# Portfolio V2 plan

Status: Phase 2B static Ember Editorial implementation complete; Phase 3 DOM motion and later WebGL intentionally not started.

## Phase 0 — Audit and recovery

- [x] Inventory package scripts, Next/OpenNext/Wrangler config, bindings, CI/CD, source, styles, fonts, assets, motion usage, and performance-sensitive code.
- [x] Record reusable content and missing/placeholder assets in `docs/CONTENT.md`.
- [x] Record preservation, rewrite, deletion, dependency, and infrastructure decisions in `docs/DECISIONS.md`.
- [x] Add the specification gate to `AGENTS.md`.
- [x] Verify the audit checkpoint branch/status before deletion without modifying Git history.
- [x] Record the pre-deletion classification in `docs/MIGRATION-MANIFEST.md`.

## Phase 1 — Resolve specifications

- [x] Resolve the approved hero composition, intro behavior, character presentation, camera behavior, mobile policy, project information architecture, navigation, project presentation, career presentation, typography, and palette.
- [x] Update `docs/SPEC.md` with the approved Phase 2A choices and their implementation constraints.
- [ ] Resolve content permissions, 3D asset source, performance release budgets, and production hostname/bindings.
- [ ] Reconfirm the content inventory: social URLs, email, employment copy, project URLs, and approved images.

## Phase 2A — Design direction and specification gate

- [x] Produce three complete overall art-direction proposals with visual, implementation, performance, and hero implications.
- [x] Evaluate hero composition, character presentation, camera behavior, intro trigger, mobile strategy, navigation, information hierarchy, project presentation, career presentation, typography, and restrained palette options.
- [x] Separate initial-experience, deferred-cinematic-runtime, and steady-state performance budgets.
- [x] Record contact/public-identity ambiguity and the exact user information required before copy is locked.
- [x] Select and approve the coherent `A1 B2 C2 D2 E3 F2 G1 H1 I1 J2 K1 L1` option set.
- [x] Move the approved choices and E3/F2/M constraints into `docs/SPEC.md` without closing unrelated open decisions.

The complete option package is [`docs/PHASE-2A-DESIGN-DIRECTIONS.md`](docs/PHASE-2A-DESIGN-DIRECTIONS.md). This phase does not implement UI, animation, WebGL, models, shaders, particles, post-processing, or new dependencies.

## Phase 2 — Establish the clean frontend boundary

- [x] Preserve `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`, `package.json` deployment scripts, lockfile, and `.github/workflows/`.
- [x] Migrate approved content into typed `src/content/` modules before deleting the legacy presentation.
- [x] Remove the legacy frontend modules and styles without deleting reusable public assets.
- [x] Create a server-first App Router structure with semantic HTML, typed content, accessible navigation, metadata, loading UI, and a static hero fallback.
- [x] Keep WebGL and motion out of this foundation phase.

## Phase 3 — Static portfolio foundation

- [x] Build a temporary semantic dark shell and responsive composition.
- [x] Implement Home, Work, About, Projects, and Contact foundation sections without WebGL.
- [x] Integrate reusable images through `next/image` with intrinsic dimensions, `sizes`, meaningful alt text, and priority only for the hero.
- [x] Keep unverified URLs out of rendered contact links while preserving candidates in content.

## Phase 2B — Polished static Ember Editorial implementation

- [x] Replace the temporary shell with the approved Ember Editorial HTML/CSS composition.
- [x] Implement the approved typography, spacing, project case-study rows, editorial career chapters, persistent minimal navigation, contact identity, and responsive behavior.
- [x] Build the complete static hero composition and designed cinematic fallback without Three.js, Motion, shaders, particles, post-processing, or background video.
- [x] Preserve server-rendered HTML, typed content, accessible controls, and omission of unresolved public profile fields.
- [x] Validate the rendered preview at 390×844, 768×1024, 1440×900, and 1920×1080, including reduced motion, keyboard skip navigation, overflow, images, and confirmed contact behavior.

Phase 3 DOM motion follows this completed static baseline. WebGL follows the motion phase.

## Phase 4 — Motion enhancement (after Phase 2B)

- [ ] Evaluate the `framer-motion` to `motion` migration; keep one animation system.
- [ ] Add meaningful transform/opacity motion, scroll and gesture behavior, and reduced-motion handling.

## Phase 4B — WebGL enhancement (after Motion)

- [ ] Prototype the hero with a placeholder GLB only after the hero specifications and budgets are locked.
- [ ] Add lighting, shader reveal, particles, and postprocessing incrementally with disposal and adaptive DPR/quality.
- [ ] Replace the placeholder with the approved optimized model only after the glTF pipeline validates it.
- [ ] Reduce runtime work after the intro and expose a static fallback for failure/weak/reduced-motion paths.

## Phase 5 — Quality gates

- [ ] Unit/type/lint/image validation and OpenNext build.
- [ ] Browser interaction, responsive screenshot, reduced-motion, WebGL-failure, and fallback coverage.
- [ ] Measure Core Web Vitals and bundle/runtime budgets on representative desktop and mobile devices.
- [ ] Run Cloudflare preview and validate asset delivery, bindings, routes, and Worker behavior.
- [ ] Validate production deploy only with the configured GitHub environment/secrets and confirmed hostname.

## Do not do in Phase 2B

- Do not implement Motion, Three.js, WebGL, shaders, particles, post-processing, smooth scrolling, or background video.
- Do not install visual runtime dependencies merely because they appear in the future brief.
- Do not delete reusable assets or deployment files.
- Do not treat this local preview as proof of WebGL, Cloudflare credential, or production readiness.
