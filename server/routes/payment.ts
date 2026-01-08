import { Router } from 'express'
import { payos } from '../services/payos'
import { prisma } from '../prisma'

const router = Router()

router.post('/create', async (req, res) => {
  try {
    const { amount, senderName, message, isAnonymous } = req.body as {
      amount?: number
      senderName?: string
      message?: string
      isAnonymous?: boolean
    }

    if (!amount || amount < 10000) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const orderCode = BigInt(Date.now())

    const paymentData = await payos.paymentRequests.create({
      orderCode: Number(orderCode),
      amount,
      description: 'Donation',
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/donation/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/donation/cancel`,
    })

    await prisma.donation.create({
      data: {
        orderCode,
        amount,
        senderName,
        message,
        isAnonymous,
        status: 'PENDING',
      },
    })

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

export default router
