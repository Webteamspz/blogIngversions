# Architecture

How the blog is built and how a request becomes a page. Read this first if you are new to the codebase.

## Stack

| Piece | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack). Newer than most tutorials, so read `node_modules/next/dist/docs/` before using a Next API |
| UI | React 19, TypeScript (strict) |
| Styling | CSS Modules (`*.module.css`) plus design tokens in `app/globals.css`. No Tailwind |
| Icons | `lucide-react` |
| Article body | `react-markdown` for legacy posts, a custom block renderer for structured posts |
| Diagrams | `mermaid` (client-side) |
| Carousel | `swiper` (the "Most Popular Articles" slider) |
| Hosting | Vercel (static output, plus two serverless API routes) |
| Newsletter | Buttondown (via `/api/subscribe`) |

There is **no database and no CMS**. All content is code and JSON in `app/data/`. Publishing a post means changing those files and deploying.

## Folder guide

```
app/
├── layout.tsx              Root layout. Loads fonts (Outfit, Plus Jakarta Sans), renders
│                           Header, <main>, Footer, Consent banner. Emits Organization JSON-LD.
├── globals.css             :root design tokens + global rules
├── layout.module.css       Layout shell styles
├── page.tsx                Home page: SEO metadata + <BlogClient />
├── not-found.tsx           Custom 404 (returns a real 404 status)
├── robots.ts               robots.txt (allows /, disallows /api/, points to sitemap)
├── sitemap.ts              sitemap.xml built from every post
├── [slug]/                 The article page
│   ├── page.tsx            generateStaticParams, generateMetadata, JSON-LD, picks a renderer
│   ├── ArticleBlocks.tsx   Renderer for structured posts (block types, TOC, FAQ, CTA)
│   ├── ArticleBlocks.module.css
│   ├── ArticleDetail.module.css   Styles for legacy markdown posts + page chrome
│   ├── CodeBlock.tsx       Code block with copy button (markdown posts)
│   ├── GetStartedBtn.tsx   CTA button
│   ├── PopularArticles.tsx "Most Popular Articles" Swiper slider
│   └── PopularArticles.module.css
├── api/
│   ├── subscribe/route.ts  POST: newsletter sign-up -> Buttondown
│   └── posts/route.ts      POST: token-protected, adds a structured post via the GitHub API
├── components/
│   ├── Header/  Footer/    Site chrome. Their link lists come from blogData.ts
│   ├── BlogClient/         Home page hero, category grid, article cards, filtering
│   ├── Faq/                Accessible accordion used by structured posts
│   ├── Consent/            Cookie banner; loads GA4 and Clarity only after Accept
│   ├── Mermaid.tsx         Renders ```mermaid blocks
│   └── ScrollToTop/
└── data/                   ALL CONTENT (see below)
public/
├── assets/blog/covers/     Article cover images (jpg, max 1600px wide)
├── assets/blog/videos/     Optional article videos
├── diagrams/               Flowchart PNGs used inside posts
└── logos/                  Site and favicon logos
next.config.ts              Redirects (/blog -> /, /privacy -> external) and security headers
```

## The content model: two kinds of post

This is the single most important thing to understand. There are two post systems that coexist.

| | **Legacy (markdown) posts** | **Structured posts** |
|---|---|---|
| Where | `app/data/articlesData.ts`, an object keyed by slug | `app/data/blogPosts.json`, an array |
| Count | 41 | grows over time (via editing or the API) |
| Body | One markdown string | `intro` and `body.sections[]`, each a list of typed blocks |
| Renderer | `react-markdown` inside `[slug]/page.tsx` | `[slug]/ArticleBlocks.tsx` |
| Styles | `ArticleDetail.module.css` | `ArticleBlocks.module.css` |
| SEO | Derived: title from heading, description from the first 160 characters | Explicit `seo` object |
| Cover image | `articleImages.ts`, else a category fallback | `meta.coverImage` |
| Home-page card | Handwritten entry in `blogData.ts` | Generated automatically by `toCard()` |

A visual fix on one system is **not** applied to the other unless asked. Check which kind of post you are looking at before editing CSS.

### How data flows

```
articlesData.ts (legacy) ─┐
                          ├─► [slug]/page.tsx ─► page HTML  (static at build)
blogPosts.json ──► structuredPosts.ts ┘
                          │
                          ├─► blogData.ts: posts[] = structured cards (newest first) + legacy cards
                          │       ├─► BlogClient (home grid, category filters)
                          │       └─► PopularArticles (slider on article pages)
                          └─► sitemap.ts (one entry per slug)
```

- `structuredPosts.ts` is the typed gateway to `blogPosts.json`. It exports `structuredPosts`, `getStructuredPost(slug)`, `resolveToc(post)` and `toCard(post, i)`.
- `blogData.ts` also holds the **site config**: header links, hero text, footer columns and socials, and the home-page card list.
- `articleImages.ts` maps legacy slugs to cover images and has per-category fallbacks.
- **Slugs are global**: a slug must be unique across both systems. The API enforces this with a 409 on duplicates.

## Request lifecycle for an article

1. At **build time**, `generateStaticParams()` in `[slug]/page.tsx` collects every slug from both systems. Each becomes a static page.
2. `generateMetadata()` builds the `<title>`, description, canonical URL, Open Graph and Twitter tags. Structured posts use their `seo` object. Legacy posts derive these values.
3. The page component checks `getStructuredPost(slug)` first and renders `<ArticleBlocks>` if found. Otherwise it looks in `articles[slug]` and renders markdown. If neither exists it calls `notFound()`.
4. Both branches add a `BlogPosting` JSON-LD script (headline, absolute image URL, ISO `datePublished`, publisher) and the `PopularArticles` slider.

**New content only appears after a rebuild.** On Vercel a git push triggers it. Locally, restart `npm run dev` or rebuild if data changes do not show up.

## Structured post renderer (ArticleBlocks.tsx)

Renders, in order: hero (badges, title, excerpt, highlights, image), a sticky table of contents (`resolveToc`), the `intro` blocks, each section (number chip, heading, blocks), the FAQ accordion if `faq` is set, and the CTA if `cta` is set.

Supported block types: `paragraph`, `list`, `callout`, `protip`, `featureGrid`, `flowDiagram`, `stepList`, `image`, `quote`, `code`, `table`, `divider`. The full field list for each is in [CONTENT-GUIDE.md](CONTENT-GUIDE.md#block-types).

Inline text supports `**bold**`, `==highlight==`, `[label](url)` and `` `code` ``.

## Home page (BlogClient)

`BlogClient.tsx` is a client component. It reads `blogData.posts`, derives a `categorySlug` from each category name, and sorts by date descending. It builds the category list with counts and filters in state when a category card is clicked. Category slugs come from `getCategorySlug()`: "Shopify Development" → `shopify`, "A/B Testing" → `ab-testing`, "Quality Assurance" → `qa`, "CRO" → `cro`, anything else is kebab-cased. If you add a post in a new category, it appears automatically as a new category.

## API routes

| Route | Purpose | Auth | Details |
|---|---|---|---|
| `POST /api/subscribe` | Add an email to Buttondown | none, rate limited | [OPERATIONS.md](OPERATIONS.md#newsletter-subscribe) |
| `POST /api/posts` | Add a structured post | `Authorization: Bearer $BLOG_API_TOKEN` | [CONTENT-GUIDE.md](CONTENT-GUIDE.md#way-3-the-api) |

Both routes run on Vercel serverless functions. Vercel's disk is **read-only**, so `/api/posts` cannot write the JSON file. It commits to GitHub through the Contents API and the resulting push triggers a rebuild.

## SEO and metadata

- `app/layout.tsx` provides defaults (`metadataBase`, icons, viewport theme colour) and `Organization` JSON-LD.
- Canonical URLs always use `https://blog.ingversionsdigital.com`.
- `sitemap.ts` merges both post systems into one map (slug → date) and lists every post.
- `robots.ts` allows crawling of `/` and blocks `/api/`.
- A page should have a unique title, a 1–2 sentence description, `og:*`/`twitter:*` tags and an absolute `og:image`.

## Client-side tracking

`components/Consent/Consent.tsx` is the **only** place analytics are loaded. It reads `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_CLARITY_ID`. If neither is set (as on `dev` and `Stage`) it renders nothing. Details in [OPERATIONS.md](OPERATIONS.md#analytics-and-cookie-consent).
