import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createPayOSHeaders,
  createPayOSPaymentSignature,
  createPayOSWebhookSignature,
  parsePayOSResponse,
  verifyPayOSWebhook,
} from '../services/payos.js'

describe('payos helpers', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubEnv('PAYOS_CLIENT_ID', 'client-id')
    vi.stubEnv('PAYOS_API_KEY', 'api-key')
    vi.stubEnv('PAYOS_CHECKSUM_KEY', 'checksum-key')
    vi.stubEnv('SUPABASE_URL', 'https://supabase.example.com')
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('builds payOS headers', () => {
    const headers = createPayOSHeaders({ 'x-extra': 'value' })

    expect(headers.get('x-client-id')).toBe('client-id')
    expect(headers.get('x-api-key')).toBe('api-key')
    expect(headers.get('x-extra')).toBe('value')
  })

  it('creates deterministic payment signatures', async () => {
    const signature = await createPayOSPaymentSignature(
      {
        amount: 25_000,
        cancelUrl: 'https://example.com/cancel',
        description: 'Donation',
        orderCode: 123,
        returnUrl: 'https://example.com/return',
      },
      'checksum-key'
    )

    expect(signature).toHaveLength(64)
  })

  it('verifies webhook payload signatures', async () => {
    const payloadData = {
      orderCode: 123,
      amount: 25_000,
      description: 'Donation',
      accountNumber: '12345678',
      reference: 'TF230204212323',
      transactionDateTime: '2024-01-01T00:00:00.000Z',
      currency: 'VND',
      paymentLinkId: 'payment-link-id',
      code: '00',
      desc: 'Thành công',
    }

    const payload = {
      code: '00',
      desc: 'success',
      success: true,
      data: payloadData,
      signature: await createPayOSWebhookSignature(payloadData, 'checksum-key'),
    }

    await expect(verifyPayOSWebhook(payload, 'checksum-key')).resolves.toEqual(payload.data)
  })

  it('parses payOS JSON responses', async () => {
    const response = new Response(JSON.stringify({ data: { ok: true } }), {
      headers: { 'Content-Type': 'application/json' },
    })

    fetchMock.mockResolvedValue(response)

    await expect(
      parsePayOSResponse('/test', {
        method: 'GET',
        headers: new Headers(),
      })
    ).resolves.toEqual({ data: { ok: true } })
  })

  it('creates payment requests with signed payloads', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ checkoutUrl: 'https://payos.test/checkout', qrCode: 'qr-code-123' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const result = await import('../services/payos.js').then(({ payos }) =>
      payos.paymentRequests.create({
        amount: 25_000,
        cancelUrl: 'https://example.com/cancel',
        description: 'Donation',
        orderCode: 123,
        returnUrl: 'https://example.com/return',
      })
    )

    expect(result).toEqual({ checkoutUrl: 'https://payos.test/checkout', qrCode: 'qr-code-123' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('https://api-merchant.payos.vn/v2/payment-requests')
    expect((init as RequestInit).method).toBe('POST')
    const headers = new Headers((init as RequestInit).headers)
    expect(headers.get('x-client-id')).toBe('client-id')
    expect(headers.get('x-api-key')).toBe('api-key')
    const body = JSON.parse(String((init as RequestInit).body)) as Record<string, unknown>
    expect(body.signature).toBeDefined()
    expect(body.signature).toHaveLength(64)
  })

  it('gets payment requests by id', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: { status: 'PENDING' } }), {
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const { payos } = await import('../services/payos.js')
    await expect(payos.paymentRequests.get(123)).resolves.toEqual({ data: { status: 'PENDING' } })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-merchant.payos.vn/v2/payment-requests/123',
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('cancels payment requests with a reason', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: { cancelled: true } }), {
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const { payos } = await import('../services/payos.js')
    await expect(payos.paymentRequests.cancel(123, 'User cancelled')).resolves.toEqual({ data: { cancelled: true } })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-merchant.payos.vn/v2/payment-requests/123/cancel',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('throws on non-ok PayOS responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ message: 'boom' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const { payos } = await import('../services/payos.js')
    await expect(
      payos.paymentRequests.get(123)
    ).rejects.toThrow('boom')
  })
})
