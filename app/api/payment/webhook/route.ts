import { NextRequest, NextResponse } from 'next/server'
import PayOS from '@payos/node'
import { prisma } from '@/lib/prisma'

// @ts-expect-error PayOS constructor types are not properly exported
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID!,
  process.env.PAYOS_API_KEY!,
  process.env.PAYOS_CHECKSUM_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-payos-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const body = await request.text()
    const isValid = payos.verifyPaymentWebhookData(body, signature)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const data = JSON.parse(body)

    if (data.code === '00') {
      await prisma.donation.updateMany({
        where: { orderCode: BigInt(data.orderCode) },
        data: { status: 'PAID' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}