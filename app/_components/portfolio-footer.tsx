import { useTranslations } from 'next-intl'
import { getFooterContent } from '@/skeleton-data/portfolio'

export function PortfolioFooter() {
  const t = useTranslations()
  const footerContent = getFooterContent(t)
  const year = new Date().getFullYear()

  return (
    <footer className="mx-auto w-full px-6 pb-6 pt-6 md:px-10 md:pb-8 xl:px-16">
      <div
        className="flex flex-col items-start justify-between gap-2 pt-4 text-[10px] uppercase leading-tight tracking-[0.35em] md:flex-row md:items-center md:gap-3 md:pt-6"
        style={{ borderTop: '1px solid rgba(201,162,39,0.25)' }}
      >
        {/* Brand with gold shimmer */}
        <span
          className="font-heading text-sm"
          style={{
            background: 'linear-gradient(90deg, #FFD700, #C9A227, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
          }}
        >
          {footerContent.brand}
        </span>

        <span style={{ color: 'rgba(201,162,39,0.45)' }}>{footerContent.tagline}</span>

        <span style={{ color: 'rgba(201,162,39,0.35)' }}>
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

