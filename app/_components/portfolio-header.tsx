import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { SettingsMenu } from './settings-menu'

export function PortfolioHeader() {
  const t = useTranslations()

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--hero-border)] bg-[var(--hero-bg)]">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4 md:px-10 xl:px-16">
        <Button
          variant="popText"
          asChild
          className="flex items-center gap-3 p-0 h-auto hover:bg-transparent transition-colors duration-300 hover:text-[var(--hero-accent)]"
        >
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.4em] text-[var(--hero-accent)]">
              {t('NAV.BRAND.001')}
            </span>
          </Link>
        </Button>

        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] md:flex">
          <Link
            href="/"
            className="transition duration-300 hover:text-[var(--hero-foreground)]"
          >
            {t('NAV.LINK.001')}
          </Link>
          <Link
            href="/donate"
            className="transition duration-300 hover:text-[var(--hero-foreground)]"
          >
            {t('NAV.LINK.002')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <SettingsMenu />
        </div>
      </div>
    </header>
  )
}
