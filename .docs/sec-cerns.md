# Website security concerns and coding plan

Review date: 2026-09-05. Source baseline: `a7420b6`.

## Implementation update — 2026-09-05

The assessment below records the original baseline; its line references and original test outcomes are historical. A subsequent code update adds bounded body parsing and read deadlines, strict payload validation, per-client attempt throttling, required same-origin requests, provider deadlines/redirect rejection, controlled quota errors, conservative accounting after Gmail starts, security headers/CSP, broader secret ignore rules, duplicate-submit suppression in the browser, and CI/deploy security checks. It also replaces handwritten platform types with generated binding/runtime types.

SEC-02's unbounded input path is fixed. SEC-03/04/05/07/08 are improved; deployment and browser verification still matter. SEC-01 remains possible for a persistent or distributed sender, and SEC-06's honeypot limitation remains. Turnstile, global attempt controls, reservation IDs/recovery, circuit breaking, action SHA pinning, and secret scanning are not implemented in this update. See [sec-manual.md](sec-manual.md) for the manual checklist and explicit remaining work.

New regression tests live in `tests/contact-security.test.mjs`; they use actual SQLite in Node and mocked platform/provider bindings. They do not certify Cloudflare concurrency, production WAF coverage, or live Gmail delivery.

## Assessment

The main confirmed risk is **denial of service against the contact form**. A single sender can consume the entire site's five-message weekly allowance. Requests also reach body parsing and a shared Durable Object without an application request-rate limit. During email-provider failures, refunded reservations allow repeated outbound attempts.

**No directly exploitable XSS, SQL injection, SSRF, command execution, or arbitrary-recipient email relay was identified in the reviewed source.** This is a scoped code assessment, not proof that the deployed website is immune to attacks.

This change adds documentation only. No application code, Cloudflare configuration, credentials, or deployments were changed.

## Scope and verification limits

Reviewed the Worker, both browser scripts, Astro page/components, asset and stylesheet references, deployment configuration, package manifest/lockfile, Git ignore rules, and both GitHub workflows. Source references below are relative to this document; line numbers describe the review baseline.

Performed a dependency advisory audit and bounded local handler checks using the actual exported Worker and `ContactQuota` class, an in-memory SQL stand-in, and mocked Google responses. No production requests, email delivery, credential inspection, load testing, browser execution, or Cloudflare account inspection were performed. The stand-in does not validate real Durable Object persistence, concurrency, or platform limits. No full Git-history secret scan was performed. A build was unnecessary for this documentation-only change and was not run.

Cloudflare WAF rules, DNS/proxy settings, TLS settings, alternate hostnames, account permissions, deployed headers, billing limits, Google OAuth scopes, and actual delivery health remain **unverified**. Historical deployment or OAuth results are not evidence of today's production state.

## Architecture and trust boundaries

| Surface | Current behavior | Security implication |
| --- | --- | --- |
| Static page and assets | Astro output in `dist`; asset-first routing except `/api/*` | Small dynamic attack surface; ordinary assets avoid contact-handler work. |
| `POST /api/contact` | Public JSON, URL-encoded, and multipart input | Any external client can attempt submission; browser validation is bypassable. |
| `ContactQuota` | One named Durable Object, keyed internally by current week | All visitors share one budget and one coordination point. |
| Google OAuth and Gmail | Worker refreshes a token and sends to configured `CONTACT_EMAIL` | Credentials stay server-side; delivery introduces external availability and abuse costs. |
| Browser status and navigation | `textContent` and fixed hash-to-view mapping | No observed attacker-controlled HTML execution sink. |
| Build/deploy | GitHub Actions installs locked packages and deploys on `main` | Repository and dependency integrity can affect the entire website. |

Request path: client → Worker method/origin checks → full body parsing → honeypot → field normalization → configuration check → global quota reservation → OAuth → Gmail → success or reservation release.

## Existing protections to preserve

- **XSS-resistant rendering:** [contact-form.ts](../src/scripts/contact-form.ts), lines 7–15, writes status with `textContent`; [page-state.ts](../src/scripts/page-state.ts), lines 14–19, maps the hash to fixed values. No `innerHTML`, `set:html`, `eval`, or `document.write` sink was found. OWASP identifies text-only DOM sinks as the appropriate defense for this context. [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).
- **Server validation:** [worker.ts](../src/worker.ts), lines 139–145 and 239–269, checks field types, requires nonempty values, validates basic email shape, removes control characters, and limits the strings used for delivery. These limits do not bound the incoming body.
- **Email header protection:** lines 211–225 and 263–265 remove CR/LF from user-controlled header fields. The body is explicitly plain text. Sender and recipient come from server configuration; the visitor supplies only `Reply-To` and content.
- **Parameterized SQL:** lines 76–103 bind the week value instead of concatenating it. The public handler generates the week server-side. No public route exposes quota `reserve`/`release` directly.
- **Method and origin checks:** lines 123–130 reject non-POST requests and explicitly mismatched origins. JSON responses use `application/json` and `Cache-Control: no-store` at lines 292–300; no permissive CORS response is present.
- **Delivery budget and honeypot:** successful sends are capped at five per week; a supplied nonempty `companyWebsite` returns a harmless 202 before quota/provider work. Their limitations are detailed below.
- **Secret separation and CI:** Google credentials are read from Worker bindings, not frontend code. Current tracked filenames contain no `.env*`, `.dev.vars*`, `.pem`, or `.key` files. CI uses read-only repository permissions and frozen-lockfile installs; observability is enabled. These observations do not certify secret history or external account settings.

## Findings and remediation

Severity reflects this portfolio's impact and exploit preconditions, not a formal CVSS score. “High” here means easy loss of a core feature or credible resource-abuse exposure; it does not imply server takeover.

### SEC-01 — High: one visitor can exhaust the shared weekly contact quota

**Evidence:** [worker.ts](../src/worker.ts), lines 1, 155–158, and 174–181. Every request uses `idFromName('portfolio-contact-weekly')`; there is no visitor-specific allowance or verified bot token.

**Scenario and impact:** assuming email delivery works, five otherwise valid unwanted messages consume every available send. Legitimate visitors receive 429 until the next Monday in `Asia/Ho_Chi_Minh`. One sender is sufficient; this is application-level denial of service, without needing a distributed flood. It blocks contact delivery, not necessarily the homepage.

**Local evidence:** six sequential submissions with no `Origin` returned `200, 200, 200, 200, 200, 429`, with ten mocked Google calls and six quota calls.

**Next code:** add per-client attempt throttling and server-verified bot checks before global reservation. Retain a global budget as a final cost guard. Reconsider whether five weekly messages is adequate after abuse controls exist; merely increasing the number moves the exhaustion threshold. Never treat a submitted email address as a verified identity or the sole limiter key.

### SEC-02 — High: request bodies are fully parsed before any byte limit

**Evidence:** [worker.ts](../src/worker.ts), lines 132, 239–255. `request.json()` and `request.formData()` consume the body before string truncation. Multipart files, unknown fields, and oversized input are parsed even though the site has no upload feature.

**Scenario and impact:** repeated oversized requests can consume parsing memory/CPU before quota rejection. Cloudflare imposes platform limits, but those do not establish a suitably small application limit. Sustained or distributed traffic could degrade availability or increase usage; an actual outage was not demonstrated.

**Local evidence:** a JSON payload containing a 64 KiB message returned 200 and made two mocked provider calls; the message was truncated rather than rejected. This was a small functional check, not a memory-exhaustion test.

**Next code:** use a bounded stream reader, cancel when the byte cap is exceeded, and return 413 before parsing. Check `Content-Length` for early rejection but count actual bytes even when it is absent or misleading. Start with a proposed **32 KiB total encoded body cap**, validate against Unicode and URL-encoding boundaries, and tune if necessary. Accept JSON and URL-encoded forms only if preserving native form submission; reject multipart with 415. Match normalized media types exactly. Reject invalid object shapes and overlong fields rather than silently truncating them. Browser `maxlength` remains a usability feature.

### SEC-03 — Medium: no request-attempt limit; failures repeatedly reach Google

**Evidence:** [worker.ts](../src/worker.ts), lines 155–181, 187–203, and 227–236. Only the delivery quota limits requests; failures release it. No rate-limiter binding or bot verifier appears in [wrangler.jsonc](../wrangler.jsonc).

**Scenario and impact:** during an OAuth or Gmail failure, unwanted submissions can repeatedly invoke the quota object, provider, and error logs. Even after successful-send quota exhaustion, requests still incur parsing and quota reads. A distributed attack can concentrate traffic on the single quota object. Missing configuration short-circuits before provider work, so the provider-failure scenario assumes credentials are present.

**Local evidence:** seven sequential simulated OAuth failures all returned 502, made seven outbound attempts and fourteen quota calls, and left the stored count at zero.

**Next code:** count attempts independently of delivery outcomes and never refund the abuse counter. Apply edge limits where available and a Worker limiter before parsing. Use trusted Cloudflare client metadata, not arbitrary `X-Forwarded-For`; define behavior when metadata is absent in local/test environments. Use a short-lived keyed hash if retaining IP-derived identifiers. Shared networks and IPv6 rotation require tuning. Add a provider failure circuit breaker and bounded logging.

The Workers rate-limiting binding uses per-location, eventually consistent counters; it is appropriate for throttling but cannot replace a strict global budget. [Cloudflare rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

### SEC-04 — Medium: provider waits and quota reservations lack recovery state

**Evidence:** [worker.ts](../src/worker.ts), lines 155–170 and 187–236. Outbound fetches have no application deadline. Reservations have no ID, expiry, delivery status, or duplicate-submission identity. Initial quota acquisition is outside the delivery try/catch.

**Scenario and impact:** interrupted execution after reservation, or a failed release, can consume a slot for the remainder of the week. A provider may accept a message before its response is lost; refunding and resubmitting can then duplicate delivery. Slow upstream calls prolong occupied reservations. A quota exception can escape the normal JSON error contract. These are failure-mode risks inferred from source, not reproduced provider incidents.

**Next code:** add bounded provider deadlines and controlled 503 handling for quota failures. Model reservations by request ID with pending/sent/failed/unknown states and bounded recovery. Release only on known non-delivery; ambiguous send outcomes need conservative accounting and reconciliation. An expired lease alone must not authorize a duplicate send. Add short-lived duplicate-submission protection. Do not automatically retry Gmail sends after ambiguous failures or promise exactly-once delivery without provider support.

No quota oversubscription race is claimed: the current select/check/update section contains synchronous SQL and no intervening `await`. Cloudflare documents synchronous SQLite operations as non-yielding. Validate the redesigned state transitions in the real runtime. [Durable Object state](https://developers.cloudflare.com/durable-objects/api/state/).

### SEC-05 — Medium hardening gap: browser security headers are not defined in source

**Evidence:** [index.astro](../src/pages/index.astro), lines 13–29; [worker.ts](../src/worker.ts), lines 292–300; no tracked `public/_headers` file. No repository-defined CSP, anti-framing policy, `nosniff`, referrer policy, or permissions policy was found. Deployed edge headers were not inspected.

**Impact:** if production also lacks these controls, the page can be framed and has less containment for a future script injection. Missing CSP is not evidence of an existing XSS exploit. Clickjacking impact is limited by the site's lack of authenticated or financial actions, but unwanted contact submissions remain possible.

**Next code:** add static response headers through `public/_headers` and API headers through Worker responses, including error paths. Static asset headers do not automatically decorate Worker-generated responses. [Cloudflare static headers](https://developers.cloudflare.com/workers/static-assets/headers/).

Start CSP in report-only mode, inspect the generated HTML, then enforce. Proposed directives: `default-src 'self'`, `base-uri 'none'`, `object-src 'none'`, `frame-ancestors 'none'`, and `form-action 'self'`; restrict scripts, styles, fonts, images, and connections to actual dependencies. Current Google Fonts need explicit style/font allowances or self-hosting. A future Turnstile integration needs its documented origins. Handle any generated inline assets with hashes or external files; do not automatically add `unsafe-inline` or `unsafe-eval`.

Also add `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a permissions policy disabling unused camera/microphone/geolocation. Verify HTTPS redirects and existing HSTS at the edge before choosing HSTS settings; do not include subdomains or preload without checking their readiness. [OWASP HTTP headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

### SEC-06 — Low: honeypot coverage is incomplete and origin checks do not stop bots

**Evidence:** [Contact.astro](../src/components/Contact.astro), lines 7–10; [contact-form.ts](../src/scripts/contact-form.ts), lines 22–27; [worker.ts](../src/worker.ts), lines 127–136. The browser JSON payload omits `companyWebsite`, so the normal JavaScript path never transmits a filled trap. Missing `Origin` is accepted; non-browser clients can also supply a matching origin.

**Impact:** the trap catches only clients that submit it directly, including native form submissions. The origin check helps reject cross-site browser submissions, but it is not authentication or bot protection. No cookie-authenticated action exists, so this is chiefly public endpoint abuse rather than classic authenticated CSRF.

**Next code:** use server-side bot verification as the primary control. If keeping the honeypot, deliberately test whether to transmit it in the JSON path, including browser/password-manager autofill and accessibility behavior; do not blindly reintroduce false-positive blocking. Define an allowed host/origin policy and treatment of missing origin. Fetch Metadata can supplement browser checks but cannot authenticate a direct client.

### SEC-07 — Medium preventive gap: secret-file variants are not ignored

**Evidence:** [.gitignore](../.gitignore), lines 17–19 and 30, ignores `.env`, `.env.production`, and `.dev.vars` only. `git check-ignore` confirmed `.env.local`, `.env.development`, and `.dev.vars.production` are not covered in this checkout. No matching secret files are currently tracked by filename.

**Impact:** a future developer can accidentally commit environment-specific credentials. This finding identifies an exposure path, not a confirmed credential leak. Actual tokens, account grants, rotation history, and repository history were not audited.

**Next code:** ignore `.env*` and `.dev.vars*` with explicit exceptions for sanitized example files. Add secret scanning to development/CI. Separately verify least-privilege Google grants and Cloudflare deployment-token scope. Rotate/revoke credentials if exposure is confirmed; deleting a file or adding an ignore rule does not revoke a credential.

### SEC-08 — Low: deployment checks and dependency controls need strengthening

**Evidence:** [.github/workflows/ci.yml](../.github/workflows/ci.yml), lines 14–32, runs only install/build. [deploy.yml](../.github/workflows/deploy.yml), lines 16–43, is independent of CI and uses version-tagged actions. A production environment is named, but its protection rules are not visible in source.

**Impact:** security regressions in the Worker need not fail an Astro build. Deployment can proceed independently of future security-test failures unless required checks or workflow dependencies enforce them. Mutable action tags leave an avoidable supply-chain risk.

**Next code:** add focused Worker tests, explicit type checking with generated platform types, an advisory audit, and secret scanning; require these checks before production deployment. Pin actions to reviewed full commit SHAs with an update process. Verify branch and environment protections externally. Keep frozen-lockfile installs and read-only workflow permissions.

**Audit result:** `pnpm audit --json` exited 0 and reported zero known vulnerabilities in all severity categories for the current dependency resolution. The lockfile resolves Astro 7.2.4 and Wrangler 4.125.0. This is an advisory snapshot, not proof against undisclosed vulnerabilities or malicious updates. No dependency upgrade is proposed solely on this result.

## Other attack classes assessed

| Attack | Assessment and remaining boundary |
| --- | --- |
| Reflected/stored/DOM XSS | No current input-to-executable-HTML path identified. Messages become plain-text email; status uses `textContent`; hash navigation is allowlisted. Reassess if adding rich HTML, Markdown rendering, or an inbox UI. |
| SQL injection | Bound parameters and server-generated week values protect the current SQL path. Keep that boundary when extending storage. |
| SSRF | Provider destinations are fixed; visitor input is not fetched as a URL. Reassess if adding URL previews, webhooks, or remote attachments. |
| Command injection / RCE | No shell execution, dynamic evaluation, or uploaded executable content in the application path. Build-system compromise remains a separate risk. |
| Email injection / open relay | CR/LF stripping and fixed recipient prevent the obvious header/recipient abuse paths. The claimed sender email is unverified; malicious links and impersonation inside plain-text messages remain possible. |
| Path traversal / arbitrary upload | No custom filesystem path resolution or file storage endpoint. Multipart acceptance is unnecessary parsing exposure, not a demonstrated file-write exploit. |
| Open redirect | No user-controlled server redirect. Browser history navigation stays on fixed views/current origin. |
| Session theft / IDOR | No application login, sessions, user-owned records, or authorization endpoints in scope. External Google/GitHub/Cloudflare account security was not reviewed. |
| Cache poisoning / data leakage | API responses are `no-store` and do not echo submitted content. No application cache manipulation was found; deployed cache rules and responses remain unverified. |
| Volumetric DDoS | Cloudflare supplies network/application DDoS mitigation, but source cannot establish this deployment's effective protection or resistance to business-logic abuse. A low-volume quota attack can still deny contact delivery. [Cloudflare DDoS protection](https://developers.cloudflare.com/ddos-protection/). |

## Prioritized next coding steps

All values below are initial proposals for staging, not limits already implemented or guarantees against abuse.

### Phase 1 — Bound requests and stop automated submissions

**Files:** `src/worker.ts`, `src/components/Contact.astro`, `src/scripts/contact-form.ts`, `wrangler.jsonc`; add focused validation/security helpers if they keep the Worker understandable.

1. Apply method, approved-host/origin, media-type, and per-client attempt checks before body parsing. Start with a tunable limit such as five attempts per minute per client; account for shared IPs and distributed bypasses. Add edge filtering to reject unwanted traffic before Worker execution where available.
2. Implement the bounded 32 KiB reader, strict payload/field validation, explicit 400/413/415 responses, and rejection of multipart input. Preserve URL-encoded support if native form submission is retained.
3. Add Turnstile to the form and validate its token on the server **before quota reservation or Google calls**. Require success and the expected hostname/action; handle expired/replayed tokens and reset the widget after submission. Verification outages must not silently allow sending. Keep the verification secret server-side. [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
4. Keep an independent attempt counter and the final global send budget. Return stable JSON with `Retry-After` where a retry time is known. Do not create a client-controlled bypass for native/no-JavaScript submissions; provide a clear fallback if verification requires JavaScript.

**Done when:** invalid, oversized, throttled, and unverified requests cause zero quota reservations and zero Google calls; valid verified input can send; rejected browser submissions display a useful error.

### Phase 2 — Recover safely from provider and quota failures

**Files:** `src/worker.ts`, quota/storage implementation, platform integration tests.

1. Add configurable deadlines, initially around ten seconds per provider operation with an overall request budget, plus a circuit breaker for repeated provider failures.
2. Add request IDs, idempotent reservation transitions, pending-state recovery, and conservative handling of ambiguous send outcomes. Keep the business allowance configurable and document its timezone/reset behavior.
3. Catch quota failures and return a controlled 503; retain failure attribution internally without returning stack traces, tokens, or provider response bodies.
4. Emit structured counters for validation rejection, throttling, verification failure, quota denial, provider failure, latency, and reservation recovery. Exclude message bodies, email addresses, and secrets; minimize and expire any client identifiers.

**Done when:** fault-injection tests cover provider rejection, timeout before/after possible delivery, quota failure, failed release, duplicate submissions, and worker interruption/recovery. Persistent accounting remains conservative and cannot be decremented twice by duplicate release operations.

### Phase 3 — Add browser and repository defenses

**Files:** new `public/_headers`, `src/worker.ts`, `.gitignore`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`; optional dependency-update configuration.

1. Add and validate the header policy from SEC-05 across static and API responses, including failures. Inspect built output before enforcing CSP.
2. Expand ignored secret patterns and add sanitized examples only where useful.
3. Add security tests, explicit Worker type checking, advisory and secret scans, pinned actions, and a deployment dependency on required checks.

**Done when:** production-like browser checks show no unexpected CSP violations; framing is blocked; navigation, fonts, and contact submission still work; deliberate security-test failures block deployment.

### Phase 4 — Verify deployment controls and monitor rollout

This phase needs account/deployment inspection; these are not confirmed findings about current settings.

- Inventory custom domains, `workers.dev`, and preview URLs. Disable unneeded alternate entry points or protect them equivalently; verify an alternate hostname cannot avoid controls applied only to the custom domain. Cloudflare documents configuration for the `workers.dev` route. [Workers routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/).
- Verify applicable WAF/rate rules, DDoS settings, HTTPS redirects, HSTS, deployment-token permissions, Google scopes, branch protections, and production-environment restrictions. Record only non-secret evidence.
- Configure alerts for contact failures, quota exhaustion, request spikes, Durable Object errors, and usage. Establish an emergency contact-endpoint disable control that preserves static pages, plus a recovery procedure.
- Deploy to staging first. Use bounded traffic with mocked email delivery to tune limits and shared-network behavior. Roll out headers in report-only mode before enforcement. A rollback must not reset quota state or silently remove all abuse controls.

## Regression checks to implement

| Check | Expected result after hardening |
| --- | --- |
| Valid JSON and supported native form input | Expected success; one reservation and one delivery per accepted submission. |
| Missing/invalid fields, arrays, primitives, malformed JSON | Controlled 400; no quota or provider side effects. |
| Body above cap, missing/incorrect length, multibyte boundary | Controlled 413 based on actual bytes; parsing stops at the bound. |
| Multipart/file part or unsupported media type | 415; no form-data buffering or delivery. |
| Cross-origin, `Origin: null`, absent origin, alternate host | Matches documented policy; no hidden route bypass. |
| Invalid/expired/replayed bot token or verifier timeout | Rejected or controlled unavailable response; no Google calls. |
| Per-client burst and distributed clients | Attempts remain bounded at intended scope; strict global budget still holds. |
| Five accepted sends and an additional submission | Final global cap behaves as configured, independently of attempt counters. |
| Provider failure, crash, repeated release, week rollover | No silent permanent pending state, double decrement, or unaccounted retry. |
| HTML-like status/message/hash and CR/LF header values | Text stays inert; no new MIME headers from visitor input. |
| Homepage, assets, API success/error headers | Correct policy on each response path; framing blocked in browser. |
| CI security check fails | Production deploy cannot proceed past required gates. |

## Checks completed during this review

| Check | Observed result |
| --- | --- |
| Dependency audit | `pnpm audit --json`: exit 0, zero known advisories. |
| Six local submissions, no Origin | Five 200 responses, then 429. |
| Seven local provider failures | Seven 502 responses; seven provider calls; quota refunded to zero. |
| Local 64 KiB message | 200; oversized input accepted before truncation. |
| Explicit mismatched Origin | 403. |
| Explicit filled honeypot | 202 without normal delivery. |
| Array payload | 400. |
| Secret filename/ignore checks | No matching tracked credential filenames; common environment variants not ignored. |

Recommended first implementation: **Phase 1**, followed by reservation recovery and header enforcement. Preserve the existing safe rendering, parameterized SQL, fixed email recipient, and static-asset routing throughout.
