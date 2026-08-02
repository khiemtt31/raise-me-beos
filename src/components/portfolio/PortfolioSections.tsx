"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit, Clapperboard, Code2, Gamepad2, Orbit, Sparkles, Trophy } from "lucide-react";

import type { SectionId } from "@/components/portfolio/PortfolioData";
import { WorkTimeline } from "@/components/portfolio/WorkTimeline";

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

const AboutHobbies = [
  { Icon: Trophy, label: "Football", note: "Energy + teamwork", tone: "spice" },
  { Icon: Clapperboard, label: "Movies", note: "Stories + worlds", tone: "gold" },
  { Icon: Gamepad2, label: "Games", note: "Strategy + play", tone: "sand" },
  { Icon: Orbit, label: "Sci-fi", note: "Future + wonder", tone: "umber" },
];

const AboutSkills = [
  {
    Icon: Code2,
    copy: "From polished interfaces to dependable APIs, I enjoy understanding the whole product.",
    title: "Full-stack craft",
  },
  {
    Icon: BrainCircuit,
    copy: "I break large problems into clear systems, useful feedback loops, and shippable steps.",
    title: "Systems thinking",
  },
  {
    Icon: Sparkles,
    copy: "AI and emerging technology keep me experimenting with what software can become next.",
    title: "Future curious",
  },
];

const AboutPrinciples = ["Learn one percent every day", "Build with purpose, not noise", "Stay playful when problems get hard"];

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
            preload
            sizes="(max-width: 900px) min(calc(100vw - 2rem), 28rem), min(36.46vw, 700px)"
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
            sizes="(max-width: 900px) min(calc(72vw - 1.44rem), 22rem), min(26.05vw, 500px)"
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
          Hybrid Achievement <span className="portfolio-work__title-symbol" aria-hidden="true">⚒</span>
          <span className="sr-only"> through hard work</span>
        </h2>
        <p className="portfolio-work__hint">Grow through out the experiences and keep moving forward everyday</p>
        <WorkTimeline active={active} />
      </motion.div>
    </section>
  );
}

export function AboutSection({ active }: SectionProps) {
  const ShouldReduceMotion = useReducedMotion();
  const MotionDuration = ShouldReduceMotion ? 0 : 0.65;

  return (
    <section aria-labelledby="about-title" className="portfolio-section portfolio-section--about" id="about">
      <div className="portfolio-section__content portfolio-about" data-active={active}>
        <motion.div
          className="portfolio-about__playbook"
          initial={{ opacity: 0, x: -52 }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0.58, x: -24 }}
          transition={{ duration: MotionDuration, ease: MotionEase }}
        >
          <p className="portfolio-about__eyebrow">Player profile / off the clock</p>
          <h2 className="portfolio-display portfolio-about__title" id="about-title">
            Built by curiosity.
            <span>Powered by play.</span>
          </h2>
          <p className="portfolio-about__lede">
            I am a software engineer who treats life like an open-world game: explore widely, learn constantly, and leave every team better than I found it.
          </p>

          <div className="portfolio-about__hobbies" aria-label="Hobbies and interests">
            {AboutHobbies.map(({ Icon, label, note, tone }, Index) => (
              <motion.div
                key={label}
                className={`portfolio-about__hobby portfolio-about__hobby--${tone}`}
                initial={{ opacity: 0, scale: 0.82, y: 18 }}
                animate={active ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.55, scale: 0.9, y: 8 }}
                transition={{ duration: MotionDuration, delay: ShouldReduceMotion ? 0 : 0.08 + Index * 0.07, ease: MotionEase }}
                whileHover={ShouldReduceMotion ? undefined : { rotate: Index % 2 === 0 ? -3 : 3, scale: 1.05, y: -4 }}
              >
                <Icon aria-hidden="true" size={19} strokeWidth={2.3} />
                <span>
                  <strong>{label}</strong>
                  <small>{note}</small>
                </span>
              </motion.div>
            ))}
          </div>

          <section className="portfolio-about__loadout" aria-labelledby="about-loadout-title">
            <div className="portfolio-about__section-heading">
              <span>01</span>
              <h3 id="about-loadout-title">Engineering loadout</h3>
            </div>
            <div className="portfolio-about__skill-grid">
              {AboutSkills.map(({ Icon, copy, title }, Index) => (
                <motion.article
                  key={title}
                  className="portfolio-about__skill"
                  initial={{ opacity: 0, y: 22 }}
                  animate={active ? { opacity: 1, y: 0 } : { opacity: 0.52, y: 12 }}
                  transition={{ duration: MotionDuration, delay: ShouldReduceMotion ? 0 : 0.27 + Index * 0.08, ease: MotionEase }}
                  whileHover={ShouldReduceMotion ? undefined : { y: -6 }}
                >
                  <Icon aria-hidden="true" size={22} strokeWidth={2.15} />
                  <h4>{title}</h4>
                  <p>{copy}</p>
                </motion.article>
              ))}
            </div>
          </section>

          <motion.section
            className="portfolio-about__method"
            aria-labelledby="about-method-title"
            initial={{ opacity: 0, y: 20 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 10 }}
            transition={{ duration: MotionDuration, delay: ShouldReduceMotion ? 0 : 0.5, ease: MotionEase }}
          >
            <div className="portfolio-about__section-heading">
              <span>02</span>
              <h3 id="about-method-title">Life methodology</h3>
            </div>
            <ol>
              {AboutPrinciples.map((Principle, Index) => (
                <li key={Principle}>
                  <span>{String(Index + 1).padStart(2, "0")}</span>
                  {Principle}
                </li>
              ))}
            </ol>
          </motion.section>
        </motion.div>

        <motion.div
          className="portfolio-about__gallery"
          initial={{ opacity: 0, x: 72 }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0.56, x: 36 }}
          transition={{ duration: MotionDuration, delay: ShouldReduceMotion ? 0 : 0.12, ease: MotionEase }}
        >
          <motion.figure className="portfolio-about__primary" whileHover={ShouldReduceMotion ? undefined : { rotate: -1.2, scale: 1.015 }}>
            <Image
              src="/images/portfolio/AboutPrimary.png"
              alt="Hanzo in a science fiction desert scene"
              width={856}
              height={466}
              sizes="(max-width: 900px) 92vw, 39vw"
            />
            <figcaption>Explorer mode / always on</figcaption>
          </motion.figure>

          <motion.figure className="portfolio-about__secondary" whileHover={ShouldReduceMotion ? undefined : { rotate: 1.2, scale: 1.02 }}>
            <Image
              src="/images/portfolio/AboutSecondary.png"
              alt="Hanzo portrait in front of an eclipse"
              width={778}
              height={561}
              sizes="(max-width: 900px) 76vw, 29vw"
            />
            <figcaption>Engineer / builder / problem solver</figcaption>
          </motion.figure>

          <div className="portfolio-about__orbit" aria-hidden="true">
            <Orbit size={32} strokeWidth={1.6} />
          </div>
          <div className="portfolio-about__film" aria-hidden="true">
            <Clapperboard size={27} strokeWidth={1.8} />
          </div>
          <span className="portfolio-about__ball-shadow" aria-hidden="true" />
          <span className="portfolio-about__ball" aria-hidden="true">⚽</span>
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
