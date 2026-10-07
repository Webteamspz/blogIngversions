import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { articles } from "../../data/articlesData";
import { structuredPosts, type StructuredPost } from "../../data/structuredPosts";

// POST /api/posts  (Authorization: Bearer $BLOG_API_TOKEN)
// Adds one structured post to app/data/blogPosts.json by committing to GitHub.
// Vercel's disk is read-only, so the commit is what triggers the rebuild that publishes it.
const FILE = "app/data/blogPosts.json";
const SITE = "https://blog.ingversionsdigital.com";
const GH = process.env.GITHUB_API_URL ?? "https://api.github.com";

// untrusted input: validated field by field in problems()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;
const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
const isStr = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";

function authorized(req: Request) {
  const token = process.env.BLOG_API_TOKEN;
  const given = req.headers.get("authorization")?.replace(/^Bearer /i, "") ?? "";
  if (!token || given.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(token));
}

function problems(p: Loose): string[] {
  const bad: string[] = [];
  const need = (ok: boolean, msg: string) => ok || bad.push(msg);
  need(isStr(p.slug) && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug), "slug must be lowercase-kebab-case");
  need(isStr(p.seo?.title) && isStr(p.seo?.description), "seo.title and seo.description are required");
  need(isStr(p.meta?.category) && isStr(p.meta?.categorySlug), "meta.category and meta.categorySlug are required");
  need(isStr(p.meta?.date) && !isNaN(Date.parse(p.meta.date)), "meta.date must be a date like 'October 7, 2026'");
  need(isStr(p.meta?.readTime) && isStr(p.meta?.coverImage), "meta.readTime and meta.coverImage are required");
  need(isStr(p.hero?.title) && isStr(p.hero?.excerpt) && Array.isArray(p.hero?.badges), "hero.title, hero.excerpt and hero.badges are required");
  need(Array.isArray(p.intro), "intro must be an array of blocks");
  need(Array.isArray(p.body?.sections) && p.body.sections.length > 0, "body.sections must be a non-empty array");
  for (const [i, s] of (p.body?.sections ?? []).entries()) {
    need(isStr(s?.id) && isStr(s?.heading) && Array.isArray(s?.blocks), `body.sections[${i}] needs id, heading and blocks`);
  }
  return bad;
}

export async function POST(req: Request) {
  if (!authorized(req)) return fail("Unauthorized", 401);

  const repo = process.env.GITHUB_REPO; // "owner/name"
  const ghToken = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH ?? "dev";
  if (!repo || !ghToken) return fail("Server is missing GITHUB_REPO / GITHUB_TOKEN", 503);

  let body: Loose;
  try {
    body = await req.json();
  } catch {
    return fail("Body must be JSON", 400);
  }

  const bad = problems(body);
  if (bad.length) return NextResponse.json({ error: "Invalid post", problems: bad }, { status: 422 });
  if (body.slug in articles || structuredPosts.some((p) => p.slug === body.slug)) {
    return fail(`Slug "${body.slug}" already exists`, 409);
  }

  // defaults so a caller only sends the content
  const post = {
    ...body,
    seo: { keywords: [], canonical: `${SITE}/${body.slug}`, ...body.seo },
    meta: { author: { name: "Ingversions Team", avatar: "/assets/team/author-1.png" }, ...body.meta },
    toc: body.toc ?? { eyebrow: "ARTICLE NAVIGATION", title: "Table of Contents", generateFromSections: true, items: [] },
    faq: body.faq ?? null,
    cta: body.cta ?? null,
  } as StructuredPost;

  const url = `${GH}/repos/${repo}/contents/${FILE}`;
  const headers = { Authorization: `Bearer ${ghToken}`, Accept: "application/vnd.github+json", "User-Agent": "ingversions-blog-api" };

  // read -> append -> write; GitHub rejects the write (409) if the file changed in between, so retry once
  for (let attempt = 0; attempt < 2; attempt++) {
    const cur = await fetch(`${url}?ref=${branch}`, { headers, cache: "no-store" });
    if (!cur.ok) return fail(`GitHub read failed (${cur.status})`, 502);
    const file = await cur.json();
    const posts: StructuredPost[] = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
    if (posts.some((p) => p.slug === post.slug)) return fail(`Slug "${post.slug}" already exists`, 409);

    const put = await fetch(url, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Add blog post: ${post.slug}`,
        content: Buffer.from(JSON.stringify([...posts, post], null, 2) + "\n").toString("base64"),
        sha: file.sha,
        branch,
      }),
    });
    if (put.ok) return NextResponse.json({ ok: true, slug: post.slug, branch, url: `${SITE}/${post.slug}` }, { status: 201 });
    if (put.status !== 409) return fail(`GitHub write failed (${put.status})`, 502);
  }
  return fail("Conflict while saving, try again", 409);
}
