"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Header } from "@/components/layout/Header";
import { Visualizer } from "@/components/home/Visualizer";

const MotionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Homepage() {
  return (
    <main className="home-page relative min-h-dvh overflow-hidden bg-background" id="home">
      <BackgroundVisualizers />
      <section aria-labelledby="hero-title" className="page-shell relative z-10 lg:hidden">
        <Header />
        <div className="mx-auto flex max-w-[34rem] flex-col gap-6 pb-8 pt-2">
          <HeroCopy Compact />
          <PortraitStack Compact />
        </div>
      </section>

      <section className="relative z-10 hidden lg:flex lg:min-h-dvh lg:items-start lg:justify-center">
        <div className="home-stage-frame">
          <div className="absolute left-[9.375%] top-[1.2963%] h-[9.2593%] w-[81.25%]">
            <Header Compact />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: MotionEase, delay: 0.1 }}
            className="absolute left-[9.375%] top-[12.963%] w-[36.4583%]"
          >
            <Image
              src="/images/homepage/HeroPrimary.png"
              alt="Primary portrait of Hanzo Hekim"
              width={700}
              height={800}
              priority
              sizes="(max-width: 1920px) 40vw, 700px"
              className="h-auto w-full shadow-[var(--shadow-image)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: MotionEase, delay: 0.22 }}
            className="absolute left-[37.9688%] top-[46.2037%] w-[26.0417%]"
          >
            <Image
              src="/images/homepage/HeroSecondary.png"
              alt="Secondary portrait of Hanzo Hekim"
              width={500}
              height={500}
              priority
              sizes="(max-width: 1920px) 28vw, 500px"
              className="h-auto w-full shadow-[var(--shadow-image)]"
            />
          </motion.div>

          <HeroCopy />
        </div>
      </section>

      <div className="sr-only">
        <section id="work" aria-hidden="true" />
        <section id="about" aria-hidden="true" />
        <section id="projects" aria-hidden="true" />
        <section id="contact" aria-hidden="true" />
      </div>
    </main>
  );
}

function BackgroundVisualizers() {
  return (
    <>
      <Visualizer
        Variant="TopRight"
        ClassName="home-visualizer hidden lg:block"
        Style={{ top: "-104px", right: "-112px", width: "54rem", height: "38rem" }}
      />

      <Visualizer
        Variant="BottomLeft"
        ClassName="home-visualizer"
        Style={{ bottom: "-22rem", left: "-18rem", width: "44rem", height: "30rem" }}
      />
    </>
  );
}

function HeroCopy({ Compact = false }: { Compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: Compact ? 0 : 24, y: Compact ? 18 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.72, ease: MotionEase, delay: Compact ? 0.1 : 0.28 }}
      className={
        Compact
          ? "space-y-3"
          : "contents"
      }
    >
      <h1
        id="hero-title"
        className={
          Compact
            ? "max-w-[8ch] text-[clamp(3.25rem,9vw,4.625rem)] leading-[0.96] text-[var(--ink-title)]"
            : "absolute left-[50%] top-[33.3333%] whitespace-nowrap text-[5cqw] leading-[0.98] text-[var(--ink-title)]"
        }
      >
        Hanzo Hekim
      </h1>
      <p
        className={
          Compact
            ? "max-w-[19ch] text-[clamp(1.2rem,3.6vw,1.7rem)] leading-[1.42] tracking-[0.01em] text-black"
            : "absolute left-[66.4063%] top-[46.2037%] w-[24.2188%] text-[1.875cqw] leading-[1.38] tracking-[0.01em] text-black"
        }
      >
        Success is rarely loud at the beginning, it grows in the quiet hours no one notices.
        Every challenge I solve today becomes the foundation for what I build tomorrow.
      </p>
    </motion.div>
  );
}

function PortraitStack({ Compact = false }: { Compact?: boolean }) {
  return (
    <div className={Compact ? "relative mx-auto w-full max-w-[31rem] px-2 pb-4 pt-1" : ""}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: MotionEase, delay: 0.16 }}
        className="relative"
      >
        <Image
          src="/images/homepage/HeroPrimary.png"
          alt="Primary portrait of Hanzo Hekim"
          width={700}
          height={800}
          priority
          sizes="(max-width: 1024px) 92vw, 700px"
          className="h-auto w-[min(100%,26rem)] shadow-[var(--shadow-image)]"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: MotionEase, delay: 0.24 }}
        className="relative -mt-12 ml-auto w-[70%]"
      >
        <Image
          src="/images/homepage/HeroSecondary.png"
          alt="Secondary portrait of Hanzo Hekim"
          width={500}
          height={500}
          priority
          sizes="(max-width: 1024px) 68vw, 500px"
          className="h-auto w-full shadow-[var(--shadow-image)]"
        />
      </motion.div>
    </div>
  );
}
