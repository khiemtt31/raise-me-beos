'use client'

import { useEffect } from 'react'

import { HeroSection } from './_components/hero-section'
import { PortfolioBackground } from './_components/portfolio-background'
import { PortfolioFooter } from './_components/portfolio-footer'
import { PortfolioHeader } from './_components/portfolio-header'
import { ProjectsSection } from './_components/projects-section'
import { StorySection } from './_components/story-section'

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
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--hero-bg)] text-[var(--hero-foreground)]">
      <PortfolioBackground />

      <div className="relative z-10 font-mono">
        <PortfolioHeader />

        <main className="mx-auto w-full px-6 pb-14 pt-10 md:px-10 md:pt-24 xl:px-16">
          <HeroSection />
          <StorySection />
          <ProjectsSection />
        </main>

        <PortfolioFooter />
      </div>
    </div>
  )
}
