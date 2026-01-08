import { Router } from 'express'
import type { Request, Response } from 'express'
import { payos } from '../services/payos'
import { prisma } from '../prisma'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    if (req.body.code === '00') {
      const webhookData = await payos.webhooks.verify(req.body)

      await prisma.donation.updateMany({
        where: { orderCode: BigInt(webhookData.orderCode) },
        data: { status: 'PAID' },
      })
    }

    return res.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(400).json({ error: 'Invalid signature' })
  }
})

export default router
