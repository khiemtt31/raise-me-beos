"use client";

import { HeroSection } from "./_components/hero-section";
import { TechStackGrid } from "./_components/tech-stack-grid";
import { PageShell } from "@/components/layout/page-shell";
import { PageContainer } from "@/components/layout/page-container";
import { useRevealObserver } from "./hooks/use-reveal-observer";

export default function PortfolioPage() {
  useRevealObserver(0.2);

  return (
    <PageShell>
      <PageContainer className="h-full">
        <div className="min-h-0 flex-1">
          <HeroSection />
          <TechStackGrid />
        </div>
      </PageContainer>
    </PageShell>
  );
}
