import { Router } from 'express'
import type { Request, Response } from 'express'
import { payos } from '../services/payos'
import { supabase } from '../services/supabase'
import { broadcastDonationUpdate } from './sse'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    if (req.body.code === '00') {
      const webhookData = await payos.webhooks.verify(req.body)

      const { data: updatedDonations, error } = await supabase
        .from('donations')
        .update({ status: 'PAID' })
        .eq('order_code', webhookData.orderCode.toString())
        .select()

      if (error) {
        console.error('Failed to update donation:', error)
        return res.status(500).json({ error: 'Failed to update donation' })
      }

      // Get the updated donation
      const { data: donation } = await supabase
        .from('donations')
        .select('*')
        .eq('order_code', webhookData.orderCode.toString())
        .single()

      // Create notification for the user if they have an account
      if (donation?.user_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: donation.user_id,
            title: 'Donation Successful',
            content: `Your donation of ${donation.amount.toLocaleString()}đ has been processed successfully. Thank you for your support!`,
            type: 'DONATION_SUCCESS',
          })
      }

      // Broadcast the update to connected clients
      broadcastDonationUpdate(webhookData.orderCode.toString(), 'PAID')
    }

    return res.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(400).json({ error: 'Invalid signature' })
  }
})

export default router
