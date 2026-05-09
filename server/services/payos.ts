import { getServerRuntimeEnv } from '../utils/runtime-env.js'

type PayosCreatePaymentRequest = {
  amount: number
  cancelUrl: string
  description: string
  orderCode: number
  returnUrl: string
  buyerName?: string
  expiredAt?: number
  items?: Array<{
    name: string
    quantity: number
    price: number
  }>
}

type PayosWebhookPayload = {
  code?: string
  data?: Record<string, unknown>
  desc?: string
  signature?: string
  success?: boolean
}

const PAYOS_BASE_URL = 'https://api-merchant.payos.vn'

const buildHeaders = (extraHeaders?: HeadersInit): Headers => {
  const env = getServerRuntimeEnv()
  const headers = new Headers({
    'Content-Type': 'application/json',
    'User-Agent': 'PayOS-Hono/1.0',
    'x-api-key': env.PAYOS_API_KEY,
    'x-client-id': env.PAYOS_CLIENT_ID,
  })

  if (env.PAYOS_PARTNER_CODE) {
    headers.set('x-partner-code', env.PAYOS_PARTNER_CODE)
  }

  if (extraHeaders) {
    new Headers(extraHeaders).forEach((value, key) => headers.set(key, value))
  }

  return headers
}

const createSignatureFromObj = async (data: Record<string, unknown>, key: string) => {
  const sortedEntries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b))
  const queryString = sortedEntries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v === null || v === undefined ? '' : String(v))}`)
    .join('&')

  const encoder = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(queryString))
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const createSignatureOfPaymentRequest = async (data: PayosCreatePaymentRequest, key: string) => {
  const queryString = `amount=${data.amount}&cancelUrl=${data.cancelUrl}&description=${data.description}&orderCode=${data.orderCode}&returnUrl=${data.returnUrl}`
  const encoder = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(queryString))
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const requestJson = async <T>(path: string, init: RequestInit): Promise<T> => {
  const response = await fetch(`${PAYOS_BASE_URL}${path}`, init)
  const text = await response.text()
  const payload = text.length > 0 ? (JSON.parse(text) as T) : (undefined as T)

  if (!response.ok) {
    throw new Error(typeof payload === 'object' && payload && 'message' in payload ? String((payload as { message?: unknown }).message) : `PayOS request failed with ${response.status}`)
  }

  return payload
}

const paymentRequests = {
  create: async (body: PayosCreatePaymentRequest) => {
    const env = getServerRuntimeEnv()
    const signature = await createSignatureOfPaymentRequest(body, env.PAYOS_CHECKSUM_KEY)
    const payload = { ...body, signature }
    return requestJson<{ checkoutUrl: string; qrCode: string }>(`/v2/payment-requests`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    })
  },
  get: async (id: number) => {
    return requestJson<Record<string, unknown>>(`/v2/payment-requests/${id}`, {
      method: 'GET',
      headers: buildHeaders(),
    })
  },
  cancel: async (id: number, cancellationReason: string) => {
    return requestJson<Record<string, unknown>>(`/v2/payment-requests/${id}/cancel`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ cancellationReason }),
    })
  },
}

const webhooks = {
  verify: async (webhook: PayosWebhookPayload, checksumKey?: string) => {
    const env = getServerRuntimeEnv()
    const key = checksumKey ?? env.PAYOS_CHECKSUM_KEY
    if (!webhook.data || !webhook.signature) {
      throw new Error('Invalid webhook data')
    }

    const signedSignature = await createSignatureFromObj(webhook.data, key)
    if (signedSignature !== webhook.signature) {
      throw new Error('Data not integrity')
    }

    return webhook.data
  },
}

export const payos = {
  paymentRequests,
  webhooks,
}

export const createPayOSHeaders = (extraHeaders?: HeadersInit) => buildHeaders(extraHeaders)
export const createPayOSPaymentSignature = createSignatureOfPaymentRequest
export const createPayOSWebhookSignature = createSignatureFromObj
export const verifyPayOSWebhook = async (webhook: PayosWebhookPayload, checksumKey?: string) => webhooks.verify(webhook, checksumKey)
export const parsePayOSResponse = requestJson
