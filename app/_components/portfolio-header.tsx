import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { sections, siteContent } from '@/skeleton-data/portfolio'

export function PortfolioHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--hero-border)] bg-[var(--hero-bg)]">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4 md:px-10 xl:px-16">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[var(--hero-accent)] shadow-[0_0_8px_var(--hero-glow-strong)]" />
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--hero-accent)]">
            {siteContent.name}
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] md:flex">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="transition duration-300 hover:text-[var(--hero-foreground)]"
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            asChild
            className="neon-border bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)]"
          >
            <a href="#donate">{siteContent.supportLabel}</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
