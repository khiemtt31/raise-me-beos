'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

const SuccessPage = () => {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-transparent text-[var(--hero-foreground)] flex items-center justify-center p-4">
      <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface-strong)]/90 p-8 max-w-md w-full text-center shadow-lg backdrop-blur">
        <div className="text-6xl mb-4">{t('DONATION.SUCCESS.ICON.001')}</div>
        <h1 className="text-2xl font-bold text-[var(--hero-accent-strong)] mb-4">
          {t('DONATION.SUCCESS.TITLE.001')}
        </h1>
        <p className="text-[var(--hero-muted)] mb-6">
          {t('DONATION.SUCCESS.TEXT.001')}
        </p>
        <div className="space-y-4">
          <p className="text-sm text-[var(--hero-muted)]">
            {t('DONATION.SUCCESS.TEXT.002')}
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full bg-[var(--hero-accent)] hover:bg-[var(--hero-accent-strong)] text-[var(--hero-accent-contrast)] font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('DONATION.SUCCESS.BUTTON.001')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
