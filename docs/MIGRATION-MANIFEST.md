# Phase 1 migration manifest

Audit checkpoint: `e9e4f55` on branch `portfolio/v2`, with only the audit/bootstrap documents and project-local skills uncommitted. No unrelated worktree changes were present before migration.

## PRESERVE

- `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `package-lock.json`, `.gitignore`
- `.github/workflows/ci.yml` and `.github/workflows/deploy.yml`
- `package.json` scripts, OpenNext/Wrangler dependencies, Next/React/TypeScript, Tailwind/PostCSS foundation, and Fontsource packages pending the dependency audit
- `scripts/verify-images.mjs`
- `src/app/favicon.ico`
- All `public/` image and static assets, including reference design frames and project evidence
- `README.md`, `components.json`, `.vscode/mcp.json`, audit documents, and `.codex/skills/`

## MIGRATE

- `src/components/portfolio/PortfolioData.ts` → typed modules under `src/content/`
- Approved identity, career, project, about, social, and contact information → server-owned content modules
- Approved image paths and intrinsic dimensions → content records consumed by server components
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, and `src/app/loading.tsx` → clean V2 replacements at the same App Router entry points
- `framer-motion`/legacy icon/button usage → no replacement in this foundation phase; semantic HTML and CSS only

## DELETE

- `src/components/portfolio/` legacy page composition, work timeline, project showcase, visualizer, and presentation data module after content migration
- `src/components/layout/Header.tsx` legacy motion navigation
- `src/components/ui/Button.tsx` legacy Radix/CVA button primitive
- `src/lib/utils.ts` legacy class-merging helper
- `src/styles/about.css`, `base.css`, `contact.css`, `galaxy.css`, `header.css`, `home.css`, `motion.css`, `portfolio-layout.css`, `projects.css`, `theme.css`, `visualizers.css`, and `work.css`
- Legacy-only runtime dependencies: `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `framer-motion`, `lucide-react`, `sass`, and `tailwind-merge`

## UNCERTAIN / RETAINED SAFELY

- `public/projects/halando/` duplicates the canonical `public/images/projects/halando/` files. It is retained in this phase because it is user content and binary deletion is not required to establish the new source boundary.
- `components.json` is not needed by the new shell yet, but is retained as repository metadata until the component tooling decision is revisited.
- `postcss.config.mjs`, Tailwind, and the OpenNext image binding remain because they are infrastructure-adjacent and removing them is not necessary for the foundation.

## Deletion rule

Only the DELETE set is removed. Anything UNCERTAIN remains until a later, explicit asset/tooling decision.
