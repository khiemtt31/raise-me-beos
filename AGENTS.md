<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Raise Me Beos agent rules

This repository is in Phase 2B of a greenfield portfolio rebuild. Phase 2A is locked, and the polished static Ember Editorial portfolio is authorized for implementation. Do not implement Motion, WebGL, the character runtime, shaders, particles, post-processing, or background video in this phase.

## Specification gate

Read `docs/SPEC.md` before substantial implementation. Treat `Locked Decisions` as immutable unless a new technical constraint makes one impossible. Record ordinary engineering choices in `Agent Decisions` and do not interrupt the user for them.

Do not ask about routine engineering details that can be determined through best practices. Decide independently on component names, folder organization, ordinary TypeScript APIs, minor spacing, lint fixes, standard accessibility, and obvious performance improvements.

Ask the user before choosing among materially different options that change visual identity, UX, information architecture, hero composition, animation direction, character presentation, camera composition, mobile experience, project presentation, major architecture, expensive dependencies, recurring paid services, or significant performance tradeoffs. Present 2–4 concrete options, explain each option and its performance/implementation implications, recommend one, and wait for the selection. Do not ask vague questions.

## Rebuild boundaries

- Preserve and audit `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`, `package.json` scripts, `package-lock.json`, `.github/workflows/`, environment/binding assumptions, deployment settings, production-domain assumptions, reusable content, and reusable assets before migration.
- Do not copy the legacy component architecture into V2. Build a clean App Router structure and migrate only validated content, assets, and infrastructure.
- Keep HTML content independent of WebGL. Treat Three.js as progressive enhancement with a static fallback for WebGL failure, model failure, weak devices, and reduced motion.
- Do not add GSAP, Lenis, physics, another UI framework, or another animation system without a documented need and specification approval.
- Keep the current no-background-video decision unless a replacement is demonstrated to be cheaper and the decision is recorded in `docs/DECISIONS.md`.
- Keep the current Phase 2B source boundary server-first: semantic HTML, typed content modules, CSS-first presentation, no animation runtime, and no WebGL.

## Validation and documentation

- Run `npm run lint`, `npm run typecheck`, `npm run verify:images`, and the relevant Next/OpenNext build after changes. Separate automated results from browser, WebGL, Cloudflare credential, preview, and production release gates.
- Update `README.md` and the relevant `docs/` inventory when capability, model, asset, deployment, or content contracts change.
- Preserve unrelated worktree changes and stage only intentional files.

Project-local operational skills live under `.codex/skills/`: `cinematic-webgl`, `gltf-pipeline`, `frontend-motion`, `performance-guardian`, `visual-qa`, `responsive-ui`, and `cloudflare-next`.
