import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { supabase } from '../services/supabase.js'

type SseClient = {
  orderCode: string
  send: (status: string) => Promise<void>
}

const clients = new Map<string, SseClient>()

export const resetDonationClients = () => {
  clients.clear()
}

export const registerDonationClient = (orderCode: string, send: (status: string) => Promise<void>) => {
  const clientId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  clients.set(clientId, { orderCode, send })
  return clientId
}

export const unregisterDonationClient = (clientId: string) => {
  clients.delete(clientId)
}

export const hasDonationClient = (orderCode: string) => {
  for (const client of clients.values()) {
    if (client.orderCode === orderCode) {
      return true
    }
  }

  return false
}

export const broadcastDonationUpdate = async (orderCode: string, status: string) => {
  const pendingUpdates: Promise<void>[] = []

  for (const [clientId, client] of clients.entries()) {
    if (client.orderCode !== orderCode) {
      continue
    }

    pendingUpdates.push(
      client
        .send(status)
        .catch(() => {
          clients.delete(clientId)
        })
        .then(() => undefined)
    )
  }

  await Promise.all(pendingUpdates)
}

const sseRoutes = new Hono()

sseRoutes.get('/status/:orderCode', async (c) => {
  const orderCode = c.req.param('orderCode')

  const { data: donation } = await supabase.from('donations').select('status').eq('order_code', orderCode).single()

  return streamSSE(c, async (stream) => {
    if (donation) {
      await stream.writeSSE({ data: JSON.stringify({ status: donation.status }) })
    }

    const clientId = registerDonationClient(orderCode, async (status: string) => {
      await stream.writeSSE({ data: JSON.stringify({ status }) })
    })

    await new Promise<void>((resolve) => {
      stream.onAbort(() => {
        unregisterDonationClient(clientId)
        resolve()
      })
    })
  })
})

export default sseRoutes
