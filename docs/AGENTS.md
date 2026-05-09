# Agent Guide

This repository is a Next.js front-end plus a separate Hono payment service. If you are an AI agent working here, read this file first and then follow the linked docs below.

## Source of truth

- `README.md` is the human entry point.
- `docs/README.md` is the docs index.
- `docs/architecture.md` explains the repo map and runtime flow.
- `docs/setup.md` explains local setup and scripts.
- `docs/conventions.md` explains code and UI conventions.
- `docs/quality.md` explains verification and current gaps.
- `docs/DESIGN.md` is the visual design system.
- `.claude/settings.local.json` defines the allowed command surface for this repo.
- `.sisyphus/` stores loop/session notes and other working artifacts.

## Operating loop

1. Read `README.md` and this guide first.
2. Read `docs/architecture.md`, `docs/conventions.md`, and `docs/setup.md` for the task shape.
3. Check `.claude/settings.local.json` before using commands or external fetches.
4. Inspect the current code paths before editing.
5. For multi-step work, keep a short task list and update it as you go.
6. Make the smallest change that matches the documented intent.
7. Verify with lint/build/manual smoke checks when the change is runnable.
8. Remove dead code only after confirming there are no live references.
9. Update docs whenever the repo structure, contracts, or conventions change.

## Working roles

- Planner: map impact, identify references, and keep the edit surface small.
- Implementer: make surgical changes that match the existing code style.
- Verifier: run lint/build/manual smoke checks after edits.
- Cleaner: remove only dead or clearly redundant code.
- Documenter: keep docs and code aligned when structure changes.

## Repo map

- `app/` — Next.js app router pages, app-level components, and client services.
- `components/` — shared layout and UI primitives.
- `lib/` — shared helpers and configuration.
- `constants/` — static app constants.
- `skeleton-data/` — content and copy models used by the UI.
- `server/` — standalone Hono payment service.
- `messages/` — locale bundles for `next-intl`.
- `public/` — static assets.
- `docs/` — architecture, setup, conventions, quality, and design docs.

## Rules of work

- Update docs first when you change structure or responsibilities.
- Keep page composition centered on `PageShell` and `PageContainer`.
- Keep visual work aligned with `docs/DESIGN.md`.
- Keep API contracts in sync between `app/services/api.ts` and `server/routes/*`.
- Do not leave test scaffolding, demo routes, or dead redirects in place unless they are intentionally documented.
- Remove code only after confirming there are no live references.

## Commands

- Root: `npm install`, `npm run dev`, `npm run build`, `npm run lint`, `npm run verify`, `npm run preview`, `npm run deploy`, `npm run upload`, `npm run cf-typegen`.
- Server: `npm install`, `npm run dev`, `npm run start`, `npm run build`, `npm run test`, `npm run verify`, `npm run lint`.

## Runtime notes

- The frontend expects `NEXT_PUBLIC_PAYMENT_SERVICE_URL` when it talks to the payment service.
- The server expects PayOS and Supabase environment values from `server/.env.example`.
- If you change allowed automation, update `.claude/settings.local.json` before depending on it.
