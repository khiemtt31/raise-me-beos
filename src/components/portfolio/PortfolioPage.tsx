"use client";

import { startTransition, useEffect, useRef, useState, type WheelEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { Header } from "@/components/layout/Header";
import { AboutSection, EmptyDesignSection, HomeSection, WorkSection } from "@/components/portfolio/PortfolioSections";
import { HeaderSections, PortfolioSections, type SectionId } from "@/components/portfolio/PortfolioData";

export function PortfolioPage() {
  const ScrollerRef = useRef<HTMLDivElement>(null);
  const [ActiveSection, SetActiveSection] = useState<SectionId>("home");
  const ScrollProgress = useMotionValue(0);
  const SmoothProgress = useSpring(ScrollProgress, { damping: 30, stiffness: 160, mass: 0.5 });

  useEffect(() => {
    const Scroller = ScrollerRef.current;

    if (!Scroller) {
      return undefined;
    }

    const SyncScrollState = () => {
      const MaxScroll = Scroller.scrollWidth - Scroller.clientWidth;
      const Progress = MaxScroll > 0 ? Scroller.scrollLeft / MaxScroll : 0;
      const NextIndex = Math.min(PortfolioSections.length - 1, Math.max(0, Math.round(Progress * (PortfolioSections.length - 1))));
      const NextSection = PortfolioSections[NextIndex]?.id ?? "home";

      ScrollProgress.set(Progress);
      startTransition(() => SetActiveSection(NextSection));
    };

    SyncScrollState();
    Scroller.addEventListener("scroll", SyncScrollState, { passive: true });
    window.addEventListener("resize", SyncScrollState);

    return () => {
      Scroller.removeEventListener("scroll", SyncScrollState);
      window.removeEventListener("resize", SyncScrollState);
    };
  }, [ScrollProgress]);

  const ScrollToSection = (SectionIdToShow: SectionId) => {
    const Scroller = ScrollerRef.current;
    const Section = Scroller?.querySelector<HTMLElement>(`#${SectionIdToShow}`);

    Section?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const HandleWheel = (Event: WheelEvent<HTMLDivElement>) => {
    const Scroller = ScrollerRef.current;

    if (!Scroller || Math.abs(Event.deltaY) <= Math.abs(Event.deltaX)) {
      return;
    }

    Event.preventDefault();
    Scroller.scrollLeft += Event.deltaY;
  };

  return (
    <main className="portfolio-page" id="portfolio">
      <Header activeSectionId={ActiveSection} navItems={HeaderSections} onNavigate={ScrollToSection} />
      <motion.div aria-hidden="true" className="portfolio-scroll-glow" style={{ opacity: SmoothProgress }} />

      <div ref={ScrollerRef} className="portfolio-scroll" onWheel={HandleWheel}>
        <HomeSection active={ActiveSection === "home"} />
        <WorkSection active={ActiveSection === "work"} />
        <AboutSection active={ActiveSection === "about"} />
        <EmptyDesignSection active={ActiveSection === "projects"} sectionId="projects" title="Projects" />
        <EmptyDesignSection active={ActiveSection === "contact"} sectionId="contact" title="Contact" />
      </div>
    </main>
  );
}
