---
name: responsive-ui
description: Design and review the portfolio’s responsive composition, typography, spacing, accessibility, and cinematic desktop/mobile/static modes. Use when changing layout, breakpoints, hero composition, project presentation, mobile behavior, or fallback UI.
---

# Responsive UI

## Composition rules

- Lock information hierarchy and content order before breakpoints; do not shrink desktop into an unusable mobile layout.
- Treat desktop as cinematic, mobile as cinematic-lite, and static fallback as first-class compositions with complete actions.
- Use a small token set for color, type, spacing, radius, width, and z-index. Avoid one-off breakpoint patches.
- Use CSS for layout and client JavaScript only for interaction/enhancement. Reserve intrinsic media space.

## Workflow

1. Write semantic DOM order and heading hierarchy.
2. Define containers and fluid type/spacing before breakpoint exceptions.
3. Design the smallest viewport first for navigation, tap targets, readable copy, project evidence, and contact actions.
4. Add the desktop cinematic composition as progressive enhancement.
5. Check overflow, focus order, zoom to 200%, orientation, reduced motion, contrast, and touch targets at each breakpoint.
6. Keep WebGL behind HTML and hide/downgrade it for weak devices, motion preference, or load failure.

## Accessibility

- Use one meaningful h1, logical headings, landmarks, skip navigation, keyboard access, visible focus, and descriptive names.
- Never communicate essential information with color, motion, hover, or canvas alone.
- Respect reduced motion and test contrast, zoom/reflow, touch targets, screen-reader labels, and alt text.

## References

- Next accessibility: node_modules/next/dist/docs/03-architecture/accessibility.md
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- MDN responsive design: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
