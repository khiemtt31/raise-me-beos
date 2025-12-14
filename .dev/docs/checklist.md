# Raise Me Beos — Task Checklist 
📚⚙️⚛️💅🌏🛢🍪🤐🦀🧪🐞⚠️🚨🚀🔨💡🗑👷‍♂️🔒🏞🎞🔈📂📦

## 1. Product scope
- [ ] Define the MVP scope (amount presets, optional note, expiration time, statuses shown, retry/regenerate QR)
- [ ] Create a short donation flow spec (screens, states: idle → pending → success/fail/expired, error cases)
- [ ] Validate the “variants” requirement (QR for 10k/20k/50k/100k… with unique requestId + expireAt)
- [ ] Define all UI messages (pending/success/fail/expired) and exact trigger conditions

## 2. MoMo API learning + access
- [ ] Register for MoMo developer access (sandbox/credentials, docs, IPN/webhook options if any)
- [ ] Read MoMo docs and list required endpoints (create payment, query status, auth/signature)
- [ ] Decide integration strategy for “no backend” (direct browser calls vs thin proxy later if required)
- [ ] Build a minimal spike: create payment request + render QR successfully

## 3. Project setup (repo + workflow)
- [👷‍♂️] Initialize repo structure (single app/monorepo)
- [ ] Set up Git flow branches

## 4. UI (Next.js + shadcn/ui + theming)
- [ ] Create Next.js project and install shadcn/ui
- [ ] Implement theming (light/dark, brand colors, typography, component styling rules)
- [ ] Build donate page UI (amount buttons, optional custom amount, note input, generate button)
- [ ] Implement QR display (QR render, countdown timer, copy payment link)

## 5. Client app logic (payment + status)
- [ ] Implement “create payment” service module (request building, auth/signature, error handling)
- [ ] Implement “check status” service module (query by requestId, parse statuses)
- [ ] Add client state store (amount, requestId, expireAt, status, last error)
- [ ] Decide polling approach (interval, timeout, stop conditions, backoff)
- [ ] Implement status poller (start on pending, stop on success/fail/expired, handle network failures)
- [ ] Handle edge cases (double-click create, refresh mid-payment, expired QR, MoMo API downtime)

## 6. Dev database (Postgres in Docker) + schema-driven ORM
- [ ] Add Docker Compose for Postgres (dev) + db scripts (up/down/reset)
- [ ] Define schema for dev tracking (donation_intent table with status + timestamps)
- [ ] Add schema-driven ORM (choose one) and implement migrations
- [ ] Persist donation intents (insert on create, update on status change)
- [ ] Add dev-only admin view (list last N intents, filter by status) for debugging

## 7. Quality + observability
- [ ] Add basic logging/analytics events (created, pending, success, fail, expired)
- [ ] Write minimal tests (status mapping, poller stop conditions, timer expiration logic)

## 8. Documentation + handoff
- [ ] Create a runbook README (start app, start DB, env vars, common errors)

## 9. Security + future deployment prep
- [ ] Review secret handling (ensure MoMo credentials are not shipped to browser; adjust architecture if needed)
- [ ] Create deployment TODO list (hosting, env management, domain, HTTPS, webhook handling if needed later)
