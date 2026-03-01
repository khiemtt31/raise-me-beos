'use client'

import { useEffect } from 'react'

/**
 * Adds an IntersectionObserver that adds `is-visible` to every
 * `[data-reveal]` element as it scrolls into view.
 *
 * @param threshold – fraction of the element that must be visible before
 *                    triggering (default 0.2 = 20 %)
 * @param rootMargin – optional root margin string (default '0px')
 */
export function useRevealObserver(
  threshold = 0.2,
  rootMargin = '0px',
) {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    )

    if (!nodes.length) return

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin },
    )

    nodes.forEach((n) => observer.observe(n))

    return () => observer.disconnect()
  }, [threshold, rootMargin])
}
