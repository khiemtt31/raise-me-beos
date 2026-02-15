'use client'

import { useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { ArrowLeft, DollarSign, Heart, Sparkles, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PaymentDialog } from '../_components/payment-dialog'
import { PortfolioFooter } from '../_components/portfolio-footer'
import { PortfolioHeader } from '../_components/portfolio-header'
import { cn } from '@/lib/utils'
import {
  donationPresets,
  getDonationContent,
} from '@/skeleton-data/portfolio'
import {
  queryKeys,
  useCreatePaymentMutation,
  useDonationHistory,
  useLatestPayment,
  usePaymentStatus,
} from '@/app/services/queries'
import type { DonationHistoryItemDTO } from '@/types/api'

const MIN_DONATION_AMOUNT = 10000
const MAX_DONATION_AMOUNT = 5000000
const HISTORY_PAGE_SIZE = 6


export default function DonatePage() {
  const t = useTranslations()
  const locale = useLocale()
  const queryClient = useQueryClient()

  const currencyLabel = t('DONATE.CURRENCY.001')
  const minAmountLabel = useMemo(
    () => MIN_DONATION_AMOUNT.toLocaleString(locale),
    [locale]
  )
  const maxAmountLabel = useMemo(
    () => MAX_DONATION_AMOUNT.toLocaleString(locale),
    [locale]
  )

  const donationContent = getDonationContent(t, {
    minAmountLabel,
    currencyLabel,
  })

  const [amount, setAmount] = useState<number>(MIN_DONATION_AMOUNT)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [senderName, setSenderName] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [showQR, setShowQR] = useState<boolean>(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [selectedHistory, setSelectedHistory] =
    useState<DonationHistoryItemDTO | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false)
  const [historyPage, setHistoryPage] = useState<number>(1)

  const createPaymentMutation = useCreatePaymentMutation()
  const latestPaymentQuery = useLatestPayment()
  const payment = latestPaymentQuery.data
  const orderCode = payment?.orderCode ?? null

  const paymentStatusQuery = usePaymentStatus(
    orderCode,
    Boolean(orderCode) && showQR
  )

  const donationHistoryQuery = useDonationHistory({
    page: historyPage,
    limit: HISTORY_PAGE_SIZE,
  })
  const donationHistory = donationHistoryQuery.data?.data ?? []
  const historyPagination = donationHistoryQuery.data?.pagination
  const historyTotalAmount = donationHistory.reduce(
    (sum, entry) => sum + entry.amount,
    0
  )

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
    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return
      const target = document.querySelector(hash)
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)

    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

  useEffect(() => {
    if (!paymentStatusQuery.data || paymentStatusQuery.data.status !== 'PAID') {
      return
    }

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#00ff88', '#00aaff', '#ff0088', '#ffaa00'],
    })
    toast.success(t('DONATE.TOAST.PAID.TITLE.001'), {
      duration: 5000,
    })

    setShowQR(false)
    createPaymentMutation.reset()
    queryClient.removeQueries({ queryKey: queryKeys.payment })
    if (orderCode) {
      queryClient.removeQueries({ queryKey: queryKeys.paymentStatus(orderCode) })
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.donationHistoryBase })
  }, [
    createPaymentMutation,
    orderCode,
    paymentStatusQuery.data,
    queryClient,
    t,
  ])

  const handleAmountSelect = (preset: number) => {
    setAmount(preset)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const num = parseInt(value)
    if (!isNaN(num) && num >= MIN_DONATION_AMOUNT) {
      setAmount(num)
    }
  }

  const handleDonate = async () => {
    if (amount < MIN_DONATION_AMOUNT) {
      toast.error(
        t('DONATE.TOAST.MIN_AMOUNT.TITLE.001', {
          amount: `${minAmountLabel} ${currencyLabel}`,
        }),
        {
          description: t('DONATE.TOAST.MIN_AMOUNT.DESC.001'),
        }
      )
      return
    }

    if (amount > MAX_DONATION_AMOUNT) {
      toast.error(
        t('DONATE.TOAST.MAX_AMOUNT.TITLE.001', {
          amount: `${maxAmountLabel} ${currencyLabel}`,
        }),
        {
          description: t('DONATE.TOAST.MAX_AMOUNT.DESC.001'),
        }
      )
      return
    }

    try {
      const resolvedSenderName = isAnonymous
        ? donationContent.namePlaceholder
        : senderName.trim() || donationContent.namePlaceholder

      await createPaymentMutation.mutateAsync({
        amount,
        senderName: resolvedSenderName,
        message,
        isAnonymous,
      })

      setShowQR(true)

      toast.success(t('DONATE.TOAST.QR_SUCCESS.TITLE.001'), {
        description: t('DONATE.TOAST.QR_SUCCESS.DESC.001'),
      })
    } catch (error: unknown) {
      console.error(error)
      toast.error(t('DONATE.TOAST.CREATE_FAILED.TITLE.001'), {
        description: t('DONATE.TOAST.CREATE_FAILED.DESC.001'),
      })
    }
  }

  const getTierLabel = (value: number) => {
    if (value >= 500000) return t('DONATE.TIER.LABEL.001')
    if (value >= 100000) return t('DONATE.TIER.LABEL.002')
    if (value >= 50000) return t('DONATE.TIER.LABEL.003')
    return t('DONATE.TIER.LABEL.004')
  }

  const isLoading = createPaymentMutation.isPending
  const isDialogOpen = showQR && Boolean(payment?.qrCode)

  const formatAmount = (value: number) =>
    `${value.toLocaleString(locale)} ${currencyLabel}`

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))

  const totalEntries = historyPagination?.total ?? 0
  const totalPages = historyPagination?.totalPages ?? 1
  const hasPrevPage = historyPagination?.hasPrevPage ?? false
  const hasNextPage = historyPagination?.hasNextPage ?? false
  const isHistoryLoading = donationHistoryQuery.isLoading

  const handleHistoryOpenChange = (open: boolean) => {
    setIsHistoryOpen(open)
    if (!open) {
      setSelectedHistory(null)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-[var(--hero-foreground)]">
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
                {t('DONATE.LINK.BACK.001')}
              </Link>
            </Button>
          </div>

          <section className="space-y-16">
            {/* Left side - Hero content */}
            <div data-reveal className="reveal space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/50 px-4 py-2 backdrop-blur-sm">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-[var(--hero-foreground)]">
                    {t('DONATE.HERO.BADGE.001')}
                  </span>
                </div>

                <h1 className="text-5xl font-heading leading-tight text-glow md:text-7xl xl:text-8xl">
                  {t('DONATE.HERO.TITLE.001')}
                  <br />
                  <span className="bg-gradient-to-r from-[var(--hero-accent)] to-blue-400 bg-clip-text text-transparent">
                    {t('DONATE.HERO.TITLE.002')}
                  </span>
                </h1>

                <p className="text-xl text-[var(--hero-muted)] leading-relaxed max-w-2xl">
                  {t('DONATE.HERO.TEXT.001')}
                </p>
              </div>

              {/* Impact stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-heading text-glow">28</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--hero-muted)]">
                    {t('DONATE.STATS.LABEL.001')}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-heading text-glow">16</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--hero-muted)]">
                    {t('DONATE.STATS.LABEL.002')}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <Users className="h-6 w-6 mx-auto text-[var(--hero-accent)]" />
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--hero-muted)]">
                    {t('DONATE.STATS.LABEL.003')}
                  </div>
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
                      {t('DONATE.TESTIMONIAL.TEXT.001')}
                    </p>
                    <p className="text-xs text-[var(--hero-muted)] mt-1">
                      {t('DONATE.TESTIMONIAL.BYLINE.001')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-10">
              {/* Donation form */}
              <div
                id="support"
                data-reveal
                className="reveal scroll-mt-28 xl:col-span-3 h-full"
              >
                <div className="glass-panel neon-border rounded-3xl p-8 relative overflow-hidden h-full">
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
                      <span
                        className={cn(
                          'text-xs font-medium uppercase tracking-wide',
                          amount >= 500000
                            ? 'text-yellow-400'
                            : amount >= 100000
                              ? 'text-blue-400'
                              : amount >= 50000
                                ? 'text-pink-400'
                                : 'text-green-400'
                        )}
                      >
                        {getTierLabel(amount)}
                      </span>
                    </div>
                  </div>

                  {/* Amount display with animation */}
                  <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/50 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em]">
                      <span className="text-[var(--hero-muted)]">{donationContent.amountLabel}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-heading text-glow font-bold">
                          {amount.toLocaleString(locale)}
                        </span>
                        <span className="text-[var(--hero-muted)] text-sm">{currencyLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preset amounts with better styling */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] mb-3">
                      {t('DONATE.LABEL.QUICK_SELECT.001')}
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
                          <span className="text-sm font-medium">{preset.toLocaleString(locale)}</span>
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
                        min={MIN_DONATION_AMOUNT}
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
                    <p>{t('DONATE.IMPACT.TEXT.001')}</p>
                    <p className="flex items-center justify-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" />
                      <span>{t('DONATE.IMPACT.TEXT.002')}</span>
                    </p>
                  </div>
                </div>
                </div>
              </div>

              {/* Donation history */}
              <div data-reveal className="reveal xl:col-span-7 h-full">
                <div className="glass-panel neon-border rounded-3xl p-8 relative overflow-hidden h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-[var(--hero-accent)]/10 pointer-events-none" />
                  <div className="relative flex h-full flex-col gap-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                          Donation History
                        </p>
                        <h2 className="text-3xl font-heading text-glow">Recent Support</h2>
                        <p className="text-sm text-[var(--hero-muted)] max-w-2xl">
                          See the latest contributions and tap any entry to view the full details.
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/60 px-4 py-2">
                          <span className="text-[var(--hero-muted)]">Total entries</span>
                          <span className="ml-2 text-[var(--hero-foreground)] font-semibold">
                            {isHistoryLoading ? '...' : totalEntries}
                          </span>
                        </div>
                        <div className="rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/60 px-4 py-2">
                          <span className="text-[var(--hero-muted)]">Page total</span>
                          <span className="ml-2 text-[var(--hero-foreground)] font-semibold">
                            {isHistoryLoading ? '...' : formatAmount(historyTotalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      {isHistoryLoading && (
                        <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 text-sm text-[var(--hero-muted)]">
                          Loading donation history...
                        </div>
                      )}

                      {!isHistoryLoading && donationHistoryQuery.isError && (
                        <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 text-sm text-[var(--hero-muted)]">
                          {t('ERROR.MESSAGE.003')}
                        </div>
                      )}

                      {!isHistoryLoading &&
                        !donationHistoryQuery.isError &&
                        donationHistory.length === 0 && (
                          <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 text-sm text-[var(--hero-muted)]">
                            No donations yet. Be the first to support.
                          </div>
                        )}

                      {!isHistoryLoading &&
                        !donationHistoryQuery.isError &&
                        donationHistory.map((entry) => {
                          const displayName = entry.isAnonymous
                            ? 'Anonymous'
                            : entry.senderName || 'Anonymous'

                          return (
                            <button
                              key={entry.id}
                              type="button"
                              onClick={() => {
                                setSelectedHistory(entry)
                                setIsHistoryOpen(true)
                              }}
                              className="w-full text-left rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]/70"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-[var(--hero-foreground)]">
                                      {displayName}
                                    </span>
                                    <span
                                      className={cn(
                                        'rounded-full px-2 py-0.5 text-xs uppercase tracking-[0.2em]',
                                        entry.status === 'PAID'
                                          ? 'bg-emerald-500/15 text-emerald-300'
                                          : entry.status === 'PENDING'
                                            ? 'bg-yellow-500/15 text-yellow-300'
                                            : 'bg-red-500/15 text-red-300'
                                      )}
                                    >
                                      {entry.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[var(--hero-muted)] line-clamp-1">
                                    {entry.message || 'No message shared.'}
                                  </p>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="text-lg font-heading text-glow">
                                    {formatAmount(entry.amount)}
                                  </div>
                                  <div className="text-xs text-[var(--hero-muted)]">
                                    {formatDate(entry.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--hero-border)] pt-4 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                      <span>
                        Page {historyPage} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!hasPrevPage || isHistoryLoading}
                          onClick={() => setHistoryPage((prev) => Math.max(1, prev - 1))}
                          className="text-[10px]"
                        >
                          Prev
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!hasNextPage || isHistoryLoading}
                          onClick={() => setHistoryPage((prev) => prev + 1)}
                          className="text-[10px]"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
          </section>

          {/* Additional info section */}
          <section className="mt-20 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-heading text-glow">
                {t('DONATE.SECTION.TITLE.001')}
              </h2>
              <p className="text-[var(--hero-muted)] max-w-2xl mx-auto">
                {t('DONATE.SECTION.TEXT.001')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-2xl p-6 text-center space-y-3">
                <Zap className="h-8 w-8 mx-auto text-yellow-400" />
                <h3 className="font-heading text-lg">{t('DONATE.CARD.TITLE.001')}</h3>
                <p className="text-sm text-[var(--hero-muted)]">
                  {t('DONATE.CARD.TEXT.001')}
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 text-center space-y-3">
                <Sparkles className="h-8 w-8 mx-auto text-blue-400" />
                <h3 className="font-heading text-lg">{t('DONATE.CARD.TITLE.002')}</h3>
                <p className="text-sm text-[var(--hero-muted)]">
                  {t('DONATE.CARD.TEXT.002')}
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 text-center space-y-3">
                <Heart className="h-8 w-8 mx-auto text-pink-400" />
                <h3 className="font-heading text-lg">{t('DONATE.CARD.TITLE.003')}</h3>
                <p className="text-sm text-[var(--hero-muted)]">
                  {t('DONATE.CARD.TEXT.003')}
                </p>
              </div>
            </div>
          </section>
        </main>

        <PortfolioFooter />
      </div>

      <PaymentDialog
        open={isDialogOpen}
        onOpenChange={setShowQR}
        qrCode={payment?.qrCode ?? ''}
        checkoutUrl={payment?.checkoutUrl ?? ''}
      />

      <Dialog open={isHistoryOpen} onOpenChange={handleHistoryOpenChange}>
        <DialogContent className="border-[var(--hero-border)] bg-[var(--hero-surface-strong)] text-[var(--hero-foreground)] max-w-lg">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-glow text-2xl">Donation Details</DialogTitle>
            <DialogDescription className="text-[var(--hero-muted)]">
              A closer look at this contribution.
            </DialogDescription>
          </DialogHeader>
          {selectedHistory && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                      Amount
                    </p>
                    <p className="text-3xl font-heading text-glow">
                      {formatAmount(selectedHistory.amount)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]',
                      selectedHistory.status === 'PAID'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : selectedHistory.status === 'PENDING'
                          ? 'bg-yellow-500/15 text-yellow-300'
                          : 'bg-red-500/15 text-red-300'
                    )}
                  >
                    {selectedHistory.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between border-b border-[var(--hero-border)] pb-2">
                  <span className="text-[var(--hero-muted)]">Donor</span>
                  <span className="font-medium">
                    {selectedHistory.isAnonymous
                      ? 'Anonymous'
                      : selectedHistory.senderName || 'Anonymous'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--hero-border)] pb-2">
                  <span className="text-[var(--hero-muted)]">Donation ID</span>
                  <span className="font-medium">{selectedHistory.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--hero-border)] pb-2">
                  <span className="text-[var(--hero-muted)]">Date</span>
                  <span className="font-medium">
                    {formatDate(selectedHistory.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--hero-border)] pb-2">
                  <span className="text-[var(--hero-muted)]">Method</span>
                  <span className="font-medium">
                    {selectedHistory.method || 'PayOS'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] mb-2">
                  Message
                </p>
                <p className="text-[var(--hero-foreground)]">
                  {selectedHistory.message || 'No message shared.'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
