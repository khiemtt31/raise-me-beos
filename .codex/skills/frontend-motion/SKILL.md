---
name: frontend-motion
description: Design and implement restrained Motion for React interactions for the portfolio, including intro timing, scroll reveals, gestures, layout transitions, and reduced-motion behavior. Use when adding or reviewing frontend animation without another animation framework.
---

# Frontend Motion

## Architecture

- Keep semantic content and layout stable; motion decorates the DOM.
- Use the motion package direction for new work and do not mix it with a second animation framework.
- Put orchestration in a small client boundary; keep server components and metadata free of browser-only code.
- Define a small set of durations/easings and keep ownership local to each component.

## Workflow

1. Identify the purpose: orientation, hierarchy, feedback, continuity, or hero reveal. Remove motion without a purpose.
2. Prefer transform and opacity. Use layout animation only for real geometry changes.
3. Use useScroll, useInView, motion values, and springs for continuous values; keep them out of React state.
4. Make intros interruptible or skippable and never hide all usable content behind a timer.
5. Use useReducedMotion and prefers-reduced-motion to remove strobe, parallax, large travel, looping particles, and auto-play.
6. Stop observers/timers and cancel animations on unmount. Test keyboard, focus, hover, press, and touch separately.

## Review checklist

- Prefer transform/opacity over layout properties and expensive filters.
- Avoid perpetual off-screen animation and state updates in render loops/effects.
- Reserve space before content arrives to prevent CLS.
- Provide a stable first frame for SSR, screenshots, and slow loads.

## References

- Motion layout: https://motion.dev/docs/react-layout-animations
- Motion component: https://motion.dev/docs/react-motion-component
- Motion reduced motion: https://motion.dev/docs/react-use-reduced-motion
