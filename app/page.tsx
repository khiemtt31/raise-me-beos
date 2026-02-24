'use client'

import { useEffect } from 'react'

import { HeroSection } from './_components/hero-section'
import { PortfolioFooter } from './_components/portfolio-footer'
import { PortfolioHeader } from './_components/portfolio-header'

export default function PortfolioPage() {
  useEffect(() => {
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    )

    if (!revealNodes.length) return

    if (!('IntersectionObserver' in window)) {
      revealNodes.forEach((node) => node.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    revealNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-[calc(100svh-var(--footer-h))] overflow-x-hidden bg-transparent text-[var(--hero-foreground)]">
      <div className="relative z-10 font-mono">
        <main className="mx-auto flex h-[calc(100svh-var(--footer-h))] w-full flex-col px-6 pb-6 pt-[calc(var(--header-h)+0.75rem)] md:px-10 md:pb-8 xl:px-16">
          <div className="min-h-0 flex-1">
            <HeroSection />
          </div>
        </main>
      </div>
    </div>
  )
}
