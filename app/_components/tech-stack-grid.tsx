const techStacks = [
  { name: 'React', label: 'UI Library', url: 'https://react.dev' },
  { name: 'Next.js', label: 'React Framework', url: 'https://nextjs.org' },
  { name: 'Angular', label: 'Web Framework', url: 'https://angular.dev' },
  { name: 'Java', label: 'Backend Language', url: 'https://www.java.com' },
  { name: 'Node.js', label: 'Runtime', url: 'https://nodejs.org' },
  { name: 'FastAPI', label: 'Python API', url: 'https://fastapi.tiangolo.com' },
  { name: 'PostgreSQL', label: 'Relational DB', url: 'https://www.postgresql.org' },
  { name: 'MySQL', label: 'Relational DB', url: 'https://www.mysql.com' },
  { name: 'MongoDB', label: 'NoSQL DB', url: 'https://www.mongodb.com' },
]

export function TechStackGrid() {
  return (
    <section id="tech-stack" data-section="tech-stack" className="mt-16 md:mt-24">
      <div data-reveal className="reveal max-w-2xl space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          Tech Stack
        </p>
        <h2 className="text-[clamp(1.6rem,3vw,2.6rem)] font-heading text-glow">
          Core Technologies
        </h2>
        <p className="text-[clamp(0.95rem,1.6vw,1.1rem)] text-[var(--hero-muted)]">
          A focused lineup of tools that power reliable frontends, fast APIs, and
          resilient data layers.
        </p>
      </div>

      <div
        data-reveal
        className="reveal mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {techStacks.map((tech, index) => (
          <a
            key={tech.name}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tech-card p-[1px]"
          >
            <div className="tech-card__inner">
              <div className="relative z-10 space-y-1">
                <p className="text-lg font-heading text-[var(--hero-accent-strong)]">
                  {tech.name}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  {tech.label}
                </p>
              </div>
              <span className="relative z-10 text-[10px] font-heading text-[var(--hero-muted)]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
