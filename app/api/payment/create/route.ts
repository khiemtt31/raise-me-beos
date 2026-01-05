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
    const { amount, senderName, message, isAnonymous } = await request.json()

    if (!amount || amount < 10000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const orderCode = BigInt(Date.now())

    const paymentData = await payos.createPaymentLink({
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

    return NextResponse.json({
      checkoutUrl: paymentData.checkoutUrl,
      qrCode: paymentData.qrCode,
      orderCode: orderCode.toString(),
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}