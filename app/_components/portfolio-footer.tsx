import { useTranslations } from 'next-intl'
import { getFooterContent } from '@/skeleton-data/portfolio'

export function PortfolioFooter() {
  const t = useTranslations()
  const footerContent = getFooterContent(t)
  const year = new Date().getFullYear()

  return (
    <footer className="mx-auto w-full px-6 pb-10 md:px-10 xl:px-16">
      <div className="flex flex-col items-start justify-between gap-3 border-t border-[var(--hero-border)] pt-6 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] md:flex-row md:items-center">
        <span className="text-[var(--hero-accent)]">{footerContent.brand}</span>
        <span>{footerContent.tagline}</span>
        <span>
          {t('FOOTER.LINE.001', {
            year,
            brand: footerContent.brand,
            rights: footerContent.copyright,
          })}
        </span>
      </div>
    </footer>
  )
}
