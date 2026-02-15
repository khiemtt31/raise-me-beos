"use client"

import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

import { MotherboardControl } from "@/components/animated/animated-background-motherboard"
import { Button } from "@/components/ui/button"
import { useBackground } from "@/components/background-provider"
import { PortfolioFooter } from "../_components/portfolio-footer"
import { PortfolioHeader } from "../_components/portfolio-header"

export default function BackgroundSettingsPage() {
  const { style, autoRotate, setStyle, toggleAutoRotate } = useBackground()

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-[var(--hero-foreground)]">
      <div className="relative z-10 font-mono">
        <PortfolioHeader />

        <main className="mx-auto w-full px-6 pb-14 pt-10 md:px-10 md:pt-24 xl:px-16">
          <div className="mb-8">
            <Button
              asChild
              variant="ghost"
              className="text-[var(--hero-muted)] hover:text-[var(--hero-foreground)] hover:bg-[var(--hero-surface)]/50"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio
              </Link>
            </Button>
          </div>

          <section className="grid gap-10 xl:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/50 px-4 py-2 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-[var(--hero-accent)]" />
                  <span className="text-sm font-medium text-[var(--hero-foreground)]">
                    Background Control
                  </span>
                </div>
                <h1 className="text-4xl font-heading text-glow md:text-5xl">
                  Tune the live signal
                </h1>
                <p className="text-lg text-[var(--hero-muted)] leading-relaxed">
                  Choose the animated atmosphere for every screen. Your selection
                  is saved locally and instantly applied across the site.
                </p>
              </div>

              <div className="glass-panel neon-border rounded-3xl p-6">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-[var(--hero-muted)]">
                  <span>Active mode</span>
                  <span className="text-[var(--hero-foreground)]">
                    {style.replace("-", " ")}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  <span>Auto rotate</span>
                  <span className="text-[var(--hero-foreground)]">
                    {autoRotate ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            <MotherboardControl
              currentStyle={style}
              onStyleChange={setStyle}
              autoRotate={autoRotate}
              onAutoRotateToggle={toggleAutoRotate}
            />
          </section>
        </main>

        <PortfolioFooter />
      </div>
    </div>
  )
}
