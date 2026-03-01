"use client"

import { LuxuryRaysBackground } from "@/components/animated/luxury-rays-background"

export function PortfolioBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <LuxuryRaysBackground />
      {/* Fine gold grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-25" />
      {/* Scanline texture */}
      <div className="absolute inset-0 bg-scanlines mix-blend-soft-light opacity-35" />
      {/* Vignette — deepen edges so rays appear from a void */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 72% at 50% 50%, transparent 38%, rgba(5,5,0,0.70) 100%)",
        }}
      />
    </div>
  )
}


