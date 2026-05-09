# Quality

## Verification standard

- Run `npm run verify` after edits.
- Run lint after edits.
- Run build after edits if you need to isolate failures.
- Manually smoke the affected user flow when the change is runnable.

## Current notes

- The server keeps a Vitest unit-test harness under `server/test`.
- Use the root/server `verify` scripts as the maintained smoke-check path.
- The payment service uses SSE and an in-memory client registry, so it is effectively single-instance unless that changes later.
- Keep `.env` files local; use `server/.env.example` as the template.

## Common cleanup targets

- Dead redirect routes.
- Commented-out test scaffolding.
- Debug-only logging that is no longer needed.
