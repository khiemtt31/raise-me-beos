# Setup

## Requirements

- Node.js 20 or newer.
- A payment service environment for the server.

## Root app

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run verify`
- `npm run preview`
- `npm run deploy`
- `npm run upload`
- `npm run cf-typegen`

## Server

- `cd server`
- `npm install`
- `npm run dev`
- `npm run start`
- `npm run build`
- `npm run test`
- `npm run verify`
- `npm run lint`

The server runs as a Hono worker entrypoint via `server/wrangler.toml` and `server/app.ts`.

## Environment

- Front-end: `NEXT_PUBLIC_PAYMENT_SERVICE_URL`
- Server: PayOS and Supabase values from `server/.env.example`
- Server: PayOS and Supabase values from `server/.env.example` or Wrangler vars for worker runs
- Keep secrets out of docs and source control.

## Verification

- Use `npm run verify` as the baseline smoke check.
- Use `npm run lint` separately for code-quality issues.
- The server now uses Vitest for unit tests and Wrangler for worker runtime parity.
