# Architecture

## Overview

The repo is split into a Next.js front-end and a separate Hono payment service. Shared content, helpers, and types live in top-level folders so the two sides stay in sync without duplicating contracts.

## Front-end

- `app/layout.tsx` — root layout, metadata, locale provider, and app shell.
- `app/page.tsx` — home/portfolio page.
- `app/donate/page.tsx` — donation flow page.
- `app/_components/*` — page-specific UI pieces.
- `app/services/api.ts` — browser API wrapper for payments, SSE, health, and donation history.
- `app/services/queries.ts` — React Query hooks plus polling/SSE orchestration.
- `components/layout/*` — shared page wrappers such as `PageShell` and `PageContainer`.
- `components/ui/*` — reusable UI primitives built with Radix + `cva`.
- `lib/utils.ts` — shared `cn()` helper.
- `lib/donation-config.ts` — donation bounds shared across the app.
- `skeleton-data/portfolio.ts` — content and copy builders used by the UI.
- `messages/*` — locale bundles for `next-intl`.

## Backend

- `server/app.ts` — exported Hono app, middleware, and route registration.
- `server/routes/payment.ts` — create/check/cancel payment routes.
- `server/routes/webhook.ts` — PayOS webhook handling.
- `server/routes/sse.ts` — server-sent events broadcast layer.
- `server/routes/donations.ts` — donation history endpoint.
- `server/services/payos.ts` — fetch-based PayOS client wrapper and webhook verification.
- `server/services/supabase.ts` — lazily created Supabase client.
- `server/utils/runtime-env.ts` — runtime/env helpers for worker and test contexts.
- `server/utils/*` — server-side helpers and constants.

## Shared flow

1. The browser creates a payment through `app/services/api.ts`.
2. The Hono server creates the PayOS request and stores donation state.
3. The browser subscribes to SSE or polls status until the payment settles.
4. PayOS webhook callbacks update the stored donation and broadcast the final status.

## Shared contracts

- `types/api.d.ts` — DTOs shared by the front-end service layer.
- `public/` — static assets used by the UI.
- `components.json` — UI tooling metadata.
