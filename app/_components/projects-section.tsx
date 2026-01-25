import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  contactContent,
  projects,
  projectsContent,
} from '@/skeleton-data/portfolio'

export function ProjectsSection() {
  return (
    <section
      id="projects"
      data-section="projects"
      data-sphere
      className="sphere-section mt-32 min-h-[85vh] space-y-10 py-16 lg:py-20"
    >
      <div data-reveal className="reveal flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
            {projectsContent.eyebrow}
          </p>
          <h2 className="text-3xl font-heading text-glow md:text-4xl">
            {projectsContent.title}
          </h2>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
        >
          <Link href="">{projectsContent.cta}</Link>
        </Button>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={project.title}
            data-reveal
            className="reveal glass-panel neon-border rounded-2xl p-5"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
              {project.type}
            </p>
            <h3 className="mt-3 text-xl font-heading text-glow">
              {project.title}
            </h3>
            <p className="mt-3 text-sm text-[var(--hero-muted)]">
              {project.description}
            </p>
          </div>
        ))}
      </div>

      <div
        data-reveal
        className="reveal flex flex-col items-start gap-6 rounded-3xl border border-[var(--hero-border)] bg-[var(--hero-surface)] p-8"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          {contactContent.eyebrow}
        </p>
        <h2 className="text-3xl font-heading text-glow md:text-4xl">
          {contactContent.title}
        </h2>
        <p className="text-[var(--hero-muted)]">{contactContent.description}</p>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            className="neon-border bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)]"
          >
            <a href={`mailto:${contactContent.email}`}>
              {contactContent.primaryCta}
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
          >
            <Link href="/donate">{contactContent.secondaryCta}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
