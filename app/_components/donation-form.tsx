'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { DollarSign, Heart, Sparkles, Users, Zap } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
        color: 'text-amber-400',
      }
    if (value >= 50000)
      return {
        icon: Heart,
        label: t('DONATE.TIER.LABEL.003'),
        color: 'text-yellow-500',
      }
    return {
      icon: Users,
      label: t('DONATE.TIER.LABEL.004'),
      color: 'text-amber-600',
    }
  }

  const tier = getAmountTier(amount)
  const TierIcon = tier.icon

  return (
    <div
      className={cn(
        'glass-panel rounded-2xl relative overflow-hidden shadow-xl border border-[var(--hero-border)]/30 hover:border-[var(--hero-accent)]/40 transition-all duration-500',
        className
      )}
    >
      {/* Background */}
      <Image
        src="/donation-form-bg.png"
        alt=""
        fill
        className="object-cover opacity-[0.08] pointer-events-none select-none"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-accent)]/8 via-transparent to-[var(--hero-surface)]/20 pointer-events-none" />

      <div className="relative grid gap-4 p-4 sm:p-5 md:grid-cols-2 md:gap-6 md:p-6">
        {/* ── Left column: amount selection ── */}
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-heading text-glow font-bold sm:text-lg leading-tight">
              {donationContent.title}
            </h2>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)] shadow backdrop-blur-sm">
                <TierIcon className={cn('h-3.5 w-3.5', tier.color)} />
              </div>
              <span className={cn('hidden text-[10px] font-bold uppercase tracking-widest sm:block', tier.color)}>
                {tier.label}
              </span>
            </div>
          </div>

          {/* Current amount display */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/60 px-3 py-2.5 backdrop-blur-sm">
            <span className="text-[10px] uppercase tracking-widest text-[var(--hero-muted)]">
              {donationContent.amountLabel}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-heading text-glow font-bold sm:text-2xl transition-all duration-300">
                {amount.toLocaleString(locale)}
              </span>
              <span className="text-xs text-[var(--hero-muted)]">{currencyLabel}</span>
            </div>
          </div>

          {/* Preset buttons */}
          <div className="grid grid-cols-3 gap-2">
            {donationPresets.map((preset, index) => (
              <Button
                key={preset}
                variant="outline"
                onClick={() => onAmountSelect(preset)}
                className={cn(
                  'h-9 rounded-xl border text-xs font-bold transition-all duration-200',
                  amount === preset && !customAmount
                    ? 'border-[var(--hero-accent)] bg-gradient-to-br from-[var(--hero-accent)] to-purple-500 text-white shadow-[0_0_15px_var(--hero-accent)] scale-[1.03]'
                    : 'border-[var(--hero-border)] bg-[var(--hero-surface)]/60 text-[var(--hero-foreground)] hover:border-[var(--hero-accent)]/60 backdrop-blur-sm'
                )}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {preset.toLocaleString(locale)}
              </Button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative">
            <DollarSign
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 z-10 transition-colors',
                focusedField === 'custom-amount' ? 'text-[var(--hero-accent)]' : 'text-[var(--hero-muted)]'
              )}
            />
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
                'no-spinner h-9 border rounded-xl bg-[var(--hero-surface)]/60 backdrop-blur-sm pl-8 text-sm font-semibold transition-all duration-200',
                focusedField === 'custom-amount'
                  ? 'border-[var(--hero-accent)] shadow-[0_0_12px_var(--hero-accent)]'
                  : 'border-[var(--hero-border)] hover:border-[var(--hero-accent)]/50'
              )}
            />
          </div>
        </div>

        {/* ── Right column: personal info + submit ── */}
        <div className="flex flex-col gap-3">
          {/* Name */}
          <Input
            id="sender-name"
            placeholder={donationContent.namePlaceholder}
            value={senderName}
            onChange={(e) => onSenderNameChange(e.target.value)}
            onFocus={() => setFocusedField('sender-name')}
            onBlur={() => setFocusedField(null)}
            className={cn(
              'h-9 border rounded-xl bg-[var(--hero-surface)]/60 backdrop-blur-sm text-sm transition-all duration-200',
              focusedField === 'sender-name'
                ? 'border-[var(--hero-accent)] shadow-[0_0_12px_var(--hero-accent)]'
                : 'border-[var(--hero-border)] hover:border-[var(--hero-accent)]/50'
            )}
          />

          {/* Message */}
          <Textarea
            id="message"
            placeholder={donationContent.messagePlaceholder}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            className={cn(
              'flex-1 min-h-[72px] border rounded-xl bg-[var(--hero-surface)]/60 backdrop-blur-sm resize-none text-sm transition-all duration-200',
              focusedField === 'message'
                ? 'border-[var(--hero-accent)] shadow-[0_0_12px_var(--hero-accent)]'
                : 'border-[var(--hero-border)] hover:border-[var(--hero-accent)]/50'
            )}
            rows={3}
          />

          {/* Donate button */}
          <Button
            onClick={onDonate}
            disabled={isLoading}
            className={cn(
              'h-10 w-full text-sm font-heading transition-all duration-300 rounded-xl relative overflow-hidden group shadow-lg',
              isLoading
                ? 'bg-[var(--hero-surface)] text-[var(--hero-muted)] cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-[var(--hero-accent)] via-purple-500 to-[var(--hero-accent)] bg-[length:200%_100%] text-white hover:bg-[position:100%_0] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_var(--hero-accent)]'
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span className="font-semibold">{donationContent.processingLabel}</span>
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 animate-pulse" />
                  <span className="font-semibold tracking-wide">{donationContent.buttonLabel}</span>
                  <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </div>
          </Button>

          {/* Compact impact note */}
          <p className="text-center text-[11px] text-[var(--hero-muted)] leading-relaxed">
            <Heart className="inline h-3 w-3 text-red-400 mr-1 animate-pulse" />
            {t('DONATE.IMPACT.TEXT.002')}
          </p>
        </div>
      </div>
    </div>
  )
}
