"use client"

import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

import { MotherboardControl } from "@/components/animated/animated-background-motherboard"
import type { BackgroundStyle } from "@/components/animated/animated-backgrounds"
import { Button } from "@/components/ui/button"
import { useBackground } from "@/components/background-provider"
import { PortfolioFooter } from "../_components/portfolio-footer"
import { PortfolioHeader } from "../_components/portfolio-header"

export default function BackgroundSettingsPage() {
  const t = useTranslations()
  const { style, autoRotate, setStyle, toggleAutoRotate } = useBackground()
  const styleLabels: Record<BackgroundStyle, string> = {
    matrix: t("BACKGROUND.STYLE.MATRIX.NAME"),
    circuit: t("BACKGROUND.STYLE.CIRCUIT.NAME"),
    "pixel-rain": t("BACKGROUND.STYLE.PIXEL_RAIN.NAME"),
    "ascii-waves": t("BACKGROUND.STYLE.ASCII_WAVES.NAME"),
    "binary-grid": t("BACKGROUND.STYLE.BINARY_GRID.NAME"),
    "terminal-glitch": t("BACKGROUND.STYLE.TERMINAL.NAME"),
  }

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
                {t("BACKGROUND.BACK.001")}
              </Link>
            </Button>
          </div>

          <section className="grid gap-10 xl:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/50 px-4 py-2 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-[var(--hero-accent)]" />
                  <span className="text-sm font-medium text-[var(--hero-foreground)]">
                    {t("BACKGROUND.BADGE.001")}
                  </span>
                </div>
                <h1 className="text-4xl font-heading text-glow md:text-5xl">
                  {t("BACKGROUND.TITLE.001")}
                </h1>
                <p className="text-lg text-[var(--hero-muted)] leading-relaxed">
                  {t("BACKGROUND.TEXT.001")}
                </p>
              </div>

              <div className="glass-panel neon-border rounded-3xl p-6">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-[var(--hero-muted)]">
                  <span>{t("BACKGROUND.STATUS.LABEL.001")}</span>
                  <span className="text-[var(--hero-foreground)]">
                    {styleLabels[style]}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  <span>{t("BACKGROUND.STATUS.LABEL.002")}</span>
                  <span className="text-[var(--hero-foreground)]">
                    {autoRotate
                      ? t("BACKGROUND.STATUS.STATE.001")
                      : t("BACKGROUND.STATUS.STATE.002")}
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
