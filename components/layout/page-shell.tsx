import { cn } from '@/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  /** Tailwind class(es) applied to the root element. */
  className?: string
  /** When true the shell fills at least the viewport minus the footer. Default: true. */
  fillViewport?: boolean
}

/**
 * PageShell — full-page outer wrapper.
 *
 * Provides the base surface every page shares:
 *   • transparent background (animated bg sits underneath in the layout)
 *   • foreground colour token
 *   • overflow-x guard
 *   • viewport-height floor so short pages don't collapse
 */
export function PageShell({
  children,
  className,
  fillViewport = true,
}: PageShellProps) {
  return (
    <div
      className={cn(
        'relative overflow-x-hidden bg-transparent text-(--hero-foreground)',
        fillViewport && 'min-h-[calc(100svh-var(--footer-h))]',
        className,
      )}
    >
      {children}
    </div>
  )
}
