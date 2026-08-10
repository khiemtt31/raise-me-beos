"use client";

import { startTransition, useEffect, useRef, useState, type WheelEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { Header } from "@/components/layout/Header";
import { AboutSection, ContactSection, HomeSection, ProjectsSection, WorkSection } from "@/components/portfolio/PortfolioSections";
import { HeaderSections, PortfolioSections, SectionTitles, type SectionId } from "@/components/portfolio/PortfolioData";
import { VisualizerStage } from "@/components/portfolio/Visualizer";

export function PortfolioPage() {
  const ScrollerRef = useRef<HTMLDivElement>(null);
  const ActiveSectionRef = useRef<SectionId>("home");
  const ScrollTargetRef = useRef<number | null>(null);
  const ScrollFrameRef = useRef<number | null>(null);
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

      if (ActiveSectionRef.current !== NextSection) {
        ActiveSectionRef.current = NextSection;
        startTransition(() => SetActiveSection(NextSection));
      }
    };

    SyncScrollState();
    Scroller.addEventListener("scroll", SyncScrollState, { passive: true });
    window.addEventListener("resize", SyncScrollState);

    return () => {
      Scroller.removeEventListener("scroll", SyncScrollState);
      window.removeEventListener("resize", SyncScrollState);
      if (ScrollFrameRef.current !== null) {
        window.cancelAnimationFrame(ScrollFrameRef.current);
      }
    };
  }, [ScrollProgress]);

  useEffect(() => {
    document.title = SectionTitles[ActiveSection];
  }, [ActiveSection]);

  const ScrollToSection = (SectionIdToShow: SectionId) => {
    const Scroller = ScrollerRef.current;
    const Section = Scroller?.querySelector<HTMLElement>(`#${SectionIdToShow}`);

    ScrollTargetRef.current = null;
    Section?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const HandleWheel = (Event: WheelEvent<HTMLDivElement>) => {
    const Scroller = ScrollerRef.current;

    if (!Scroller || Math.abs(Event.deltaY) <= Math.abs(Event.deltaX)) {
      return;
    }

    Event.preventDefault();
    const MaxScroll = Scroller.scrollWidth - Scroller.clientWidth;
    const CurrentTarget = ScrollTargetRef.current ?? Scroller.scrollLeft;
    ScrollTargetRef.current = Math.min(MaxScroll, Math.max(0, CurrentTarget + Event.deltaY));

    if (ScrollFrameRef.current !== null) {
      return;
    }

    const EaseScroll = () => {
      const Target = ScrollTargetRef.current;

      if (Target === null) {
        ScrollFrameRef.current = null;
        return;
      }

      const Distance = Target - Scroller.scrollLeft;
      if (Math.abs(Distance) < 0.5) {
        Scroller.scrollLeft = Target;
        ScrollFrameRef.current = null;
        return;
      }

      Scroller.scrollLeft += Distance * 0.16;
      ScrollFrameRef.current = window.requestAnimationFrame(EaseScroll);
    };

    ScrollFrameRef.current = window.requestAnimationFrame(EaseScroll);
  };

  return (
    <main className="portfolio-page" id="portfolio">
      <VisualizerStage sectionId={ActiveSection} />

      <Header activeSectionId={ActiveSection} navItems={HeaderSections} onNavigate={ScrollToSection} />
      <motion.div aria-hidden="true" className="portfolio-scroll-glow" style={{ opacity: SmoothProgress }} />

      <div ref={ScrollerRef} className="portfolio-scroll" onWheel={HandleWheel}>
        <HomeSection active={ActiveSection === "home"} />
        <WorkSection active={ActiveSection === "work"} />
        <AboutSection active={ActiveSection === "about"} />
        <ProjectsSection active={ActiveSection === "projects"} />
        <ContactSection active={ActiveSection === "contact"} />
      </div>
    </main>
  );
}
