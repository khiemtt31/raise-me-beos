'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

import { HeroSection } from './_components/hero-section'
import { MilestonesSection } from './_components/milestones-section'
import { PaymentDialog } from './_components/payment-dialog'
import { PortfolioBackground } from './_components/portfolio-background'
import { PortfolioFooter } from './_components/portfolio-footer'
import { PortfolioHeader } from './_components/portfolio-header'
import { ProjectsSection } from './_components/projects-section'
import { StorySection } from './_components/story-section'

export default function PortfolioPage() {
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

  useEffect(() => {
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    )

    if (!revealNodes.length) return

    if (!('IntersectionObserver' in window)) {
      revealNodes.forEach((node) => node.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    revealNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

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

        <main className="mx-auto w-full px-6 pb-24 pt-20 md:px-10 md:pt-24 xl:px-16">
          <HeroSection
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
          <StorySection />
          <MilestonesSection />
          <ProjectsSection />
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
