# Conventions

## UI and layout

- Use `PageShell` for the full-page outer wrapper.
- Use `PageContainer` for the standard inner page layout.
- Keep visual changes aligned with `docs/DESIGN.md`.
- Use `Button` and the other `components/ui/*` primitives instead of ad hoc variants.

## Code organization

- Put page-specific UI in `app/_components/*`.
- Put shared helpers in `lib/*`.
- Put shared content models in `skeleton-data/portfolio.ts`.
- Keep the server thin: the Hono app handles HTTP, services handle external clients, utils handle pure helpers.

## Naming

- Prefer explicit names for hooks, query keys, and route handlers.
- Keep file names tied to responsibility, not implementation detail.
- Keep doc references current when moving files.

## Cleanup rules

- Remove dead redirects and unused scaffolding once references are gone.
- Do not leave commented-out test files or commented configs behind.
