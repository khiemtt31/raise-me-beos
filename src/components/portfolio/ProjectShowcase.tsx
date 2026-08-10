"use client";

import Image from "next/image";
import { Activity, ArrowLeft, ArrowRight, Bot, FileText, ScanLine } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type CSSProperties, type FocusEvent } from "react";
import type { LucideIcon } from "lucide-react";

import type { Project } from "@/components/portfolio/PortfolioData";

type ProjectCategory = {
  Icon: LucideIcon;
  label: string;
  accent: string;
  accentSoft: string;
  surface: string;
  ink: string;
};

type Corner = {
  left: string;
  top: string;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
};

const ProjectCategories: Record<string, ProjectCategory> = {
  halando: {
    Icon: FileText,
    label: "Document intelligence",
    accent: "#d9784b",
    accentSoft: "rgba(217, 120, 75, 0.18)",
    surface: "rgba(248, 224, 185, 0.96)",
    ink: "#382116",
  },
  "detail-design-with-agent": {
    Icon: Bot,
    label: "Agent workflows",
    accent: "#6d8d91",
    accentSoft: "rgba(109, 141, 145, 0.2)",
    surface: "rgba(220, 231, 221, 0.96)",
    ink: "#203b3b",
  },
  mimlork: {
    Icon: ScanLine,
    label: "Computer vision",
    accent: "#b85d43",
    accentSoft: "rgba(184, 93, 67, 0.18)",
    surface: "rgba(239, 214, 194, 0.96)",
    ink: "#351d18",
  },
  "aperture-markets": {
    Icon: Activity,
    label: "Live data systems",
    accent: "#a3813f",
    accentSoft: "rgba(163, 129, 63, 0.2)",
    surface: "rgba(238, 226, 187, 0.96)",
    ink: "#342b18",
  },
};

const FallbackCategory: ProjectCategory = {
  Icon: Activity,
  label: "Product systems",
  accent: "#a94f2c",
  accentSoft: "rgba(169, 79, 44, 0.18)",
  surface: "rgba(232, 207, 159, 0.96)",
  ink: "#2b1c13",
};

const CornerPositions: Corner[] = [
  { left: "25%", top: "25%", rotateX: 3, rotateY: -5, rotateZ: -2.5 },
  { left: "75%", top: "25%", rotateX: 3, rotateY: 5, rotateZ: 2.5 },
  { left: "25%", top: "75%", rotateX: -3, rotateY: -5, rotateZ: 2.5 },
  { left: "75%", top: "75%", rotateX: -3, rotateY: 5, rotateZ: -2.5 },
];

const StackSpring = { type: "spring" as const, stiffness: 230, damping: 28, mass: 0.8 };
const AutoplayDelay = 3000;

export function ProjectGrid({ active, projects }: { active: boolean; projects: Project[] }) {
  const [HoveredProjectId, SetHoveredProjectId] = useState<string | null>(null);
  const ShouldReduceMotion = useReducedMotion();

  if (projects.length === 0) {
    return null;
  }

  return (
    <div
      className="projects-grid"
      data-has-hover={HoveredProjectId !== null}
      onMouseLeave={() => SetHoveredProjectId(null)}
      onBlur={(Event: FocusEvent<HTMLDivElement>) => {
        const NextTarget = Event.relatedTarget;

        if (!(NextTarget instanceof Node) || !Event.currentTarget.contains(NextTarget)) {
          SetHoveredProjectId(null);
        }
      }}
    >
      <div className="projects-grid__center" aria-hidden={HoveredProjectId !== null}>
        <p>Selected builds / 04</p>
        <h2 className="portfolio-display">Projects with a point of view.</h2>
        <span>Hover a stack to bring it forward</span>
      </div>

      {projects.map((ProjectItem, ProjectIndex) => (
        <ProjectStack
          key={ProjectItem.id}
          project={ProjectItem}
          corner={CornerPositions[ProjectIndex % CornerPositions.length] ?? CornerPositions[0]}
          isPromoted={HoveredProjectId === ProjectItem.id}
          isDimmed={HoveredProjectId !== null && HoveredProjectId !== ProjectItem.id}
           reducedMotion={ShouldReduceMotion}
           active={active}
           onPromote={() => SetHoveredProjectId(ProjectItem.id)}
        />
      ))}
    </div>
  );
}

type ProjectStackProps = {
  project: Project;
  corner: Corner;
  isPromoted: boolean;
  isDimmed: boolean;
  reducedMotion: boolean | null;
  active: boolean;
  onPromote: () => void;
};

function ProjectStack({ active, project, corner, isPromoted, isDimmed, reducedMotion, onPromote }: ProjectStackProps) {
  const [ActiveImageIndex, SetActiveImageIndex] = useState(0);
  const [IsExpanded, SetIsExpanded] = useState(false);
  const Category = ProjectCategories[project.id] ?? FallbackCategory;
  const Icon = Category.Icon;
  const Transition = reducedMotion ? { duration: 0 } : StackSpring;

  useEffect(() => {
    if (reducedMotion || !active || project.images.length < 2) {
      return undefined;
    }

    const AutoplayTimer = window.setInterval(() => {
      SetActiveImageIndex((CurrentIndex) => (CurrentIndex + 1) % project.images.length);
    }, AutoplayDelay);

    return () => window.clearInterval(AutoplayTimer);
  }, [active, project.images.length, reducedMotion]);

  const MoveImage = (Direction: 1 | -1) => {
    SetActiveImageIndex((CurrentIndex) => (CurrentIndex + Direction + project.images.length) % project.images.length);
  };

  return (
    <motion.article
      className="project-stack"
      data-dimmed={isDimmed}
      data-promoted={isPromoted}
      tabIndex={0}
      style={
        {
          "--stack-accent": Category.accent,
          "--stack-accent-soft": Category.accentSoft,
          "--stack-surface": Category.surface,
          "--stack-ink": Category.ink,
          top: corner.top,
          left: corner.left,
          translate: "-50% -50%",
        } as CSSProperties
      }
      initial={false}
      animate={{
        top: isPromoted ? "50%" : corner.top,
        left: isPromoted ? "50%" : corner.left,
        width: isPromoted ? "52%" : "38%",
        height: isPromoted ? "78%" : "38%",
        opacity: isDimmed ? 0.2 : 1,
        rotateX: isPromoted ? 0 : corner.rotateX,
        rotateY: isPromoted ? 0 : corner.rotateY,
        rotateZ: isPromoted ? 0 : corner.rotateZ,
        scale: isDimmed ? 0.82 : 1,
        z: isPromoted ? 220 : 40,
      }}
      transition={Transition}
      onMouseEnter={onPromote}
      onFocus={onPromote}
      onClick={onPromote}
    >
      <div className="project-stack__thickness" aria-hidden="true" />
      <div className="project-stack__viewport" aria-label={`${project.title} image carousel`}>
        {project.images.map((ProjectImage, ImageIndex) => {
          const RelativeIndex = GetRelativeIndex(ImageIndex, ActiveImageIndex, project.images.length);
          const IsCurrent = RelativeIndex === 0;
          const IsVisible = Math.abs(RelativeIndex) <= 1;

          return (
            <motion.figure
              key={ProjectImage.id}
              className="project-stack__slide"
              aria-hidden={!IsCurrent}
              style={{ position: "absolute" }}
              initial={false}
              animate={{
                opacity: IsVisible ? (IsCurrent ? 1 : 0.64) : 0,
                rotateY: RelativeIndex * -25,
                rotateZ: RelativeIndex === 0 ? 0 : RelativeIndex < 0 ? -2 : 2,
                scale: IsCurrent ? 1 : 0.82,
                x: `${RelativeIndex * 78}%`,
                z: IsCurrent ? 70 : -24,
              }}
              transition={Transition}
            >
              <Image
                src={ProjectImage.src}
                alt={ProjectImage.alt}
                fill
                sizes="(max-width: 900px) 86vw, 30vw"
                draggable={false}
              />
              <figcaption>{ProjectImage.caption}</figcaption>
            </motion.figure>
          );
        })}
        <div className="project-stack__image-shade" aria-hidden="true" />
        <div className="project-stack__image-meta">
          <span>{String(ActiveImageIndex + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}</span>
          <span>{project.year}</span>
        </div>
        {isPromoted && project.images.length > 1 ? (
          <div className="project-stack__image-controls" aria-label="Project image controls">
            <button type="button" aria-label={`Previous ${project.title} image`} onClick={(Event) => { Event.stopPropagation(); MoveImage(-1); }}>
              <ArrowLeft aria-hidden="true" size={15} />
            </button>
            <button type="button" aria-label={`Next ${project.title} image`} onClick={(Event) => { Event.stopPropagation(); MoveImage(1); }}>
              <ArrowRight aria-hidden="true" size={15} />
            </button>
          </div>
        ) : null}
      </div>

      <div className="project-stack__body">
        <div className="project-stack__category">
          <span className="project-stack__icon"><Icon aria-hidden="true" size={16} strokeWidth={2.1} /></span>
          <span>{Category.label}</span>
          <small>{project.status}</small>
        </div>
        <h3>{project.title}</h3>
        <p className="project-stack__role">{project.role}</p>
        <div className="project-stack__tags" aria-label="Technology stack">
          {project.stack.slice(0, 3).map((Technology) => <span key={Technology}>{Technology}</span>)}
        </div>
        {isPromoted ? (
          <button
            type="button"
            className="project-stack__details-toggle"
            aria-expanded={IsExpanded}
            onClick={(Event) => { Event.stopPropagation(); SetIsExpanded((Expanded) => !Expanded); }}
          >
            {IsExpanded ? "Close details" : "Open details"}
            <span aria-hidden="true">{IsExpanded ? "−" : "+"}</span>
          </button>
        ) : null}
        {isPromoted && IsExpanded ? (
          <motion.div
            className="project-stack__details"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
          >
            <p>{project.detailSummary}</p>
            <p><strong>My contribution:</strong> {project.contribution}</p>
          </motion.div>
        ) : null}
      </div>
    </motion.article>
  );
}

function GetRelativeIndex(Index: number, ActiveIndex: number, Length: number) {
  const ForwardIndex = (Index - ActiveIndex + Length) % Length;

  return ForwardIndex > Length / 2 ? ForwardIndex - Length : ForwardIndex;
}
