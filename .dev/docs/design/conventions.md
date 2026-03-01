# Design Conventions

A reference for spacing, layout, and grid standards to ensure visual consistency across the project.

---

## 1. Padding Top: Distance from Header

The padding between the header (navigation bar) and main content depends on whether the header is fixed/sticky or static, and the visual weight of the first section.

| Context | Padding Top |
|---|---|
| Standard content pages | `48px – 80px` (`3rem – 5rem`) |
| Hero sections / landing pages | `96px – 160px` (`6rem – 10rem`) |
| Double Header Rule (recommended) | `1× – 1.5×` the header height |

### Rules

- **Standard Content Pages** — `48px` to `80px` gives enough breathing room for the eye to distinguish global navigation from page-specific content.
- **Hero Sections / Landing Pages** — When the first element is a high-impact hero image or large headline, increase top padding to `96px`–`160px`.
- **The Double Header Rule** — A common professional technique: make the top padding of your first section equal to or `1.5×` the height of the header itself. If the header is `80px` tall, the top padding should be at least `80px`–`120px`.

---

## 2. The 8/12 Column Grid Standard

Use **8 out of 12 columns** (~66% of container width) as the default for readable content. This is the professional standard for controlling line length and preventing eye fatigue.

### Column Usage Guide

| Layout | Columns | Use Case |
|---|---|---|
| Full-width | 12 / 12 | Dashboards, data tables, image galleries |
| Centered content | 8 / 12 | Long-form text, landing page copy, forms |
| Content + Sidebar | 8 / 12 + 4 / 12 | News sites, e-commerce category pages |

### Line Length Rule

The golden rule for web typography is **45–75 characters per line**. Content spanning the full 12 columns on a `1440px` screen produces lines that are too long. Centering content in an 8-column span (~`700px`–`900px`) prevents this.

---

## 3. Spacing Standards (Margins and Paddings)

All spacing must follow the **8pt Grid System** — use only multiples of `8`. This ensures mathematical harmony across all screen sizes and avoids arbitrary pixel values.

### 8pt Scale

| Token | Value (rem) | Value (px) |
|---|---|---|
| `spacing-1` | `0.5rem` | `8px` |
| `spacing-2` | `1rem` | `16px` |
| `spacing-3` | `1.5rem` | `24px` |
| `spacing-4` | `2rem` | `32px` |
| `spacing-6` | `3rem` | `48px` |
| `spacing-8` | `4rem` | `64px` |
| `spacing-10` | `5rem` | `80px` |
| `spacing-16` | `8rem` | `128px` |

> Never use a value outside of this scale. A site with consistent "wrong" spacing looks better than a site with "perfectly guessed" inconsistent spacing.

### Vertical Section Spacing

| Context | Spacing |
|---|---|
| Between sections | `80px – 128px` |
| Inside cards / containers | `24px` or `32px` |

Smaller gaps (`20px`, `40px`) between sections make the page feel cluttered. Default to generous white space.

---

## 4. Critical Implementation Rules

### Use `rem` over `px`

Always define spacing in `rem` units. This ensures layouts scale proportionally when a user changes their browser's default font size for accessibility.

```css
/* Preferred */
padding-top: 5rem;

/* Avoid */
padding-top: 80px;
```

### Container Max-Width

Never let content expand to the absolute edges of ultrawide monitors. Apply a `max-width` and center with `margin: 0 auto`.

```css
.container {
  max-width: 1280px; /* or 1140px / 1440px depending on design */
  margin: 0 auto;
  padding-inline: 1.5rem;
}
```

Accepted max-width values: `1140px`, `1280px`, `1440px`.

### Consistency is King

Pick a spacing scale and never deviate from it. Consistency across the entire UI is more important than any individual spacing decision being "perfect."
