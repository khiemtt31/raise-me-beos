export type SectionId = "home" | "work" | "about" | "projects" | "contact";

export type VisualizerTone = "sandstorm" | "shadow" | "spice" | "sun";

export type VisualizerLayer = {
  activeScale?: number;
  className: string;
  idleScale?: number;
  id: string;
  rotation: number;
  tone: VisualizerTone;
};

export type WorkMilestone = {
  align: "left" | "center" | "right";
  company: string;
  companyProfile: string;
  current?: boolean;
  id: string;
  image: string;
  imageAlt: string;
  monogram: string;
  period: string;
  position: string;
  role: string;
  shortRole: string;
  side: "top" | "bottom";
  skills: string[];
  summary: string;
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
      tone: "sandstorm",
      className: "visualizer--home-top-right",
      rotation: -7,
      activeScale: 1.04,
    },
    {
      id: "home-right-sun",
      tone: "sun",
      className: "visualizer--home-right-sun",
      rotation: 10,
      idleScale: 0.94,
    },
    {
      id: "home-bottom-left",
      tone: "spice",
      className: "visualizer--home-bottom-left",
      rotation: 16,
    },
  ],
  work: [
    {
      id: "work-left",
      tone: "spice",
      className: "visualizer--work-left",
      rotation: -16,
      activeScale: 1.08,
    },
    {
      id: "work-top",
      tone: "sandstorm",
      className: "visualizer--work-top",
      rotation: 4,
    },
    {
      id: "work-right",
      tone: "sun",
      className: "visualizer--work-right",
      rotation: 21,
    },
    {
      id: "work-bottom-left",
      tone: "shadow",
      className: "visualizer--work-bottom-left",
      rotation: -3,
    },
    {
      id: "work-bottom-right",
      tone: "spice",
      className: "visualizer--work-bottom-right",
      rotation: 13,
    },
  ],
  about: [
    {
      id: "about-top-right",
      tone: "sandstorm",
      className: "visualizer--about-top-right",
      rotation: 12,
      activeScale: 1.05,
    },
    {
      id: "about-right",
      tone: "spice",
      className: "visualizer--about-right",
      rotation: -9,
    },
    {
      id: "about-bottom-left",
      tone: "shadow",
      className: "visualizer--about-bottom-left",
      rotation: 15,
    },
  ],
  projects: [
    {
      id: "projects-top-right",
      tone: "sandstorm",
      className: "visualizer--projects-top-right",
      rotation: 9,
      activeScale: 1.04,
    },
    {
      id: "projects-right",
      tone: "spice",
      className: "visualizer--projects-right",
      rotation: -8,
    },
    {
      id: "projects-bottom-left",
      tone: "shadow",
      className: "visualizer--projects-bottom-left",
      rotation: 4,
    },
  ],
  contact: [
    {
      id: "contact-top-left",
      tone: "spice",
      className: "visualizer--contact-top-left",
      rotation: -18,
      activeScale: 1.07,
    },
    {
      id: "contact-top-right",
      tone: "sun",
      className: "visualizer--contact-top-right",
      rotation: 8,
    },
    {
      id: "contact-left",
      tone: "sandstorm",
      className: "visualizer--contact-left",
      rotation: 17,
    },
    {
      id: "contact-bottom",
      tone: "spice",
      className: "visualizer--contact-bottom",
      rotation: -7,
    },
    {
      id: "contact-bottom-right",
      tone: "shadow",
      className: "visualizer--contact-bottom-right",
      rotation: 25,
    },
  ],
};

export const WorkMilestones: WorkMilestone[] = [
  {
    id: "frontend-force",
    align: "left",
    company: "TANCA Joint Stock Company",
    companyProfile: "Vietnamese HR technology company building a cloud platform for attendance, payroll, and workforce operations.",
    image: "/Work/work-placeholder.jpg",
    imageAlt: "Temporary workplace placeholder",
    monogram: "TA",
    period: "Mar 2024 - Oct 2024",
    position: "10%",
    role: "Frontend Developer",
    shortRole: "Frontend developer",
    side: "bottom",
    skills: ["React", "TypeScript", "SaaS", "Product delivery"],
    summary:
      "Positioned as an intermediate Frontend Developer, I collaborated with a cross-functional team to ship profitable features for a Human Resource Management SaaS product.",
  },
  {
    id: "fullstack-intern",
    align: "center",
    company: "Vucar Joint Stock Company",
    companyProfile: "A technology-led automotive marketplace improving how used cars are inspected, valued, and auctioned.",
    image: "/Work/work-placeholder.jpg",
    imageAlt: "Temporary workplace placeholder",
    monogram: "VU",
    period: "Nov 2024 - Dec 2024",
    position: "34%",
    role: "Intern Software Engineer",
    shortRole: "Full-stack intern",
    side: "top",
    skills: ["Full Stack", "AI Agents", "API design", "Car bidding"],
    summary:
      "Worked as a Full Stack Developer to enhance a car bidding system with integrated AI agents while also building supporting AI services and solving product problems end to end.",
  },
  {
    id: "fresher-fullstack",
    align: "center",
    company: "SystemEXE Vietnam Limited Company",
    companyProfile: "The Vietnam engineering center of a Japanese software group delivering enterprise systems for clients in Japan.",
    image: "/Work/work-placeholder.jpg",
    imageAlt: "Temporary workplace placeholder",
    monogram: "SX",
    period: "Mar 2025 - May 2026",
    position: "59%",
    role: "Fresher Software Engineer",
    shortRole: "Software engineer",
    side: "bottom",
    skills: ["Agile", "SDLC", "Backend", "Japanese projects"],
    summary:
      "Focused on solving software problems for Japanese clients, following Agile practices closely and contributing throughout the full software development lifecycle.",
  },
  {
    id: "junior-fullstack",
    align: "right",
    company: "Amaris Vietnam Limited Company",
    companyProfile: "Amaris Consulting is Mantu's technology consulting business, connecting engineering specialists with global enterprise teams.",
    current: true,
    image: "/Work/work-placeholder.jpg",
    imageAlt: "Temporary workplace placeholder",
    monogram: "AM",
    period: "Jun 2026 - Present",
    position: "84%",
    role: "Software Engineer",
    shortRole: "Software consultant",
    side: "top",
    skills: ["Consulting", "Agile & Scrum", "SDLC", "Bosch BGSW"],
    summary:
      "I work as a Software Engineering Consultant outsourced to Bosch Global Software Technologies Vietnam, applying the full SDLC within Agile and Scrum delivery teams.",
  },
];
