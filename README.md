# Ingversions Blog

The blog for Ingversions Digital, live at **https://blog.ingversionsdigital.com**. It publishes articles on conversion rate optimisation (CRO), A/B testing, Shopify development and QA.

Built with **Next.js 16 (App Router, Turbopack)**, **React 19**, **TypeScript** and **CSS Modules**, hosted on **Vercel**. Every page is statically generated at build time.

> **Next.js 16 differs from older versions.** Before writing any Next.js code, read the matching guide in `node_modules/next/dist/docs/` (see [AGENTS.md](AGENTS.md)).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm start          # serve the production build
npm run lint       # eslint
```

Requires Node 20+ (Next 16). No environment variables are needed to run locally. The optional ones are listed in [docs/OPERATIONS.md](docs/OPERATIONS.md#environment-variables).

## Documentation

| Read this | When you want to |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Understand how the site is built: folders, routing, data flow, how a page gets rendered |
| [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) | Add or edit a blog post (three ways), the post JSON format, images, SEO fields |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Branches and releases, Vercel, environment variables, API, analytics and consent, security, troubleshooting |
| [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) | Change the look: palette, tokens, layout rules, CSS conventions |
| [AGENTS.md](AGENTS.md) / [CLAUDE.md](CLAUDE.md) | Rules for AI coding assistants working in this repo |
| [.claude/agents/blog-polish.md](.claude/agents/blog-polish.md) | The visual-polish agent's playbook (also a good summary of CSS rules) |

## Repository map

```
app/
  layout.tsx            Root layout: fonts, Header, Footer, consent banner, Organization JSON-LD
  page.tsx              Home page (metadata + <BlogClient>)
  [slug]/               One article page for every post (static, generateStaticParams)
  api/subscribe/        Newsletter sign-up -> Buttondown
  api/posts/            Token-protected API that adds a post by committing to GitHub
  components/           Header, Footer, BlogClient (home grid), Faq, Consent, Mermaid, ScrollToTop
  data/                 All content: articlesData.ts, blogPosts.json, blogData.ts, templates
  robots.ts, sitemap.ts Generated robots.txt and sitemap.xml
  not-found.tsx         Custom 404
public/                 Static files: logos, blog cover images, diagrams, videos
next.config.ts          Redirects and security headers
docs/                   This documentation
```

## Branches in one minute

`dev` → `Stage` → `main`. Work happens on `dev`, is verified on a Vercel preview, then merged up through a pull request. `main` is production. Analytics scripts exist **only** in Production (see [docs/OPERATIONS.md](docs/OPERATIONS.md#branches-and-releases)).

## Legacy design concept

[DESIGN.md](DESIGN.md) is the original April 2026 design concept. It no longer matches the live design (the live palette is in [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md)). Keep it only as history. [linkedin-posts.md](linkedin-posts.md) is marketing copy for promoting the blog, not technical documentation.
