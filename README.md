# Raise Me Beos

Portfolio V2 static Ember Editorial portfolio for Khiem Hanzo Tran. Phase 2B replaces the previous horizontally scrolling frontend with a polished server-rendered App Router composition while preserving the Cloudflare/OpenNext delivery path and reusable portfolio content/assets.

The static experience is intentionally complete before future enhancement. This phase does not include Motion, WebGL, animation runtime, character reveal, shaders, particles, post-processing, or background video.

## Run it

```bash
npm ci
npm run dev
```

## Scripts

- `npm run dev` — local Next.js development
- `npm run build` — standard Next.js production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript without emitting files
- `npm run build:cloudflare` — OpenNext Cloudflare build
- `npm run preview` — OpenNext Cloudflare local preview
- `npm run deploy` — OpenNext Cloudflare deployment
- `npm run verify:images` — image optimization/preview check
- `npm run cf-typegen` — Wrangler environment type generation when bindings exist

## Source map

- `src/app/` — App Router entry points, metadata, loading UI, and global CSS
- `src/components/` — small server-rendered layout and content sections
- `src/content/` — typed profile, career, project, about, and contact data
- `src/styles/tokens.css` — semantic Obsidian/Ember color, spacing, width, typography, and z-index tokens
- `src/styles/typography.css` — local font roles
- `public/` — reusable portfolio imagery and reference assets
- `.github/workflows/` — CI and Cloudflare deployment workflows
- `docs/` — audit, migration, content, decisions, and specification records

## Architecture status

- React Server Components are the default; Phase 2B has no Client Components.
- HTML content is independent of WebGL and the static hero is the intentional future fallback state.
- The approved Ember Editorial direction is implemented with CSS, existing Fontsource assets, and `next/image`.
- Motion, Three.js, React Three Fiber, and glTF tooling remain deferred to later phases.
- Production deployment was not performed as part of Phase 2B.

Read [PLAN.md](PLAN.md), [docs/SPEC.md](docs/SPEC.md), and [docs/MIGRATION-MANIFEST.md](docs/MIGRATION-MANIFEST.md) before continuing the rebuild.
