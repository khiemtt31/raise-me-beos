import { footerContent } from '@/skeleton-data/portfolio'

export function PortfolioFooter() {
  return (
    <footer className="mx-auto w-full px-6 pb-10 md:px-10 xl:px-16">
      <div className="flex flex-col items-start justify-between gap-3 border-t border-[var(--hero-border)] pt-6 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] md:flex-row md:items-center">
        <span className="text-[var(--hero-accent)]">{footerContent.brand}</span>
        <span>{footerContent.tagline}</span>
        <span>
          (c) {new Date().getFullYear()} {footerContent.brand}.{' '}
          {footerContent.copyright}
        </span>
      </div>
    </footer>
  )
}
