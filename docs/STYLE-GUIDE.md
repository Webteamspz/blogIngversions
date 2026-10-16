# Style Guide

How the blog looks and the CSS rules to follow. The design tokens live in `app/globals.css` (`:root`). Component styles are CSS Modules next to each component.

> The old [DESIGN.md](../DESIGN.md) (blue and black palette) is **obsolete**. Use this file.

## Palette

The brand uses **four accent colours only**:

| Token | Hex | Use |
|---|---|---|
| `--quaternary` | `#34d399` | green |
| `--tertiary` | `#fbbf24` | yellow |
| `--accent` | `#8b5cf6` | purple |
| `--secondary` | `#f472b6` | pink |

Rules:
- **Never introduce a new hex colour.** Banned for backgrounds, borders and shadows: sky blue `#38bdf8`, `--accent-soft`, `--accent-strong`.
- `--accent-strong` (`#7c3aed`) is allowed only for link, inline-code and marker **text** (for contrast).
- Make lighter tints with `color-mix(in srgb, var(--token) N%, var(--bg-800))`, not raw hex.
- When cards cycle through colours, card 5 repeats card 1 and card 6 repeats card 2.
- Category-card hover shadow is purple only.

Neutrals: text `--text-primary` `#1e293b`, `--text-muted` `#64748b`, `--text-subtle` `#475569`; backgrounds `--bg-950` `#fffdf5` (page), `--bg-800` `#ffffff` (cards), `--bg-700` `#f1f5f9`.

## Tokens

| Token | Value | Notes |
|---|---|---|
| `--border` | `#1e293b` | Dark outline used on cards and buttons |
| `--border-width` | `2px` | The "neo-brutalist" thick border |
| `--border-soft` | `rgba(30,41,59,.12)` | Subtle dividers |
| `--radius-sm/md/lg/full` | 8 / 16 / 24 / 9999 px | |
| `--shadow-pop` | `4px 4px 0 0 var(--border)` | Hard offset shadow, resting state |
| `--shadow-pop-hover` | `6px 6px 0 0 …` | On hover (desktop only) |
| `--shadow-pop-active` | `2px 2px 0 0 …` | Pressed |
| `--ease-pop` | `cubic-bezier(.34,1.56,.64,1)` | Bouncy hover transitions |

Look and feel: cream page background, white cards with 2 px dark borders, hard offset shadows, rounded corners, pastel accents.

## Fonts

- Headings: **Outfit** (`--font-outfit`), weights 600–800
- Body: **Plus Jakarta Sans** (`--font-plus-jakarta`), weights 400–700
- Below `767.98px` the body font is forced to `system-ui` for performance.
- Fonts are loaded in `app/layout.tsx` with `next/font/google`. Do not add `<link>` tags for fonts.

## Layout and responsive rules

- **One consistent 16 px gutter at every width.** Use `max-width: min(<cap>px, calc(100% - 32px))` with `margin-inline: auto`, not left/right padding.
- The article content column cap is **1228 px**. `.article-content-wrapper`, `.article-hero-wrapper` and `.back-link-wrapper` share the same `min(1228px, …)` box so every block lines up.
- **No horizontal page overflow** at 360, 390, 768, 834, 1280 and 1920 px. Test with `document.documentElement.scrollWidth - document.documentElement.clientWidth === 0`. (Off-screen Swiper slides are clipped, so they do not count.)
- To shrink a box to its content and centre it: `width: fit-content; margin-inline: auto; max-width: 100%`, plus `overflow-x: auto` as a safety net.
- A `display:flex` `<li>` loses its native marker. The flow lists rely on this. If you remove the flex, scope the rule under `.markdown-content` to override `.markdown-content ol`.
- Honour `prefers-reduced-motion`. The globals already do. Keep new animations behind the same media query.
- Hover effects are desktop-only: wrap them in `@media (min-width: 1024px)`.

## CSS conventions

- Component-scoped CSS Modules. Import as `styles` and use `styles.name` (or `styles["kebab-name"]` in `[slug]/`, which uses kebab-case classes).
- Reuse an existing token or pattern before adding a new value. Match the surrounding file's property order and naming.
- No Tailwind and no inline colours. Dynamic styling (colour per card, accent per section) should use a class chosen in code, not inline hex.

## Which stylesheet for what

| Area | File |
|---|---|
| Global tokens and resets | `app/globals.css` |
| Home page grid, hero, category cards | `app/components/BlogClient/BlogClient.module.css` |
| Header / Footer | `app/components/Header/…`, `app/components/Footer/…` |
| Legacy (markdown) article body and page chrome | `app/[slug]/ArticleDetail.module.css` |
| Structured article blocks | `app/[slug]/ArticleBlocks.module.css` |
| Popular-articles slider | `app/[slug]/PopularArticles.module.css` |
| FAQ accordion | `app/components/Faq/Faq.module.css` |
| Cookie banner | `app/components/Consent/Consent.module.css` |
| 404 | `app/not-found.module.css` |

Legacy and structured posts have **separate** flow-diagram styles (`.flow-steps*` versus `.flow`/`.flowStep`/`.flowCard`) on purpose. Change only the system you were asked about.

## Verifying a style change

CSS Modules are compiled at build time, so a running production server shows a stale build.

```bash
npm run build          # must finish green
npm start -- -p 4150   # then check the page at several widths
```

Check the exact element you changed, then the overflow check above at the listed widths. Use `npm run dev` for fast iteration.

## Accessibility basics

- Interactive elements are real `<button>` / `<a>` elements with visible focus.
- Images have meaningful `alt` (empty for decorative).
- The FAQ accordion uses `aria-expanded`, `aria-controls` and `role="region"`. Keep that pattern for new disclosure widgets.
- Keep colour contrast: coloured accents are for fills and borders, and body text stays dark.
