# Locked Decisions

Choices explicitly approved by the user. Do not change these silently.

- The Phase 1 audit/bootstrap checkpoint was documentation-only; Phase 2B now authorizes the polished static portfolio UI while Motion and the cinematic runtime remain deferred.
- The eventual frontend is a greenfield Next.js rebuild; do not copy or incrementally refactor the existing component architecture.
- Preserve Cloudflare Workers, OpenNext, Wrangler, bindings, required scripts, CI/CD, deployment assumptions, reusable content, and reusable assets before deletion.
- The eventual visual direction is very dark, cinematic, technically sophisticated, minimal when idle, and performance-conscious.
- The hero concept is a 3D character revealed by intermittent cinematic rim/strobe light, shader-driven ignition, a fiery reveal boundary, sparse embers, cinematic lighting, and a settled post-intro state.
- HTML content must remain independent of WebGL. WebGL is progressive enhancement.
- The site must remain usable when WebGL fails, the model fails, the device is weak, or reduced motion is enabled.
- The cinematic runtime must become cheaper after the introduction.
- Do not add GSAP, Lenis, physics engines, another UI framework, or another animation framework without demonstrated need and approval.

## Phase 2A locked design decisions

The following choices are approved for implementation planning and authorize the Phase 2B static implementation. They do not authorize Motion or the cinematic runtime in the same phase.

- A1 — Ember Editorial: use a dark, warm editorial system with generous negative space, restrained ember accents, hairline borders, and projects presented as evidence rather than dashboard cards.
- B2 — Three-quarter portrait/bust: frame the hero as an offset three-quarter character portrait with room for editorial copy and responsive cropping.
- C2 — Stylized realistic character: use a recognizable but authored character treatment that supports cinematic lighting while reducing uncanny-valley, asset-production, and runtime risk.
- D2 — Micro-motion camera: use bounded, damped camera movement for depth and life, with no free orbit and a static/reduced-motion baseline.
- E3 — Hybrid intro trigger: on the first qualifying visit, play the complete cinematic introduction once assets are ready without blocking readable HTML; on repeat visits, use a substantially shortened reveal or begin near the settled hero state, with an intentional replay control added later.
- E3 accessibility and persistence constraints: `prefers-reduced-motion` bypasses flashes, major camera movement, and the full ignition sequence; first-visit/repeat behavior must not require a server dependency, while the exact persistence mechanism remains an Agent Decision during implementation.
- F2 — Cinematic-lite realtime: capable mobile devices may receive the reduced realtime experience; weak or poorly performing runtimes dynamically lower quality; reduced-motion, unavailable WebGL, and severe performance limitations use a designed static cinematic fallback. Capability/runtime behavior, not viewport width alone, decides the mode.
- G1 — Persistent minimal top navigation: keep explicit navigation available in a quiet, compact top bar that remains discoverable on desktop and mobile.
- H1 — One long-form portfolio page: organize the first polished release as a coherent page containing Hero, Selected Work, Career/Experience, About/Profile, Technical Identity, Personal Interests, and Contact.
- I1 — Editorial case-study rows: present selected projects as large, readable rows with dominant proof imagery, concise context, and a future-compatible path to detail routes.
- J2 — Editorial experience chapters: present career history as authored chronological chapters rather than an interaction-heavy timeline.
- K1 — Literary display plus technical grotesk: use Jacques Francois for selected display statements and Space Grotesk for body, interface, metadata, and technical evidence, subject to loading and contrast validation.
- L1 — Obsidian / Ember: use near-black obsidian, warm bone text, quiet graphite borders, muted brass accents, and reserve hot/ember colors for the ignition language.
- M — Public identity: use `Khiem Hanzo Tran`, `Software Engineer · Full-stack Developer`, and `hanzo.work.vnn@gmail.com` as the confirmed public identity. GitHub, LinkedIn, broad location, and availability/status remain unresolved and must be omitted until supplied; never invent placeholder URLs or personal details, and never expose private phone numbers or exact addresses.

# Agent Decisions

- Use the existing App Router and OpenNext/Wrangler delivery spine until a concrete incompatibility is found.
- Keep deployment configuration in the repository and validate it through `npm run build:cloudflare`; do not assume a successful local build proves a credentialed or production deploy.
- Use a server-first HTML composition with narrowly scoped client islands for navigation, motion, and WebGL.
- Keep content typed and separate from visual components.
- Use native CSS/HTML fallback paths before adding expensive client dependencies.
- Treat `docs/CONTENT.md` as the source for content migration questions and `docs/DECISIONS.md` as the record of architectural audit choices.
- Phase 1 uses `src/content/` for typed, server-owned content modules and CSS-only semantic presentation components.
- Phase 1 keeps the root page server-rendered and defers WebGL, Motion, Playwright, glTF tooling, and final visual identity implementation.
- Phase 1 retains Tailwind/PostCSS and the existing OpenNext/Wrangler configuration while removing dependencies that only supported deleted legacy presentation code.
- Phase 2A's complete visual option set and rationale live in [`docs/PHASE-2A-DESIGN-DIRECTIONS.md`](./PHASE-2A-DESIGN-DIRECTIONS.md); the approved selections above are the source of truth for later implementation planning.
- Phase 2A is complete as a documentation gate; Phase 2B is the approved static implementation step and does not authorize Motion or WebGL in the same phase.
- Phase 2B keeps the root route server-rendered with no Client Components. CSS, semantic HTML, typed content, existing Fontsource fonts, and `next/image` provide the complete static experience.
- `public/images/homepage/HeroPrimary.png` is the approved static hero portrait reference. The unrelated `public/images/portfolio/contact-model.png` asset is not used in the polished contact section.
- The polished contact section renders only the confirmed name, title, and email; unresolved GitHub, LinkedIn, location, availability/status, resume, and project URLs are omitted.
- Same-page navigation uses native anchors, and the page order is Hero, Selected Work, Experience, About/Profile, Contact, and Footer.

# Open Decisions

These require the Specification Gate before the corresponding implementation begins.

1. 3D asset source and budget: supplied model, commissioned model, or procedural/stylized placeholder; include maximum GLB, texture, triangle, and initial-load budgets.
2. Performance release budgets: target device/browser matrix, LCP/INP/CLS thresholds, initial JS budget, hero GLB budget, and acceptable fallback threshold.
3. Remaining public identity and content permissions: GitHub, LinkedIn, broad location, availability/status, resume availability, public project URLs, employment wording, and whether current employer/client names may be published.
4. Production hostname and Cloudflare bindings: confirm custom domain/routes, environment names, and whether `IMAGES` is required or can be removed. This remains open and non-blocking for Phase 2B.

Detailed alternatives and consequences for the locked choices and remaining gates are recorded in [`docs/PHASE-2A-DESIGN-DIRECTIONS.md`](./PHASE-2A-DESIGN-DIRECTIONS.md).
