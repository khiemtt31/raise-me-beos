'use client'

import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { milestoneContent, milestones } from '@/skeleton-data/portfolio'

export function MilestonesSection() {
  const [viewMode, setViewMode] = useState<'immersive' | 'compact'>('immersive')
  const isImmersive = viewMode === 'immersive'

  return (
    <section
      id="milestones"
      data-section="milestones"
      data-sphere
      className="sphere-section mt-32 min-h-[85vh] space-y-12 py-16 lg:py-20"
    >
      <div
        data-reveal
        className="reveal flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
            {milestoneContent.eyebrow}
          </p>
          <h2 className="text-3xl font-sans text-glow md:text-4xl">
            {milestoneContent.title}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--hero-accent)]" />
            {milestoneContent.status}
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)] p-1 text-[11px] uppercase tracking-[0.3em] text-[var(--hero-muted)]">
            <button
              type="button"
              onClick={() => setViewMode('immersive')}
              className={cn(
                'rounded-full px-3 py-2 transition duration-300',
                isImmersive
                  ? 'bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] shadow-[0_0_10px_var(--hero-glow-strong)]'
                  : 'hover:text-[var(--hero-foreground)]'
              )}
            >
              Immersive
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={cn(
                'rounded-full px-3 py-2 transition duration-300',
                !isImmersive
                  ? 'bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] shadow-[0_0_10px_var(--hero-glow-strong)]'
                  : 'hover:text-[var(--hero-foreground)]'
              )}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[var(--hero-border)] lg:block" />
        <div className={cn('space-y-16', isImmersive ? 'lg:space-y-28' : 'lg:space-y-16')}>
          {milestones.map((milestone, index) => {
            const isEven = index % 2 === 0
            const step = String(index + 1).padStart(2, '0')
            return (
              <div
                key={milestone.title}
                data-reveal
                className={cn(
                  'reveal milestone-panel relative grid items-center gap-10 lg:grid-cols-2',
                  isImmersive ? 'min-h-screen py-10 lg:py-20' : 'min-h-[60vh] py-8'
                )}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <span className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--hero-accent)] shadow-[0_0_12px_var(--hero-glow-strong)] lg:block" />
                <div
                  className={cn(
                    'milestone-media relative flex justify-center',
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  )}
                >
                  <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[32px] border border-[var(--hero-border)] bg-[var(--hero-surface)] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.15)]">
                    <Image
                      src="/white-mousetain.png"
                      alt={`${milestone.title} visual`}
                      width={960}
                      height={720}
                      className="h-full w-full rounded-[24px] object-cover"
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    'milestone-content relative flex flex-col gap-5 rounded-[32px] border border-[var(--hero-border)] bg-[var(--hero-surface-strong)] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.18)]',
                    isEven ? 'lg:order-2 lg:text-left' : 'lg:order-1 lg:text-right'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute -top-10 text-6xl font-sans text-[var(--hero-border)] opacity-40',
                      isEven ? 'right-8' : 'left-8'
                    )}
                  >
                    {step}
                  </span>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                    {milestone.year}
                  </p>
                  <h3 className="text-3xl font-sans text-glow md:text-4xl">
                    {milestone.title}
                  </h3>
                  <p className="text-base text-[var(--hero-muted)] md:text-lg">
                    {milestone.description}
                  </p>
                  <div
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border border-[var(--hero-border)] bg-[var(--hero-bg)] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[var(--hero-muted)]',
                      isEven ? 'self-start' : 'self-start lg:self-end'
                    )}
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--hero-accent)]" />
                    Node {step}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
