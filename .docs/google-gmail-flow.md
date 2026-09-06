# Gmail sending setup

This guide enables the portfolio contact form from a new Google Cloud project through production verification. It covers the current implementation:

- Browser form: src/components/Contact.astro
- Browser request: src/scripts/contact-form.ts
- Worker endpoint: POST /api/contact in src/worker.ts
- Worker: raise-me-beos
- Production site: https://raise-me-beos-hanzo.uk
- Local site: http://localhost:4321
- Local Worker: http://localhost:8787

The Worker sends mail through the Gmail API. Google credentials never reach the browser.

## 1. Prerequisites

Install dependencies and confirm the tools:

    pnpm install --frozen-lockfile
    pnpm --version
    pnpm exec wrangler --version

You need:

- A Google account with Gmail enabled. This is the sender account.
- Access to a Google Cloud project where you can configure APIs and OAuth.
- Access to the Cloudflare account containing the raise-me-beos Worker.
- Wrangler authentication if deploying manually.

Never put real OAuth values in source control, documentation, shell history, screenshots, issue comments, or chat. If a client secret or refresh token is exposed, revoke it and create a replacement.

## 2. Create or select the Google Cloud project

1. Open the Google Cloud Console: https://console.cloud.google.com/
2. Create a project or select the project that will own this integration.
3. Record the project name and project ID for your own inventory.

Keep the OAuth client ID, client secret, and refresh token in this same project. Mixing a client secret from one project with a refresh token issued to another client is a common cause of token-exchange failures.

## 3. Enable the Gmail API

1. Open APIs & Services > Library.
2. Search for Gmail API.
3. Select Gmail API and click Enable.

Reference: https://developers.google.com/workspace/guides/enable-apis

Enabling the API does not authorize the sender account. OAuth consent is configured next.

## 4. Configure Google Auth Platform

Google may show these settings under Google Auth Platform rather than the older OAuth consent screen menu.

### 4.1 Branding

Open Google Auth Platform > Branding and configure:

- App name: for example, Khiem Hanzo Tran Portfolio.
- User support email: the sender/owner account.
- Developer contact information: an address you monitor.
- App homepage: https://raise-me-beos-hanzo.uk/

Save the configuration.

### 4.2 Audience

Open Google Auth Platform > Audience.

- Choose Internal only when the sender account belongs to the Google Workspace organization that owns this project.
- Choose External for a personal Gmail account or an account outside the Workspace organization.
- For an External app in Testing, add the sender account under Test users.

For production, publish the consent configuration when appropriate. External apps left in Testing can issue refresh tokens that expire after seven days when non-profile scopes such as Gmail sending are requested.

Reference: https://developers.google.com/identity/protocols/oauth2

### 4.3 Data access

Open Google Auth Platform > Data Access and add this exact scope:

    https://www.googleapis.com/auth/gmail.send

The Gmail send method accepts this send scope:
https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send

## 5. Create the OAuth client

OAuth Playground is used once to authorize the sender account and obtain a refresh token. Use this portfolio's own OAuth client; do not use OAuth Playground's shared default client.

1. Open Google Auth Platform > Clients or APIs & Services > Credentials.
2. Choose Create client or Create credentials > OAuth client ID.
3. Select Web application.
4. Use a name such as raise-me-beos Gmail sending.
5. Under Authorized redirect URIs, add this exact URI:

       https://developers.google.com/oauthplayground

6. Create the client.
7. Copy the client ID and client secret into a temporary password-manager entry.

The redirect URI must match exactly, including scheme and path. OAuth Playground also documents this requirement:
https://developers.google.com/oauthplayground/

## 6. Generate a matching refresh token

1. Open https://developers.google.com/oauthplayground/
2. Open the configuration menu using the gear icon.
3. Keep OAuth flow as Server-side.
4. Select Use your own OAuth credentials.
5. Enter the client ID and client secret created above.
6. Set access type to Offline.
7. Set the prompt to Consent Screen when generating a replacement token.
8. Close the configuration panel.
9. In Step 1: Select & authorize APIs, enter:

       https://www.googleapis.com/auth/gmail.send

10. Click Authorize APIs.
11. Sign in as the exact Gmail account that will send the messages and accept the Gmail permission.
12. If Google blocks the request, confirm the account is a Test user or the app is published, and confirm the Gmail scope is configured.
13. In Step 2: Exchange authorization code for tokens, click Exchange authorization code for tokens.
14. Copy the resulting Refresh token into a secure password manager entry. The access token is short-lived; the refresh token is what the Worker needs.

The refresh token must be generated while OAuth Playground is configured with the same client ID and client secret that will be stored in Cloudflare. A token from another client commonly causes invalid_grant or a token endpoint 401 response.

Reference: https://developers.google.com/identity/protocols/oauth2/web-server

## 7. Configure local secrets

Create an ignored .dev.vars file in the repository root. Use real values only in this local file:

    CONTACT_EMAIL=your-sender@gmail.com
    GOOGLE_CLIENT_ID=your-oauth-client-id
    GOOGLE_CLIENT_SECRET=your-oauth-client-secret
    GOOGLE_REFRESH_TOKEN=your-refresh-token

The current .gitignore excludes .dev.vars*. Confirm it is ignored:

    git check-ignore -v .dev.vars

Local development uses these values through Wrangler. A valid local configuration can send real email, so use the sender account deliberately and avoid repeated test submissions.

## 8. Test locally

Run the combined development command:

    pnpm dev

This builds static assets, starts the local Worker on port 8787, starts Astro on port 4321, and proxies /api/* from Astro to the Worker. Open:

    http://localhost:4321/

The API is a Worker endpoint, not a static Astro page. The proxy prevents the old localhost:4321/api/contact 404 error.

### Safe route check

This reaches the Worker without sending email:

    curl -i http://localhost:4321/api/contact

Expected response: 405 Method Not Allowed with Allow: POST.

### Safe form-path check

The honeypot path exits before quota reservation or Gmail calls:

    curl -i -X POST http://localhost:4321/api/contact \
      -H 'Origin: http://localhost:4321' \
      -H 'Content-Type: application/json' \
      --data '{"name":"Bot","email":"bot@example.com","message":"route check","companyWebsite":"filled"}'

Expected response: 202 Accepted.

### Real local delivery check

Only do this once the Google credentials are ready. It sends a real message to CONTACT_EMAIL:

    curl -i -X POST http://localhost:4321/api/contact \
      -H 'Origin: http://localhost:4321' \
      -H 'Content-Type: application/json' \
      --data '{"name":"Local Gmail test","email":"your-real-reply-address@example.com","message":"Local Gmail delivery test. Please ignore."}'

Expected response:

    {"message":"Message sent. I’ll get back to you soon."}

Check the sender account's Sent folder and inbox/spam folder. A 502 means the provider step failed; inspect Wrangler output for oauth provider request failed with <status> or gmail provider request failed with <status>.

Stop the combined development servers with Ctrl-C.

## 9. Configure production Worker secrets

Production secrets are separate from .dev.vars. The Worker requires these values:

| Secret | Value |
| --- | --- |
| CONTACT_EMAIL | One plain sender/recipient mailbox address |
| GOOGLE_CLIENT_ID | OAuth client ID from Section 5 |
| GOOGLE_CLIENT_SECRET | Secret for that same OAuth client |
| GOOGLE_REFRESH_TOKEN | Token generated with that client and sender account |

The CONTACT_EMAIL account should be the account that authorized the refresh token. The Worker sends From and To as CONTACT_EMAIL and uses the visitor's address only as Reply-To.

Confirm Wrangler is authenticated to the intended Cloudflare account:

    pnpm exec wrangler whoami

Upload each secret interactively. Do not put values in shell history, URLs, or command arguments:

    pnpm exec wrangler secret put CONTACT_EMAIL --name raise-me-beos
    pnpm exec wrangler secret put GOOGLE_CLIENT_ID --name raise-me-beos
    pnpm exec wrangler secret put GOOGLE_CLIENT_SECRET --name raise-me-beos
    pnpm exec wrangler secret put GOOGLE_REFRESH_TOKEN --name raise-me-beos

Wrangler prompts for each value. secret put updates and deploys a Worker version immediately; avoid uploading partial or mismatched OAuth values.

Reference: https://developers.cloudflare.com/workers/configuration/secrets/

List names only to confirm the bindings exist:

    pnpm exec wrangler secret list --name raise-me-beos

This does not validate the values. A live valid submission is required.

## 10. Deploy the application

Before deployment, run:

    pnpm test
    pnpm typecheck:worker
    pnpm build
    pnpm exec wrangler deploy --dry-run
    git diff --check

Push the reviewed application commit:

    git status --short --branch
    git add <intended-files>
    git commit -m "<message>"
    git push origin main

The push to main starts .github/workflows/deploy.yml. The workflow installs dependencies, type-checks the Worker, runs regression tests and the dependency audit, builds the site, and deploys using the production Cloudflare environment.

For an explicitly authorized manual deployment:

    pnpm run deploy

A successful deployment does not prove Gmail delivery works.

## 11. Verify production

Check the site and route:

    curl -i https://raise-me-beos-hanzo.uk/
    curl -i https://raise-me-beos-hanzo.uk/api/contact

Expected results:

- Homepage: 200 OK.
- GET /api/contact: 405 Method Not Allowed.

Submit exactly one controlled valid message to test provider integration. This sends a real email to CONTACT_EMAIL:

    curl -i -X POST https://raise-me-beos-hanzo.uk/api/contact \
      -H 'Origin: https://raise-me-beos-hanzo.uk' \
      -H 'Content-Type: application/json' \
      --data '{"name":"Production Gmail test","email":"your-real-reply-address@example.com","message":"Production Gmail delivery test. Please ignore."}'

Expected success:

    {"message":"Message sent. I’ll get back to you soon."}

Verify the message in the sender account's Sent folder and the destination inbox. Do not repeatedly resubmit an ambiguous request: once the Gmail call has started, delivery may be uncertain.

Watch new Worker logs while reproducing one request:

    pnpm exec wrangler tail raise-me-beos --format pretty --method POST

The Worker logs provider stage and HTTP status without logging OAuth values or contact message bodies. Stop the tail with Ctrl-C.

## 12. Troubleshooting

| Symptom | Meaning | Fix |
| --- | --- | --- |
| localhost:4321/api/contact returns 404 | Astro is running without the Worker proxy, or the combined dev command is not being used. | Run pnpm dev; confirm Astro is on 4321 and Wrangler is on 8787. |
| 503 Email delivery is not configured yet. | A required local or production binding is missing/empty, or CONTACT_EMAIL is invalid. | Check .dev.vars locally or Worker secrets in Cloudflare. secret list does not prove values are valid. |
| 502 with oauth provider request failed with 401 | Google rejected the client/refresh-token exchange. | Generate a new token with the same OAuth client ID and secret; confirm sender account, audience, test-user status, and scope. |
| 502 with OAuth 400 | Google commonly reports an invalid, revoked, expired, or mismatched refresh grant. | Re-authorize the sender account and replace the refresh token. Publish an External Testing app or expect seven-day refresh-token expiry. |
| 502 with gmail provider request failed with 401 | The access token was rejected by Gmail. | Recreate the matching refresh token and confirm the client project and sender account. |
| 502 with gmail provider request failed with 403 | OAuth succeeded but Gmail denied the send. | Confirm Gmail API is enabled, gmail.send was granted, the sender is the authorized account, and Workspace/admin policy allows sending. |
| 429 Too many attempts | The per-client attempt limiter is active. | Wait at least one minute and avoid repeated automated submissions. |
| 429 weekly message limit | The Durable Object's five-message weekly budget is exhausted. | Wait until the next calendar week in Asia/Ho_Chi_Minh. |
| Browser reports a network error | The local Worker is not running, the proxy target is unavailable, or a production edge/network issue exists. | Check pnpm dev output locally or Cloudflare Worker logs in production. |

## 13. Credential rotation and recovery

Rotate all related values together when the client secret or refresh token is uncertain:

1. Revoke the old grant or remove the old client if it is compromised.
2. Create a new OAuth client if the client secret was exposed or regenerated.
3. Generate a new refresh token with that exact client and the sender account.
4. Upload the new GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN values to the intended Worker.
5. Confirm CONTACT_EMAIL is the same sender mailbox.
6. Run one controlled production delivery test and check Sent mail.
7. Revoke old refresh tokens that are no longer needed.

References:

- https://developers.google.com/identity/protocols/oauth2
- https://developers.google.com/workspace/gmail/api/auth/web-server

## 14. Completion checklist

- [ ] Gmail API is enabled in the intended Google Cloud project.
- [ ] Google Auth Platform branding and audience are configured.
- [ ] Sender account is a Test user or the consent app is published.
- [ ] gmail.send is granted.
- [ ] OAuth client is a Web application with the OAuth Playground redirect URI.
- [ ] Refresh token was generated with the same client ID and client secret used by the Worker.
- [ ] Local .dev.vars is ignored and contains no values committed to Git.
- [ ] pnpm dev reaches /api/contact through the local proxy.
- [ ] All four production secrets are configured on raise-me-beos.
- [ ] Tests, type-check, build, and deploy dry-run pass.
- [ ] Production homepage and API route return expected statuses.
- [ ] One controlled production submission returns 200.
- [ ] The message appears in the sender's Sent folder and destination inbox.
- [ ] No OAuth secret or refresh token appears in logs, commits, or shared artifacts.
