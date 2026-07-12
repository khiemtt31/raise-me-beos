# Raise Me Beos

<p align="center">
  <b>🍭 A bright, bouncy, horizontally scrolling portfolio for Hanzo Hekim 🍭</b><br />
  Built to feel a little like a candy shop, a little like a science-fair poster, and a lot like the codebase it lives in.
</p>

<p align="center">
  <a href="#tiny-tour">Tiny Tour</a> ·
  <a href="#run-it">Run It</a> ·
  <a href="#scripts">Scripts</a> ·
  <a href="#project-map">Project Map</a> ·
  <a href="#notes">Notes</a>
</p>

---

## What this is

This project is a Next.js portfolio site with a playful, colorful art direction and a side-scrolling layout.

The experience is built around:

- a fixed header with section navigation
- a horizontally scrolling main canvas
- animated blob-like visualizers
- large editorial typography
- local artwork and background assets in `public/`

It currently includes these sections:

- `Home`
- `Work`
- `About`
- `Projects`
- `Contact`

Tiny Tour:

- `Home` introduces the portfolio with portrait imagery and a bold title.
- `Work` shows a milestone timeline.
- `About` mixes text with visual cards.
- `Projects` and `Contact` are ready as empty design sections for expansion.

</details>

---

## Scripts

- `npm run dev` - start the local Next.js dev server
- `npm run build` - production build for Next.js
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript without emitting files
- `npm run build:cloudflare` - build with OpenNext for Cloudflare
- `npm run preview` - build for Cloudflare and preview locally
- `npm run deploy` - build for Cloudflare and deploy
- `npm run cf-typegen` - generate Cloudflare types

---

## Project Map

- `src/app/page.tsx` - app entry page
- `src/app/layout.tsx` - root layout and metadata
- `src/app/globals.css` - global styles, theme tokens, and layout rules
- `src/components/portfolio/PortfolioPage.tsx` - horizontal scroll controller
- `src/components/portfolio/PortfolioSections.tsx` - home, work, about, and placeholder sections
- `src/components/portfolio/PortfolioData.ts` - section data and timeline copy
- `src/components/portfolio/Visualizer.tsx` - animated background blobs
- `src/components/layout/Header.tsx` - sticky navigation header
- `src/components/ui/Button.tsx` - reusable button primitive
- `src/lib/Utils.ts` - shared class name helper

---

## Stack

- Next.js 16.2.9
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
- OpenNext for Cloudflare deployment

---

## Design Mood

The UI intentionally leans into a cheerful, childlike energy:

- warm cream background
- vivid pink, violet, and lime accents
- oversized serif display type
- soft frosted surfaces
- floating visual blobs
- smooth motion and scroll snapping

It is colorful on purpose, but still shaped by the actual portfolio structure in the codebase.

---

## Assets

Local assets live in `public/`:

- `public/images/homepage/`
- `public/images/portfolio/`
- `public/images/background/`
- `public/Portfolio Designs/`

The original background videos are intentionally kept out of git because they are too large for GitHub's 100 MB file limit.

---

## Notes

- The main experience is horizontal, not vertical.
- The navigation uses section IDs that match the portfolio sections.
- `Projects` and `Contact` currently exist as placeholder panels, so they can be expanded later without changing the layout.
- If you change the visual copy or the section list, update the matching data in `src/components/portfolio/PortfolioData.ts`.