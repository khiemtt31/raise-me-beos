import { cn } from '@/lib/utils'

interface CenteredShellProps {
  children: React.ReactNode
  /** Tailwind class(es) merged onto the root element. */
  className?: string
}

/**
 * CenteredShell — full-viewport centred wrapper for standalone pages
 * (success, cancel, error, coming-soon, etc.).
 *
 * Minimum height fills the viewport minus the footer so the centred card sits
 * in the visible area without the footer contributing dead space.
 * Padding follows the 8 pt scale (px-6 = 24 px).
 */
export function CenteredShell({ children, className }: CenteredShellProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-[calc(100svh-var(--footer-h))] items-center justify-center',
        'overflow-x-hidden bg-transparent text-(--hero-foreground)',
        // 8 pt horizontal / vertical padding
        'px-6 py-12',
        className,
      )}
    >
      {children}
    </div>
  )
}
