# Manual security setup checklist

Updated: 2026-09-05. Unchecked items require your verification; none of these account settings were changed by the code update. Keep secrets out of this file, Git, screenshots, and chat.

## What the code now handles

- Contact bodies are limited to 32 KiB of actual bytes and five seconds of reading. Only JSON and URL-encoded forms are accepted; multipart is rejected. Fields must have the expected types and lengths.
- Contact requests require a matching `Origin`; explicit cross-site Fetch Metadata is rejected. Direct clients can forge origin headers, so this is browser protection, not bot authentication.
- `CONTACT_ATTEMPTS` allows three attempts per 60 seconds per client key. Attempts are counted before body parsing and never refunded on email failures. Missing client metadata shares an `unknown` bucket. Missing/broken limiter bindings fail closed with 503.
- Google fetches have ten-second deadlines and reject redirects. Quota outages return controlled JSON. Once Gmail sending starts, a failed response retains the quota slot to avoid treating a possibly delivered message as unsent. No automatic delivery retry is performed.
- Static pages and API responses have anti-framing, MIME-sniffing, referrer, and permissions protections. The static page has an enforced CSP allowing same-origin scripts plus the existing Google Fonts resources. Astro styles are emitted as external files.
- Common environment-file variants are ignored. CI and the deployment workflow run Worker type checking, security tests, and a high/critical dependency advisory gate before deployment.

**Remaining risks:** a persistent sender can still exhaust the shared five-message weekly quota; per-location throttling does not provide a strict global attempt cap. Turnstile is not implemented or enabled. There is no provider circuit breaker, durable request-ID deduplication, or reservation recovery workflow. Interrupted or uncertain sends may occupy slots until the next week. The honeypot remains supplementary and is omitted from the JavaScript payload to preserve existing autofill behavior. Review these limits before considering the contact endpoint fully hardened.

## Code destination map

Use this map when applying or reviewing each handling described in this checklist. A destination marked **manual** belongs in Cloudflare, Google, GitHub, or browser settings; it is not implemented by a source file.

| Security handling | Code destination | What to inspect or change |
| --- | --- | --- |
| Request byte cap and body-read timeout | [`src/worker.ts:1`](../src/worker.ts:1), [`src/worker.ts:279`](../src/worker.ts:279) | `MAX_BODY_BYTES`, `BODY_TIMEOUT_MS`, and `readBoundedBody()`; keep the actual stream-byte check and cancellation. |
| Accepted media types and payload shape | [`src/worker.ts:254`](../src/worker.ts:254) | `readContactPayload()`; keep the JSON/URL-encoded allowlist, duplicate-key rejection, object check, and field-name/type allowlist. |
| Origin and Fetch Metadata checks | [`src/worker.ts:110`](../src/worker.ts:110) | `handleContact()`; update the approved-origin policy here if the production hostname changes. |
| Per-client attempt throttling | [`src/worker.ts:120`](../src/worker.ts:120), [`wrangler.jsonc:9`](../wrangler.jsonc:9) | `CF-Connecting-IP` key and `CONTACT_ATTEMPTS` binding. Keep `X-Forwarded-For` out of the trust path. |
| Honeypot handling | [`src/components/Contact.astro:7`](../src/components/Contact.astro:7), [`src/worker.ts:131`](../src/worker.ts:131) | The `companyWebsite` field and server-side early 202 response. Decide deliberately before adding it to the JavaScript payload. |
| Contact field lengths and control characters | [`src/worker.ts:135`](../src/worker.ts:135), [`src/worker.ts:249`](../src/worker.ts:249) | `normalizedText()` and the required-field check; reject overlong values rather than silently truncating them. |
| Configured recipient validation | [`src/worker.ts:143`](../src/worker.ts:143) | Missing-secret check and `CONTACT_EMAIL` validation; do not accept visitor-controlled recipients. |
| Weekly delivery budget | [`src/worker.ts:151`](../src/worker.ts:151), [`src/worker.ts:37`](../src/worker.ts:37) | `useQuota()`, `WEEKLY_SEND_LIMIT`, and `ContactQuota`; preserve server-generated week keys and parameterized SQL. |
| Quota outage/error contract | [`src/worker.ts:178`](../src/worker.ts:178), [`src/worker.ts:92`](../src/worker.ts:92) | `useQuota()` validation and the Worker route's controlled 503 catch. |
| OAuth/Gmail timeout and redirect policy | [`src/worker.ts:193`](../src/worker.ts:193), [`src/worker.ts:235`](../src/worker.ts:235) | `getAccessToken()` and `sendGmailMessage()`; update `PROVIDER_TIMEOUT_MS` only with tests. |
| Ambiguous delivery accounting | [`src/worker.ts:157`](../src/worker.ts:157) | `sendStarted` branch; do not automatically refund/retry once Gmail may have accepted the message. |
| Email header and content safety | [`src/worker.ts:219`](../src/worker.ts:219), [`src/worker.ts:311`](../src/worker.ts:311) | `headerSafe()` and the plain-text MIME construction. Keep recipient/sender configuration-only. |
| API security headers | [`src/worker.ts:340`](../src/worker.ts:340) | `json()`; every API success and error response inherits these headers. |
| Static security headers and CSP | [`public/_headers:1`](../public/_headers:1) | Update allowed origins when adding third-party services; keep framing, object, base, form, and script restrictions. |
| External script/style output required by CSP | [`astro.config.mjs:5`](../astro.config.mjs:5), [`scripts/check-built-security.mjs:1`](../scripts/check-built-security.mjs:1) | Keep Astro styles/scripts external and retain the built-output assertion. |
| Client double-submit suppression | [`src/scripts/contact-form.ts:3`](../src/scripts/contact-form.ts:3), [`src/scripts/contact-form.ts:21`](../src/scripts/contact-form.ts:21) | `submitting` guard and disabled button; this is usability protection, not server authentication. |
| Safe browser status rendering | [`src/scripts/contact-form.ts:8`](../src/scripts/contact-form.ts:8) | `textContent`; never replace it with `innerHTML` for server messages. |
| Secret filename protection | [`.gitignore:17`](../.gitignore:17) | Keep `.env*` and `.dev.vars*` ignored, with only sanitized examples allowed. |
| Worker binding/type contract | [`tsconfig.worker.json:1`](../tsconfig.worker.json:1), [`src/worker.ts:14`](../src/worker.ts:14) | Generated Wrangler types and the `Env` binding selection. Rerun `wrangler types` after config changes. |
| Security regression coverage | [`tests/contact-security.test.mjs:1`](../tests/contact-security.test.mjs:1) | Extend tests for any change to validation, throttling, quota, providers, or headers. |
| CI/deployment security gates | [`package.json:10`](../package.json:10), [`.github/workflows/ci.yml:31`](../.github/workflows/ci.yml:31), [`.github/workflows/deploy.yml:39`](../.github/workflows/deploy.yml:39) | Keep typecheck, regression tests, audit, and build before deploy. Branch/environment protection remains manual. |
| WAF, DDoS, hostname, TLS, HSTS, Turnstile, alerts, and access review | **manual** — Cloudflare/Google/GitHub dashboards | Complete the checkboxes below; add any resulting hostname or third-party origin to the relevant code destination above. |

## 1. Cloudflare routing and abuse controls — before production rollout

- [ ] Inventory every hostname reaching this Worker: custom domains, `workers.dev`, and preview URLs. Record which ones should remain public.
- [ ] Disable unneeded `workers.dev` and preview routes, or protect them equivalently. Put the resulting settings in `wrangler.jsonc` so the next deploy does not undo the decision. Verify no alternate hostname bypasses custom-domain WAF rules. [Workers routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/).
- [ ] Check rate-limit namespace `1001` is appropriate and does not unintentionally share counters with another application in the account. If necessary, choose a unique numeric namespace ID in `wrangler.jsonc` before deployment.
- [ ] Verify `CONTACT_ATTEMPTS` appears in the deployed bindings with limit 3 / period 60. Repeat the binding configuration in any new Wrangler named environment; bindings are not automatically inherited.
- [ ] Check trusted client-IP behavior, including Pseudo IPv4 and any Worker/proxy in front of this Worker. The code uses `CF-Connecting-IP`, never `X-Forwarded-For`. An upstream Worker/service binding is a separate trust boundary and must not accept arbitrary visitor-supplied client metadata.
- [ ] In your zone's Security/WAF settings, configure a narrowly scoped rate rule for `POST /api/contact` using features available on your plan. Start conservatively and tune from legitimate traffic, particularly shared networks. Edge filtering should act before Worker execution.
- [ ] Verify applicable managed WAF/DDoS protections and inspect security events for this hostname. Avoid blanket country blocks or broad challenges without a measured reason.
- [ ] Confirm the homepage remains available when the contact endpoint is blocked or throttled. Keep an emergency edge rule ready to disable only `/api/contact` during abuse.

The Workers limiter is per-location and eventually consistent. It reduces bursts but is not a strict global budget or a complete DDoS defense. [Cloudflare rate-limit semantics](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

## 2. Bot verification — requires a follow-up code integration

- [ ] Create a managed Turnstile widget restricted to approved production hostnames; use separate testing/staging configuration.
- [ ] Store the secret as a Worker secret; the site key may be public. Never expose the verification secret through an Astro `PUBLIC_*` variable.
- [ ] Integrate the widget into `Contact.astro`, include the token in the browser payload, and extend the server's strict field allowlist. Validate with Siteverify before quota reservation or Google calls; require the expected hostname and action as well as success.
- [ ] Handle expired/replayed tokens, reset after submission, and fail closed on verification outages. Provide an accessible fallback when JavaScript or the widget is unavailable. No native-form bypass should skip verification.
- [ ] Update CSP with only the origins required by Turnstile and test the production build in a browser. Test autofill and keyboard behavior before changing the honeypot payload.
- [ ] Reassess the five-message weekly business budget after bot protection is working. Raising the cap alone does not prevent exhaustion.

Creating a widget in the dashboard does not protect the current endpoint by itself. Server verification and the frontend integration are still required. [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## 3. HTTPS and browser policy

- [ ] Verify HTTP redirects to HTTPS on every supported public hostname.
- [ ] Check current TLS settings and certificate health. Use an appropriate strict origin mode if an external origin is involved; this project otherwise serves Worker static assets.
- [ ] Review existing HSTS at the edge before adding or changing it. Start with a limited duration; enable `includeSubDomains` only when all subdomains support HTTPS. Do not preload without accepting its long-lived consequences.
- [ ] Inspect the actual deployed homepage and API responses for CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, referrer policy, and permissions policy. Edge transform rules must not weaken or conflict with them.
- [ ] Open the site in a browser and check the console for CSP violations. Verify fonts, navigation, reduced-motion behavior, keyboard controls, and contact submission. Try framing the staging site from a different local origin and confirm it is blocked.
- [ ] When adding third-party scripts, analytics, inline code, or fonts, review and test CSP deliberately. Avoid adding broad wildcards, `unsafe-inline`, or `unsafe-eval` to silence errors.

Static responses use `public/_headers`; API responses need their own Worker headers. [Cloudflare headers](https://developers.cloudflare.com/workers/static-assets/headers/).

## 4. Google and Cloudflare credentials

- [ ] Verify `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, and `CONTACT_EMAIL` exist on the intended Worker. Local `.dev.vars` does not configure production.
- [ ] Confirm the refresh token belongs to the intended Gmail sender and has the minimum required grant, normally `gmail.send`. Use a dedicated sender account if practical, and enable MFA on its administrative login.
- [ ] Verify `CONTACT_EMAIL` is one plain mailbox address, without display-name syntax or newlines; it is the fixed sender/recipient, not visitor input.
- [ ] Review the Cloudflare deploy token's resource scope and permissions. Avoid a global API key; limit access to the account and deployment resources required.
- [ ] Check old tokens, copied environment files, CI artifacts, and repository history with an approved secret scanner. If a credential was exposed, revoke/rotate it at its provider and update deployments; deleting its Git file does not revoke it.
- [ ] Keep local secret files out of backups/artifacts you share. Sanitized `.env.example` and `.dev.vars.example` are allowed by Git; never put real values in them.
- [ ] Review GitHub, Cloudflare, and Google account members; remove unused access and enable MFA/recovery controls.

Use the providers' secret-entry UI or an interactive secret prompt. Do not paste secret values into shell commands, PR descriptions, or this checklist.

## 5. GitHub production gates and supply chain

- [ ] Protect `main` with required CI checks and reviewed pull requests. Verify the configured check name matches the current workflow job.
- [ ] Set the `production` environment's allowed deployment branches and reviewer rules where supported. `workflow_dispatch` should not allow an unreviewed branch to obtain production secrets.
- [ ] Verify production secrets are environment-scoped and only available to the deploy job. Keep ordinary pull-request jobs unprivileged.
- [ ] Enable repository secret scanning/push protection where available, or configure an approved scanner in CI. This patch expands ignore rules but does not add a secret-scanning service.
- [ ] Pin GitHub actions to reviewed full commit SHAs and establish an update process. Existing action version tags remain unchanged by this patch.
- [ ] Enable dependency update notifications. Review updates and advisory scope rather than assuming a clean audit guarantees safe packages.

Both workflows now run the same security checks, and the deploy job runs them before its deploy step. Repository/environment protection settings still require manual configuration.

## 6. Staging, recovery, and monitoring

- [ ] Use an isolated staging Worker/quota store and test credentials. Do not use real email delivery for automated load tests.
- [ ] Run `pnpm test`, `pnpm typecheck:worker`, `pnpm build`, `pnpm audit --audit-level=high`, and `pnpm exec wrangler deploy --dry-run` before rollout.
- [ ] Verify the rate limiter locally and in staging. Test 400/403/408/413/415/429/503 paths without email calls. API clients must now send the matching `Origin`; missing origin is intentionally rejected.
- [ ] Make one controlled staging delivery to verify the actual OAuth/Gmail integration. Fault tests with mocks do not establish live credential health.
- [ ] Configure alerts for request spikes, repeated 502/503 responses, quota exhaustion, Durable Object errors, and unexpected usage. Review logs without collecting contact message bodies, full email addresses, or tokens.
- [ ] During uncertain delivery, check Gmail's sent messages and provider health before asking a visitor to resubmit. Do not reset the global quota blindly. Current code intentionally preserves all slots once a Gmail call has begun, including explicit Gmail failures.
- [ ] Plan durable reservation IDs/reconciliation and a provider circuit breaker as the next reliability change. Account for ambiguous delivery and interrupted execution; automatic expiry/refunds can re-enable duplicate sends.
- [ ] Record a rollback and emergency endpoint-disable procedure. Avoid rolling back to code that removes all abuse controls or resetting the Durable Object data.
- [ ] Record rollout evidence here using dates and non-secret observations only. A checklist mark should mean you checked the deployed behavior, not merely read the source.

## Verification record

Local code verification completed for this update: 12 regression tests passed; generated Worker type checking, Astro build, built-CSP compatibility check, and Wrangler deployment dry run passed. Dependency audit reported zero known advisories. Local Wrangler returned security headers on the homepage and API, and returned 400/400/400/429 for four malformed same-origin submissions. No email was sent. Browser execution, production settings, live Gmail delivery, and distributed rate-limit behavior remain unverified.

| Item | Owner/date | Non-secret evidence |
| --- | --- | --- |
| Hostnames / alternate-route protection | Pending | |
| Rate binding / edge rules | Pending | |
| Turnstile integration | Pending | |
| HTTPS / headers / browser checks | Pending | |
| Secret scopes / rotation review | Pending | |
| GitHub production protections | Pending | |
| Staging delivery / monitoring | Pending | |
