import { Router } from 'express'
import { payos } from '../services/payos'
import { supabase } from '../services/supabase'

const router = Router()

router.post('/create', async (req, res) => {
  const startTime = Date.now()
  console.log(`[PAYMENT CREATE] Starting payment creation for amount: ${req.body.amount}`)

  try {
    const { amount, senderName, message, isAnonymous, userId } = req.body as {
      amount?: number
      senderName?: string
      message?: string
      isAnonymous?: boolean
      userId?: string
    }

    // Validate amount
    if (!amount || amount < 10000.00) {
      console.log(`[PAYMENT CREATE] Invalid amount: ${amount}`)
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Minimum donation amount is 10,000.00đ'
      })
    }

    if (amount > 50000000.00) { // 50 million VND limit
      console.log(`[PAYMENT CREATE] Amount too large: ${amount}`)
      return res.status(400).json({
        error: 'Amount too large',
        message: 'Maximum donation amount is 50,000,000.00đ'
      })
    }

    const orderCode = Number(Date.now())
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    console.log(`[PAYMENT CREATE] Generated orderCode: ${orderCode}`)

    // Create PayOS payment request with timeout
    let paymentData
    const payosStartTime = Date.now()
    try {
      console.log(`[PAYMENT CREATE] Creating PayOS payment request...`)
      const paymentPromise = payos.paymentRequests.create({
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

      // Add timeout for PayOS API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('PayOS API timeout')), 10000) // 10 second timeout
      })

      paymentData = await Promise.race([paymentPromise, timeoutPromise]) as any
      console.log(`[PAYMENT CREATE] PayOS request completed in ${Date.now() - payosStartTime}ms`)
    } catch (payosError: unknown) {
      console.error(`[PAYMENT CREATE] PayOS error after ${Date.now() - payosStartTime}ms:`, payosError)
      const errorMessage = payosError instanceof Error ? payosError.message : 'Unknown PayOS error'
      if (errorMessage === 'PayOS API timeout') {
        return res.status(504).json({
          error: 'Payment service timeout',
          message: 'Unable to create payment link. Please try again.'
        })
      }
      return res.status(500).json({
        error: 'Payment service error',
        message: 'Failed to create payment link. Please try again.'
      })
    }

    // Insert donation into database with timeout
    const dbStartTime = Date.now()
    try {
      console.log(`[PAYMENT CREATE] Inserting donation into database...`)
      const insertPromise = supabase
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

      // Add timeout for database operation
      const dbTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database timeout')), 8000) // 8 second timeout
      })

      const result = await Promise.race([insertPromise, dbTimeoutPromise]) as { error: any }

      const { error } = result

      if (error) {
        console.error(`[PAYMENT CREATE] Database insert failed after ${Date.now() - dbStartTime}ms:`, error)

        // Try to cancel the PayOS payment since DB insert failed
        try {
          await payos.paymentRequests.cancel(orderCode, 'Database error')
        } catch (cancelError) {
          console.error('Failed to cancel PayOS payment:', cancelError)
        }

        return res.status(500).json({
          error: 'Database error',
          message: 'Failed to save donation details. Please try again.'
        })
      }

      console.log(`[PAYMENT CREATE] Database insert completed in ${Date.now() - dbStartTime}ms`)
    } catch (dbError: unknown) {
      console.error(`[PAYMENT CREATE] Database operation error after ${Date.now() - dbStartTime}ms:`, dbError)

      // Try to cancel the PayOS payment since DB operation failed
      try {
        await payos.paymentRequests.cancel(orderCode, 'Database timeout')
      } catch (cancelError) {
        console.error('Failed to cancel PayOS payment:', cancelError)
      }

      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error'
      if (errorMessage === 'Database timeout') {
        return res.status(504).json({
          error: 'Database timeout',
          message: 'Database operation timed out. Please try again.'
        })
      }

      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to save donation details. Please try again.'
      })
    }

    console.log(`[PAYMENT CREATE] Payment creation completed successfully in ${Date.now() - startTime}ms`)

    // Success - return QR code and checkout URL
    return res.json({
      checkoutUrl: paymentData.checkoutUrl,
      qrCode: paymentData.qrCode,
      orderCode: orderCode.toString(),
    })

  } catch (error) {
    console.error(`[PAYMENT CREATE] Unexpected error after ${Date.now() - startTime}ms:`, error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again.'
    })
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