---
name: cloudflare-next
description: Preserve, migrate, preview, and deploy Next.js App Router applications through OpenNext on Cloudflare Workers. Use when changing Next config, OpenNext config, Wrangler bindings, environment interfaces, CI/CD, preview/deploy scripts, or production routes.
---

# Cloudflare Next

## Preservation contract

- Treat next.config.ts, open-next.config.ts, wrangler.jsonc, package manifests, .github/workflows, generated environment types, and deployment scripts as one contract.
- Audit bindings, secrets, compatibility flags/date, asset directory, image binding, routes/domain, and environment before editing.
- Keep secrets out of source and public client variables. Distinguish build-time env, Worker bindings, GitHub secrets, and NEXT_PUBLIC_*.

## Local workflow

1. Read the installed Next guidance under node_modules/next/dist/docs/ before changing App Router or config behavior.
2. Use npm ci for lockfile-faithful installs, npm run dev for development, and npm run build:cloudflare for the deployment build.
3. Use npm run preview after a successful build. Treat it as stronger than next dev, not as production proof.
4. Run npm run cf-typegen only when Wrangler bindings/environments are defined; commit generated types only when the repo contract requires it.
5. Use npm run deploy only with confirmed Cloudflare scope and an approved production action.

## CI/CD

- Keep CI on the supported Node version and npm ci; cover lint, typecheck, content/image checks, and the OpenNext build.
- Add browser/preview gates explicitly rather than implying the build covers them.
- Deploy only from the intended branch/environment with CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in GitHub secrets.
- Validate ASSETS/image delivery, custom routes, and hostnames separately; a worker name alone does not prove a production domain.

## References

- Cloudflare Next/OpenNext: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- OpenNext adapter: https://opennext.js.org/cloudflare
- Wrangler configuration: https://developers.cloudflare.com/workers/wrangler/configuration/
- Local App Router docs: node_modules/next/dist/docs/01-app/
