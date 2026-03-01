import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { SettingsMenu } from './settings-menu'

export function PortfolioHeader() {
  const t = useTranslations()

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 h-[var(--header-h)]"
      style={{
        background: 'rgba(5, 5, 0, 0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.28)',
        boxShadow: '0 1px 32px rgba(201, 162, 39, 0.10), 0 0 0 0.5px rgba(201,162,39,0.15)',
      }}
    >
      {/* Gold shimmer line at very top */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.6) 30%, rgba(255,215,0,0.9) 50%, rgba(255,215,0,0.6) 70%, transparent 100%)',
        }}
      />

      <div className="mx-auto flex h-full w-full items-center justify-between px-6 md:px-10 xl:px-16">
        {/* Brand */}
        <Button
          variant="popText"
          asChild
          className="flex items-center gap-3 p-0 h-auto hover:bg-transparent"
        >
          <Link href="/" className="flex items-center gap-3 group">
            {/* Decorative diamond */}
            <span
              className="inline-block h-2 w-2 rotate-45 transition-all duration-300 group-hover:scale-125"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #C9A227)',
                boxShadow: '0 0 8px rgba(255,215,0,0.7)',
              }}
            />
            <span
              className="text-lg uppercase tracking-[0.45em] transition-all duration-300"
              style={{
                color: '#C9A227',
                textShadow: '0 0 14px rgba(255,215,0,0.45)',
                fontFamily: 'var(--font-orbitron)',
                fontWeight: 700,
                letterSpacing: '0.45em',
              }}
            >
              {t('NAV.BRAND.001')}
            </span>
          </Link>
        </Button>

        {/* Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {[
            { href: '/', label: t('NAV.LINK.001') },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group relative text-xs uppercase tracking-[0.35em] transition-all duration-300"
              style={{ color: 'rgba(240,192,64,0.55)', fontFamily: 'var(--font-orbitron)' }}
            >
              <span className="transition-all duration-300 group-hover:text-[#FFD700] group-hover:[text-shadow:0_0_12px_rgba(255,215,0,0.6)]">
                {label}
              </span>
              {/* Underline sweep */}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: 'linear-gradient(90deg, #FFD700, #C9A227)' }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SettingsMenu />
        </div>
      </div>
    </header>
  )
}

