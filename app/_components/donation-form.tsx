'use client'

import { useMemo, useState } from 'react'
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
        'glass-panel neon-border rounded-3xl relative overflow-hidden flex flex-col',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-accent)]/5 via-transparent to-[var(--hero-accent)]/10 pointer-events-none" />

      <div className="relative flex min-h-0 flex-1 flex-col gap-6 px-5 py-5 sm:px-6 sm:py-6 md:gap-8 md:px-8 md:py-8">
        {/* Header with tier badge */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
              {donationContent.eyebrow}
            </p>
            <h2 className="text-xl font-heading text-glow sm:text-2xl">
              {donationContent.title}
            </h2>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)] shadow-lg">
              <tier.icon className={cn('h-6 w-6', tier.color)} />
            </div>
            <span className={cn('text-xs font-medium uppercase tracking-wide', tier.color)}>
              {tier.label}
            </span>
          </div>
        </div>

        {/* Amount display with animation */}
        <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/50 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em]">
            <span className="text-[var(--hero-muted)]">{donationContent.amountLabel}</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-heading text-glow font-bold sm:text-2xl">
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
                onClick={() => onAmountSelect(preset)}
                className={cn(
                  'h-10 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg sm:h-12',
                  amount === preset && !customAmount
                    ? 'border-[var(--hero-accent)] bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] shadow-[0_0_20px_var(--hero-accent)]'
                    : 'border-[var(--hero-border)] bg-[var(--hero-surface)]/50 text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)] backdrop-blur-sm'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-xs font-medium sm:text-sm">
                  {preset.toLocaleString(locale)}
                </span>
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
                'no-spinner h-11 border transition-all duration-300 rounded-xl bg-[var(--hero-surface)]/50 backdrop-blur-sm sm:h-12',
                focusedField === 'custom-amount'
                  ? 'border-[var(--hero-accent)] shadow-[0_0_20px_var(--hero-accent)]'
                  : 'border-[var(--hero-border)]'
              )}
            />
          </div>
        </div>

        {/* Personal info section */}
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
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
              onChange={(e) => onSenderNameChange(e.target.value)}
              onFocus={() => setFocusedField('sender-name')}
              onBlur={() => setFocusedField(null)}
              className={cn(
                'h-11 transition-all duration-300 rounded-xl bg-[var(--hero-surface)]/50 backdrop-blur-sm sm:h-12',
                focusedField === 'sender-name'
                  ? 'border-[var(--hero-accent)] shadow-[0_0_20px_var(--hero-accent)]'
                  : 'border-[var(--hero-border)]'
              )}
            />
          </div>

          <div className="space-y-2">
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
              onChange={(e) => onMessageChange(e.target.value)}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              className={cn(
                'min-h-[72px] transition-all duration-300 rounded-xl bg-[var(--hero-surface)]/50 backdrop-blur-sm resize-none sm:min-h-[100px]',
                focusedField === 'message'
                  ? 'border-[var(--hero-accent)] shadow-[0_0_20px_var(--hero-accent)]'
                  : 'border-[var(--hero-border)]'
              )}
              rows={3}
            />
          </div>

        </div>

        {/* Enhanced donate button */}
        <Button
          onClick={onDonate}
          disabled={isLoading}
          className={cn(
            'neon-border h-12 w-full text-base font-heading transition-all duration-300 rounded-xl relative overflow-hidden group sm:h-14 sm:text-lg',
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
  )
}
