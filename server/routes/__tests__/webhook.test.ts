// import express from 'express'
// import request from 'supertest'
// import { beforeEach, describe, expect, it, vi } from 'vitest'

// vi.mock('../../services/payos', () => ({
//   payos: {
//     webhooks: {
//       verify: vi.fn(),
//     },
//   },
// }))

// vi.mock('../../services/supabase', () => ({
//   supabase: {
//     from: vi.fn(),
//   },
// }))

// vi.mock('../sse', () => ({
//   broadcastDonationUpdate: vi.fn(),
// }))

// import { payos } from '../../services/payos'
// import { supabase } from '../../services/supabase'
// import { broadcastDonationUpdate } from '../sse'
// import webhookRouter from '../webhook'

// type UpdateRecord = {
//   table?: string
//   values?: Record<string, unknown>
//   column?: string
//   value?: string
// }

// const createApp = () => {
//   const app = express()
//   app.use(express.json())
//   app.use('/api/payment/webhook', webhookRouter)
//   return app
// }

// const buildSupabaseMock = (options: {
//   updateResult?: { data: unknown; error: unknown }
//   donation?: { user_id?: string; amount: number }
// }) => {
//   const updateResult = options.updateResult ?? { data: [{ id: '1' }], error: null }
//   const donation = options.donation ?? { user_id: 'user-1', amount: 15000 }

//   const updateRecord: UpdateRecord = {}
//   const insertCalls: Array<{ table: string; values: Record<string, unknown> }> = []

//   class MockBuilder {
//     private mode: 'update' | 'select' = 'select'
//     constructor(private table: string) {}

//     update(values: Record<string, unknown>) {
//       this.mode = 'update'
//       updateRecord.table = this.table
//       updateRecord.values = values
//       return this
//     }

//     select() {
//       if (this.mode === 'update') {
//         return Promise.resolve(updateResult)
//       }
//       return this
//     }

//     eq(column: string, value: string) {
//       updateRecord.column = column
//       updateRecord.value = value
//       return this
//     }

//     single() {
//       return Promise.resolve({ data: donation, error: null })
//     }

//     insert(values: Record<string, unknown>) {
//       insertCalls.push({ table: this.table, values })
//       return Promise.resolve({ data: null, error: null })
//     }
//   }

//   ;(supabase.from as ReturnType<typeof vi.fn>).mockImplementation(
//     (table: string) => new MockBuilder(table)
//   )

//   return { updateRecord, insertCalls }
// }

// describe('payment webhook', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//   })

//   it('updates donation to PAID and broadcasts on success payload', async () => {
//     const app = createApp()
//     const { updateRecord, insertCalls } = buildSupabaseMock({})

//     ;(payos.webhooks.verify as ReturnType<typeof vi.fn>).mockResolvedValue({
//       orderCode: 12345,
//     })

//     const payload = {
//       code: '00',
//       success: true,
//       data: { orderCode: 12345, code: '00' },
//       signature: 'test-signature',
//     }

//     const response = await request(app)
//       .post('/api/payment/webhook')
//       .send(payload)

//     expect(response.status).toBe(200)
//     expect(updateRecord.values).toEqual({ status: 'PAID' })
//     expect(updateRecord.column).toBe('order_code')
//     expect(updateRecord.value).toBe('12345')
//     expect(broadcastDonationUpdate).toHaveBeenCalledWith('12345', 'PAID')
//     expect(
//       insertCalls.some((call) => call.table === 'notifications')
//     ).toBe(true)
//   })

//   it('updates donation to FAILED and broadcasts on failure payload', async () => {
//     const app = createApp()
//     const { updateRecord, insertCalls } = buildSupabaseMock({})

//     ;(payos.webhooks.verify as ReturnType<typeof vi.fn>).mockResolvedValue({
//       orderCode: 67890,
//     })

//     const payload = {
//       code: '11',
//       success: false,
//       data: { orderCode: 67890, code: '11' },
//       signature: 'test-signature',
//     }

//     const response = await request(app)
//       .post('/api/payment/webhook')
//       .send(payload)

//     expect(response.status).toBe(200)
//     expect(updateRecord.values).toEqual({ status: 'FAILED' })
//     expect(updateRecord.column).toBe('order_code')
//     expect(updateRecord.value).toBe('67890')
//     expect(broadcastDonationUpdate).toHaveBeenCalledWith('67890', 'FAILED')
//     expect(
//       insertCalls.some((call) => call.table === 'notifications')
//     ).toBe(false)
//   })
// })
