import { Hono } from 'hono'
import { payos } from '../services/payos.js'
import { supabase } from '../services/supabase.js'
import { MAX_DONATION_AMOUNT, MIN_DONATION_AMOUNT } from '../utils/donation-config.js'
import { DonationStatus } from '../utils/donation-status.js'
import { broadcastDonationUpdate } from './sse.js'
import { getServerRuntimeEnv } from '../utils/runtime-env.js'

type CreatePaymentBody = {
  amount?: number
  senderName?: string
  message?: string
  isAnonymous?: boolean
}

type PayOsPaymentRequestResult = {
  checkoutUrl: string
  qrCode: string
}

const parseJsonBody = async <T>(payload: Promise<unknown>): Promise<Partial<T>> => {
  try {
    return (await payload) as Partial<T>
  } catch {
    return {}
  }
}

const paymentRoutes = new Hono()

paymentRoutes.post('/create', async (c) => {
  const startTime = Date.now()
  const env = getServerRuntimeEnv({ env: c.env as Record<string, string | undefined> })

  try {
    const { amount, senderName, message, isAnonymous } = await parseJsonBody<CreatePaymentBody>(c.req.json())
    console.log(`[PAYMENT CREATE] Starting payment creation for amount: ${amount}`)
    const resolvedMessage =
      typeof message === 'string' && message.trim().length > 0
        ? message.trim()
        : 'With all the supports!!!'

    if (typeof amount !== 'number' || Number.isNaN(amount) || amount < MIN_DONATION_AMOUNT) {
      console.log(`[PAYMENT CREATE] Invalid amount: ${amount}`)
      return c.json(
        {
          error: 'Invalid amount',
          message: `Minimum donation amount is ${MIN_DONATION_AMOUNT.toLocaleString()} VND`,
        },
        400
      )
    }

    if (amount > MAX_DONATION_AMOUNT) {
      console.log(`[PAYMENT CREATE] Amount too large: ${amount}`)
      return c.json(
        {
          error: 'Amount too large',
          message: `Maximum donation amount is ${MAX_DONATION_AMOUNT.toLocaleString()} VND`,
        },
        400
      )
    }

    const orderCode = Number(Date.now())
    const baseUrl = env.BASE_URL
    console.log(`[PAYMENT CREATE] Generated orderCode: ${orderCode}`)

    let paymentData: PayOsPaymentRequestResult
    const payosStartTime = Date.now()
    try {
      console.log('[PAYMENT CREATE] Creating PayOS payment request...')
      const paymentPromise = payos.paymentRequests.create({
        orderCode,
        amount,
        description: 'Donation',
        returnUrl: `${baseUrl}/donation/success?orderCode=${orderCode}`,
        cancelUrl: `${baseUrl}/donation/cancel`,
        buyerName: isAnonymous ? undefined : senderName?.substring(0, 100),
        expiredAt: Math.floor(Date.now() / 1000) + 30 * 60,
        items: [
          {
            name: 'Donation',
            quantity: 1,
            price: amount,
          },
        ],
      })

      let timeoutId: ReturnType<typeof setTimeout> | undefined
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('PayOS API timeout')), 10_000)
      })

      try {
        paymentData = (await Promise.race([paymentPromise, timeoutPromise])) as PayOsPaymentRequestResult
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      }

      console.log(`[PAYMENT CREATE] PayOS request completed in ${Date.now() - payosStartTime}ms`)
    } catch (payosError: unknown) {
      console.error(`[PAYMENT CREATE] PayOS error after ${Date.now() - payosStartTime}ms:`, payosError)
      const errorMessage = payosError instanceof Error ? payosError.message : 'Unknown PayOS error'
      if (errorMessage === 'PayOS API timeout') {
        return c.json(
          {
            error: 'Payment service timeout',
            message: 'Unable to create payment link. Please try again.',
          },
          504
        )
      }

      return c.json(
        {
          error: 'Payment service error',
          message: 'Failed to create payment link. Please try again.',
        },
        500
      )
    }

    const dbStartTime = Date.now()
    try {
      console.log('[PAYMENT CREATE] Inserting donation into database...')
      const insertPromise = supabase.from('donations').insert({
        order_code: orderCode.toString(),
        amount,
        sender_name: senderName,
        message: resolvedMessage,
        is_anonymous: isAnonymous,
        status: DonationStatus.PENDING,
      })

      let timeoutId: ReturnType<typeof setTimeout> | undefined
      const dbTimeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Database timeout')), 8_000)
      })

      try {
        const result = (await Promise.race([insertPromise, dbTimeoutPromise])) as { error: unknown }
        const { error } = result

        if (error) {
          console.error(`[PAYMENT CREATE] Database insert failed after ${Date.now() - dbStartTime}ms:`, error)

          try {
            await payos.paymentRequests.cancel(orderCode, 'Database error')
          } catch (cancelError) {
            console.error('Failed to cancel PayOS payment:', cancelError)
          }

          return c.json(
            {
              error: 'Database error',
              message: 'Failed to save donation details. Please try again.',
            },
            500
          )
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      }

      console.log(`[PAYMENT CREATE] Database insert completed in ${Date.now() - dbStartTime}ms`)
    } catch (dbError: unknown) {
      console.error(`[PAYMENT CREATE] Database operation error after ${Date.now() - dbStartTime}ms:`, dbError)

      try {
        await payos.paymentRequests.cancel(orderCode, 'Database timeout')
      } catch (cancelError) {
        console.error('Failed to cancel PayOS payment:', cancelError)
      }

      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error'
      if (errorMessage === 'Database timeout') {
        return c.json(
          {
            error: 'Database timeout',
            message: 'Database operation timed out. Please try again.',
          },
          504
        )
      }

      return c.json(
        {
          error: 'Database error',
          message: 'Failed to save donation details. Please try again.',
        },
        500
      )
    }

    console.log(`[PAYMENT CREATE] Payment creation completed successfully in ${Date.now() - startTime}ms`)

    return c.json({
      checkoutUrl: paymentData.checkoutUrl,
      qrCode: paymentData.qrCode,
      orderCode: orderCode.toString(),
    })
  } catch (error) {
    console.error(`[PAYMENT CREATE] Unexpected error after ${Date.now() - startTime}ms:`, error)
    return c.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.',
      },
      500
    )
  }
})

paymentRoutes.get('/:orderCode', async (c) => {
  try {
    const orderCode = c.req.param('orderCode')
    if (!orderCode) {
      return c.json({ error: 'Missing orderCode' }, 400)
    }

    const paymentLinkInfo = await payos.paymentRequests.get(Number(orderCode))

    if (!paymentLinkInfo) {
      return c.json({ error: 'Payment not found' }, 404)
    }

    if (paymentLinkInfo.status === 'PAID') {
      const { data: updated, error: updateError } = await supabase
        .from('donations')
        .update({ status: DonationStatus.SUCCESS })
        .eq('order_code', orderCode)
        .neq('status', DonationStatus.SUCCESS)
        .select('order_code')

      if (updateError) {
        console.error('Failed to sync paid donation status:', updateError)
      } else if (updated && updated.length > 0) {
        await broadcastDonationUpdate(orderCode, DonationStatus.SUCCESS)
      }
    }

    return c.json({
      data: paymentLinkInfo,
    })
  } catch (error) {
    console.error('Get payment info error:', error)
    return c.json({ error: 'Failed to get payment info' }, 500)
  }
})

paymentRoutes.post('/:orderCode/cancel', async (c) => {
  try {
    const orderCode = c.req.param('orderCode')
    const { cancellationReason } = await parseJsonBody<{ cancellationReason?: string }>(c.req.json())

    if (!orderCode) {
      return c.json({ error: 'Missing orderCode' }, 400)
    }

    const cancelledPaymentLink = await payos.paymentRequests.cancel(
      Number(orderCode),
      cancellationReason || 'User cancelled'
    )

    const { error } = await supabase.from('donations').update({ status: DonationStatus.FAIL }).eq('order_code', orderCode)

    if (error) {
      console.error('Failed to cancel donation:', error)
      return c.json({ error: 'Failed to cancel donation' }, 500)
    }

    await broadcastDonationUpdate(orderCode, DonationStatus.FAIL)

    return c.json({
      data: cancelledPaymentLink,
    })
  } catch (error) {
    console.error('Cancel payment error:', error)
    return c.json({ error: 'Failed to cancel payment' }, 500)
  }
})

export default paymentRoutes
