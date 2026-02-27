'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { DollarSign, Heart, Sparkles, Users, Zap } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MIN_DONATION_AMOUNT } from '@/lib/donation-config'
import { cn } from '@/lib/utils'
import { getDonationContent, donationPresets } from '@/skeleton-data/portfolio'

type DonationFormProps = {
  className?: string
  amount: number
  customAmount: string
  senderName: string
  message: string
  isLoading: boolean
  onAmountSelect: (preset: number) => void
  onCustomAmountChange: (value: string) => void
  onSenderNameChange: (value: string) => void
  onMessageChange: (value: string) => void
  onDonate: () => void
}

export function DonationForm({
  className,
  amount,
  customAmount,
  senderName,
  message,
  isLoading,
  onAmountSelect,
  onCustomAmountChange,
  onSenderNameChange,
  onMessageChange,
  onDonate,
}: DonationFormProps) {
  const t = useTranslations()
  const locale = useLocale()
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const currencyLabel = t('DONATE.CURRENCY.001')
  const minAmountLabel = useMemo(
    () => MIN_DONATION_AMOUNT.toLocaleString(locale),
    [locale]
  )
  const donationContent = getDonationContent(t, {
    minAmountLabel,
    currencyLabel,
  })

  const getAmountTier = (value: number) => {
    if (value >= 500000)
      return {
        icon: Sparkles,
        label: t('DONATE.TIER.LABEL.001'),
        color: 'text-yellow-400',
      }
    if (value >= 100000)
      return {
        icon: Zap,
        label: t('DONATE.TIER.LABEL.002'),
        color: 'text-blue-400',
      }
    if (value >= 50000)
      return {
        icon: Heart,
        label: t('DONATE.TIER.LABEL.003'),
        color: 'text-pink-400',
      }
    return {
      icon: Users,
      label: t('DONATE.TIER.LABEL.004'),
      color: 'text-green-400',
    }
  }

  const tier = getAmountTier(amount)

  return (
    <div
      className={cn(
        'glass-panel rounded-3xl relative overflow-hidden flex flex-col shadow-2xl border-2 border-[var(--hero-border)]/30 hover:border-[var(--hero-accent)]/50 transition-all duration-500',
        className
      )}
    >
      {/* Background image */}
      <Image
        src="/donation-form-bg.png"
        alt=""
        fill
        className="object-cover opacity-[0.12] pointer-events-none select-none"
        priority
      />
      {/* Animated background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-accent)]/10 via-purple-500/5 to-blue-500/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--hero-accent),transparent_70%)] opacity-20 pointer-events-none" />

      <div className="relative flex min-h-0 flex-1 flex-col gap-5 px-5 py-6 sm:gap-6 sm:px-7 sm:py-7 md:gap-7 md:px-8 md:py-8">
        {/* Header with animated tier badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--hero-muted)] font-semibold">
              {donationContent.eyebrow}
            </p>
            <h2 className="text-2xl font-heading text-glow sm:text-3xl leading-tight">
              {donationContent.title}
            </h2>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--hero-accent)] to-purple-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--hero-border)] bg-[var(--hero-surface)] shadow-xl backdrop-blur-sm transition-transform group-hover:scale-110 duration-300">
                <tier.icon className={cn('h-7 w-7 transition-all', tier.color)} />
              </div>
            </div>
            <span className={cn('text-[10px] font-bold uppercase tracking-widest', tier.color)}>
              {tier.label}
            </span>
          </div>
        </div>

        {/* Enhanced amount display */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--hero-accent)]/20 via-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative rounded-2xl border-2 border-[var(--hero-border)] bg-gradient-to-br from-[var(--hero-surface)]/80 to-[var(--hero-surface)]/40 p-5 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] font-semibold">
                {donationContent.amountLabel}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-heading text-glow font-bold sm:text-4xl transition-all duration-300">
                  {amount.toLocaleString(locale)}
                </span>
                <span className="text-sm text-[var(--hero-muted)] font-medium">{currencyLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preset amounts with modern cards */}
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--hero-muted)] font-semibold">
            {t('DONATE.LABEL.QUICK_SELECT.001')}
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {donationPresets.map((preset, index) => (
              <Button
                key={preset}
                variant="outline"
                onClick={() => onAmountSelect(preset)}
                className={cn(
                  'h-14 rounded-2xl border-2 transition-all duration-300 hover:scale-105 active:scale-95 sm:h-16 relative overflow-hidden group',
                  amount === preset && !customAmount
                    ? 'border-[var(--hero-accent)] bg-gradient-to-br from-[var(--hero-accent)] to-purple-500 text-white shadow-[0_0_30px_var(--hero-accent)] scale-105'
                    : 'border-[var(--hero-border)] bg-[var(--hero-surface)]/60 text-[var(--hero-foreground)] hover:border-[var(--hero-accent)]/70 hover:bg-[var(--hero-surface)] backdrop-blur-sm shadow-md'
                )}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-sm font-bold sm:text-base">
                  {preset.toLocaleString(locale)}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom amount with icon */}
        <div className="space-y-2.5">
          <Label
            htmlFor="custom-amount"
            className="text-[10px] uppercase tracking-[0.4em] text-[var(--hero-muted)] font-semibold"
          >
            {donationContent.customAmountLabel}
          </Label>
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--hero-accent)]/30 to-purple-500/30 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center">
              <DollarSign className={cn(
                'absolute left-4 h-5 w-5 transition-colors duration-300',
                focusedField === 'custom-amount' ? 'text-[var(--hero-accent)]' : 'text-[var(--hero-muted)]'
              )} />
              <Input
                id="custom-amount"
                type="number"
                placeholder={donationContent.customAmountPlaceholder}
                value={customAmount}
                onChange={(e) => onCustomAmountChange(e.target.value)}
                onFocus={() => setFocusedField('custom-amount')}
                onBlur={() => setFocusedField(null)}
                min={MIN_DONATION_AMOUNT}
                className={cn(
                  'no-spinner h-14 border-2 transition-all duration-300 rounded-2xl bg-[var(--hero-surface)]/60 backdrop-blur-sm pl-12 text-lg font-semibold shadow-md',
                  focusedField === 'custom-amount'
                    ? 'border-[var(--hero-accent)] shadow-[0_0_25px_var(--hero-accent)] scale-[1.02]'
                    : 'border-[var(--hero-border)] hover:border-[var(--hero-accent)]/50'
                )}
              />
            </div>
          </div>
        </div>

        {/* Personal info section with enhanced styling */}
        <div className="space-y-4">
          <div className="space-y-2.5">
            <Label
              htmlFor="sender-name"
              className="text-[10px] uppercase tracking-[0.4em] text-[var(--hero-muted)] font-semibold"
            >
              {donationContent.nameLabel}
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--hero-accent)]/30 to-blue-500/30 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <Input
                id="sender-name"
                placeholder={donationContent.namePlaceholder}
                value={senderName}
                onChange={(e) => onSenderNameChange(e.target.value)}
                onFocus={() => setFocusedField('sender-name')}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  'relative h-12 transition-all duration-300 rounded-2xl bg-[var(--hero-surface)]/60 backdrop-blur-sm border-2 shadow-md sm:h-14',
                  focusedField === 'sender-name'
                    ? 'border-[var(--hero-accent)] shadow-[0_0_25px_var(--hero-accent)] scale-[1.02]'
                    : 'border-[var(--hero-border)] hover:border-[var(--hero-accent)]/50'
                )}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="message"
              className="text-[10px] uppercase tracking-[0.4em] text-[var(--hero-muted)] font-semibold"
            >
              {donationContent.messageLabel}
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 to-[var(--hero-accent)]/30 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <Textarea
                id="message"
                placeholder={donationContent.messagePlaceholder}
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  'relative min-h-[80px] transition-all duration-300 rounded-2xl bg-[var(--hero-surface)]/60 backdrop-blur-sm resize-none border-2 shadow-md sm:min-h-[100px]',
                  focusedField === 'message'
                    ? 'border-[var(--hero-accent)] shadow-[0_0_25px_var(--hero-accent)] scale-[1.02]'
                    : 'border-[var(--hero-border)] hover:border-[var(--hero-accent)]/50'
                )}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Premium donate button */}
        <Button
          onClick={onDonate}
          disabled={isLoading}
          className={cn(
            'h-14 w-full text-lg font-heading transition-all duration-300 rounded-2xl relative overflow-hidden group shadow-2xl sm:h-16 sm:text-xl',
            isLoading
              ? 'bg-[var(--hero-surface)] text-[var(--hero-muted)] cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-[var(--hero-accent)] via-purple-500 to-[var(--hero-accent)] bg-[length:200%_100%] text-white hover:bg-[position:100%_0] hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_40px_var(--hero-accent)]'
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="relative flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-3 border-white/30 border-t-white" />
                <span className="font-bold">{donationContent.processingLabel}</span>
              </>
            ) : (
              <>
                <Heart className="h-5 w-5 animate-pulse" />
                <span className="font-bold tracking-wide">{donationContent.buttonLabel}</span>
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </>
            )}
          </div>
        </Button>

        {/* Enhanced impact message */}
        <div className="rounded-2xl border border-[var(--hero-border)]/50 bg-[var(--hero-surface)]/30 backdrop-blur-sm p-4 text-center space-y-2">
          <p className="text-xs text-[var(--hero-muted)] leading-relaxed">{t('DONATE.IMPACT.TEXT.001')}</p>
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-red-400 animate-pulse" />
            <span className="text-xs text-[var(--hero-foreground)] font-medium">{t('DONATE.IMPACT.TEXT.002')}</span>
            <Heart className="h-4 w-4 text-red-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
