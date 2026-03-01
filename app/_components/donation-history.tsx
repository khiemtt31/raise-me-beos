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
        'glass-panel rounded-3xl relative overflow-hidden flex flex-col shadow-2xl border-2 border-[var(--hero-border)]/30 hover:border-[var(--hero-accent)]/40 transition-all duration-500',
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

      <div className="relative flex h-full min-h-0 flex-col gap-6 lg:gap-8 px-6 py-6 md:px-8 md:py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 lg:gap-6">
          <div className="space-y-2.5 flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--hero-muted)] font-semibold">
              {t('DONATE.HISTORY.TITLE.001')}
            </p>
            <h2 className="text-2xl font-heading text-glow sm:text-3xl lg:text-4xl leading-tight">
              {t('DONATE.HISTORY.SUBTITLE.001')}
            </h2>
            <p className="text-sm text-[var(--hero-muted)] max-w-2xl leading-relaxed">
              {t('DONATE.HISTORY.TEXT.001')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--hero-accent)] to-[var(--hero-accent-strong)] blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative rounded-full border-2 border-[var(--hero-border)] bg-gradient-to-br from-[var(--hero-surface)]/80 to-[var(--hero-surface)]/40 px-4 py-2 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-105 sm:px-5 sm:py-2.5">
                <span className="text-[var(--hero-muted)] font-medium">
                  {t('DONATE.HISTORY.STATS.TOTAL_ENTRIES')}
                </span>
                {isLoading ? (
                  <span className="ml-2 inline-block h-4 w-10 rounded-full bg-[var(--hero-border)]/40 align-middle animate-pulse" />
                ) : (
                  <span className="ml-2 text-[var(--hero-foreground)] font-bold text-sm">
                    {totalEntries}
                  </span>
                )}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--hero-accent-strong)] to-[var(--hero-accent)] blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative rounded-full border-2 border-[var(--hero-border)] bg-gradient-to-br from-[var(--hero-surface)]/80 to-[var(--hero-surface)]/40 px-4 py-2 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-105 sm:px-5 sm:py-2.5">
                <span className="text-[var(--hero-muted)] font-medium">
                  {t('DONATE.HISTORY.STATS.PAGE_TOTAL')}
                </span>
                {isLoading ? (
                  <span className="ml-2 inline-block h-4 w-16 rounded-full bg-[var(--hero-border)]/40 align-middle animate-pulse" />
                ) : (
                  <span className="ml-2 text-[var(--hero-foreground)] font-bold text-sm">
                    {formatAmount(historyTotalAmount)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* History list */}
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-1 -mx-1">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`history-skeleton-${index}`}
                  className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-2">
                      <div className="h-4 w-36 rounded-full bg-[var(--hero-border)]/40 animate-pulse" />
                      <div className="h-3 w-48 rounded-full bg-[var(--hero-border)]/30 animate-pulse" />
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="h-4 w-24 rounded-full bg-[var(--hero-border)]/40 animate-pulse" />
                      <div className="h-3 w-20 rounded-full bg-[var(--hero-border)]/30 animate-pulse ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 text-sm text-[var(--hero-muted)]">
              {t('ERROR.MESSAGE.003')}
            </div>
          )}

          {!isLoading && !isError && donationHistory.length === 0 && (
            <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 text-sm text-[var(--hero-muted)]">
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
                  className="w-full text-left rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-[var(--hero-foreground)] truncate">
                          {displayName}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm',
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
                      <p className="text-xs text-[var(--hero-muted)] line-clamp-1 leading-relaxed">
                        {entry.message || t('DONATE.HISTORY.MESSAGE.NONE')}
                      </p>
                    </div>
                    <div className="text-right space-y-1 shrink-0">
                      <div className="text-xl font-heading text-glow font-bold">
                        {formatAmount(entry.amount)}
                      </div>
                      <div className="text-[10px] text-[var(--hero-muted)] font-medium">
                        {formatDate(entry.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-[var(--hero-border)] pt-5 text-xs">
          <span className="uppercase tracking-[0.3em] text-[var(--hero-muted)] font-semibold">
            {t('DONATE.HISTORY.PAGINATION.LABEL', {
              page: historyPage,
              total: totalPages,
            })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevPage || isLoading}
              onClick={onPrevPage}
              className="text-[10px] h-9 px-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg disabled:opacity-40"
            >
              {t('DONATE.HISTORY.PAGINATION.PREV')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage || isLoading}
              onClick={onNextPage}
              className="text-[10px] h-9 px-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg disabled:opacity-40"
            >
              {t('DONATE.HISTORY.PAGINATION.NEXT')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
