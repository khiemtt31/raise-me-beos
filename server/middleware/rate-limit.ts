import type { MiddlewareHandler } from 'hono'

type Bucket = {
  count: number
  resetAt: number
}

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 100

const getBucketMap = (): Map<string, Bucket> => {
  const globalBuckets = globalThis as { __raiseMeBeosBuckets?: Map<string, Bucket> }
  if (!globalBuckets.__raiseMeBeosBuckets) {
    globalBuckets.__raiseMeBeosBuckets = new Map<string, Bucket>()
  }

  return globalBuckets.__raiseMeBeosBuckets
}

export const resetRateLimitState = () => {
  getBucketMap().clear()
}

export const createRateLimitMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    if (c.req.method === 'OPTIONS' || c.req.path.startsWith('/api/payment/webhook')) {
      await next()
      return
    }

    const clientId =
      c.req.header('cf-connecting-ip') ??
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
      c.req.header('x-real-ip') ??
      'local'

    const now = Date.now()
    const buckets = getBucketMap()
    const bucket = buckets.get(clientId)

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(clientId, { count: 1, resetAt: now + WINDOW_MS })
      await next()
      return
    }

    if (bucket.count >= MAX_REQUESTS) {
      c.header('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)))
      return c.json({ status: 'error', message: 'Too many requests, please try again later.' }, 429)
    }

    bucket.count += 1
    await next()
  }
}
