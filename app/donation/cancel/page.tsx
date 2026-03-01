'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CenteredShell } from '@/components/layout/centered-shell'

const CancelPage = () => {
  const t = useTranslations()

  return (
    <CenteredShell>
      <Card className="max-w-md w-full border-(--hero-border) bg-(--hero-surface-strong)/90 text-(--hero-foreground) shadow-lg backdrop-blur">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{t('DONATION.CANCEL.ICON.001')}</div>
          <CardTitle className="text-2xl text-(--hero-accent-strong)">
            {t('DONATION.CANCEL.TITLE.001')}
          </CardTitle>
          <CardDescription className="text-(--hero-muted)">
            {t('DONATION.CANCEL.TEXT.001')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-(--hero-muted) text-center">
            {t('DONATION.CANCEL.TEXT.002')}
          </p>
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1 border-(--hero-border) text-(--hero-foreground)"
            >
              <Link href="/">{t('DONATION.CANCEL.BUTTON.001')}</Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-(--hero-accent) text-(--hero-accent-contrast) hover:bg-(--hero-accent-strong)"
            >
              <Link href="/donate">{t('DONATION.CANCEL.BUTTON.002')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </CenteredShell>
  )
}

export default CancelPage
