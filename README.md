# Khiem Hanzo Tran

A cinematic single-page Astro portfolio introduction with a full-screen portrait background,
animated focus transition, Cinzel title treatment, and hash-linked About Me state.

## 🚀 Project Structure

The project is a one-route Astro site:

```text
/
├── public/
├── wrangler.jsonc
├── src/
│   ├── components/
│   │   ├── About.astro
│   │   ├── Contact.astro
│   │   ├── Hero.astro
│   │   └── Navigation.astro
│   ├── pages/
│   │   └── index.astro
│   ├── scripts/
│   │   ├── contact-form.ts
│   │   └── page-state.ts
│   ├── styles/
│   │   ├── contact.css
│   │   └── global.css
│   └── worker.ts
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

The hero title is rendered in static HTML, uses a hosted Cinzel font with a serif fallback, and
respects reduced-motion preferences. The fixed About Me navigation points to `#about-me`; wheel,
touch, and keyboard gestures change the active state without scrolling the document. Hero, About
Me, and navigation markup live in separate components, while `page-state.ts` owns browser state.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `npm run build:cloudflare` | Cloudflare-compatible production build to `./dist/` |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |
| `pnpm run deploy`      | Build and deploy the site to Cloudflare Workers |

Cloudflare deployment is configured for the existing `raise-me-beos` Worker. Pushes to `main`
run the production workflow with the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets
from the repository's `production` environment.

### Contact form delivery

The Contacts state submits to `/api/contact`. The Cloudflare Worker validates the payload, enforces
a five-message calendar-week limit using the `ContactQuota` Durable Object, and sends accepted
messages to `shacker1357@gmail.com` through the Gmail API. The visitor's address is preserved as
the `Reply-To` address.

Configure the Gmail OAuth secrets in the Cloudflare Worker; never commit them to the repository:

```sh
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GOOGLE_REFRESH_TOKEN
wrangler secret put CONTACT_EMAIL
```

The Gmail OAuth client must be authorized with the `gmail.send` scope. Local Worker requests can be
tested with `pnpm exec wrangler dev --local` after providing equivalent local variables through a
local-only `.dev.vars` file. Set `CONTACT_EMAIL` there for local development; configure the same
variable as a Worker secret or variable in production.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
