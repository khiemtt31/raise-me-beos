"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { WorkMilestones, type SectionId } from "@/components/portfolio/PortfolioData";
import { Cn } from "@/lib/utils";

type SectionProps = {
  active: boolean;
};

type EmptySectionProps = SectionProps & {
  sectionId: Extract<SectionId, "projects" | "contact">;
  title: string;
};

const MotionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ContentMotion = {
  active: { opacity: 1, scale: 1, y: 0 },
  inactive: { opacity: 0.72, scale: 0.985, y: 10 },
};

const AboutTechnologyCopy =
  "I've always been fascinated by technology and science fiction. What draws me to the genre isn't just the futuristic worlds, but the possibility that today's imagination can become tomorrow's reality. The rapid evolution of artificial intelligence is a perfect example of ideas once considered fiction becoming part of everyday life, and it continues to inspire my curiosity as a developer.";

const AboutGamesCopy =
  "Outside of coding, I enjoy playing games that challenge creativity, strategy, and problem-solving. I appreciate experiences that encourage exploration, experimentation, and continuous learning. I believe curiosity is one of the strongest drivers of growth, and it's something I bring into both my work and my everyday life.";

export function HomeSection({ active }: SectionProps) {
  return (
    <section aria-labelledby="home-title" className="portfolio-section portfolio-section--home" id="home">
      <div className="portfolio-section__content portfolio-home">
        <motion.div
          className="portfolio-home__primary portfolio-image-frame"
          variants={ContentMotion}
          initial="inactive"
          animate={active ? "active" : "inactive"}
          transition={{ duration: 0.8, ease: MotionEase }}
        >
          <Image
            src="/images/homepage/HeroPrimary.png"
            alt="Primary portrait of Hanzo Hekim"
            width={700}
            height={800}
            priority
            sizes="(max-width: 900px) 86vw, 37vw"
          />
        </motion.div>

        <motion.div
          className="portfolio-home__secondary portfolio-image-frame"
          variants={ContentMotion}
          initial="inactive"
          animate={active ? "active" : "inactive"}
          transition={{ duration: 0.8, delay: 0.08, ease: MotionEase }}
        >
          <Image
            src="/images/homepage/HeroSecondary.png"
            alt="Secondary portrait of Hanzo Hekim"
            width={500}
            height={500}
            priority
            sizes="(max-width: 900px) 68vw, 27vw"
          />
        </motion.div>

        <motion.div
          className="portfolio-home__intro"
          variants={ContentMotion}
          initial="inactive"
          animate={active ? "active" : "inactive"}
          transition={{ duration: 0.8, delay: 0.16, ease: MotionEase }}
        >
          <h1 className="portfolio-display portfolio-home__title" id="home-title">
            Hanzo Hekim
          </h1>
          <p className="portfolio-home__quote">
            Success is rarely loud at the beginning-it grows in the quiet hours no one notices. Every challenge I solve today becomes the foundation for what I build tomorrow.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function WorkSection({ active }: SectionProps) {
  return (
    <section aria-labelledby="work-title" className="portfolio-section portfolio-section--work" id="work">
      <motion.div
        className="portfolio-section__content portfolio-work"
        variants={ContentMotion}
        initial="inactive"
        animate={active ? "active" : "inactive"}
        transition={{ duration: 0.8, ease: MotionEase }}
      >
        <h2 className="portfolio-display portfolio-work__title" id="work-title">
          How I Evolved
        </h2>

        <div className="portfolio-timeline" aria-label="Career evolution timeline">
          <div className="portfolio-timeline__line" />
          {WorkMilestones.map((Milestone) => (
            <div
              key={Milestone.id}
              className={Cn("portfolio-milestone", `portfolio-milestone--${Milestone.side}`, Milestone.className)}
              style={{ left: Milestone.position }}
            >
              {Milestone.side !== "line" ? <span className="portfolio-milestone__marker" aria-hidden="true" /> : null}
              <p className="portfolio-milestone__label">{Milestone.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export function AboutSection({ active }: SectionProps) {
  return (
    <section aria-labelledby="about-title" className="portfolio-section portfolio-section--about" id="about">
      <div className="portfolio-section__content portfolio-about">
        <h2 className="sr-only" id="about-title">
          About
        </h2>

        <motion.div
          className="portfolio-about__primary portfolio-image-frame"
          variants={ContentMotion}
          initial="inactive"
          animate={active ? "active" : "inactive"}
          transition={{ duration: 0.8, ease: MotionEase }}
        >
          <Image
            src="/images/portfolio/AboutPrimary.png"
            alt="Hanzo in a science fiction desert scene"
            width={856}
            height={466}
            sizes="(max-width: 900px) 88vw, 45vw"
          />
        </motion.div>

        <motion.p
          className="portfolio-about__copy portfolio-about__copy--top"
          variants={ContentMotion}
          initial="inactive"
          animate={active ? "active" : "inactive"}
          transition={{ duration: 0.8, delay: 0.08, ease: MotionEase }}
        >
          {AboutTechnologyCopy}
        </motion.p>

        <motion.p
          className="portfolio-about__copy portfolio-about__copy--bottom"
          variants={ContentMotion}
          initial="inactive"
          animate={active ? "active" : "inactive"}
          transition={{ duration: 0.8, delay: 0.16, ease: MotionEase }}
        >
          {AboutGamesCopy}
        </motion.p>

        <motion.div
          className="portfolio-about__secondary portfolio-image-frame"
          variants={ContentMotion}
          initial="inactive"
          animate={active ? "active" : "inactive"}
          transition={{ duration: 0.8, delay: 0.22, ease: MotionEase }}
        >
          <Image
            src="/images/portfolio/AboutSecondary.png"
            alt="Hanzo portrait in front of an eclipse"
            width={778}
            height={561}
            sizes="(max-width: 900px) 88vw, 41vw"
          />
        </motion.div>
      </div>
    </section>
  );
}

export function EmptyDesignSection({ active, sectionId, title }: EmptySectionProps) {
  return (
    <section aria-labelledby={`${sectionId}-title`} className={`portfolio-section portfolio-section--${sectionId}`} id={sectionId}>
      <motion.div
        className="portfolio-section__content"
        variants={ContentMotion}
        initial="inactive"
        animate={active ? "active" : "inactive"}
        transition={{ duration: 0.8, ease: MotionEase }}
      >
        <h2 className="sr-only" id={`${sectionId}-title`}>
          {title}
        </h2>
      </motion.div>
    </section>
  );
}
