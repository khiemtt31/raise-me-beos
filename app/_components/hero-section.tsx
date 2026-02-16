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
      className="sphere-section grid min-h-[85vh] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div data-reveal className="reveal space-y-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
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
            <a href="#blogs">{heroContent.primaryCta}</a>
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
      <div data-reveal className="reveal relative h-96 w-full">
        {/* Cat - Bottom Left */}
        <div className="absolute bottom-0 left-0 z-10 rounded-3xl overflow-hidden w-48 h-48 -rotate-12">
          <Image
            src="/cat.png"
            alt="Cat"
            width={400}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Dog - Middle Right */}
        <div className="absolute top-1/2 right-0 z-20 rounded-3xl overflow-hidden w-56 h-56 rotate-6">
          <Image
            src="/dog.png"
            alt="Dog"
            width={500}
            height={500}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Me-Dog - Top Left (Highlighted) */}
        <div className="absolute top-0 left-1/4 z-30 rounded-3xl overflow-hidden w-64 h-64 -rotate-3 shadow-2xl">
          <Image
            src="/me-dog.png"
            alt={t('HOME.IMAGE.ALT.001')}
            width={600}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
