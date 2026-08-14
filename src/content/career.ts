export type CareerEntry = {
  company: string;
  companyProfile: string;
  current?: boolean;
  image: string;
  imageAlt: string;
  period: string;
  position: string;
  role: string;
  skills: string[];
  summary: string;
};

export const career: CareerEntry[] = [
  {
    company: "TANCA Joint Stock Company",
    companyProfile:
      "Vietnamese HR technology company building a cloud platform for attendance, payroll, and workforce operations.",
    image: "/Work/work-placeholder.jpg",
    imageAlt: "Temporary workplace placeholder",
    period: "Mar 2024 – Oct 2024",
    position: "Frontend Developer",
    role: "Frontend developer",
    skills: ["React", "TypeScript", "SaaS", "Product delivery"],
    summary:
      "Positioned as an intermediate Frontend Developer, I collaborated with a cross-functional team to ship profitable features for a Human Resource Management SaaS product.",
  },
  {
    company: "Vucar Joint Stock Company",
    companyProfile:
      "A technology-led automotive marketplace improving how used cars are inspected, valued, and auctioned.",
    image: "/Work/work-placeholder.jpg",
    imageAlt: "Temporary workplace placeholder",
    period: "Nov 2024 – Dec 2024",
    position: "Intern Software Engineer",
    role: "Full-stack intern",
    skills: ["Full Stack", "AI Agents", "API design", "Car bidding"],
    summary:
      "Worked as a Full Stack Developer to enhance a car bidding system with integrated AI agents while also building supporting AI services and solving product problems end to end.",
  },
  {
    company: "SystemEXE Vietnam Limited Company",
    companyProfile:
      "The Vietnam engineering center of a Japanese software group delivering enterprise systems for clients in Japan.",
    image: "/Work/work-placeholder.jpg",
    imageAlt: "Temporary workplace placeholder",
    period: "Mar 2025 – May 2026",
    position: "Fresher Software Engineer",
    role: "Software engineer",
    skills: ["Agile", "SDLC", "Backend", "Japanese projects"],
    summary:
      "Focused on solving software problems for Japanese clients, following Agile practices closely and contributing throughout the full software development lifecycle.",
  },
  {
    company: "Amaris Vietnam Limited Company",
    companyProfile:
      "Amaris Consulting is Mantu’s technology consulting business, connecting engineering specialists with global enterprise teams.",
    current: true,
    image: "/Work/work-placeholder.jpg",
    imageAlt: "Temporary workplace placeholder",
    period: "Jun 2026 – Present",
    position: "Software Engineer",
    role: "Software consultant",
    skills: ["Consulting", "Agile & Scrum", "SDLC", "Bosch BGSW"],
    summary:
      "I work as a Software Engineering Consultant outsourced to Bosch Global Software Technologies Vietnam, applying the full SDLC within Agile and Scrum delivery teams.",
  },
];
