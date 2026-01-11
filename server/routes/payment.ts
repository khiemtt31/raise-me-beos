import { Router } from 'express'
import { payos } from '../services/payos'
import { supabase } from '../services/supabase'

const router = Router()

router.post('/create', async (req, res) => {
  try {
    const { amount, senderName, message, isAnonymous, userId } = req.body as {
      amount?: number
      senderName?: string
      message?: string
      isAnonymous?: boolean
      userId?: string
    }

    if (!amount || amount < 10000) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const orderCode = Number(Date.now())
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

    const paymentData = await payos.paymentRequests.create({
      orderCode,
      amount,
      description: 'Donation',
      returnUrl: `${baseUrl}/donation/success`,
      cancelUrl: `${baseUrl}/donation/cancel`,
      buyerName: isAnonymous ? undefined : senderName?.substring(0, 100),
      expiredAt: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
      items: [
        {
          name: 'Donation',
          quantity: 1,
          price: amount,
        },
      ],
    })

    const { error } = await supabase
      .from('donations')
      .insert({
        order_code: orderCode.toString(),
        amount,
        sender_name: senderName,
        message,
        is_anonymous: isAnonymous,
        status: 'PENDING',
        user_id: userId || null,
      })

    if (error) {
      console.error('Failed to create donation:', error)
      return res.status(500).json({ error: 'Failed to create donation' })
    }

    return res.json({
      checkoutUrl: paymentData.checkoutUrl,
      qrCode: paymentData.qrCode,
      orderCode: orderCode.toString(),
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return res.status(500).json({ error: 'Failed to create payment' })
  }
})

router.get('/:orderCode', async (req, res) => {
  try {
    const { orderCode } = req.params
    if (!orderCode) {
      return res.status(400).json({ error: 'Missing orderCode' })
    }

    const paymentLinkInfo = await payos.paymentRequests.get(Number(orderCode))

    if (!paymentLinkInfo) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    return res.json({
      data: paymentLinkInfo,
    })
  } catch (error) {
    console.error('Get payment info error:', error)
    return res.status(500).json({ error: 'Failed to get payment info' })
  }
})

router.post('/:orderCode/cancel', async (req, res) => {
  try {
    const { orderCode } = req.params
    const { cancellationReason } = req.body

    if (!orderCode) {
      return res.status(400).json({ error: 'Missing orderCode' })
    }

    const cancelledPaymentLink = await payos.paymentRequests.cancel(
      Number(orderCode),
      cancellationReason || 'User cancelled'
    )

    const { error } = await supabase
      .from('donations')
      .update({ status: 'CANCELLED' })
      .eq('order_code', orderCode)

    if (error) {
      console.error('Failed to cancel donation:', error)
      return res.status(500).json({ error: 'Failed to cancel donation' })
    }

    return res.json({
      data: cancelledPaymentLink,
    })
  } catch (error) {
    console.error('Cancel payment error:', error)
    return res.status(500).json({ error: 'Failed to cancel payment' })
  }
})

export default router