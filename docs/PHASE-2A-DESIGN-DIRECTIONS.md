# Phase 2A — Design Direction and Specification Gate

Status: approved and locked in `docs/SPEC.md`; Phase 2B static implementation is complete, while Motion and WebGL remain deferred.

This document is the decision package for the final visual and interaction direction of Portfolio V2. It records the concrete alternatives, implementation consequences, and rationale behind the approved choices in `docs/SPEC.md`; alternatives remain useful context but are not selected for implementation.

## Scope boundary

The Phase 2A decision work was documentation-only: it did not add or select a model, install Three/R3F/Motion, add shaders or particles, or deploy anything. The approved Phase 2B static implementation now provides the visual baseline; the cinematic runtime remains deferred.

The eventual hero may follow this sequence:

`darkness → brief illumination → silhouette → darkness → alternate illumination → ignition/reveal → complete character → settled idle`

The ignition language should communicate energy, heat, and transformation rather than realistic bodily injury. The experience must remain understandable and usable as HTML when WebGL, the model, advanced effects, or motion are unavailable.

## Decision summary

The following table records the approved Phase 2A set.

| Gate | Approved option | Why it was approved |
| --- | --- | --- |
| A | 1 — Ember Editorial | Best balance of premium cinematic identity, readable content, and restrained implementation surface. |
| B | 2 — Three-quarter portrait/bust | Gives the reveal a strong human presence while leaving room for editorial copy and responsive cropping. |
| C | 2 — Stylized realistic | Preserves identity and lighting detail while reducing uncanny-valley and production risk. |
| D | 2 — Micro-motion | Adds life without turning the hero into a toy or requiring free-orbit controls. |
| E | 3 — Hybrid trigger | Protects the first visit while allowing repeat visitors and accessibility preferences to skip the spectacle. |
| F | 2 — Cinematic-lite realtime, with static fallback | Preserves continuity on capable phones without making battery, thermal, and GPU variance a release blocker. |
| G | 1 — Persistent minimal top nav | Highest discoverability with the smallest navigation state machine. |
| H | 1 — One long-form portfolio page | Matches the present content volume and keeps the cinematic arc coherent. |
| I | 1 — Editorial case-study rows | Creates hierarchy and impact without inventing detail routes before project content is deep enough. |
| J | 2 — Editorial experience chapters | More authored than a generic timeline while remaining simple on mobile. |
| K | 1 — Editorial serif plus technical grotesk | Gives the portfolio a memorable voice while keeping interface text practical. |
| L | 1 — Obsidian / Ember | Makes ignition distinctive because the rest of the interface stays quiet and neutral. |

N (budgets) remains a proposed release guardrail, not a final universal performance claim. M has a confirmed name, title, and email, while optional public profile fields remain open.

## A. Overall art-direction proposals

Each proposal is a complete system rather than a color swap. All three can support the future darkness-to-ignition hero sequence, but they make different promises about what the rest of the portfolio feels like.

### A1 — Ember Editorial

**Concept.** A quiet black editorial space in which the character and selected work appear as rare, controlled events. The portfolio feels like a small independent studio journal: precise, warm, and cinematic without becoming a film trailer.

**Visual characteristics**

- Background: near-black obsidian with subtle tonal shifts, never a full-page gradient wash.
- Typography: warm display serif for statements and section titles; restrained technical grotesk for navigation, metadata, dates, and labels.
- Accents: ember orange is reserved for ignition, active states, tiny rules, and occasional status marks. It is not the default button color or a constant glow.
- Imagery: large, carefully cropped project stills and a dark character silhouette; imagery carries the emotional weight while text stays sparse.
- Borders: hairline warm-gray rules, occasional interrupted rules, and no glass panels.
- Density and rhythm: generous negative space, short text blocks, clear pauses between sections, and a few high-impact compositions rather than a dense grid.
- Project presentation: editorial rows with title, year, role, one-sentence premise, and one dominant image. A row can open into a detail route later if content grows.
- Navigation character: persistent, small, typographic, and slightly letter-spaced; active section state is a quiet line or color change.
- Cinematic relation: the hero is the opening scene; the remainder behaves like the calm aftermath and evidence of the work, not a second spectacle.

**Strengths**

- Strongest balance of identity, readability, and restraint.
- Lets the character reveal remain rare and meaningful.
- Works with the current content inventory, including projects that do not yet have verified URLs or long case studies.
- Graceful degradation is natural: the static silhouette/poster still belongs to the art direction.

**Weaknesses**

- Requires disciplined typography, cropping, and spacing to avoid looking like a generic dark portfolio.
- The warm accent must be governed carefully or the page will drift into an obvious “fire theme.”
- A very quiet idle state may feel less immediately demonstrative to visitors who expect a conventional project grid.

**Implementation complexity.** Medium. The static layer is mostly semantic HTML/CSS; the future hero adds the planned client-only 3D island, reveal shader, lighting, and particles without requiring every section to become animated.

**Performance implications.** Low for the page shell. The primary cost is concentrated in the deferred hero runtime and image decoding. The restrained surface avoids expensive background effects and makes a static poster credible.

**Hero support.** Excellent. Alternating illumination, rim light, and a rare ember boundary have a clear conceptual role and can settle into a nearly still portrait.

**Recommendation score.** 9/10.

### A2 — Precision Monolith

**Concept.** A severe architectural portfolio built from a strict grid. The character is treated as a technical artifact under controlled light, and projects read as evidence arranged in a high-confidence system.

**Visual characteristics**

- Background: flat charcoal-black with large measured fields and strong vertical or horizontal alignment.
- Typography: one geometric or neo-grotesk family used in contrasting weights; all-caps labels and oversized numeric indexes provide the voice.
- Accents: cool electric blue or desaturated cyan for system state, with a separate hot ignition color used only in the reveal.
- Imagery: monochrome or low-saturation project imagery with occasional full-color “proof” frames.
- Borders: visible grid lines, coordinate-like markers, and hard rectangular boundaries; panels are opaque, not translucent.
- Density and rhythm: higher information density, deliberate repetition, and modular alignment. Empty space is measured rather than atmospheric.
- Project presentation: numbered modules or large index cards with strong metadata, role, stack, and outcome fields.
- Navigation character: compact index with section numbers and a visible progress cue; nav feels like a control instrument.
- Cinematic relation: the hero is a controlled calibration or activation event; the portfolio presents the resulting system with technical confidence.

**Strengths**

- Communicates technical rigor quickly.
- Gives projects and career data a clear, scannable structure.
- Grid rules make responsive decisions and content alignment easier to reason about.
- A future technical identity section can feel native rather than appended.

**Weaknesses**

- Higher risk of looking like a dashboard, product landing page, or generic “developer system.”
- Grid markers and status language can compete with the character and the work.
- The design has less room for softness, ambiguity, or personal warmth.

**Implementation complexity.** Medium to high. The CSS grid and responsive states are straightforward, but the visual system needs more metadata, indexes, and consistent project fields than the current content guarantees.

**Performance implications.** Low to medium for the shell. More visible image modules may raise image bytes and decode cost. The hero can still be deferred, but the system encourages more above-the-fold content than A1.

**Hero support.** Good. The reveal can be framed as ignition of a precision instrument, but particles, glow, and warm light need restraint to avoid fighting the grid.

**Recommendation score.** 7.5/10.

### A3 — Film Archive

**Concept.** A nocturnal archive of fragments: contact sheets, chapter cards, filmic captions, and deliberate cuts between scenes. The visitor moves through a personal body of work as if handling a small reel of stills and notes.

**Visual characteristics**

- Background: deep blue-black with occasional black frames and subtle grain-like texture only where it serves the composition.
- Typography: condensed display face or tracked uppercase for captions, paired with a humanist body face for notes and longer copy.
- Accents: muted silver, pale blue, and a single ember-hot highlight for the ignition event.
- Imagery: cinematic stills, portrait crops, contact-sheet groupings, and occasional full-bleed frames with caption overlays.
- Borders: film-frame edges, caption rules, and imperfectly interrupted separators; avoid faux camera/HUD decoration.
- Density and rhythm: alternates between sparse full-bleed scenes and compact archive lists. The rhythm is more variable and editorially authored than the other proposals.
- Project presentation: alternating image-and-caption panels, with project context appearing as a chapter note rather than a card.
- Navigation character: chapter labels and a small progress marker; section names remain explicit so the archive metaphor never hides orientation.
- Cinematic relation: the hero is the first cut, with the reveal acting as a title sequence before the archive settles into still frames.

**Strengths**

- Most memorable atmosphere and strongest relationship between photography, motion, and narrative.
- Gives the portfolio a natural place for personal interests and process fragments.
- Can make modest project descriptions feel authored through sequencing and captions.

**Weaknesses**

- Most likely to become theatrical, slow, or cryptic if captions and transitions are overused.
- Requires stronger image direction and more complete project media than is currently verified.
- Archive metaphors can reduce quick scanning and make navigation feel less conventional.

**Implementation complexity.** High. Beyond the hero, the composition invites more scroll choreography, image sequencing, and responsive art direction. It must remain CSS-first in the fallback path to avoid turning the page into a motion dependency.

**Performance implications.** Medium to high. Full-bleed stills, alternate crops, grain, and transitions increase image and decoding pressure. Any grain or post-processing must be optional and cheap.

**Hero support.** Excellent. The darkness/illumination sequence reads naturally as a title sequence, though it risks making the first impression feel longer than intended.

**Recommendation score.** 8/10.

### Art-direction recommendation

A1 — Ember Editorial is approved. It has the clearest relationship between the proposed hero and the actual portfolio content, keeps the idle state premium and quiet, and gives the future 3D runtime a deliberately bounded role. A2 and A3 remain documented alternatives, not selected directions.

## B. Hero composition

The composition must be evaluated separately from model style. The same character can be lit differently, but the framing determines identity, copy space, mobile crops, and how much of the model must be produced.

### B1 — Centered portrait/bust

The head and shoulders occupy the visual center, with the reveal reading as a portrait activation. It maximizes facial recognition and keeps the silhouette legible at small sizes, but leaves little space for copy and can feel conventional if the lighting is not exceptional.

- Identity: strongest face-first identity.
- Cinematography: intimate, controlled, portrait-studio language.
- Shader reveal: easiest to isolate around face, shoulders, hair, and clothing boundary.
- Desktop/mobile: highly resilient crop; copy must move above or below on mobile.
- Model requirement: head, shoulders, and upper costume need the highest quality; lower body can be omitted.
- GPU cost: lowest geometry and texture scope of the three.

### B2 — Three-quarter portrait/bust

The character is offset from center and turned slightly toward or away from the viewer. The open side carries a short statement, index, or project cue. It retains face and shoulder identity while giving the composition directional movement.

- Identity: strong, with more personality and posture than B1.
- Cinematography: strongest balance of portrait intimacy and editorial negative space.
- Shader reveal: excellent boundary and rim-light surface; the turn gives the reveal a readable progression.
- Desktop/mobile: desktop supports copy beside the figure; mobile can crop to face/torso with the copy reordered above or below.
- Model requirement: face, neck, shoulder, torso, and upper garment need coherent silhouette; no full-body asset is required.
- GPU cost: low to medium, depending on garment and hair complexity.

### B3 — Full-body environmental figure

The complete character stands within a minimal environment or floor plane. The environment supplies scale, silhouette, and a stronger sense of a complete digital double, but the face occupies fewer pixels and the scene is more expensive.

- Identity: strongest body-language identity, weakest small-screen facial recognition.
- Cinematography: widest and most filmic; supports depth, floor shadows, and environmental light.
- Shader reveal: excellent for a silhouette-to-complete-character transition across the whole figure.
- Desktop/mobile: compelling on wide screens, difficult to preserve without aggressive mobile crop or alternate framing.
- Model requirement: full body, clothing, footwear, environment/floor, and more animation-ready topology.
- GPU cost: highest geometry, skin/material, shadow, and texture cost.

### Hero recommendation

B2 is recommended. It offers the best identity-to-cost ratio and makes the dark/bright/dark/ignition sequence legible without demanding a full-body asset. B1 is the safest if the supplied identity must be prioritized above all else. B3 is justified only if a strong full-body model and an environmental story are approved together.

## C. Character presentation

### C1 — Realistic or semi-realistic digital double

This treats the character as a recognizable digital likeness with realistic skin, hair, clothing, and physically plausible materials.

- Recognizability: highest when the source likeness and expressions are strong.
- Model and texturing: hardest; requires careful topology, facial detail, hair strategy, material authoring, and likely more source approvals.
- Lighting: skin and eye response can be cinematic, but realism exposes every lighting and texture weakness.
- Uncanny valley: highest risk, especially in a dark reveal that withholds information before suddenly revealing the face.
- Performance: highest texture and shader pressure; animated facial detail is not necessary for the proposed sequence but realistic assets still cost more.
- Ignition suitability: powerful if the reveal is abstract and light-based; avoid effects that imply the skin is burning or damaged.

### C2 — Stylized realistic character

This preserves recognizable proportions and a human presence while simplifying materials, facial detail, hair, and costume into an authored visual language.

- Recognizability: high enough for a personal portfolio, especially with a consistent silhouette and signature clothing.
- Model and texturing: medium difficulty; allows baked detail, simplified materials, and controlled exaggeration.
- Lighting: highly compatible with rim light, broad key light, emissive seams, and a restrained shader reveal.
- Uncanny valley: substantially lower than C1 because the visual contract is clearly authored.
- Performance: medium; asset scope can be kept within the same mobile/static fallback plan.
- Ignition suitability: strongest overall; the transition can feel like energy assembling a form rather than damage happening to a body.

### C3 — Sculptural or abstract silhouette

This presents a non-literal figure: a carved form, faceted body, mask, mannequin, or abstract volume whose identity is carried by posture, outline, and light.

- Recognizability: lowest literal identity; highest opportunity for a conceptual symbol.
- Model and texturing: easiest to control; geometry and materials can be deliberately simple.
- Lighting: very strong; silhouette, rim, and emissive boundaries read cleanly.
- Uncanny valley: minimal.
- Performance: lowest of the three if the sculpt remains simple.
- Ignition suitability: excellent for boundary reveal and particles, but risks feeling like a generic 3D art demo without personal marks.

### Character recommendation

C2 is recommended. It gives the hero a human anchor while keeping model production, texturing, and device cost realistic. C1 should require an explicit likeness/privacy and asset-production approval. C3 is a strong fallback or alternate campaign direction if no approved likeness is available.

## D. Camera behavior

Free orbit is excluded. The camera should create a cinematic point of view, not turn the hero into a product viewer.

### D1 — Static camera

One authored composition with only the planned lighting and reveal changing.

- Cinematic quality: strongest graphic control and easiest shot matching.
- Distraction: lowest.
- Motion sickness/accessibility: safest; reduced motion can remove nearly all camera movement.
- Complexity/performance: lowest; no pointer or scroll event loop is required.
- Mobile: easiest to crop and art-direct as a separate static fallback.

### D2 — Micro-motion camera

Small, damped parallax or breathing movement within a very narrow range. The character remains in the authored shot; there is no orbit or user-controlled spin.

- Cinematic quality: adds life and depth without changing the composition.
- Distraction: low if amplitude and frequency are bounded.
- Motion sickness/accessibility: manageable with `prefers-reduced-motion`, a no-motion mode, and no rapid depth shifts.
- Complexity/performance: low to medium; pointer sampling and camera interpolation must avoid per-frame allocations.
- Mobile: can be disabled or reduced automatically to protect battery and stability.

### D3 — Scroll-reactive camera

The camera reframes or advances as the visitor scrolls through the hero and into the first section.

- Cinematic quality: potentially high; creates a stronger scene transition.
- Distraction: medium to high because reading position changes the shot.
- Motion sickness/accessibility: highest risk; requires reduced-motion and keyboard/scroll fallback states.
- Complexity/performance: medium to high; scroll synchronization and loading boundaries are more complex.
- Mobile: more sensitive to browser toolbar changes, touch momentum, and variable viewport height.

### Camera recommendation

D2 is recommended with D1 as the reduced-motion and failure baseline. D3 should be deferred unless the selected page architecture makes the hero-to-content transition a core narrative requirement. The camera must never require pointer movement, scrolling, or a high-refresh device to understand the hero.

## E. Intro trigger and replay policy

### E1 — Automatic one-shot

The sequence starts after the minimum poster/hero assets are ready and runs once.

- First impression: strongest spectacle and clearest authored opening.
- Usability: delays access if the sequence blocks content or navigation.
- Repeat visits: potentially irritating if replayed every time.
- Loading: can synchronize directly with model readiness, but must not hold the HTML shell hostage.
- Accessibility: requires a visible skip and reduced-motion bypass.
- Complexity: medium.

### E2 — Interaction-triggered

The initial hero is quiet and the reveal starts only after a clear “enter,” “ignite,” or equivalent interaction.

- First impression: less immediate; the user must understand the affordance.
- Usability: strongest user control and no surprise motion.
- Repeat visits: naturally non-repeating unless requested.
- Loading: can defer expensive runtime work until intent is demonstrated.
- Accessibility: easiest to make explicit, but keyboard focus and labeling must be excellent.
- Complexity: medium; requires a meaningful fallback state and interaction design.

### E3 — Hybrid

The first eligible visit may begin automatically once ready, but the visitor can skip immediately; subsequent visits default to the settled hero with an explicit replay control. Reduced-motion, data-saver, failed WebGL, and weak-device paths bypass the cinematic sequence.

- First impression: preserves the intended cinematic signature without trapping the visitor.
- Usability: strongest overall if skip/replay controls are visible and the page is navigable during loading.
- Repeat visits: respectful and fast.
- Loading: requires a poster-first state, readiness timeout, and session/local preference policy.
- Accessibility: supports explicit bypass, reduced-motion, keyboard operation, and static fallback.
- Complexity: highest of the three because it has more states to test.

### Intro recommendation

E3 is approved with this policy: on the first qualifying visit, play the complete cinematic introduction once assets are ready without blocking readable HTML; on repeat visits, use a substantially shortened reveal or begin near the settled hero state; provide an intentional replay control later; and bypass flashes, major camera movement, and the full ignition sequence when reduced motion is requested. The persistence mechanism is an Agent Decision and must not require a server dependency.

## F. Mobile strategy

These are mobile experience strategies, not merely responsive CSS breakpoints.

### F1 — Full realtime 3D on mobile

The same character, reveal, lighting, and particle experience runs on mobile with adaptive quality.

- Continuity: highest; desktop and mobile share the same spectacle.
- Battery/thermal: highest risk, especially during the intro and on long visits.
- GPU variability: difficult to predict across iOS Safari, Android browsers, integrated GPUs, and thermal states.
- Loading: full model/textures/runtime arrive on the smallest screens.
- Complexity/maintenance: high; device detection and quality adaptation become part of the product.

### F2 — Cinematic-lite realtime

Capable phones receive the same composition and a reduced runtime: lower DPR, simplified materials, reduced particles, no dynamic shadow, shorter intro, and low-amplitude camera motion. Weak devices and reduced-motion users receive the static fallback.

- Continuity: high at the level of composition, light, and narrative; exact effect parity is not required.
- Battery/thermal: manageable with an explicit quality ceiling and a cheap settled state.
- GPU variability: moderate risk; requires capability checks, timeout, context-loss handling, and a static escape hatch.
- Loading: same model family can be reused, but mobile budgets must be enforced independently.
- Complexity/maintenance: medium to high, with one authored fallback and one reduced realtime mode.

### F3 — Pre-rendered or static fallback on mobile

Mobile uses a poster, short pre-rendered loop, or CSS/HTML composition rather than realtime 3D.

- Continuity: preserves the shot and ignition idea but not interactive depth.
- Battery/thermal: safest.
- GPU variability: safest.
- Loading: can be excellent with a small poster, but a video introduces its own bytes, codec, autoplay, and caching concerns.
- Complexity/maintenance: lower runtime complexity, but requires producing and maintaining alternate captures.

### Mobile recommendation

F2 is approved as a capability-driven mobile policy, with F3 as the designed static fallback: capable mobile receives cinematic-lite realtime, weak or poorly performing runtimes dynamically lower quality, and reduced-motion, unavailable-WebGL, or severely limited devices use the static cinematic mode. Viewport width alone must not decide the mode.

## G. Navigation character

### G1 — Persistent minimal top navigation

A small top bar remains available with explicit links or anchors: Work, Experience, About, and Contact. It can become denser on scroll but does not disappear unexpectedly.

- Usability: strongest discoverability and orientation.
- Mobile: can collapse to a compact menu while retaining visible menu state and keyboard access.
- Cinematic fit: quiet typography and a hairline rule keep it subordinate to the hero.
- Complexity/performance: lowest; no scroll direction state is required.

### G2 — Disappearing/reappearing navigation

The nav hides while scrolling down and returns on upward intent or near the top.

- Usability: maximizes visual space during reading.
- Mobile: can conflict with browser chrome and touch momentum; reappearance rules need careful testing.
- Cinematic fit: strongest uninterrupted compositions.
- Complexity/performance: medium; scroll state, focus behavior, and reduced-motion transitions need explicit handling.

### G3 — Chapter index/progress navigation

A compact chapter index or progress rail shows the visitor's position through the authored page.

- Usability: useful for a long, narrative page; less useful if the page stays short.
- Mobile: a persistent rail may consume space, so it likely becomes a top progress control.
- Cinematic fit: supports Film Archive and Precision Monolith more naturally than Ember Editorial.
- Complexity/performance: medium; active-section observation and accessible labels are required.

### Navigation recommendation

G1 is recommended as the base. A low-contrast version of G3 can be added only if the approved page becomes long enough to need orientation. G2 should not be the only way to reach navigation, and any hide/show behavior must not remove a focused control or surprise keyboard users.

## H. Final information hierarchy and page architecture

### Recommended hierarchy

1. Hero: name/role statement, short orientation, skip/replay affordance, and a clear path to Work.
2. Selected Work: the smallest high-confidence set of projects, led by the strongest visual proof.
3. Career / Experience: dates, role, organization, and a concise account of contribution and growth.
4. About / Profile: an authored personal introduction rather than a generic biography.
5. Technical identity: tools, disciplines, and working principles expressed as capability, not a logo wall.
6. Personal interests: a small humanizing section that explains adjacent curiosities and influences.
7. Contact: verified public contact paths and a concise invitation to collaborate.

The technical identity and personal interests sections should not compete with Selected Work. They can be compact subsections of About if the content remains short.

### H1 — One long-form portfolio page

The page carries the full sequence above, with anchor navigation and a curated project presentation. Project detail can initially expand inline or link only to verified external destinations.

- Best for: a coherent cinematic arc and the current modest content volume.
- Maintenance: low to medium; one page and one content model.
- SEO: strong if all meaningful text remains server-rendered and section headings are semantic.
- Risk: a long page can become monotonous if every section uses the same scale and rhythm.

### H2 — Portfolio index plus detail routes

The home page presents the hero and a concise index; each selected project receives a route such as `/work/[slug]` with a deeper case study.

- Best for: a growing body of work with verified URLs, process notes, outcomes, and multiple media assets per project.
- Maintenance: higher; requires route metadata, detail templates, and more content governance.
- SEO: potentially strongest per project, but only if pages contain genuinely distinct, substantial content.
- Risk: current project data may not justify separate routes yet, making the routes feel thin or padded.

### Information-architecture recommendation

H1 is recommended for the first approved release. H2 should remain an intentional extension point, not an invented route structure. The current content inventory should be expanded with verified project URLs, roles, outcomes, and case-study material before detail routes become the default.

## I. Project presentation

### I1 — Editorial case-study rows

Each project is a large, readable row with one dominant image, project title, year, role, short premise, and a small set of technical tags. Rows can alternate image side or crop treatment without becoming a card grid.

- Storytelling: clear premise-to-proof relationship.
- Maintenance: low; works with the current data shape and grows incrementally.
- Impact: high for a small number of projects because each gets visual breathing room.
- SEO: strong when each row has real semantic text and a verified link where available.
- Navigation complexity: low.
- Content required: title, date, role, summary, image, and optional verified URL.

### I2 — Alternating cinematic panels

Projects are presented as a sequence of large image/text scenes with stronger scroll rhythm and more deliberate transitions.

- Storytelling: highest visual impact and strongest relation to Film Archive.
- Maintenance: medium to high; every project needs better image direction and responsive composition.
- Impact: high when media is strong, weak when a project has only one ordinary screenshot.
- SEO: good if panels remain ordinary HTML; motion must never be required to expose context.
- Navigation complexity: medium.
- Content required: multiple images or meaningful visual states, a premise, role, and ideally an outcome.

### I3 — Compact index with detail routes

The homepage shows a compact index; selecting a project opens a dedicated case-study route.

- Storytelling: strongest for deep projects, weakest on the landing page.
- Maintenance: highest; introduces route, template, metadata, and content lifecycle work.
- Impact: depends entirely on the quality and depth of each detail page.
- SEO: potentially strongest per project if content is non-duplicative and substantial.
- Navigation complexity: highest, especially on mobile.
- Content required: a real case study with context, contribution, process, outcome, and media.

### Project recommendation

I1 is recommended now. I2 is a visual variant that can be introduced after the art direction and image set are approved. I3 should wait until there is enough content to make each route useful; the current inventory does not prove that threshold yet.

## J. Career / experience presentation

### J1 — Vertical chronological timeline

A conventional vertical timeline lists dates, roles, organizations, and concise descriptions.

- Desktop: highly scannable and easy to compare.
- Mobile: robust if the line and date column collapse cleanly.
- Storytelling: factual and chronological, but not especially authored.
- Simplicity: highest; low interaction and low content overhead.

### J2 — Editorial experience chapters

Each role becomes a chapter with a large date marker, organization/role statement, a short narrative, and selected contribution bullets. The chronological order remains explicit without making the line itself the visual centerpiece.

- Desktop: gives room for hierarchy and a stronger relationship to the editorial art direction.
- Mobile: straightforward stacked sections; no delicate interactive line to preserve.
- Storytelling: strongest balance of factual history and personal authorship.
- Simplicity: medium; requires better copy editing and consistent chapter fields.

### J3 — Interactive indexed timeline

A persistent index or scrubber lets visitors jump between career chapters; the active chapter changes as the page scrolls.

- Desktop: engaging for a long career history.
- Mobile: touch targets, sticky state, and scroll synchronization add complexity.
- Storytelling: potentially high, but interaction can overshadow the facts.
- Simplicity: lowest; requires observation, state, focus management, and reduced-motion behavior.

### Career recommendation

J2 is recommended. It keeps the chronological truth of J1 while matching the proposed premium editorial direction. J1 is the safe fallback if verified dates and copy remain compact. J3 is not justified until the experience history is long enough to need an index.

## K. Typography systems

The current repository has self-hosted Fontsource packages for Jacques Francois and Space Grotesk. No font is installed or changed in Phase 2A. A future replacement should remain self-hosted or use `next/font` with an explicit loading budget.

### K1 — Literary display + technical grotesk

- Display: Jacques Francois for hero statements, section titles, and occasional project names.
- Body: Space Grotesk in readable sentence case.
- Interface: Space Grotesk with restrained uppercase labels and modest tracking.
- Headings: large, calm, sentence case; use the serif where a personal statement deserves a distinct voice.
- Uppercase/tracking: only metadata, navigation labels, and small chapter markers; avoid all-caps paragraphs.
- Numeric/technical: Space Grotesk tabular-feeling weight and consistent alignment for years, stack labels, and metrics.
- Personality: human, literary, and quietly unusual.
- Tradeoff: Jacques Francois has a more specific voice and may need careful line-height and fallback tuning at display sizes.

### K2 — Single-system technical grotesk

- Display: Space Grotesk at extreme size/weight contrast.
- Body: Space Grotesk with a calmer regular weight and generous line-height.
- Interface: the same family, with a strict uppercase label scale.
- Headings: compact, geometric, and often split into short lines.
- Uppercase/tracking: more prominent; numbers and labels become part of the visual system.
- Numeric/technical: strongest consistency and scannability.
- Personality: precise, contemporary, and closer to a technical studio.
- Tradeoff: easier to systematize but less distinctive; it increases the risk of the portfolio reading like a product or developer dashboard.

### K3 — Current grotesk plus a future display replacement

- Display: a future self-hosted variable serif or expressive grotesk, selected only after licensing and rendering tests.
- Body: Space Grotesk.
- Interface: Space Grotesk with no additional family.
- Headings: the future display face carries the visual identity while body/interface remain stable.
- Uppercase/tracking: conservative until the replacement is validated.
- Numeric/technical: Space Grotesk remains the source of truth.
- Personality: highest long-term flexibility and a chance to find a more personal display voice.
- Tradeoff: the final visual identity cannot be fully judged in the current repository; it adds future font-selection and loading work.

### Typography recommendation

K1 is recommended for the first visual prototype because it uses already available fonts while creating a clear distinction between personal voice and technical evidence. K2 is the best fallback for strict performance or if the serif does not render reliably at the intended sizes. K3 should remain a later refinement, not a reason to block the specification.

## L. Restrained color palettes

All palettes keep the ignition colors conceptually separate from ordinary interface accents. “Ignition hot” and “ignition ember” should appear during the reveal, in a replay control, or in a tiny approved accent—not as a page-wide orange UI treatment. Values below are design tokens for evaluation, not yet committed CSS tokens.

### L1 — Obsidian / Ember

| Token | Conceptual value |
| --- | --- |
| Background | `#090A0A` — near-black obsidian |
| Surface | `#121514` — barely lifted charcoal |
| Primary text | `#F1EEE5` — warm bone, high contrast |
| Secondary text | `#A8AAA2` — cool warm-gray |
| Border | `#30332F` — quiet graphite rule |
| Primary accent | `#C6A46A` — muted brass for selected states |
| Ignition hot | `#FFB15C` — short-lived hot light |
| Ignition ember | `#A94425` — deep ember at the boundary |

Personality: intimate, premium, and warm without making the interface orange.

### L2 — Blue-black / Ultraviolet

| Token | Conceptual value |
| --- | --- |
| Background | `#070A12` — blue-black night |
| Surface | `#101522` — dense blue-charcoal |
| Primary text | `#F0F3F7` — cool white |
| Secondary text | `#A4ACBB` — slate text |
| Border | `#2A3345` — blue graphite rule |
| Primary accent | `#8799D9` — restrained periwinkle |
| Ignition hot | `#FFD28A` — warm contrast event |
| Ignition ember | `#C15B38` — orange-red only in the reveal |

Personality: more nocturnal and technical; it separates the normal interface from the warm ignition more dramatically.

### L3 — Graphite / Ivory / Acid signal

| Token | Conceptual value |
| --- | --- |
| Background | `#101111` — neutral graphite |
| Surface | `#191B1A` — hard matte surface |
| Primary text | `#F5F0E6` — ivory |
| Secondary text | `#A3A69D` — mineral gray |
| Border | `#363A36` — visible but quiet rule |
| Primary accent | `#B8C18D` — desaturated acid signal |
| Ignition hot | `#FFE09B` — pale heated light |
| Ignition ember | `#B34A2D` — controlled ember |

Personality: more experimental and art-directed; it avoids the familiar black-and-orange portfolio pattern.

### Palette recommendation

L1 is recommended for A1 because it gives the ignition sequence a clear semantic home and supports warm portrait lighting. L2 is the strongest alternative for A2. L3 is the most distinctive alternative for an art-led A3 or if the user wants to avoid an expected fire palette. Any selected palette still needs contrast checks for body text, borders, focus indicators, and active navigation states.

## M. Contact and public identity gate

The following public identity is approved for the production-facing contact contract:

- Display name: `Khiem Hanzo Tran`
- Professional title: `Software Engineer · Full-stack Developer`
- Public email: `hanzo.work.vnn@gmail.com`
- GitHub: unresolved and omitted until supplied.
- LinkedIn: unresolved and omitted until supplied or explicitly omitted.
- Location: unresolved and omitted until supplied or explicitly approved.
- Availability/status: unresolved and omitted until supplied.

Private phone numbers, exact addresses, and other unnecessary personal information are out of scope and must not be exposed.

The older candidate emails `hello@hanzohekim.dev` and `hello@your-domain.com` must not render as contact links under this direction. Employment dates, role wording, Bosch naming, project URLs, and resume availability still need confirmation before they become public claims.

The contact section should therefore be designed as a clear, compact invitation with the confirmed email CTA and identity, while optional social/profile links, location, status, resume, and other public claims remain subject to the open content-permissions gate.

Please provide the following before optional contact copy is expanded:

1. Supply the GitHub URL/handle and decide whether LinkedIn should be published.
3. Decide whether a broad location and optional availability/status should be shown.
4. Confirm whether a downloadable resume/CV should be public, and provide its approved file if so.
5. Confirm whether current and past employers/clients may be named publicly, including the approved wording.
6. Confirm which project URLs are safe to publish.

Until these are answered, the confirmed identity may render, but unresolved fields must be omitted and no new public claims may be invented.

## N. Proposed V2 performance budgets

These are proposed guardrails for the eventual release plan. They separate the initial experience from the deferred cinematic runtime and from steady-state rendering. They are targets to measure on representative devices, not guarantees that a local build or a single desktop browser proves compliance.

### N1 — Initial experience budgets

The visitor should receive useful HTML and a credible static hero before the cinematic runtime is ready.

| Budget | Proposed target |
| --- | --- |
| Initial route-owned client JavaScript | ≤ 150 KB gzip, excluding unavoidable shared framework runtime; no 3D runtime in this budget |
| Initial CSS | ≤ 40 KB gzip for route-critical styles |
| Hero poster / first visual | ≤ 250 KB AVIF/WebP target, with a smaller mobile source where useful |
| LCP asset | ≤ 300 KB transferred target, including the actual selected LCP image rather than a placeholder |
| Fonts | ≤ 100 KB transferred on first view target; at most one display family and one interface/body family |
| Initial useful HTML | Navigation, hero copy, skip/fallback state, and first work heading rendered server-side |
| First input | Navigation and skip/fallback controls remain usable without WebGL readiness |

### N2 — Deferred cinematic runtime budgets

The 3D runtime is loaded only after the static path is visible and the device/user policy permits it.

| Budget | Proposed target |
| --- | --- |
| Three/R3F/Drei and hero runtime chunk | ≤ 220 KB gzip target, loaded after the initial shell |
| Approved GLB | ≤ 2.5 MB compressed target; exact maximum requires the selected composition and asset source |
| Geometry | ≤ 80k triangles desktop target; ≤ 45k triangles mobile-lite target unless an approved exception is measured |
| Textures | ≤ 3 MB total compressed target; preferably 1024² maximum for mobile-visible maps |
| Environment/HDR | Prefer analytic lights or a tiny compressed environment; ≤ 1 MB if an HDR/environment is approved |
| Post-processing | At most one meaningful pass in the first release, disabled on weak/mobile-lite paths unless measured safe |
| Particles | Spawned only after the reveal begins and retired/pooled; no perpetual high-volume field |

### N3 — Runtime budgets and guardrails

| Budget | Desktop target | Mobile-lite target |
| --- | --- | --- |
| Device pixel ratio | Cap at 1.5 | Cap at 1.25 |
| Intro frame rate | 60 FPS target on representative hardware | 45 FPS target; shorter and cheaper intro is acceptable |
| Settled state | 30–60 FPS or demand-rendered when visually still | 30 FPS or demand-rendered when visually still |
| Peak particles | ≤ 1,200 visible embers | ≤ 250 visible embers |
| Dynamic shadows | One key light, measured and bounded | Off by default; baked/contact cue preferred |
| Draw calls | ≤ 80 target | ≤ 40 target |
| Quality adaptation | DPR/material/particle fallback before layout changes | Static fallback after timeout, context loss, or capability failure |

The release gate should also measure LCP, INP, CLS, memory behavior, context loss, reduced motion, slow loading, mobile thermal behavior, and a no-WebGL browser path. A green build, a local preview, or a successful desktop run does not establish these budgets.

### Budget recommendation

Adopt N1 and N2 as initial engineering guardrails, then validate N3 against the approved model and composition. If the asset cannot fit the model/texture limits without harming the selected identity, the specification must return to the asset and composition gates rather than silently expanding the runtime budget.

## What must be selected before Phase 2 implementation

The minimum coherent approval set is:

- one overall art direction from A;
- one hero composition from B;
- one character presentation from C;
- one camera behavior from D;
- one intro policy from E;
- one mobile strategy from F;
- one navigation character from G;
- one page architecture from H;
- one project presentation from I;
- one career presentation from J;
- one typography system from K;
- one palette from L;
- verified answers for M;
- accepted or revised budgets from N.

The implementation plan should then be updated to trace each selected choice into static composition, client-island boundaries, asset production, motion, WebGL, responsive behavior, and quality gates. Until that happens, the choices in this document remain proposals only.
