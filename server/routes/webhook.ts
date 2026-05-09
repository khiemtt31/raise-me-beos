import { Hono } from 'hono'
import { payos } from '../services/payos.js'
import { supabase } from '../services/supabase.js'
import { DonationStatus } from '../utils/donation-status.js'
import { getServerRuntimeEnv } from '../utils/runtime-env.js'
import { broadcastDonationUpdate } from './sse.js'

type PayosWebhookPayload = {
  code?: string
  desc?: string
  success?: boolean
  data?: {
    orderCode?: string | number
    code?: string
  }
  signature?: string
}

const isWebhookPayload = (payload: PayosWebhookPayload): payload is PayosWebhookPayload & { data: Record<string, unknown>; signature: string } => {
  return (
    typeof payload.code === 'string' &&
    typeof payload.desc === 'string' &&
    typeof payload.success === 'boolean' &&
    typeof payload.signature === 'string' &&
    typeof payload.data === 'object' &&
    payload.data !== null &&
    'orderCode' in payload.data
  )
}

const webhookRoutes = new Hono()

webhookRoutes.post('/', async (c) => {
  try {
    const payload = (await c.req.json().catch(() => ({}))) as PayosWebhookPayload
    const env = getServerRuntimeEnv({ env: c.env as Record<string, string | undefined> })

    if (!isWebhookPayload(payload)) {
      return c.json({ error: 'Invalid webhook payload' }, 400)
    }

    const verifiedData = await payos.webhooks.verify(payload, env.PAYOS_CHECKSUM_KEY)
    const orderCode = ((verifiedData as { orderCode?: string | number })?.orderCode ?? payload.data?.orderCode)?.toString()

    if (!orderCode) {
      return c.json({ error: 'Missing orderCode' }, 400)
    }

    const topCode = payload.code
    const dataCode = payload.data?.code
    const successFlag = payload.success

    const isPaid = successFlag === true && topCode === '00' && dataCode === '00'
    const isFailed =
      successFlag === false ||
      (typeof topCode === 'string' && topCode !== '00') ||
      (typeof dataCode === 'string' && dataCode !== '00')

    if (!isPaid && !isFailed) {
      return c.json({ success: true })
    }

    const status = isPaid ? DonationStatus.SUCCESS : DonationStatus.FAIL

    const { error } = await supabase.from('donations').update({ status }).eq('order_code', orderCode).select()

    if (error) {
      console.error('Failed to update donation:', error)
      return c.json({ error: 'Failed to update donation' }, 500)
    }

    if (status === DonationStatus.SUCCESS) {
      const { data: donation } = await supabase.from('donations').select('*').eq('order_code', orderCode).single()

      if (donation?.user_id) {
        await supabase.from('notifications').insert({
          user_id: donation.user_id,
          title: 'Donation Successful',
          content: `Your donation of ${donation.amount.toLocaleString()}đ has been processed successfully. Thank you for your support!`,
          type: 'DONATION_SUCCESS',
        })
      }
    }

    await broadcastDonationUpdate(orderCode, status)

    return c.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return c.json({ error: 'Invalid signature' }, 400)
  }
})

export default webhookRoutes
