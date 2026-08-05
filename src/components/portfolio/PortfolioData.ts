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

export type ProjectImage = {
  alt: string;
  caption: string;
  height: number;
  id: string;
  src: string;
  width: number;
};

export type Project = {
  contribution: string;
  detailSummary: string;
  id: string;
  images: ProjectImage[];
  purpose: string;
  role: string;
  stack: string[];
  status: string;
  title: string;
  year: string;
};

export const PortfolioSections: { id: SectionId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const SectionTitles: Record<SectionId, string> = {
  home: "Home Hanzo",
  work: "Work Hanzo",
  about: "About Hanzo",
  projects: "Hanzo's Projects",
  contact: "Contact Hanzo",
};

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

export const Projects: Project[] = [
  {
    id: "halando",
    title: "Halando OCR API",
    year: "2026",
    status: "Local-first backend system",
    role: "Full-stack/backend engineer",
    purpose:
      "Halando solves the gap between a simple OCR demo and a real document-processing product: users can upload PDFs or images, process them through a worker, store extracted page text, search the results, and manage access through authenticated APIs.",
    detailSummary:
      "The project wraps OCR in production-shaped backend concerns: file validation, local storage ownership, signed/direct upload flows, async job states, retries and cancellation, searchable extracted text, original/OCR downloads, Keycloak auth, admin views, audit events, and Dockerized native OCR dependencies.",
    contribution:
      "I built the FastAPI service boundaries, document and job APIs, SQLite persistence, worker pipeline, Keycloak integration, local dashboard, and Docker setup that packages Tesseract, OCRmyPDF, Poppler, Ghostscript, QPDF, and related tools into a reproducible local environment.",
    stack: ["Python 3.14", "FastAPI", "SQLite", "SQLAlchemy", "Keycloak", "Tesseract", "OCRmyPDF", "Docker"],
    images: [
      {
        id: "home-desktop",
        src: "/images/projects/halando/01-home-desktop.png",
        alt: "Halando unauthenticated desktop home dashboard",
        caption: "Landing dashboard",
        width: 1440,
        height: 1025,
      },
      {
        id: "api-docs",
        src: "/images/projects/halando/02-api-docs.png",
        alt: "Halando FastAPI OpenAPI documentation page",
        caption: "API surface",
        width: 1440,
        height: 3593,
      },
      {
        id: "keycloak-login",
        src: "/images/projects/halando/03-keycloak-login.png",
        alt: "Halando Keycloak login screen",
        caption: "OIDC login",
        width: 1440,
        height: 1000,
      },
      {
        id: "home-authenticated",
        src: "/images/projects/halando/04-home-authenticated.png",
        alt: "Halando authenticated home workspace",
        caption: "Authenticated workspace",
        width: 1440,
        height: 1000,
      },
      {
        id: "identity-authenticated",
        src: "/images/projects/halando/05-identity-authenticated.png",
        alt: "Halando identity and permissions page",
        caption: "Identity and roles",
        width: 1440,
        height: 1183,
      },
      {
        id: "upload-authenticated",
        src: "/images/projects/halando/06-upload-authenticated.png",
        alt: "Halando document upload workflow",
        caption: "Upload and OCR job",
        width: 1440,
        height: 1038,
      },
    ],
  },
  {
    id: "detail-design-with-agent",
    title: "Detail Design with Agent",
    year: "2026",
    status: "Repository-aware planning system",
    role: "Systems/design engineer",
    purpose:
      "Detail Design with Agent helps coding agents turn product requests and codebase changes into evidence-backed, implementation-ready detail designs.",
    detailSummary:
      "The repository provides a single-agent workflow for discovery, clarification, design, self-review, and implementation handoff across frontend, backend, data, infrastructure, and automation work.",
    contribution:
      "I designed the planning standards, requirement and risk catalogs, traceability model, testing guidance, reusable templates, and the complete Laggy Horse example that demonstrates the system in practice.",
    stack: ["Markdown", "Requirements", "Traceability", "Testing standards", "Agent workflows", "GitHub Pages"],
    images: [
      {
        id: "desktop-overview",
        src: "/images/projects/laggy-horse/desktop.png",
        alt: "Detail Design with Agent desktop project evidence",
        caption: "Project evidence",
        width: 1440,
        height: 900,
      },
      {
        id: "mobile-controls",
        src: "/images/projects/laggy-horse/mobile.png",
        alt: "Detail Design with Agent mobile project evidence",
        caption: "Responsive evidence",
        width: 390,
        height: 844,
      },
      {
        id: "action-states",
        src: "/images/projects/laggy-horse/04-action-states-contact-sheet.png",
        alt: "Detail Design with Agent action-state evidence",
        caption: "Action evidence",
        width: 1280,
        height: 885,
      },
      {
        id: "focus-contrast",
        src: "/images/projects/laggy-horse/08-focus-and-contrast.png",
        alt: "Detail Design with Agent accessibility evidence",
        caption: "Accessibility evidence",
        width: 1280,
        height: 720,
      },
    ],
  },
  {
    id: "mimlork",
    title: "Mimlork",
    year: "2026",
    status: "Offline gesture matcher",
    role: "Python/desktop engineer",
    purpose:
      "Mimlork matches a live webcam gesture to a local meme image while keeping camera frames and inference on the device.",
    detailSummary:
      "The macOS-first desktop app uses one foreground model and a measurable gesture-detail vector, then ranks local references with cosine similarity and stabilizes the result over time.",
    contribution:
      "I built the camera viewport, foreground segmentation flow, normalized feature encoder, embedding database, similarity matcher, confidence stabilization, diagnostics, and offline validation tooling.",
    stack: ["Python 3.14", "PySide6", "OpenCV", "PPHumanSeg", "NumPy", "Cosine similarity"],
    images: [
      {
        id: "hands-up-surrender",
        src: "/images/projects/mimlork/hands-up-surrender.jpg",
        alt: "Mimlork hands up surrender meme reference",
        caption: "Hands up reference",
        width: 545,
        height: 436,
      },
      {
        id: "thinking-baby",
        src: "/images/projects/mimlork/thinking-baby.jpg",
        alt: "Mimlork thinking baby meme reference",
        caption: "Thinking reference",
        width: 736,
        height: 813,
      },
      {
        id: "stop-hand",
        src: "/images/projects/mimlork/stop-hand.jpg",
        alt: "Mimlork stop hand meme reference",
        caption: "Stop gesture",
        width: 615,
        height: 459,
      },
      {
        id: "awestruck-looking-up",
        src: "/images/projects/mimlork/awestruck-looking-up.jpg",
        alt: "Mimlork awestruck looking up meme reference",
        caption: "Looking up reference",
        width: 736,
        height: 664,
      },
    ],
  },
  {
    id: "aperture-markets",
    title: "Aperture Markets",
    year: "2026",
    status: "Live market dashboard",
    role: "Full-stack systems engineer",
    purpose:
      "Aperture Markets is a responsive dashboard for monitoring leading U.S.-listed companies with live quotes, sector performance, search, watchlists, and stock detail views.",
    detailSummary:
      "The system separates a quota-aware market-data gateway from the browser, keeps provider credentials server-side, and makes live, refreshed, stale, and unavailable data states explicit in the UI.",
    contribution:
      "I designed the gateway boundaries, provider quota controls, WebSocket subscription coordinator, quote cache, watchlist persistence, accessible detail drawer, health endpoints, and operational failure states.",
    stack: ["TypeScript", "React", "Node.js", "Finnhub", "WebSocket", "Vitest"],
    images: [
      {
        id: "desktop-dashboard",
        src: "/images/projects/aperture-markets/desktop.png",
        alt: "Aperture Markets desktop dashboard",
        caption: "Market dashboard",
        width: 1440,
        height: 900,
      },
      {
        id: "mobile-dashboard",
        src: "/images/projects/aperture-markets/mobile.png",
        alt: "Aperture Markets mobile dashboard",
        caption: "Responsive dashboard",
        width: 390,
        height: 844,
      },
    ],
  },
];
