import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function PortfolioHeader() {
  const router = useRouter()

  const handleHomeClick = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL?.replace(/\/$/, '') ?? ''
      const healthzUrl = apiBase ? `${apiBase}/healthz` : '/healthz'
      await fetch(healthzUrl)
    } catch (error) {
      console.error('Health check failed:', error)
    }
    router.push('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--hero-border)] bg-[var(--hero-bg)]">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4 md:px-10 xl:px-16">
        <Button
          variant="ghost"
          onClick={handleHomeClick}
          className="flex items-center gap-3 p-0 h-auto hover:bg-transparent transition-colors duration-300 hover:text-[var(--hero-accent)]"
        >
          <span className="h-3 w-3 rounded-full bg-[var(--hero-accent)] shadow-[0_0_8px_var(--hero-glow-strong)]" />
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--hero-accent)]">
            нαиzσ
          </span>
        </Button>

        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] md:flex">
          <Link
            href="/"
            className="transition duration-300 hover:text-[var(--hero-foreground)]"
          >
            Home
          </Link>
          <Link
            href="/donate"
            className="transition duration-300 hover:text-[var(--hero-foreground)]"
          >
            Donate
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            asChild
            className="neon-border bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)]"
          >
            <Link href="/donate">Support</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
