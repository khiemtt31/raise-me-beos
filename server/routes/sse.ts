import { Router } from 'express'
import { supabase } from '../services/supabase'

const router = Router()

// Store connected clients
const clients = new Map<string, { res: any, orderCode: string }>()

router.get('/status/:orderCode', async (req, res) => {
  const { orderCode } = req.params

  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  })

  // Send initial data
  const { data: donation } = await supabase
    .from('donations')
    .select('status')
    .eq('order_code', orderCode)
    .single()

  if (donation) {
    res.write(`data: ${JSON.stringify({ status: donation.status })}\n\n`)
  }

  // Store client connection
  const clientId = Date.now().toString()
  clients.set(clientId, { res, orderCode })

  // Remove client on disconnect
  req.on('close', () => {
    clients.delete(clientId)
  })
})

// Function to broadcast status updates
export const broadcastDonationUpdate = (orderCode: string, status: string) => {
  clients.forEach((client, clientId) => {
    if (client.orderCode === orderCode) {
      client.res.write(`data: ${JSON.stringify({ status })}\n\n`)
    }
  })
}

export default router