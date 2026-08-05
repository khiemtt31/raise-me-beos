"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  Clapperboard,
  Code2,
  Gamepad2,
  Mail,
  Orbit,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState } from "react";

import { Projects, type SectionId } from "@/components/portfolio/PortfolioData";
import { Button } from "@/components/ui/Button";
import { ProjectGrid } from "@/components/portfolio/ProjectShowcase";
import { WorkTimeline } from "@/components/portfolio/WorkTimeline";

type SectionProps = {
  active: boolean;
};

type EmptySectionProps = SectionProps & {
  sectionId: Extract<SectionId, "contact">;
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

type ContactLink = {
  href: string;
  Icon?: typeof Mail;
  label: string;
  note: string;
  tone: "github" | "linkedin" | "instagram" | "email";
  mark: string;
};

const ContactLinks: ContactLink[] = [
  {
    href: "https://github.com/your-handle",
    label: "GitHub",
    note: "Code, repos, and shipping proof",
    tone: "github",
    mark: "GH",
  },
  {
    href: "https://www.linkedin.com/in/your-handle",
    label: "LinkedIn",
    note: "Work history and collaborations",
    tone: "linkedin",
    mark: "in",
  },
  {
    href: "https://www.instagram.com/your-handle",
    label: "Instagram",
    note: "A more personal signal",
    tone: "instagram",
    mark: "ig",
  },
  {
    href: "mailto:hello@your-domain.com",
    Icon: Mail,
    label: "Email",
    note: "Fastest way to reach me",
    tone: "email",
    mark: "@",
  },
];

const ContactPills = ["Open to freelance", "Open to collab", "Product + full-stack"];

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
        </motion.div>
      </div>
    </section>
  );
}

export function ProjectsSection({ active }: SectionProps) {
  return (
    <section aria-label="Projects" className="portfolio-section portfolio-section--projects" id="projects">
      <motion.div
        className="portfolio-section__content portfolio-projects"
        variants={ContentMotion}
        initial="inactive"
        animate={active ? "active" : "inactive"}
        transition={{ duration: 0.8, ease: MotionEase }}
      >
        <ProjectGrid projects={Projects} />
      </motion.div>
    </section>
  );
}

export function ContactSection({ active }: SectionProps) {
  const ShouldReduceMotion = useReducedMotion();
  const MotionDuration = ShouldReduceMotion ? 0 : 0.7;
  const ContactModelSources = ["/images/portfolio/contact-model.png", "/images/portfolio/AboutSecondary.png", "/images/homepage/HeroPrimary.png"];
  const [ContactModelIndex, SetContactModelIndex] = useState(0);

  return (
    <section aria-labelledby="contact-title" className="portfolio-section portfolio-section--contact" id="contact">
      <div className="portfolio-section__content portfolio-contact" data-active={active}>
        <motion.div
          className="portfolio-contact__copy"
          initial={{ opacity: 0, x: -48 }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0.6, x: -18 }}
          transition={{ duration: MotionDuration, ease: MotionEase }}
        >
          <p className="portfolio-contact__eyebrow">Signal / final checkpoint</p>
          <h2 className="portfolio-display portfolio-contact__title" id="contact-title">
            Let&apos;s build something real.
          </h2>
          <p className="portfolio-contact__lede">
            I&apos;m open to freelance and collab opportunities. If you need a builder for frontend, full-stack, or product work, send a signal.
          </p>

          <div className="portfolio-contact__status" aria-label="Availability">
            {ContactPills.map((Pill) => (
              <span key={Pill}>{Pill}</span>
            ))}
          </div>

          <div className="portfolio-contact__actions">
            <Button asChild className="portfolio-contact__cta" variant="default">
              <a href="mailto:hello@hanzohekim.dev">
                <Mail aria-hidden="true" size={18} strokeWidth={2.2} />
                Email me
              </a>
            </Button>
            <p className="portfolio-contact__aside">Prefer social? Use the cards below.</p>
          </div>

          <div className="portfolio-contact__socials" aria-label="Social links">
            {ContactLinks.map(({ href, Icon, label, note, tone, mark }, Index) => (
              <motion.a
                key={label}
                className={`portfolio-contact__social portfolio-contact__social--${tone}`}
                href={href}
                initial={{ opacity: 0, y: 18 }}
                animate={active ? { opacity: 1, y: 0 } : { opacity: 0.56, y: 10 }}
                transition={{ duration: MotionDuration, delay: ShouldReduceMotion ? 0 : 0.2 + Index * 0.08, ease: MotionEase }}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                whileHover={ShouldReduceMotion ? undefined : { y: -4 }}
                whileTap={ShouldReduceMotion ? undefined : { scale: 0.98 }}
              >
                <span className="portfolio-contact__social-icon" aria-hidden="true">
                  {Icon ? <Icon size={20} strokeWidth={2.2} /> : <span className="portfolio-contact__social-mark">{mark}</span>}
                </span>
                <span className="portfolio-contact__social-copy">
                  <strong>{label}</strong>
                  <small>{note}</small>
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.figure
          className="portfolio-contact__model"
          initial={{ opacity: 0, x: 56, scale: 0.96 }}
          animate={active ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0.58, x: 22, scale: 0.98 }}
          transition={{ duration: MotionDuration, delay: ShouldReduceMotion ? 0 : 0.12, ease: MotionEase }}
        >
          <span className="portfolio-contact__model-badge">Cutout / ready</span>
          <div className="portfolio-contact__model-frame">
            <Image
              src={ContactModelSources[ContactModelIndex] ?? ContactModelSources[0]}
              alt="Hanzo Hekim portrait for the contact section"
              fill
              sizes="(max-width: 900px) 86vw, 30vw"
              onError={() => {
                SetContactModelIndex((Index) => Math.min(Index + 1, ContactModelSources.length - 1));
              }}
            />
          </div>
          <figcaption>Open for freelance and collab</figcaption>
        </motion.figure>
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
