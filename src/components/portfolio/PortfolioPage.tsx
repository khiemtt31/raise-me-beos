"use client";

import { startTransition, useEffect, useRef, useState, type WheelEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Video, VideoOff } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { AboutSection, EmptyDesignSection, HomeSection, WorkSection } from "@/components/portfolio/PortfolioSections";
import { HeaderSections, PortfolioSections, type SectionId } from "@/components/portfolio/PortfolioData";
import { VisualizerStage } from "@/components/portfolio/Visualizer";

export function PortfolioPage() {
  const ScrollerRef = useRef<HTMLDivElement>(null);
  const VideoRef = useRef<HTMLVideoElement>(null);
  const ActiveSectionRef = useRef<SectionId>("home");
  const [ActiveSection, SetActiveSection] = useState<SectionId>("home");
  const [VideoEnabled, SetVideoEnabled] = useState(true);
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
    };
  }, [ScrollProgress]);

  useEffect(() => {
    const VideoElement = VideoRef.current;

    if (!VideoElement) {
      return;
    }

    if (VideoEnabled) {
      void VideoElement.play().catch(() => undefined);
      return;
    }

    VideoElement.pause();
  }, [VideoEnabled]);

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
      <video
        ref={VideoRef}
        aria-hidden="true"
        autoPlay
        className="portfolio-background-video"
        loop
        muted
        playsInline
        preload="metadata"
        data-enabled={VideoEnabled}
      >
        <source src="/videos/live-background-001.mp4" type="video/mp4" />
      </video>

      <VisualizerStage sectionId={ActiveSection} />

      <Header activeSectionId={ActiveSection} navItems={HeaderSections} onNavigate={ScrollToSection} />
      <motion.div aria-hidden="true" className="portfolio-scroll-glow" style={{ opacity: SmoothProgress }} />

      <motion.button
        type="button"
        className="portfolio-video-toggle"
        aria-label={VideoEnabled ? "Turn background video off" : "Turn background video on"}
        aria-pressed={VideoEnabled}
        onClick={() => SetVideoEnabled((Enabled) => !Enabled)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {VideoEnabled ? <Video aria-hidden="true" size={22} strokeWidth={2.2} /> : <VideoOff aria-hidden="true" size={22} strokeWidth={2.2} />}
      </motion.button>

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
