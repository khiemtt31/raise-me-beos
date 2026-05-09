import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  type SupabaseState = {
    publicDonations: { data: unknown[]; error: unknown }
    historyDonations: { data: unknown[]; error: unknown; count: number }
    donationStatus: { data: { status: string } | null; error: unknown }
    donationById: { data: Record<string, unknown> | null; error: unknown }
    webhookDonation: { data: Record<string, unknown> | null; error: unknown }
    paymentCreateInsert: { error: unknown }
    paymentCancelUpdate: { error: unknown }
    paymentStatusSyncUpdate: { data: unknown[]; error: unknown }
    webhookUpdate: { data: unknown[]; error: unknown }
    notificationInsert: { error: unknown }
    captured: {
      donationInserts: unknown[]
      notificationInserts: unknown[]
      donationUpdates: unknown[]
    }
  }

  const state: SupabaseState = {
    publicDonations: { data: [], error: null },
    historyDonations: { data: [], error: null, count: 0 },
    donationStatus: { data: null, error: null },
    donationById: { data: null, error: null },
    webhookDonation: { data: null, error: null },
    paymentCreateInsert: { error: null },
    paymentCancelUpdate: { error: null },
    paymentStatusSyncUpdate: { data: [], error: null },
    webhookUpdate: { data: [], error: null },
    notificationInsert: { error: null },
    captured: {
      donationInserts: [],
      notificationInserts: [],
      donationUpdates: [],
    },
  }

  const resetState = () => {
    state.publicDonations = { data: [], error: null }
    state.historyDonations = { data: [], error: null, count: 0 }
    state.donationStatus = { data: null, error: null }
    state.donationById = { data: null, error: null }
    state.webhookDonation = { data: null, error: null }
    state.paymentCreateInsert = { error: null }
    state.paymentCancelUpdate = { error: null }
    state.paymentStatusSyncUpdate = { data: [], error: null }
    state.webhookUpdate = { data: [], error: null }
    state.notificationInsert = { error: null }
    state.captured = {
      donationInserts: [],
      notificationInserts: [],
      donationUpdates: [],
    }
  }

  type Plan = {
    operation: 'select' | 'insert' | 'update' | undefined
    columns: string
    count?: 'exact'
    terminal?: 'single' | 'limit' | 'range' | 'selectAfterUpdate'
    values?: Record<string, unknown>
  }

  const resolveResult = (table: string, plan: Plan) => {
    if (table === 'donations') {
      if (plan.operation === 'insert') {
        state.captured.donationInserts.push(plan.values)
        return state.paymentCreateInsert
      }

      if (plan.operation === 'update') {
        state.captured.donationUpdates.push(plan.values)

        if (plan.terminal === 'selectAfterUpdate') {
          if (plan.columns === 'order_code') {
            return state.paymentStatusSyncUpdate
          }

          return state.webhookUpdate
        }

        return state.paymentCancelUpdate
      }

      if (plan.operation === 'select') {
        if (plan.count === 'exact') {
          return state.historyDonations
        }

        if (plan.terminal === 'limit') {
          return state.publicDonations
        }

        if (plan.terminal === 'range') {
          return state.historyDonations
        }

        if (plan.terminal === 'single' && plan.columns === 'status') {
          return state.donationStatus
        }

        if (plan.terminal === 'single' && plan.columns.includes('user:users')) {
          return state.donationById
        }

        if (plan.terminal === 'single' && plan.columns === '*') {
          return state.webhookDonation
        }
      }
    }

    if (table === 'notifications' && plan.operation === 'insert') {
      state.captured.notificationInserts.push(plan.values)
      return state.notificationInsert
    }

    return { data: null, error: null }
  }

  const createChain = (table: string) => {
    const plan: Plan = { operation: undefined, columns: '' }

    const chain: Record<string, unknown> = {
      select(columns = '', options?: { count?: 'exact' }) {
        if (plan.operation === 'update') {
          plan.terminal = 'selectAfterUpdate'
          plan.columns = columns
          return chain
        }

        plan.operation = 'select'
        plan.columns = columns
        plan.count = options?.count
        return chain
      },
      insert(values: Record<string, unknown>) {
        plan.operation = 'insert'
        plan.values = values
        return chain
      },
      update(values: Record<string, unknown>) {
        plan.operation = 'update'
        plan.values = values
        return chain
      },
      eq() {
        return chain
      },
      neq() {
        return chain
      },
      order() {
        return chain
      },
      limit() {
        plan.terminal = 'limit'
        return chain
      },
      range() {
        plan.terminal = 'range'
        return chain
      },
      single() {
        plan.terminal = 'single'
        return chain
      },
      then(onFulfilled: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) {
        return Promise.resolve(resolveResult(table, plan)).then(onFulfilled, onRejected)
      },
      catch(onRejected: (reason: unknown) => unknown) {
        return Promise.resolve(resolveResult(table, plan)).catch(onRejected)
      },
      finally(onFinally: () => void) {
        return Promise.resolve(resolveResult(table, plan)).finally(onFinally)
      },
    }

    return chain
  }

  const payos = {
    paymentRequests: {
      create: vi.fn(),
      get: vi.fn(),
      cancel: vi.fn(),
    },
    webhooks: {
      verify: vi.fn(),
    },
  }

  const from = vi.fn((table: string) => createChain(table))

  return { state, resetState, from, payos }
})

vi.mock('../services/payos', () => ({ payos: mocks.payos }))
vi.mock('../services/supabase', () => ({ supabase: { from: mocks.from } }))

import { app } from '../app.js'
import { resetRateLimitState } from '../middleware/rate-limit.js'
import {
  broadcastDonationUpdate,
  hasDonationClient,
  registerDonationClient,
  resetDonationClients,
  unregisterDonationClient,
} from '../routes/sse.js'

const jsonHeaders = {
  'Content-Type': 'application/json',
  Origin: 'http://localhost:3000',
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.resetState()
  resetDonationClients()
  resetRateLimitState()
  vi.stubEnv('BASE_URL', 'http://localhost:3000')
  vi.stubEnv('CORS_ORIGINS', 'http://localhost:3000')
  vi.stubEnv('PAYOS_CLIENT_ID', 'test-client-id')
  vi.stubEnv('PAYOS_API_KEY', 'test-api-key')
  vi.stubEnv('PAYOS_CHECKSUM_KEY', 'test-checksum-key')
  vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co')
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-key')
  vi.stubEnv('NODE_ENV', 'test')
  vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)

  mocks.payos.paymentRequests.create.mockResolvedValue({
    checkoutUrl: 'https://payos.test/checkout',
    qrCode: 'qr-code-123',
  })
  mocks.payos.paymentRequests.get.mockResolvedValue({ status: 'PENDING', code: '00' })
  mocks.payos.paymentRequests.cancel.mockResolvedValue({ cancelled: true })
  mocks.payos.webhooks.verify.mockResolvedValue({ orderCode: 1_700_000_000_000 })
})

afterEach(() => {
  vi.restoreAllMocks()
  resetDonationClients()
  resetRateLimitState()
  vi.unstubAllEnvs()
})

describe('server app', () => {
  it('serves healthz with CORS headers', async () => {
    const res = await app.request('/healthz', {
      headers: {
        Origin: 'http://localhost:3000',
      },
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      status: 'ok',
      message: 'Payment service is healthy',
    })
    expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:3000')
    expect(res.headers.get('access-control-allow-credentials')).toBe('true')
  })

  it('creates a payment link', async () => {
    const res = await app.request('/api/payment/create', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        amount: 25_000,
        senderName: 'Alex',
        message: 'Thanks for the work',
        isAnonymous: false,
      }),
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      checkoutUrl: 'https://payos.test/checkout',
      qrCode: 'qr-code-123',
      orderCode: '1700000000000',
    })
    expect(mocks.payos.paymentRequests.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 25_000,
        buyerName: 'Alex',
        description: 'Donation',
      })
    )
    expect(mocks.state.captured.donationInserts).toHaveLength(1)
    expect(mocks.state.captured.donationInserts[0]).toEqual(
      expect.objectContaining({
        order_code: '1700000000000',
        amount: 25_000,
        sender_name: 'Alex',
        message: 'Thanks for the work',
        is_anonymous: false,
        status: 'PENDING',
      })
    )
  })

  it('rejects invalid payment amounts', async () => {
    const res = await app.request('/api/payment/create', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        amount: 1_000,
        senderName: 'Alex',
        message: 'Too small',
        isAnonymous: false,
      }),
    })

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      error: 'Invalid amount',
      message: 'Minimum donation amount is 10,000 VND',
    })
    expect(mocks.payos.paymentRequests.create).not.toHaveBeenCalled()
  })

  it('applies the rate limit after 100 requests', async () => {
    for (let index = 0; index < 100; index += 1) {
      const res = await app.request('/healthz', {
        headers: {
          Origin: 'http://localhost:3000',
          'X-Forwarded-For': '203.0.113.10',
        },
      })

      expect(res.status).toBe(200)
    }

    const limited = await app.request('/healthz', {
      headers: {
        Origin: 'http://localhost:3000',
        'X-Forwarded-For': '203.0.113.10',
      },
    })

    expect(limited.status).toBe(429)
    await expect(limited.json()).resolves.toEqual({
      status: 'error',
      message: 'Too many requests, please try again later.',
    })
  })

  it('returns payment details and syncs paid donations', async () => {
    mocks.payos.paymentRequests.get.mockResolvedValue({ status: 'PAID', transactionId: 'txn_1' })
    mocks.state.paymentStatusSyncUpdate = { data: [{ order_code: '1700000000000' }], error: null }

    const res = await app.request('/api/payment/1700000000000', {
      headers: {
        Origin: 'http://localhost:3000',
      },
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      data: { status: 'PAID', transactionId: 'txn_1' },
    })
    expect(mocks.state.captured.donationUpdates).toContainEqual(
      expect.objectContaining({ status: 'SUCCESS' })
    )
  })

  it('cancels payment links and marks donations as failed', async () => {
    const res = await app.request('/api/payment/1700000000000/cancel', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ cancellationReason: 'User cancelled' }),
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      data: { cancelled: true },
    })
    expect(mocks.payos.paymentRequests.cancel).toHaveBeenCalledWith(1_700_000_000_000, 'User cancelled')
    expect(mocks.state.captured.donationUpdates).toContainEqual(
      expect.objectContaining({ status: 'FAIL' })
    )
  })

  it('handles payment webhooks and creates notifications', async () => {
    mocks.payos.webhooks.verify.mockResolvedValue({ orderCode: 1_700_000_000_000 })
    mocks.state.webhookDonation = {
      data: {
        id: 'don_1',
        user_id: 'user_1',
        amount: 25_000,
      },
      error: null,
    }

    const res = await app.request('/api/payment/webhook', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        code: '00',
        desc: 'success',
        success: true,
        data: {
          orderCode: 1_700_000_000_000,
          code: '00',
        },
        signature: 'signature',
      }),
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ success: true })
    expect(mocks.state.captured.notificationInserts).toHaveLength(1)
    expect(mocks.state.captured.notificationInserts[0]).toEqual(
      expect.objectContaining({
        user_id: 'user_1',
        title: 'Donation Successful',
        type: 'DONATION_SUCCESS',
      })
    )
  })

  it('rejects malformed webhook payloads', async () => {
    const res = await app.request('/api/payment/webhook', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        code: '00',
        success: true,
      }),
    })

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      error: 'Invalid webhook payload',
    })
  })

  it('returns 404 for missing donation records', async () => {
    mocks.state.donationById = {
      data: null,
      error: { message: 'not found' },
    }

    const res = await app.request('/api/donations/missing-id', {
      headers: {
        Origin: 'http://localhost:3000',
      },
    })

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual({
      error: 'Donation not found',
    })
  })

  it('returns donation history with pagination metadata', async () => {
    mocks.state.historyDonations = {
      data: [
        {
          id: 'don_1',
          amount: 50_000,
          message: 'Keep going',
          senderName: 'Taylor',
          createdAt: '2024-01-01T00:00:00.000Z',
          status: 'SUCCESS',
          isAnonymous: false,
        },
      ],
      error: null,
      count: 1,
    }

    const res = await app.request('/api/donations/history?page=1&limit=1', {
      headers: {
        Origin: 'http://localhost:3000',
      },
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      data: [
        {
          id: 'don_1',
          amount: 50_000,
          message: 'Keep going',
          senderName: 'Taylor',
          createdAt: '2024-01-01T00:00:00.000Z',
          status: 'SUCCESS',
          isAnonymous: false,
          method: 'PayOS',
        },
      ],
      pagination: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    })
  })

  it('returns donation details by id', async () => {
    mocks.state.donationById = {
      data: {
        id: 'don_1',
        amount: 25_000,
        status: 'SUCCESS',
      },
      error: null,
    }

    const res = await app.request('/api/donations/don_1', {
      headers: {
        Origin: 'http://localhost:3000',
      },
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      donation: {
        id: 'don_1',
        amount: 25_000,
        status: 'SUCCESS',
      },
    })
  })

  it('streams donation status updates through SSE', async () => {
    mocks.state.donationStatus = {
      data: { status: 'PENDING' },
      error: null,
    }

    const res = await app.request('/api/sse/status/1700000000000', {
      headers: {
        Origin: 'http://localhost:3000',
      },
    })

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/event-stream')
    expect(res.body).not.toBeNull()

    const reader = res.body!.getReader()
    try {
      const first = await reader.read()
      expect(first.done).toBe(false)
      expect(new TextDecoder().decode(first.value)).toContain('data: {"status":"PENDING"}')

      await broadcastDonationUpdate('1700000000000', 'SUCCESS')

      const second = await reader.read()
      expect(second.done).toBe(false)
      expect(new TextDecoder().decode(second.value)).toContain('data: {"status":"SUCCESS"}')
    } finally {
      await reader.cancel()
    }
  })

  it('removes SSE clients from the registry when unregistered', async () => {
    const send = vi.fn().mockResolvedValue(undefined)
    const clientId = registerDonationClient('1700000000000', send)

    expect(hasDonationClient('1700000000000')).toBe(true)

    unregisterDonationClient(clientId)

    expect(hasDonationClient('1700000000000')).toBe(false)

    await broadcastDonationUpdate('1700000000000', 'SUCCESS')

    expect(send).not.toHaveBeenCalled()
  })
})
