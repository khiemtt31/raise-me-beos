import { signals, stats, storyContent } from '@/skeleton-data/portfolio'

export function StorySection() {
  return (
    <section
      id="story"
      data-section="story"
      data-sphere
      className="sphere-section mt-32 grid min-h-[85vh] gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-20"
    >
      <div data-reveal className="reveal space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          {storyContent.eyebrow}
        </p>
        <h2 className="text-3xl font-sans text-glow md:text-4xl">
          {storyContent.title}
        </h2>
        <p className="text-[var(--hero-muted)]">{storyContent.description}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-panel neon-border rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-sans text-glow">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {signals.map((signal, index) => {
          const Icon = signal.icon
          return (
            <div
              key={signal.title}
              data-reveal
              className="reveal glass-panel neon-border rounded-2xl p-5"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]">
                  <Icon className="h-4 w-4 text-[var(--hero-foreground)]" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  {signal.detail}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-sans text-glow">{signal.title}</h3>
              <p className="mt-3 text-sm text-[var(--hero-muted)]">
                {signal.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
