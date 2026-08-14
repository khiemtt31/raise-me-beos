# Architecture and audit decisions

Audit date: 2026-08-10

## Decisions made during audit

### Preserve the deployment spine

Keep the current Next.js App Router, OpenNext adapter, Wrangler worker entrypoint, `nodejs_compat`, `.open-next` asset binding, image binding, CI workflow, deploy workflow, npm lockfile, and deployment scripts as the starting infrastructure. The rebuild should change the frontend module graph without discarding the delivery path.

### Rebuild the frontend as a clean V2

The current `src/components/portfolio` tree and the imported CSS layers are reference material. V2 should not gradually refactor this architecture. Create a new, smaller server-first composition and migrate only validated content, assets, and infrastructure.

### Keep WebGL progressive enhancement

The semantic HTML portfolio must render and remain usable without WebGL, model loading, or motion. WebGL may decorate the hero and must not own navigation, copy, project evidence, or contact actions.

### Keep the no-video performance decision

`docs/ui-improvement-checkpoint.md` records that background video was removed to reduce scroll-time rendering pressure. Do not reintroduce video during the rebuild unless a measured replacement passes the performance gate.

### Prefer one motion system

The current UI uses `framer-motion` 12.42.2. The requested direction names Motion for React, which is the current successor/package direction. Do not add both systems. Evaluate a controlled migration to `motion` during implementation and remove the old package only after all imports and lockfile entries are gone.

### Defer expensive dependencies

Do not install Three.js, React Three Fiber, Drei, postprocessing, Playwright, or glTF Transform during this audit. Add them in the implementation phase only after the open hero and QA specifications are locked, with bundle and runtime budgets recorded.

### Use the current font assets as candidates, not commitments

`@fontsource/space-grotesk` and `@fontsource/jacques-francois` are currently imported through CSS. V2 may retain them or replace them after visual direction is approved; do not silently change typography during infrastructure work.

## Phase 1 migration decisions

### Keep the foundation server-first

The new root page is composed from React Server Components with no `use client` boundary, animation runtime, or WebGL. Navigation uses semantic same-page anchors, and the hero is a static image/content composition.

### Move content into `src/content`

Profile, career, project, about, and contact records now live in typed modules under `src/content/`. Presentation components consume those records and do not own the portfolio copy.

### Use a temporary semantic dark shell

`src/styles/tokens.css` and `src/styles/typography.css` define temporary semantic values for the foundation. The palette, camera composition, cinematic effects, and final project presentation remain open decisions.

### Remove only legacy presentation dependencies

Removed direct dependencies used exclusively by deleted UI: Radix Slot, CVA, clsx, Framer Motion, Lucide, Sass, and tailwind-merge. Tailwind/PostCSS remains as existing CSS infrastructure; Three/R3F/Drei/postprocessing, Motion, Playwright, and glTF Transform remain deferred.

## Phase 2B static Ember Editorial decisions

### Build the complete visual baseline without runtime enhancement

Implement the approved A1 Ember Editorial direction with semantic server-rendered HTML, CSS tokens, local Fontsource typography, native anchor navigation, and `next/image`. The static page is intentionally complete without Motion, Three.js, WebGL, shaders, particles, post-processing, smooth scrolling, or background video.

### Use the approved portrait as the static hero reference

Use `public/images/homepage/HeroPrimary.png` for the three-quarter static hero composition because it is the existing approved portrait asset that matches the locked visual direction. Do not fabricate a 3D character or substitute the unrelated contact-model asset.

### Keep unresolved public identity fields absent

The contact section renders only the confirmed name, professional title, and `hanzo.work.vnn@gmail.com` mailto link. Unresolved GitHub, LinkedIn, location, availability/status, resume, and project URLs are omitted rather than represented with placeholders.

### Keep every section editorial rather than card-driven

Selected Work uses asymmetric case-study rows, Experience uses chronological editorial chapters, About combines engineering identity, principles, and supported interests, and Contact closes the page as a direct identity/email chapter.

### Keep the static route server-only

No Phase 2B component requires a Client Component. CSS handles hover, focus, reduced-motion behavior, responsive composition, and the intentional static fallback state.

## Current infrastructure facts

- `next.config.ts` only disables dev indicators; there are no redirects, headers, image remote patterns, rewrites, or runtime settings.
- `open-next.config.ts` exports the default `defineCloudflareConfig()` configuration.
- `wrangler.jsonc` names the worker `raise-me-beos`, serves `.open-next/worker.js`, binds `.open-next/assets` as `ASSETS`, declares `IMAGES`, enables `nodejs_compat`, and enables observability.
- No tracked `.env` file, `cloudflare-env.d.ts`, `vars`, KV/R2/D1 bindings, routes, custom domain, or `workers.dev` hostname is present. `cf-typegen` references a generated `cloudflare-env.d.ts` that is not tracked.
- CI runs Node 22, `npm ci`, lint, typecheck, OpenNext build, and image verification on pushes and pull requests.
- Production deploy runs on pushes to `main` or manual dispatch and requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` GitHub secrets in the `production` environment.
- The git remote is `git@github.com:khiemtt31/raise-me-beos.git`; the active branch is `portfolio/v2`.

## Dependency assessment

| Dependency | Current use | Audit recommendation |
| --- | --- | --- |
| Next / React / React DOM | Runtime foundation | Preserve and read the installed Next 16 docs before coding |
| OpenNext / Wrangler | Cloudflare build and deploy | Preserve; validate after every routing/runtime change |
| Tailwind CSS / PostCSS | Utility and CSS processing | Preserve initially; simplify only with a deliberate design-system decision |
| Sass | Declared but no `.scss` source was present | Removed |
| Framer Motion | Legacy interactive motion | Removed; defer Motion until motion is specified |
| Lucide / Radix Slot / CVA / clsx / tailwind-merge | Legacy icons/button primitive/class helper | Removed; use semantic HTML in foundation |
| Fontsource packages | Current typography | Preserve until typography is approved |
| Three / R3F / Drei / postprocessing | Not installed | Deferred to the 3D implementation phase, behind progressive enhancement |
| Playwright | Not installed; no E2E directory | Add in QA phase when the app has stable routes and interactions |
| glTF Transform CLI | Not installed | Add to an asset pipeline only when a real GLB exists |

## Reference documentation used

- Next guidance was read locally from `node_modules/next/dist/docs/`, including App Router, accessibility, and glossary material.
- Three.js: https://threejs.org/docs/pages/WebGLRenderer.html
- React Three Fiber performance pitfalls: https://r3f.docs.pmnd.rs/advanced/pitfalls
- Motion for React layout animation: https://motion.dev/docs/react-layout-animations
- Cloudflare Next.js/OpenNext: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
