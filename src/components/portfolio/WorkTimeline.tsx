"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { WorkMilestones } from "@/components/portfolio/PortfolioData";
import { Cn } from "@/lib/utils";

const DefaultMilestone = WorkMilestones.find((Milestone) => Milestone.current) ?? WorkMilestones.at(-1)!;

export function WorkTimeline({ active }: { active: boolean }) {
  const ShouldReduceMotion = useReducedMotion();
  const [SelectedMilestoneId, SetSelectedMilestoneId] = useState(DefaultMilestone.id);
  const [HoveredMilestoneId, SetHoveredMilestoneId] = useState<string | null>(null);
  const ActiveMilestoneId = HoveredMilestoneId ?? SelectedMilestoneId;
  const ActiveMilestone = WorkMilestones.find((Milestone) => Milestone.id === ActiveMilestoneId) ?? DefaultMilestone;

  return (
    <div className="work-map" onMouseLeave={() => SetHoveredMilestoneId(null)}>
      <div className="work-map__hud" aria-hidden="true">
        <span>Arrakis career archive</span>
        <span>04 field records</span>
      </div>

      <div className="work-map__scenery" aria-hidden="true">
        <span className="work-map__cloud work-map__cloud--one" />
        <span className="work-map__cloud work-map__cloud--two" />
        <span className="work-map__spark work-map__spark--one">+</span>
        <span className="work-map__spark work-map__spark--two">+</span>
        <span className="work-map__mountain work-map__mountain--one" />
        <span className="work-map__mountain work-map__mountain--two" />
      </div>

      <div className="work-map__route" aria-hidden="true">
        <motion.span
          className="work-map__route-fill"
          initial={false}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: ShouldReduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="work-map__finish">
          <span>1%</span>
        </span>
      </div>

      <motion.div
        className="work-map__explorer"
        aria-hidden="true"
        initial={false}
        animate={{ left: active ? ActiveMilestone.position : "5%" }}
        transition={{ duration: ShouldReduceMotion ? 0 : 0.58, type: "spring", bounce: 0.28 }}
      >
        <span className="work-map__explorer-shadow" />
        <span className="work-map__explorer-leg work-map__explorer-leg--left" />
        <span className="work-map__explorer-leg work-map__explorer-leg--right" />
        <span className="work-map__explorer-body">
          <span className="work-map__explorer-breath" />
          <span className="work-map__explorer-mark">H</span>
        </span>
        <span className="work-map__explorer-head">
          <span />
        </span>
      </motion.div>

      <ol className="work-map__milestones" aria-label="Career evolution timeline">
        {WorkMilestones.map((Milestone, Index) => {
          const IsActive = ActiveMilestone.id === Milestone.id;
          const DetailSide = Milestone.side === "top" ? "bottom" : "top";

          return (
            <li
              key={Milestone.id}
              className={Cn("work-checkpoint", `work-checkpoint--${Milestone.side}`, IsActive && "work-checkpoint--active")}
              style={{ "--milestone-position": Milestone.position } as CSSProperties}
            >
              <button
                type="button"
                className="work-checkpoint__trigger"
                aria-controls={`work-detail-${Milestone.id}`}
                aria-expanded={IsActive}
                aria-label={`${Milestone.role} at ${Milestone.company}, ${Milestone.period}`}
                onClick={() => SetSelectedMilestoneId(Milestone.id)}
                onFocus={() => SetSelectedMilestoneId(Milestone.id)}
                onMouseEnter={() => SetHoveredMilestoneId(Milestone.id)}
              >
                <span className="work-checkpoint__pulse" aria-hidden="true" />
                <span className="work-checkpoint__portal" aria-hidden="true">
                  <span className="work-checkpoint__portal-core">{String(Index + 1).padStart(2, "0")}</span>
                </span>
              </button>

              <div className="work-checkpoint__label">
                <span>{Milestone.period}</span>
                <strong>{Milestone.shortRole}</strong>
              </div>

              <AnimatePresence initial={false}>
                {IsActive ? (
                  <motion.article
                    key={Milestone.id}
                    className={Cn("work-detail", `work-detail--${DetailSide}`, `work-detail--align-${Milestone.align}`)}
                    id={`work-detail-${Milestone.id}`}
                    initial={{ filter: "blur(7px)", opacity: 0 }}
                    animate={{ filter: "blur(0px)", opacity: 1 }}
                    exit={{ filter: "blur(7px)", opacity: 0 }}
                    transition={{ duration: ShouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="work-detail__topline">
                      <span>Field record {String(Index + 1).padStart(2, "0")}</span>
                      <span>{Milestone.current ? "Active assignment" : "Mission complete"}</span>
                    </div>

                    <div className="work-detail__profile">
                      <div className="work-detail__monogram" aria-hidden="true">
                        {Milestone.monogram}
                      </div>
                      <div>
                        <p className="work-detail__company">{Milestone.company}</p>
                        <h3>{Milestone.role}</h3>
                        <p className="work-detail__period">{Milestone.period}</p>
                      </div>
                    </div>

                    <div className="work-detail__body">
                      <div className="work-detail__image">
                        <Image
                          src={Milestone.image}
                          alt={Milestone.imageAlt}
                          fill
                          sizes="(max-width: 520px) calc(100vw - 8rem), (max-width: 900px) 31vw, 7.2rem"
                        />
                        <span aria-hidden="true">Company field file</span>
                      </div>
                      <div className="work-detail__copy">
                        <p>{Milestone.companyProfile}</p>
                        <p>{Milestone.summary}</p>
                      </div>
                    </div>

                    <ul className="work-detail__skills" aria-label="Portfolio skills used in this role">
                      {Milestone.skills.map((Skill) => (
                        <li key={Skill}>{Skill}</li>
                      ))}
                    </ul>
                  </motion.article>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
