'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { CenteredShell } from '@/components/layout/centered-shell'

const SuccessPage = () => {
  const t = useTranslations()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderCode = params.get('orderCode')
    if (!orderCode) return

    const base = (process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ?? '').replace(/\/$/, '')
    fetch(`${base}/api/payment/${orderCode}`).catch(() => {})
  }, [])

  return (
    <CenteredShell>
      <div className="rounded-2xl border border-(--hero-border) bg-(--hero-surface-strong)/90 p-8 max-w-md w-full text-center shadow-lg backdrop-blur">
        <div className="text-6xl mb-4">{t('DONATION.SUCCESS.ICON.001')}</div>
        <h1 className="text-2xl font-bold text-(--hero-accent-strong) mb-4">
          {t('DONATION.SUCCESS.TITLE.001')}
        </h1>
        <p className="text-(--hero-muted) mb-6">
          {t('DONATION.SUCCESS.TEXT.001')}
        </p>
        <div className="space-y-4">
          <p className="text-sm text-(--hero-muted)">
            {t('DONATION.SUCCESS.TEXT.002')}
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full bg-(--hero-accent) hover:bg-(--hero-accent-strong) text-(--hero-accent-contrast) font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('DONATION.SUCCESS.BUTTON.001')}
          </Button>
        </div>
      </div>
    </CenteredShell>
  )
}

export default SuccessPage
