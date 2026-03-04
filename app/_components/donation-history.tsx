'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DonationHistoryItemDTO, PaginationMetaDTO } from '@/types/api'

type DonationHistoryProps = {
  className?: string
  donationHistory: DonationHistoryItemDTO[]
  isLoading: boolean
  isError: boolean
  pagination: PaginationMetaDTO | undefined
  historyPage: number
  onPrevPage: () => void
  onNextPage: () => void
}

export function DonationHistory({
  className,
  donationHistory,
  isLoading,
  isError,
  pagination,
  historyPage,
  onPrevPage,
  onNextPage,
}: DonationHistoryProps) {
  const t = useTranslations()
  const locale = useLocale()

  const currencyLabel = t('DONATE.CURRENCY.001')

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

  const statusLabels = useMemo(
    () => ({
      SUCCESS: t('DONATE.HISTORY.STATUS.PAID'),
      PENDING: t('DONATE.HISTORY.STATUS.PENDING'),
      FAIL: t('DONATE.HISTORY.STATUS.CANCELLED'),
    }),
    [t],
  )

  const getStatusLabel = (status: string) =>
    statusLabels[status as keyof typeof statusLabels] ?? status

  const totalEntries = pagination?.total ?? 0
  const totalPages = pagination?.totalPages ?? 1
  const hasPrevPage = pagination?.hasPrevPage ?? false
  const hasNextPage = pagination?.hasNextPage ?? false

  const historyTotalAmount = donationHistory.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  )

  return (
    <div
      className={cn(
        'glass-panel rounded-2xl relative overflow-hidden shadow-xl border border-[var(--hero-border)]/30 hover:border-[var(--hero-accent)]/40 transition-all duration-500',
        className,
      )}
    >
      {/* Background image */}
      <Image
        src="/donation-history-bg.png"
        alt=""
        fill
        className="object-cover opacity-[0.12] pointer-events-none select-none"
      />
      {/* Animated background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-surface)]/60 via-[var(--hero-accent)]/6 to-[var(--hero-accent)]/12 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--hero-accent),transparent_60%)] opacity-10 pointer-events-none" />

      <div className="relative flex flex-col gap-4 p-4 sm:p-5 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-heading text-glow font-bold sm:text-lg">
            {t('DONATE.HISTORY.SUBTITLE.001')}
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <div className="rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/60 px-3 py-1 backdrop-blur-sm">
              <span className="text-[var(--hero-muted)]">{t('DONATE.HISTORY.STATS.TOTAL_ENTRIES')}</span>
              {isLoading ? (
                <span className="ml-1.5 inline-block h-3.5 w-8 rounded-full bg-[var(--hero-border)]/40 align-middle animate-pulse" />
              ) : (
                <span className="ml-1.5 font-bold text-[var(--hero-foreground)]">{totalEntries}</span>
              )}
            </div>
            <div className="rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/60 px-3 py-1 backdrop-blur-sm">
              <span className="text-[var(--hero-muted)]">{t('DONATE.HISTORY.STATS.PAGE_TOTAL')}</span>
              {isLoading ? (
                <span className="ml-1.5 inline-block h-3.5 w-14 rounded-full bg-[var(--hero-border)]/40 align-middle animate-pulse" />
              ) : (
                <span className="ml-1.5 font-bold text-[var(--hero-foreground)]">{formatAmount(historyTotalAmount)}</span>
              )}
            </div>
          </div>
        </div>

        {/* History list */}
        <div className="space-y-2 overflow-y-auto max-h-[420px] sm:max-h-[480px] px-0.5 -mx-0.5">
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`history-skeleton-${index}`}
                  className="rounded-xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-32 rounded-full bg-[var(--hero-border)]/40 animate-pulse" />
                      <div className="h-3 w-44 rounded-full bg-[var(--hero-border)]/30 animate-pulse" />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <div className="h-3.5 w-20 rounded-full bg-[var(--hero-border)]/40 animate-pulse ml-auto" />
                      <div className="h-3 w-16 rounded-full bg-[var(--hero-border)]/30 animate-pulse ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <div className="rounded-xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-4 py-3 text-sm text-[var(--hero-muted)]">
              {t('ERROR.MESSAGE.003')}
            </div>
          )}

          {!isLoading && !isError && donationHistory.length === 0 && (
            <div className="rounded-xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-4 py-3 text-sm text-[var(--hero-muted)]">
              {t('DONATE.HISTORY.EMPTY.001')}
            </div>
          )}

          {!isLoading &&
            !isError &&
            donationHistory.map((entry) => {
              const displayName = entry.isAnonymous
                ? t('DONATE.HISTORY.ANONYMOUS')
                : entry.senderName || t('DONATE.HISTORY.ANONYMOUS')

              return (
                <div
                  key={entry.id}
                  className="w-full text-left rounded-xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[var(--hero-foreground)] truncate">
                          {displayName}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold',
                            entry.status === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : entry.status === 'PENDING'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30',
                          )}
                        >
                          {getStatusLabel(entry.status)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--hero-muted)] line-clamp-1">
                        {entry.message || t('DONATE.HISTORY.MESSAGE.NONE')}
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      <div className="text-sm font-heading text-glow font-bold">
                        {formatAmount(entry.amount)}
                      </div>
                      <div className="text-[10px] text-[var(--hero-muted)]">
                        {formatDate(entry.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-3 border-t border-[var(--hero-border)]/60 pt-3 text-xs">
          <span className="text-[10px] uppercase tracking-widest text-[var(--hero-muted)]">
            {t('DONATE.HISTORY.PAGINATION.LABEL', { page: historyPage, total: totalPages })}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevPage || isLoading}
              onClick={onPrevPage}
              className="text-[10px] h-7 px-3 rounded-lg border transition-all disabled:opacity-40"
            >
              {t('DONATE.HISTORY.PAGINATION.PREV')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage || isLoading}
              onClick={onNextPage}
              className="text-[10px] h-7 px-3 rounded-lg border transition-all disabled:opacity-40"
            >
              {t('DONATE.HISTORY.PAGINATION.NEXT')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
