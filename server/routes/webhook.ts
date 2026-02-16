import { Router } from 'express'
import type { Request, Response } from 'express'
import { payos } from '../services/payos'
import { supabase } from '../services/supabase'
import { broadcastDonationUpdate } from './sse'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const payload = req.body as {
      code?: string
      desc?: string
      success?: boolean
      data?: { orderCode?: string | number; code?: string }
      signature?: string
    }

    const verifiedData = await payos.webhooks.verify(req.body)
    const orderCode = (
      (verifiedData as { orderCode?: string | number })?.orderCode ??
      payload.data?.orderCode
    )?.toString()

    if (!orderCode) {
      return res.status(400).json({ error: 'Missing orderCode' })
    }

    const topCode = payload.code
    const dataCode = payload.data?.code
    const successFlag = payload.success

    const isPaid =
      successFlag === true && topCode === '00' && dataCode === '00'
    const isFailed =
      successFlag === false ||
      (typeof topCode === 'string' && topCode !== '00') ||
      (typeof dataCode === 'string' && dataCode !== '00')

    if (!isPaid && !isFailed) {
      return res.json({ success: true })
    }

    const status = isPaid ? 'PAID' : 'FAILED'

    const { error } = await supabase
      .from('donations')
      .update({ status })
      .eq('order_code', orderCode)
      .select()

    if (error) {
      console.error('Failed to update donation:', error)
      return res.status(500).json({ error: 'Failed to update donation' })
    }

    if (status === 'PAID') {
      // Get the updated donation
      const { data: donation } = await supabase
        .from('donations')
        .select('*')
        .eq('order_code', orderCode)
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
    }

    // Broadcast the update to connected clients
    broadcastDonationUpdate(orderCode, status)

    return res.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(400).json({ error: 'Invalid signature' })
  }
})

export default router
