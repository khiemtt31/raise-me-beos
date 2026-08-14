# Content inventory

Audit date: 2026-08-10

This is the reusable content and asset inventory extracted from the reference application. It is an input to V2, not an instruction to preserve the legacy layout or component tree.

## Content currently represented in code

Source before migration: the legacy portfolio data and section files. Current migrated source: `src/content/`.

- Identity: Khiem Hanzo Tran; the approved public title is `Software Engineer · Full-stack Developer`.
- Sections: Home, Work, About, Projects, Contact.
- Work history: TANCA (Mar 2024–Oct 2024), Vucar (Nov 2024–Dec 2024), SystemEXE Vietnam (Mar 2025–May 2026), and Amaris/Bosch BGSW (Jun 2026–Present).
- Projects: Halando OCR API, Detail Design with Agent, Mimlork, and Aperture Markets.
- About themes: full-stack craft, systems thinking, future curiosity; football, movies, games, and sci-fi; three working principles.
- Contact copy: confirmed identity `Khiem Hanzo Tran`, `Software Engineer · Full-stack Developer`, and `hanzo.work.vnn@gmail.com`; unresolved GitHub, LinkedIn, location, and availability/status fields are omitted until supplied.

## Content requiring confirmation before production

- GitHub and LinkedIn remain unresolved placeholders and must not ship as real links until supplied or explicitly omitted; do not expose private phone numbers or exact addresses.
- The confirmed public email is `hanzo.work.vnn@gmail.com`; the older candidates `hello@hanzohekim.dev` and `hello@your-domain.com` must not ship under this direction.
- Work entries use the same temporary image (`/Work/work-placeholder.jpg`) and need approved company imagery or an intentional typographic treatment.
- The current copy describes live/current employment and projects; confirm dates, role names, public wording, and whether Bosch may be named.
- The hero 3D character is a concept only. No model, animation capture, or model license is present in this checkout.

## Reusable image groups

| Group | Paths | Dimensions / notes | V2 disposition |
| --- | --- | --- | --- |
| Hero portraits | `public/images/homepage/HeroPrimary.png`, `HeroSecondary.png` | 700×800 and 500×500 | Candidate fallback/reference assets |
| About art | `public/images/portfolio/AboutPrimary.png`, `AboutSecondary.png` | 856×466 and 778×561 | Candidate fallback/reference assets |
| Contact art | `public/images/portfolio/contact-model.png`, `public/contacts/voidkazu.png` | both 1526×1907 | Audit relationship and retain only the approved source |
| Background | `public/images/background/background-001.png` | 1672×941 | Candidate static atmosphere; optimize before hero use |
| Project evidence | `public/images/projects/{halando,laggy-horse,mimlork,aperture-markets}/` | mixed PNG/JPEG screenshots | Reuse as project proof, lazy-load below the fold |
| Design references | `public/Portfolio Designs/{Home,Work,About,Projects,Contact}.png` | exported reference frames | Reference-only unless explicitly approved as content |
| Work placeholder | `public/Work/work-placeholder.jpg` | 597×335 | Replace or remove before production |

The six files under `public/projects/halando/` are byte-identical duplicates of the corresponding files under `public/images/projects/halando/`. Do not preserve both paths in V2 without a compatibility reason.

## Missing assets

- No `.glb`, `.gltf`, HDRI, shader source, texture atlas, video, font file, or 3D capture is present.
- The original background videos are not in the repository; the checkpoint documents a deliberate no-video decision.
- No verified social/profile URLs, resume, project URLs, or case-study links are present.

## Content migration rule

Approved content is now separated into typed, server-owned modules under `src/content/`. Keep media references explicit, include intrinsic dimensions and meaningful alt text, and do not carry placeholder URLs or unapproved employment claims into production.
