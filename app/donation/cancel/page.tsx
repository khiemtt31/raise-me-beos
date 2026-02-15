'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const CancelPage = () => {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-transparent text-[var(--hero-foreground)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-[var(--hero-border)] bg-[var(--hero-surface-strong)]/90 text-[var(--hero-foreground)] shadow-lg backdrop-blur">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{t('DONATION.CANCEL.ICON.001')}</div>
          <CardTitle className="text-2xl text-[var(--hero-accent-strong)]">
            {t('DONATION.CANCEL.TITLE.001')}
          </CardTitle>
          <CardDescription className="text-[var(--hero-muted)]">
            {t('DONATION.CANCEL.TEXT.001')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--hero-muted)] text-center">
            {t('DONATION.CANCEL.TEXT.002')}
          </p>
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1 border-[var(--hero-border)] text-[var(--hero-foreground)]"
            >
              <Link href="/">{t('DONATION.CANCEL.BUTTON.001')}</Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)]"
            >
              <Link href="/donate">{t('DONATION.CANCEL.BUTTON.002')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CancelPage
