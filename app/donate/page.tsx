'use client'

import React, { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { ArrowLeft, DollarSign, Heart, Sparkles, Users, Zap } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PaymentDialog } from '../_components/payment-dialog'
import { PortfolioBackground } from '../_components/portfolio-background'
import { PortfolioFooter } from '../_components/portfolio-footer'
import { PortfolioHeader } from '../_components/portfolio-header'
import { cn } from '@/lib/utils'
import {
  donationContent,
  donationPresets,
} from '@/skeleton-data/portfolio'

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
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    revealNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!orderCode) return

    const paymentServiceBase =
      process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL?.replace(/\/$/, '') ?? ''

    const eventSource = new EventSource(`${paymentServiceBase}/api/sse/status/${orderCode}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.status === 'PAID') {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#00ff88', '#00aaff', '#ff0088', '#ffaa00'],
        })
        toast.success('🎉 Thank you for your donation! Your support means everything.', {
          duration: 5000,
        })
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
      toast.error('Minimum donation amount is 10,000 VND', {
        description: 'Please select a higher amount to continue.',
      })
      return
    }

    if (amount > 5000000) {
      toast.error('Maximum donation amount is 5,000,000 VND', {
        description: 'Please select a lower amount to continue.',
      })
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

      toast.success('Payment QR code generated!', {
        description: 'Scan with your banking app to complete the donation.',
      })
    } catch (error: unknown) {
      console.error('Donation creation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create donation. Please try again.'
      toast.error(errorMessage, {
        description: 'If the problem persists, try refreshing the page.',
      })
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
          {/* Back navigation */}
          <div className="mb-8">
            <Button
              asChild
              variant="ghost"
              className="text-[var(--hero-muted)] hover:text-[var(--hero-foreground)] hover:bg-[var(--hero-surface)]/50"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio
              </Link>
            </Button>
          </div>

          <section className="space-y-16">
            {/* Left side - Hero content */}
            <div data-reveal className="reveal space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/50 px-4 py-2 backdrop-blur-sm">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-[var(--hero-foreground)]">Support the Vision</span>
                </div>

                <h1 className="text-5xl font-heading leading-tight text-glow md:text-7xl xl:text-8xl">
                  Fuel the
                  <br />
                  <span className="bg-gradient-to-r from-[var(--hero-accent)] to-blue-400 bg-clip-text text-transparent">
                    Next Drop
                  </span>
                </h1>

                <p className="text-xl text-[var(--hero-muted)] leading-relaxed max-w-2xl">
                  Help power the next wave of cyberpunk interfaces, motion design, and instant payment systems.
                  Your support directly fuels creative development and innovative tools.
                </p>
              </div>

              {/* Impact stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-heading text-glow">28</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--hero-muted)]">Drops Shipped</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-heading text-glow">16</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--hero-muted)]">Signal Partners</div>
                </div>
                <div className="text-center space-y-2">
                  <Users className="h-6 w-6 mx-auto text-[var(--hero-accent)]" />
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--hero-muted)]">Growing Community</div>
                </div>
              </div>

              {/* Social proof */}
              <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/30 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-[var(--hero-bg)] bg-gradient-to-br from-blue-400 to-purple-500" />
                    <div className="h-8 w-8 rounded-full border-2 border-[var(--hero-bg)] bg-gradient-to-br from-green-400 to-blue-500" />
                    <div className="h-8 w-8 rounded-full border-2 border-[var(--hero-bg)] bg-gradient-to-br from-purple-400 to-pink-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--hero-foreground)] font-medium">
                      &ldquo;This portfolio is a masterpiece of modern web design&rdquo;
                    </p>
                    <p className="text-xs text-[var(--hero-muted)] mt-1">
                      Recent supporter • Anonymous donor
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Donation form */}
            <div data-reveal className="reveal">
              <div className="glass-panel neon-border rounded-3xl p-8 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-accent)]/5 via-transparent to-[var(--hero-accent)]/10 pointer-events-none" />

                <div className="relative space-y-8">
                  {/* Header with tier badge */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                        {donationContent.eyebrow}
                      </p>
                      <h2 className="text-2xl font-heading text-glow">{donationContent.title}</h2>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)] shadow-lg">
                        {amount >= 500000 ? (
                          <Sparkles className="h-6 w-6 text-yellow-400" />
                        ) : amount >= 100000 ? (
                          <Zap className="h-6 w-6 text-blue-400" />
                        ) : amount >= 50000 ? (
                          <Heart className="h-6 w-6 text-pink-400" />
                        ) : (
                          <Users className="h-6 w-6 text-green-400" />
                        )}
                      </div>
                      <span className={cn("text-xs font-medium uppercase tracking-wide",
                        amount >= 500000 ? "text-yellow-400" :
                        amount >= 100000 ? "text-blue-400" :
                        amount >= 50000 ? "text-pink-400" : "text-green-400"
                      )}>
                        {amount >= 500000 ? "Legend" :
                         amount >= 100000 ? "Supporter" :
                         amount >= 50000 ? "Friend" : "Contributor"}
                      </span>
                    </div>
                  </div>

                  {/* Amount display with animation */}
                  <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/50 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em]">
                      <span className="text-[var(--hero-muted)]">{donationContent.amountLabel}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-heading text-glow font-bold">
                          {amount.toLocaleString()}
                        </span>
                        <span className="text-[var(--hero-muted)] text-sm">VND</span>
                      </div>
                    </div>
                  </div>

                  {/* Preset amounts with better styling */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] mb-3">
                      Quick select
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {donationPresets.map((preset, index) => (
                        <Button
                          key={preset}
                          variant="outline"
                          onClick={() => handleAmountSelect(preset)}
                          className={cn(
                            'h-12 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg',
                            amount === preset && !customAmount
                              ? 'border-[var(--hero-accent)] bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] shadow-[0_0_20px_var(--hero-accent)]'
                              : 'border-[var(--hero-border)] bg-[var(--hero-surface)]/50 text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)] backdrop-blur-sm'
                          )}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span className="text-sm font-medium">{preset.toLocaleString()}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount with better UX */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="custom-amount"
                      className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]"
                    >
                      {donationContent.customAmountLabel}
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--hero-muted)]" />
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder={donationContent.customAmountPlaceholder}
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        onFocus={() => setFocusedField('custom-amount')}
                        onBlur={() => setFocusedField(null)}
                        min="10000"
                        className={cn(
                          'pl-12 h-12 border transition-all duration-300 rounded-xl bg-[var(--hero-surface)]/50 backdrop-blur-sm',
                          focusedField === 'custom-amount'
                            ? 'border-[var(--hero-accent)] shadow-[0_0_20px_var(--hero-accent)]'
                            : 'border-[var(--hero-border)]'
                        )}
                      />
                    </div>
                  </div>

                  {/* Personal info section */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="sender-name"
                        className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]"
                      >
                        {donationContent.nameLabel}
                      </Label>
                      <Input
                        id="sender-name"
                        placeholder={donationContent.namePlaceholder}
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        onFocus={() => setFocusedField('sender-name')}
                        onBlur={() => setFocusedField(null)}
                        className={cn(
                          'h-12 transition-all duration-300 rounded-xl bg-[var(--hero-surface)]/50 backdrop-blur-sm',
                          focusedField === 'sender-name'
                            ? 'border-[var(--hero-accent)] shadow-[0_0_20px_var(--hero-accent)]'
                            : 'border-[var(--hero-border)]'
                        )}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="message"
                        className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]"
                      >
                        {donationContent.messageLabel}
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={donationContent.messagePlaceholder}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className={cn(
                          'min-h-[100px] transition-all duration-300 rounded-xl bg-[var(--hero-surface)]/50 backdrop-blur-sm resize-none',
                          focusedField === 'message'
                            ? 'border-[var(--hero-accent)] shadow-[0_0_20px_var(--hero-accent)]'
                            : 'border-[var(--hero-border)]'
                        )}
                        rows={3}
                      />
                    </div>

                    {/* Anonymous toggle with better styling */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/30 backdrop-blur-sm">
                      <Checkbox
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                        className="border-[var(--hero-border)] data-[state=checked]:bg-[var(--hero-accent)] data-[state=checked]:text-[var(--hero-accent-contrast)] h-5 w-5"
                      />
                      <Label
                        htmlFor="anonymous"
                        className="text-sm text-[var(--hero-foreground)] cursor-pointer"
                      >
                        {donationContent.anonymousLabel}
                      </Label>
                    </div>
                  </div>

                  {/* Enhanced donate button */}
                  <Button
                    onClick={handleDonate}
                    disabled={isLoading}
                    className={cn(
                      'neon-border h-14 w-full text-lg font-heading transition-all duration-300 rounded-xl relative overflow-hidden group',
                      isLoading
                        ? 'bg-[var(--hero-surface)] text-[var(--hero-muted)] cursor-not-allowed'
                        : 'bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)] hover:scale-[1.02] hover:shadow-[0_0_30px_var(--hero-accent)]'
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="relative flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--hero-accent-contrast)] border-t-transparent" />
                          {donationContent.processingLabel}
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-5 w-5" />
                          <span>{donationContent.buttonLabel}</span>
                          <Sparkles className="h-4 w-4 opacity-70" />
                        </>
                      )}
                    </div>
                  </Button>

                  {/* Impact message */}
                  <div className="text-center text-xs text-[var(--hero-muted)] space-y-1">
                    <p>Your support helps fuel the next wave of neon-powered innovation</p>
                    <p className="flex items-center justify-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" />
                      <span>100% goes to development and creative tools</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional info section */}
          <section className="mt-20 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-heading text-glow">Why Your Support Matters</h2>
              <p className="text-[var(--hero-muted)] max-w-2xl mx-auto">
                Every donation directly supports the development of cutting-edge design tools,
                open-source contributions, and the creation of innovative user experiences.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-2xl p-6 text-center space-y-3">
                <Zap className="h-8 w-8 mx-auto text-yellow-400" />
                <h3 className="font-heading text-lg">Innovation</h3>
                <p className="text-sm text-[var(--hero-muted)]">
                  Fueling the next generation of web interfaces and motion design
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 text-center space-y-3">
                <Sparkles className="h-8 w-8 mx-auto text-blue-400" />
                <h3 className="font-heading text-lg">Tools</h3>
                <p className="text-sm text-[var(--hero-muted)]">
                  Developing and maintaining creative tools for the design community
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 text-center space-y-3">
                <Heart className="h-8 w-8 mx-auto text-pink-400" />
                <h3 className="font-heading text-lg">Community</h3>
                <p className="text-sm text-[var(--hero-muted)]">
                  Building connections and supporting fellow creators
                </p>
              </div>
            </div>
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
