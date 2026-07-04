# Checkpoint

## Completed

- Implemented the homepage from Figma node `21:65` in the existing Next.js 16 App Router project.
- Replaced the previous demo homepage with a componentized homepage flow and a reusable `Header`.
- Added global SCSS tokens and base styles in `src/app/globals.scss`.
- Added Framer Motion-driven entrance transitions for the header, text, and image groups.
- Exported the two required homepage portrait assets from Figma into `public/images/homepage`.
- Kept the existing Cloudflare/OpenNext setup because the repo already had compatible build, preview, deploy, Wrangler, and GitHub Actions configuration.
- Confirmed the app currently contains only the Homepage flow, with `Header` as the minimum reusable component.
- Tightened the desktop stage to fit the viewport height without pushing the hero below the fold.
- Renamed reusable code files to CamelCase where Next.js file conventions do not require lowercase names.
- Removed the old Three.js hourglass demo code and unused starter SVG assets that no longer relate to the app.

## Current homepage structure

- `src/app/layout.tsx`
  - global fonts, metadata, SCSS import
- `src/app/page.tsx`
  - homepage route entry only
- `src/components/layout/Header.tsx`
  - desktop nav and mobile menu toggle
- `src/components/home/Homepage.tsx`
  - background visualizers
  - viewport-fitted desktop hero stage
  - responsive mobile hero layout
  - animated portraits and copy
- `src/components/ui/Button.tsx`
  - shadcn-style button used for the mobile menu trigger
- `src/lib/Utils.ts`
  - shared class name utility

## Manual tasks I still need to do

- Provide additional Figma frames if mobile/tablet layouts must match a separate design rather than the responsive interpretation built from the desktop frame.
- Replace placeholder in-page navigation targets with real sections or routes once those flows exist.
- Add Cloudflare secrets in GitHub if deployment should run automatically:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

## Known concerns

- The provided Figma input contains one desktop homepage frame only. Mobile and tablet behavior were inferred conservatively from that single frame.
- The blurred background visualizers were recreated in CSS from the Figma vector color, opacity, blur, and placement data instead of exporting those shapes as bitmap assets.
- Header links are currently single-page anchors because no additional routed pages or designed sections were provided.
- Next.js special files such as `page.tsx` and `layout.tsx` remain lowercase because App Router requires those exact filenames.

## Future updates

- Add real `Work`, `About`, `Projects`, and `Contact` sections once their designs are available.
- Refine the responsive layout with dedicated breakpoint-specific Figma frames.
- Add visual regression coverage once the rest of the site structure is defined.

## Deployment notes

- Local development: `npm run dev`
- Standard Next.js build: `npm run build`
- Production build for Cloudflare/OpenNext: `npm run build:cloudflare`
- Local Cloudflare preview: `npm run preview`
- Production deploy: `npm run deploy`
- Existing GitHub workflows already cover CI and Cloudflare deployment, so no duplicate workflow was added.

## Figma/design assumptions

- Source file: `https://www.figma.com/design/hOu80zw45xuZ6rlMlqBM2C/Portfolio-Designs?node-id=21-65`
- Implemented from frame `Home` (`21:65`)
- Fonts used from Figma:
  - `Space Grotesk`
  - `Jacques Francois`
- Exported portrait assets:
  - `public/images/homepage/HeroPrimary.png`
  - `public/images/homepage/HeroSecondary.png`
- The quote punctuation was normalized for web copy flow on smaller screens while preserving the original wording and meaning.
