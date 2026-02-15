import { ArrowDown } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { getHeroContent } from '@/skeleton-data/portfolio'

export function HeroSection() {
  const t = useTranslations()
  const heroContent = getHeroContent(t)

  return (
    <section
      id="hero"
      data-section="hero"
      data-sphere
      className="sphere-section grid min-h-[85vh] items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div data-reveal className="reveal space-y-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--hero-accent)] animate-pulse" />
          {heroContent.pill}
        </div>
        <h1 className="text-4xl font-heading leading-tight text-glow md:text-6xl">
          {heroContent.title}
        </h1>
        <p className="text-lg text-[var(--hero-muted)]">{heroContent.subtitle}</p>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            className="neon-border bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)]"
          >
            <a href="#projects">{heroContent.primaryCta}</a>
          </Button>

        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          {heroContent.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--hero-border)] px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          <span className="h-px w-10 bg-[var(--hero-border)]" />
          {heroContent.scrollHint}
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
      <div data-reveal className="reveal">
        <div className="glass-panel rounded-3xl overflow-hidden">
          <Image
            src="/hanzo.png"
            alt={t('HOME.IMAGE.ALT.001')}
            width={800}
            height={800}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
