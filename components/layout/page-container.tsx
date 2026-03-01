import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  /** Tailwind class(es) merged onto the <main> element. */
  className?: string
}

/**
 * PageContainer — scrollable inner container for standard pages.
 *
 * Convention compliance (from design/conventions.md):
 *   • pt = var(--page-pt)  →  header height + 1.5 rem  ≈ 96 px  (Double Header Rule)
 *   • px = 1.5 rem (24 px) → 2.5 rem (40 px) → 4 rem (64 px)   (8 pt scale)
 *   • pb = 1.5 rem (24 px) → 2 rem (32 px)                      (8 pt scale)
 *   • max-width 1280 px centred                                   (Container Max-Width rule)
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={cn(
        // horizontal gutter: 24 px → 40 px → 64 px (8 pt)
        'mx-auto flex h-full w-full max-w-7xl flex-col',
        'px-6 md:px-10 xl:px-16',
        // bottom padding: 24 px → 32 px (8 pt)
        'pb-6 md:pb-8',
        // top padding clears header + breathing room (Double Header Rule)
        'pt-(--page-pt)',
        className,
      )}
    >
      {children}
    </main>
  )
}
