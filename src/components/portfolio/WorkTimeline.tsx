"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

import { WorkMilestones } from "@/components/portfolio/PortfolioData";
import { Cn } from "@/lib/utils";

const DefaultMilestone = WorkMilestones.find((Milestone) => Milestone.current) ?? WorkMilestones.at(-1)!;
const MotionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function WorkTimeline({ active }: { active: boolean }) {
  const ShouldReduceMotion = useReducedMotion();
  const [SelectedMilestoneId, SetSelectedMilestoneId] = useState(DefaultMilestone.id);
  const [HoveredMilestoneId, SetHoveredMilestoneId] = useState<string | null>(null);
  const [Velocity, SetVelocity] = useState(0.62);
  const LastPointerXRef = useRef<number | null>(null);
  const CameraX = useMotionValue(0);
  const SmoothCameraX = useSpring(CameraX, { damping: 26, stiffness: 130, mass: 0.65 });
  const CameraRotation = useTransform(SmoothCameraX, [-1, 1], ["8deg", "-8deg"]);
  const ShipDrift = useTransform(SmoothCameraX, [-1, 1], ["-1.8rem", "1.8rem"]);
  const ActiveMilestoneId = HoveredMilestoneId ?? SelectedMilestoneId;
  const ActiveMilestone = WorkMilestones.find((Milestone) => Milestone.id === ActiveMilestoneId) ?? DefaultMilestone;

  useEffect(() => {
    if (ShouldReduceMotion || !active) {
      SetVelocity(0);
      return undefined;
    }

    const CruiseTimer = window.setInterval(() => {
      SetVelocity((CurrentVelocity) => {
        const NextVelocity = CurrentVelocity + (Math.random() - 0.5) * 0.08;
        return Math.min(0.94, Math.max(0.48, NextVelocity));
      });
    }, 520);

    return () => window.clearInterval(CruiseTimer);
  }, [ShouldReduceMotion, active]);

  const HandlePointerMove = (Event: PointerEvent<HTMLDivElement>) => {
    const Bounds = Event.currentTarget.getBoundingClientRect();
    const NormalizedX = ((Event.clientX - Bounds.left) / Bounds.width) * 2 - 1;
    const PointerDelta = LastPointerXRef.current === null ? 0 : Math.abs(Event.clientX - LastPointerXRef.current);

    LastPointerXRef.current = Event.clientX;
    CameraX.set(Math.max(-1, Math.min(1, NormalizedX)));
    SetVelocity((CurrentVelocity) => Math.min(1.45, Math.max(0.5, CurrentVelocity + PointerDelta * 0.018)));
  };

  const HandlePointerLeave = () => {
    LastPointerXRef.current = null;
    CameraX.set(0);
    SetHoveredMilestoneId(null);
    SetVelocity((CurrentVelocity) => Math.min(0.72, Math.max(0.5, CurrentVelocity)));
  };

  return (
    <div
      className="work-space"
      data-active={active}
      data-velocity={Velocity.toFixed(2)}
      onPointerLeave={HandlePointerLeave}
      onPointerMove={HandlePointerMove}
    >
      <div className="work-space__hud" aria-hidden="true">
        <span>Deep-space career route</span>
        <span>Sector 04 / live telemetry</span>
        <strong>Velocity {Velocity.toFixed(2)}c</strong>
      </div>

      <div className="work-space__stars" aria-hidden="true">
        {Array.from({ length: 22 }, (_, Index) => (
          <i
            key={Index}
            style={{
              top: `${8 + ((Index * 17) % 84)}%`,
              left: `${4 + ((Index * 23) % 92)}%`,
              width: `${1 + (Index % 3)}px`,
              height: `${1 + (Index % 3)}px`,
              opacity: 0.22 + (Index % 4) * 0.14,
              animationDelay: `${Index * -0.18}s`,
            }}
          />
        ))}
      </div>
      <div className="work-space__nebula" aria-hidden="true" />
      <div className="work-space__horizon" aria-hidden="true" />

      <motion.div className="work-space__camera" aria-hidden="true" style={{ rotateY: CameraRotation }}>
        <span className="work-space__lane work-space__lane--left" />
        <span className="work-space__lane work-space__lane--right" />
        <span className="work-space__lane work-space__lane--center" />
      </motion.div>

      <motion.div className="work-space__ship" aria-hidden="true" style={{ x: ShipDrift }}>
        <span className="work-space__ship-glow" />
        <span className="work-space__ship-wing work-space__ship-wing--left" />
        <span className="work-space__ship-wing work-space__ship-wing--right" />
        <span className="work-space__ship-core">H</span>
        <span className="work-space__ship-engine" />
      </motion.div>

      <ol className="work-space__checkpoints" aria-label="Career checkpoints in deep space">
        {WorkMilestones.map((Milestone, Index) => {
          const IsActive = ActiveMilestone.id === Milestone.id;

          return (
            <li
              key={Milestone.id}
              className={Cn("space-checkpoint", IsActive && "space-checkpoint--active")}
              style={{ "--checkpoint-position": Milestone.position, "--checkpoint-depth": `${Index * 72}px` } as CSSProperties}
            >
              <button
                type="button"
                className="space-checkpoint__trigger"
                aria-controls="work-space-detail"
                aria-expanded={IsActive}
                aria-label={`${Milestone.role} at ${Milestone.company}, ${Milestone.period}`}
                onClick={() => SetSelectedMilestoneId(Milestone.id)}
                onFocus={() => SetSelectedMilestoneId(Milestone.id)}
                onMouseEnter={() => SetHoveredMilestoneId(Milestone.id)}
              >
                <span className="space-checkpoint__ring" aria-hidden="true" />
                <span className="space-checkpoint__core" aria-hidden="true">{String(Index + 1).padStart(2, "0")}</span>
              </button>
              <span className="space-checkpoint__label">
                <small>{Milestone.period}</small>
                <strong>{Milestone.shortRole}</strong>
              </span>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={ActiveMilestone.id}
          className="work-space__detail"
          id="work-space-detail"
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
          transition={{ duration: ShouldReduceMotion ? 0 : 0.28, ease: MotionEase }}
        >
          <div className="work-space__detail-header">
            <span>Checkpoint {String(WorkMilestones.indexOf(ActiveMilestone) + 1).padStart(2, "0")}</span>
            <span>{ActiveMilestone.current ? "Current orbit" : "Mission archived"}</span>
          </div>
          <div className="work-space__detail-content">
            <div className="work-space__detail-copy">
              <p>{ActiveMilestone.company}</p>
              <h3>{ActiveMilestone.role}</h3>
              <small>{ActiveMilestone.period}</small>
              <p>{ActiveMilestone.summary}</p>
              <ul aria-label="Skills used">
                {ActiveMilestone.skills.map((Skill) => <li key={Skill}>{Skill}</li>)}
              </ul>
            </div>
            <div className="work-space__detail-image">
              <Image src={ActiveMilestone.image} alt={ActiveMilestone.imageAlt} fill sizes="(max-width: 900px) 35vw, 10rem" />
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
