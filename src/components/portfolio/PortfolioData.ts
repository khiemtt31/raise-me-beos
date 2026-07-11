export type SectionId = "home" | "work" | "about" | "projects" | "contact";

export type VisualizerTone = "aurora" | "ribbon" | "lime" | "wash";

export type VisualizerLayer = {
  activeScale?: number;
  className: string;
  idleScale?: number;
  id: string;
  rotation: number;
  tone: VisualizerTone;
};

export type WorkMilestone = {
  className?: string;
  id: string;
  label: string;
  position: string;
  side: "top" | "bottom" | "line";
};

export const PortfolioSections: { id: SectionId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const HeaderSections = PortfolioSections.filter((Section) => Section.id !== "home");

export const SectionVisualizers: Record<SectionId, VisualizerLayer[]> = {
  home: [
    {
      id: "home-top-right",
      tone: "ribbon",
      className: "visualizer--home-top-right",
      rotation: -7,
      activeScale: 1.04,
    },
    {
      id: "home-right-lime",
      tone: "lime",
      className: "visualizer--home-right-lime",
      rotation: 10,
      idleScale: 0.94,
    },
    {
      id: "home-bottom-left",
      tone: "aurora",
      className: "visualizer--home-bottom-left",
      rotation: 16,
    },
  ],
  work: [
    {
      id: "work-left",
      tone: "aurora",
      className: "visualizer--work-left",
      rotation: -16,
      activeScale: 1.08,
    },
    {
      id: "work-top",
      tone: "ribbon",
      className: "visualizer--work-top",
      rotation: 4,
    },
    {
      id: "work-right",
      tone: "lime",
      className: "visualizer--work-right",
      rotation: 21,
    },
    {
      id: "work-bottom-left",
      tone: "wash",
      className: "visualizer--work-bottom-left",
      rotation: -3,
    },
    {
      id: "work-bottom-right",
      tone: "aurora",
      className: "visualizer--work-bottom-right",
      rotation: 13,
    },
  ],
  about: [
    {
      id: "about-top-right",
      tone: "ribbon",
      className: "visualizer--about-top-right",
      rotation: 12,
      activeScale: 1.05,
    },
    {
      id: "about-right",
      tone: "aurora",
      className: "visualizer--about-right",
      rotation: -9,
    },
    {
      id: "about-bottom-left",
      tone: "wash",
      className: "visualizer--about-bottom-left",
      rotation: 15,
    },
  ],
  projects: [
    {
      id: "projects-top-right",
      tone: "ribbon",
      className: "visualizer--projects-top-right",
      rotation: 9,
      activeScale: 1.04,
    },
    {
      id: "projects-right",
      tone: "aurora",
      className: "visualizer--projects-right",
      rotation: -8,
    },
    {
      id: "projects-bottom-left",
      tone: "wash",
      className: "visualizer--projects-bottom-left",
      rotation: 4,
    },
  ],
  contact: [
    {
      id: "contact-top-left",
      tone: "aurora",
      className: "visualizer--contact-top-left",
      rotation: -18,
      activeScale: 1.07,
    },
    {
      id: "contact-top-right",
      tone: "lime",
      className: "visualizer--contact-top-right",
      rotation: 8,
    },
    {
      id: "contact-left",
      tone: "ribbon",
      className: "visualizer--contact-left",
      rotation: 17,
    },
    {
      id: "contact-bottom",
      tone: "aurora",
      className: "visualizer--contact-bottom",
      rotation: -7,
    },
    {
      id: "contact-bottom-right",
      tone: "wash",
      className: "visualizer--contact-bottom-right",
      rotation: 25,
    },
  ],
};

export const WorkMilestones: WorkMilestone[] = [
  {
    id: "frontend-force",
    label: "Joining the software forces as a part time Frontend Developer",
    position: "14.5%",
    side: "top",
  },
  {
    id: "fullstack-intern",
    label: "Continuous learning to become a Full Stack Developer Intern",
    position: "32.5%",
    side: "bottom",
  },
  {
    id: "fresher-fullstack",
    label: "Keep moving forward to Fresher Full Stack Developer",
    position: "50.4%",
    side: "top",
  },
  {
    id: "junior-fullstack",
    label: "Full fill my skill to become Junior Full Stack Developer",
    position: "68.9%",
    side: "bottom",
  },
  {
    id: "one-percent",
    className: "portfolio-milestone--end",
    label: "Continuos learning 1% everyday",
    position: "81.1%",
    side: "line",
  },
];
