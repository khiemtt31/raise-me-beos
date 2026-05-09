import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { createRateLimitMiddleware } from './middleware/rate-limit.js'
import donationsRoutes from './routes/donations.js'
import paymentRoutes from './routes/payment.js'
import sseRoutes from './routes/sse.js'
import webhookRoutes from './routes/webhook.js'
import { getPublicRuntimeEnv } from './utils/runtime-env.js'

const getErrorStatusCode = (err: unknown): number => {
  if (typeof err === 'object' && err !== null && 'statusCode' in err) {
    const statusCode = (err as { statusCode?: unknown }).statusCode
    if (typeof statusCode === 'number') {
      return statusCode
    }
  }

  return 500
}

export const createApp = () => {
  const app = new Hono<{ Bindings: Record<string, string | undefined> }>()

  app.use('*', logger())
  app.use('*', secureHeaders())
  app.use('*', bodyLimit({ maxSize: 1_000_000 }))
  app.use('*', async (c, next) => {
    const env = getPublicRuntimeEnv({ env: c.env })
    return cors({
      origin: env.CORS_ORIGINS,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
      credentials: true,
      maxAge: 86400,
    })(c, next)
  })
  app.use('*', createRateLimitMiddleware())

  app.get('/healthz', (c) => c.json({ status: 'ok', message: 'Payment service is healthy' }))

  app.route('/api/payment/webhook', webhookRoutes)
  app.route('/api/payment', paymentRoutes)
  app.route('/api/sse', sseRoutes)
  app.route('/api/donations', donationsRoutes)

  app.onError((err, c) => {
    console.error(err)
    const statusCode = getErrorStatusCode(err)
    const env = getPublicRuntimeEnv({ env: c.env })
    return new Response(
      JSON.stringify({
        status: 'error',
        message:
          env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err instanceof Error
              ? err.message
              : 'Internal server error',
      }),
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  })

  return app
}

export const app = createApp()

export default app
