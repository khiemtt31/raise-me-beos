'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

import { PaymentDialog } from '../_components/payment-dialog'
import { PortfolioBackground } from '../_components/portfolio-background'
import { PortfolioFooter } from '../_components/portfolio-footer'
import { PortfolioHeader } from '../_components/portfolio-header'
import { DonationForm } from '../_components/donation-form'

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(10000)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [senderName, setSenderName] = useState<string>('Anonymous')
  const [message, setMessage] = useState<string>('')
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [qrCode, setQrCode] = useState<string>('')
  const [showQR, setShowQR] = useState<boolean>(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string>('')
  const [orderCode, setOrderCode] = useState<string>('')

  useEffect(() => {
    if (!orderCode) return

    const paymentServiceBase =
      process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL?.replace(/\/$/, '') ?? ''

    const eventSource = new EventSource(`${paymentServiceBase}/api/sse/status/${orderCode}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.status === 'PAID') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        toast.success('Thank you for your donation!')
        setShowQR(false)
        setQrCode('')
        setOrderCode('')
        eventSource.close()
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [orderCode])

  const handleAmountSelect = (preset: number) => {
    setAmount(preset)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const num = parseInt(value)
    if (!isNaN(num) && num >= 10000) {
      setAmount(num)
    }
  }

  const paymentServiceBase =
    process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL?.replace(/\/$/, '') ?? ''

  const getCreateEndpoint = () =>
    paymentServiceBase ? `${paymentServiceBase}/api/payment/create` : '/api/payment/create'

  const handleDonate = async () => {
    if (amount < 10000) {
      toast.error('Minimum donation amount is 10,000 VND')
      return
    }

    if (amount > 5000000) {
      toast.error('Maximum donation amount is 5,000,000 VND')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(getCreateEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          senderName,
          message,
          isAnonymous,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create payment')
      }

      const data = await response.json()
      setQrCode(data.qrCode)
      setOrderCode(data.orderCode)
      setCheckoutUrl(data.checkoutUrl)
      setShowQR(true)
    } catch (error: any) {
      console.error('Donation creation error:', error)
      toast.error(error.message || 'Failed to create donation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--hero-bg)] text-[var(--hero-foreground)]">
      <PortfolioBackground />

      <div className="relative z-10 font-mono">
        <PortfolioHeader />

        <main className="mx-auto w-full px-6 pb-14 pt-10 md:px-10 md:pt-24 xl:px-16">
          <section className="grid min-h-[70vh] items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div data-reveal className="reveal space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-heading leading-tight text-glow md:text-6xl">
                  Support the Build
                </h1>
                <p className="text-lg text-[var(--hero-muted)]">
                  Help fuel the next wave of neon-powered design and motion innovation.
                </p>
              </div>
            </div>

            <DonationForm
              amount={amount}
              customAmount={customAmount}
              senderName={senderName}
              message={message}
              isAnonymous={isAnonymous}
              isLoading={isLoading}
              onAmountSelect={handleAmountSelect}
              onCustomAmountChange={handleCustomAmountChange}
              onSenderNameChange={setSenderName}
              onMessageChange={setMessage}
              onAnonymousChange={setIsAnonymous}
              onDonate={handleDonate}
            />
          </section>
        </main>

        <PortfolioFooter />
      </div>

      <PaymentDialog
        open={showQR}
        onOpenChange={setShowQR}
        qrCode={qrCode}
        checkoutUrl={checkoutUrl}
      />
    </div>
  )
}
