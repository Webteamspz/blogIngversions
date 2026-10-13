# Content Guide

How to publish, edit and remove blog posts. For how posts are rendered, see [ARCHITECTURE.md](ARCHITECTURE.md#the-content-model-two-kinds-of-post).

## Choose how to add a post

| Way | Best for | Needs |
|---|---|---|
| **1. Edit `blogPosts.json`** | Most posts. Full control of layout | Git access |
| **2. Add a legacy markdown post** | A plain text article with no special layout | Git access; touches 3 files |
| **3. The API** | Adding a structured post without opening the repo (scripts, automation) | `BLOG_API_TOKEN` |

Prefer **structured posts** (way 1 or 3). The home card, popular slider, sitemap, JSON-LD and SEO fields are all generated automatically. Legacy posts need several manual registrations.

Every post, whichever way it is added, needs:
- a **unique slug** (lowercase kebab-case, for example `how-to-test-checkout`), unique across *both* systems
- a **cover image** under `public/assets/blog/covers/`
- a date in the form `October 7, 2026`

## Way 1: add a structured post by editing JSON

1. Copy the `post` object from [`app/data/blogPostTemplate.json`](../app/data/blogPostTemplate.json). It contains a worked example of every block type.
2. Append it to the array in [`app/data/blogPosts.json`](../app/data/blogPosts.json). Remove the template's `_heroRight` hint key, and keep the real fields.
3. Add the cover image (see [Images](#images)).
4. Run `npm run dev` and open `http://localhost:3000/<slug>`.
5. Run `npm run build` to confirm it compiles. Then commit on `dev`.

The post appears on the home page, in the popular slider and in `sitemap.xml` with no other edits. The home page sorts all posts by date, newest first.

### Post shape

```jsonc
{
  "slug": "my-post",                       // kebab-case, unique
  "seo": {
    "title": "Page title | Ingversions Blog",
    "description": "1-2 sentence summary shown in search results",
    "keywords": ["cro", "shopify"],
    "canonical": "https://blog.ingversionsdigital.com/my-post"
  },
  "meta": {
    "category": "CRO",                     // label shown on cards
    "categorySlug": "cro",
    "date": "October 7, 2026",             // must parse as a date
    "readTime": "8 min read",
    "coverImage": "/assets/blog/covers/my-post.jpg",
    "author": { "name": "Ingversions Team", "avatar": "/assets/team/author-1.png" }
  },
  "hero": {
    "title": "Headline",
    "excerpt": "Shown under the headline and on the card",
    "badges": [{ "label": "CRO", "color": "purple" }],
    "highlights": [{ "icon": "zap", "color": "purple", "label": "Short benefit" }],
    "image": { "src": "/assets/blog/covers/x.jpg", "alt": "describe it" }   // optional; wins over highlights
  },
  "toc": { "eyebrow": "ARTICLE NAVIGATION", "title": "Table of Contents", "generateFromSections": true, "items": [] },
  "intro": [ { "type": "paragraph", "text": "Opening paragraph" } ],
  "body": {
    "sections": [
      { "id": "why", "number": 1, "accent": "yellow", "heading": "Why it matters", "blocks": [ /* see Block types */ ] }
    ]
  },
  "faq": { "id": "faq", "heading": "FAQ", "items": [{ "q": "Question?", "a": "Answer." }] },   // or null
  "cta": { "heading": "Ready?", "text": "…", "buttonLabel": "Book a call", "buttonLink": "https://…" }  // or null
}
```

Rules of thumb:
- Never delete a key you are not using. Set it to `null` or `[]` (the template says the same).
- With `toc.generateFromSections: true` and empty `items`, the table of contents is built from section headings (plus the FAQ). Fill `items` only to override labels, order or icons.
- Each section's `id` is the anchor for the table of contents. Keep it unique and URL-safe.
- Sections cycle accent colours `yellow → purple → pink` by convention. The only colours allowed are `yellow`, `purple`, `pink` and `green` (see [STYLE-GUIDE.md](STYLE-GUIDE.md#palette)).
- `icon` values are `lucide-react` names in kebab-case (`zap`, `bar-chart-3`, `check-circle`, `lightbulb`, …). Browse them at lucide.dev.

### Inline text

Any `text` field supports: `**bold**`, `==highlight==`, `[label](https://url)` and `` `inline code` ``.

### Block types

| `type` | Fields |
|---|---|
| `paragraph` | `text` |
| `list` | `ordered` (bool), `items` (string[]) |
| `callout` | `variant` (`star` \| `info` \| `warning` \| `success`), `icon`, `title` (or null), `text`, `items` (or null) |
| `protip` | `label` (default "PRO TIP"), `icon`, `text`, `checklist` (string[]) |
| `featureGrid` | `columns`, `items[]` of `{ icon, color, title, text }` |
| `flowDiagram` | `steps[]` of `{ icon, color, title, subtitle }` |
| `stepList` | `color`, `steps[]` of `{ title, text }` |
| `image` | `src`, `alt`, `caption` (or null) |
| `quote` | `text`, `cite` (or null) |
| `code` | `language`, `code` (use `language: "mermaid"` for diagrams) |
| `table` | `headers` (string[]), `rows` (string[][]) |
| `divider` | none |

## Way 2: add a legacy markdown post

Use only when you want a simple markdown article. Three files must change, and forgetting one means the post is missing from the home page or has the wrong image.

1. **Body:** add an entry to `articles` in `app/data/articlesData.ts`:
   ```ts
   "my-slug": {
     title: "…", category: "CRO", categorySlug: "cro",
     date: "October 7, 2026", readTime: "6 min read",
     content: `## Heading\nMarkdown body…`,
   },
   ```
   Use `##` and `###` headings. Code fences are supported, including ` ```mermaid `. Linear `graph TD` flows are drawn as a simple step list. Branching graphs become real mermaid SVGs.
2. **Cover image:** add `"my-slug": "/assets/blog/covers/…jpg"` to `articleImages` in `app/data/articleImages.ts`. Without it, the category fallback image is used.
3. **Home card:** add a card object (id, title, slug, excerpt, author, date, readTime, category, coverImage) to the `posts` array in `app/data/blogData.ts`. Use the next `post-NN` id.

The description for SEO is taken from the first 160 characters of the body, so make the opening paragraph a good summary.

## Way 3: the API

`POST /api/posts` appends a structured post to `blogPosts.json` by making a commit through the GitHub Contents API. The push triggers a Vercel rebuild, and the post goes live in about a minute.

```bash
curl -X POST https://<deployment-url>/api/posts \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data @my-post.json
```

PowerShell users should run the same call with `curl.exe` or `Invoke-RestMethod`, since `curl` there is an alias.

- **Body:** the same shape as a `post` above. Required: `slug`, `seo.title`, `seo.description`, `meta.category`, `meta.categorySlug`, `meta.date`, `meta.readTime`, `meta.coverImage`, `hero.title`, `hero.excerpt`, `hero.badges`, `intro` (array), `body.sections` (non-empty, each with `id`, `heading`, `blocks`).
- **Defaults filled in for you:** `seo.keywords` (`[]`), `seo.canonical`, `meta.author`, `toc` (auto-generated), `faq` (null), `cta` (null).
- **Responses:**

| Status | Meaning |
|---|---|
| 201 | Created. Body: `{ ok, slug, branch, url }` |
| 401 | Missing or wrong token |
| 409 | Slug already exists (in either system), or a write conflict that did not clear after one retry |
| 422 | Validation failed. `problems[]` lists each issue |
| 400 | Body is not JSON |
| 502 | GitHub read or write failed. Check `GITHUB_REPO`, `GITHUB_TOKEN` and `GITHUB_BRANCH` |
| 503 | Server is missing `GITHUB_REPO` or `GITHUB_TOKEN` |

- **Which branch gets the commit** is set by `GITHUB_BRANCH` (default `dev`). The Production deployment should use `main`. Setup and rotation are in [OPERATIONS.md](OPERATIONS.md#the-posts-api).
- The API cannot upload images. Commit the cover image to `public/assets/blog/covers/` first and reference its path.
- To **remove** a post added by the API, delete its object from `blogPosts.json` in git (or `git revert` the `Add blog post: <slug>` commit).

## Images

- Cover images go in `public/assets/blog/covers/`. Use **JPEG, at most 1600 px wide, quality about 76** (target under 300 KB). The 25 covers in the repo were compressed this way.
- Use a **unique image per post.** Do not reuse an image already used by another post.
- Reference images by absolute path from `public/` (for example `/assets/blog/covers/x.jpg`). Do not include `public` in the path.
- Always write meaningful `alt` text for content images. Use `alt=""` only for decorative ones.
- Flowchart images go in `public/diagrams/`.
- The `og:image` for structured posts is `meta.coverImage`. The recommended share size is 1200 × 630.

## Editing and removing posts

- **Edit** text: change it in `blogPosts.json` (structured) or `articlesData.ts` (legacy).
- **Change a slug:** it is the public URL, so also add a redirect in `next.config.ts` (`redirects()`) from the old path to the new, or inbound links will 404.
- **Remove:** delete the data, the home card (legacy only), the image mapping and the cover file. Add a redirect if the post had traffic.

## Pre-publish checklist

- [ ] Slug is unique, lowercase kebab-case
- [ ] Title is short, with a unique SEO title; description is 1–2 sentences
- [ ] Date parses (for example `October 7, 2026`) and read time is set
- [ ] Cover image is compressed, unique, and the path resolves
- [ ] Every image has alt text
- [ ] `npm run build` passes and the page looks right at phone width
- [ ] The post is in the sitemap (`/sitemap.xml`) after deploy
