export const aboutContent = {
  eyebrow: "Profile / off the clock",
  title: "Built by curiosity. Powered by play.",
  lede:
    "I am a software engineer who treats life like an open-world game: explore widely, learn constantly, and leave every team better than I found it.",
  hobbies: [
    { label: "Football", note: "Energy + teamwork" },
    { label: "Movies", note: "Stories + worlds" },
    { label: "Games", note: "Strategy + play" },
    { label: "Sci-fi", note: "Future + wonder" },
  ],
  skills: [
    {
      title: "Full-stack craft",
      copy: "From polished interfaces to dependable APIs, I enjoy understanding the whole product.",
    },
    {
      title: "Systems thinking",
      copy: "I break large problems into clear systems, useful feedback loops, and shippable steps.",
    },
    {
      title: "Future curious",
      copy: "AI and emerging technology keep me experimenting with what software can become next.",
    },
  ],
  principles: ["Learn one percent every day", "Build with purpose, not noise", "Stay playful when problems get hard"],
  images: [
    {
      src: "/images/portfolio/AboutPrimary.png",
      alt: "Hanzo in a science fiction desert scene",
      width: 856,
      height: 466,
      caption: "Explorer mode / always on",
    },
    {
      src: "/images/portfolio/AboutSecondary.png",
      alt: "Hanzo portrait in front of an eclipse",
      width: 778,
      height: 561,
      caption: "Engineer / builder / problem solver",
    },
  ],
} as const;
