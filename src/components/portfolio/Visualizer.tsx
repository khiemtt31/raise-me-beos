"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Cn } from "@/lib/utils";
import { SectionVisualizers, type SectionId, type VisualizerLayer, type VisualizerTone } from "@/components/portfolio/PortfolioData";

type BlobDefinition = {
  background: string;
  clipPath: string;
  opacity: number;
};

type VisualizerProps = VisualizerLayer & {
  active: boolean;
};

type VisualizerFieldProps = {
  active: boolean;
  sectionId: SectionId;
};

const BlobPresets: Record<VisualizerTone, BlobDefinition[]> = {
  spice: [
    {
      background: "var(--visualizer-spice)",
      clipPath: "ellipse(49% 38% at 34% 54%)",
      opacity: 0.68,
    },
    {
      background: "var(--visualizer-umber)",
      clipPath: "ellipse(45% 34% at 68% 48%)",
      opacity: 0.34,
    },
    {
      background: "var(--visualizer-sand)",
      clipPath: "ellipse(34% 42% at 12% 82%)",
      opacity: 0.46,
    },
  ],
  sandstorm: [
    {
      background: "var(--visualizer-sand)",
      clipPath: "ellipse(58% 24% at 43% 42%)",
      opacity: 0.62,
    },
    {
      background: "var(--visualizer-spice)",
      clipPath: "ellipse(42% 30% at 75% 58%)",
      opacity: 0.48,
    },
    {
      background: "var(--visualizer-sun)",
      clipPath: "ellipse(28% 29% at 83% 18%)",
      opacity: 0.36,
    },
  ],
  sun: [
    {
      background: "var(--visualizer-sun)",
      clipPath: "ellipse(33% 41% at 42% 38%)",
      opacity: 0.5,
    },
    {
      background: "var(--visualizer-sand)",
      clipPath: "ellipse(52% 33% at 58% 62%)",
      opacity: 0.58,
    },
    {
      background: "var(--visualizer-spice)",
      clipPath: "ellipse(34% 42% at 82% 84%)",
      opacity: 0.3,
    },
  ],
  shadow: [
    {
      background: "var(--visualizer-umber)",
      clipPath: "ellipse(35% 31% at 20% 34%)",
      opacity: 0.3,
    },
    {
      background: "var(--visualizer-spice)",
      clipPath: "ellipse(53% 40% at 57% 64%)",
      opacity: 0.46,
    },
    {
      background: "var(--visualizer-sand)",
      clipPath: "ellipse(35% 30% at 77% 72%)",
      opacity: 0.34,
    },
  ],
};

const MotionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function VisualizerStage({ sectionId }: Pick<VisualizerFieldProps, "sectionId">) {
  return (
    <div aria-hidden="true" className="portfolio-visualizer-stage">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={sectionId}
          className="portfolio-section__visualizers"
          initial={{ opacity: 0, scale: 1.04, filter: "blur(18px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.96, filter: "blur(22px)" }}
          transition={{ duration: 0.95, ease: MotionEase }}
        >
          {SectionVisualizers[sectionId].map((Layer) => (
            <Visualizer key={Layer.id} {...Layer} active />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function VisualizerField({ active, sectionId }: VisualizerFieldProps) {
  return (
    <div aria-hidden="true" className="portfolio-section__visualizers">
      {SectionVisualizers[sectionId].map((Layer) => (
        <Visualizer key={Layer.id} {...Layer} active={active} />
      ))}
    </div>
  );
}

function Visualizer({ active, activeScale = 1, className, idleScale = 0.98, rotation, tone }: VisualizerProps) {
  return (
    <motion.div
      className={Cn("portfolio-visualizer", className)}
      initial={false}
      animate={{
        opacity: active ? 1 : 0.72,
        rotate: active ? rotation : rotation - 10,
        scale: active ? activeScale : idleScale,
      }}
      transition={{ duration: 1.1, ease: MotionEase }}
    >
      {BlobPresets[tone].map((Blob, Index) => (
        <motion.span
          key={`${tone}-${Index}`}
          className="portfolio-visualizer__blob"
          style={{
            background: Blob.background,
            clipPath: Blob.clipPath,
            opacity: Blob.opacity,
          }}
          animate={{
            x: Index % 2 === 0 ? [0, 26, -12, 0] : [0, -22, 10, 0],
            y: Index % 2 === 0 ? [0, -8, 6, 0] : [0, 10, -5, 0],
            scale: Index === 1 ? [1, 1.04, 0.99, 1] : [1, 0.98, 1.03, 1],
          }}
          transition={{
            duration: 16 + Index * 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </motion.div>
  );
}
