# Operations

Branches and releases, hosting, environment variables, the two API routes, analytics and cookie consent, security, and troubleshooting.

## Branches and releases

| Branch | Purpose | Vercel environment |
|---|---|---|
| `dev` | Day-to-day work | Preview |
| `Stage` (capital S) | Pre-production check | Preview |
| `main` | Production, serves https://blog.ingversionsdigital.com | Production |

Flow: **`dev` → `Stage` → `main`**. Production is only ever updated by merging a pull request into `main`.

### Everyday workflow

1. `git checkout dev`, make the change.
2. Verify locally: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
3. Commit with a short message (`fix: <thing>`, or a plain description) and push `dev`.
4. Open the Vercel Preview for `dev` and check it.
5. Merge `dev` into `Stage`, push, and check that preview.
6. Open a pull request `Stage` → `main`: https://github.com/Webteamspz/blogIngversions/compare/main...Stage. Merge it. Production redeploys.

Notes:
- Nothing is committed, pushed or merged without the owner's explicit approval. This applies to AI assistants too.
- The GitHub CLI (`gh`) is not installed on the team's machine, so pull requests are opened in the browser.
- Windows line endings: most files use LF. If `git diff` shows every line changed, a tool wrote CRLF. Convert it back to LF (`sed -i 's/\r$//' <file>`). `app/api/subscribe/route.ts` is the exception and uses CRLF.
- Never rewrite or force-push shared branches.

## Hosting (Vercel)

- Vercel builds on every push. The branch decides whether it is a Preview or Production deploy.
- Vercel's file system is **read-only at runtime**. Anything that "saves" content must commit to git (as `/api/posts` does).
- Preview deployments can be behind **Deployment Protection**, which returns 401 or a login page to `curl`. Use the browser, or a protection-bypass token, to test APIs on a preview.
- Environment variables are set per environment (Production / Preview / Development) in Vercel → Project → Settings → Environment Variables. **Changing one does not affect the running deployment. Redeploy to apply it.**

## Environment variables

None are needed to run `npm run dev`. All of the following are set in Vercel.

| Variable | Where | Used by | Notes |
|---|---|---|---|
| `BUTTONDOWN_API_KEY` | Production (and Preview if you test sign-ups) | `/api/subscribe` | Buttondown API token |
| `BLOG_API_TOKEN` | Production + Preview | `/api/posts` | Shared secret. Use a long random value (32+ characters) |
| `GITHUB_REPO` | Production + Preview | `/api/posts` | `owner/name`, for example `Webteamspz/blogIngversions` |
| `GITHUB_TOKEN` | Production + Preview | `/api/posts` | Fine-grained GitHub token, **Contents: read and write** on this repo only |
| `GITHUB_BRANCH` | per environment | `/api/posts` | Branch that receives the commit. Default `dev`. Set to `main` for Production |
| `GITHUB_API_URL` | optional | `/api/posts` | Override for GitHub Enterprise (default `https://api.github.com`) |
| `NEXT_PUBLIC_GA_ID` | **Production only** | Consent banner | GA4 Measurement ID (starts `G-`) |
| `NEXT_PUBLIC_CLARITY_ID` | **Production only** | Consent banner | Microsoft Clarity project ID |

`NEXT_PUBLIC_*` values are compiled into the browser bundle at build time. They are not secret, but they require a rebuild when changed.

## Analytics and cookie consent

- **Google Analytics 4** and **Microsoft Clarity** are loaded by `app/components/Consent/Consent.tsx`, and nowhere else.
- A banner asks visitors to Accept or Decline. The choice is stored in `localStorage` under `cookie-consent`. **Nothing loads until the visitor accepts.** Declining or ignoring the banner means no tracking.
- The banner links to the company privacy policy at https://ingversionsdigital.com/privacy-policy. The site's own `/privacy` redirects there, and the footer links to it too.
- **Rule: `dev` and `Stage` must not track.** They have no `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_CLARITY_ID`, so the component renders nothing. Do not hard-code IDs in source.
- **Before merging the consent banner to `main`:** `main`'s `app/layout.tsx` used to carry hard-coded GA4 and Clarity scripts. Remove them when merging, otherwise they would load before consent. Also set the two variables above for Production.
- GA4 setup: the Measurement ID is in GA4 → Admin → Data streams. To count newsletter conversions, create a key event for the sign-up (there is no `/thank-you` page today).
- To test: set the two variables in `.env.local`, run `npm run dev`, click Accept, and confirm requests to `googletagmanager.com` and `clarity.ms` in the Network tab. Clear the `cookie-consent` key to see the banner again.

## Newsletter subscribe

`POST /api/subscribe` with JSON `{ "email": "…" }` adds the address to Buttondown.

| Result | Meaning |
|---|---|
| 200 `{success:true}` | Subscribed |
| 400 | Missing or invalid email (checked on the server: type, 254-character limit, format) |
| 429 | More than 5 requests per minute from one IP |
| 5xx / Buttondown status | Buttondown rejected it (for example a duplicate), or the key is missing |

The rate limit is **in-memory per serverless instance**, so it is soft. For a hard cap, add a Vercel Firewall rate-limit rule on `/api/subscribe`. The route has no CAPTCHA or honeypot. Add Cloudflare Turnstile if spam appears.

At the time of writing there is no sign-up form in the UI that calls this route. Check before assuming one exists.

## The posts API

Full request and response reference: [CONTENT-GUIDE.md](CONTENT-GUIDE.md#way-3-the-api). Setup:

1. Create a **fine-grained GitHub token** from an account with write access to the repo, limited to this repository with **Contents: Read and write**. Put it in Vercel as `GITHUB_TOKEN`.
2. Set `GITHUB_REPO`, `GITHUB_BRANCH` and `BLOG_API_TOKEN` and redeploy.
3. Test on a Preview with a throwaway post, then delete the test post from `blogPosts.json`.

How it works: the route validates the body, rejects duplicate slugs, reads `app/data/blogPosts.json` from GitHub, appends the post and writes it back with the file's `sha` (retrying once on a conflict). The commit message is `Add blog post: <slug>`. Vercel sees the push and rebuilds.

Common failures:
- **502 "GitHub read failed (404)"**: `GITHUB_BRANCH` names a branch that does not have the file, or the token cannot see the repo.
- **401**: the Bearer token does not match `BLOG_API_TOKEN` in *that environment*. Preview and Production have separate values.
- **Works but nothing changes**: the commit landed on a branch other than the one being viewed.

**Rotating `BLOG_API_TOKEN`:** generate a long random value (for example `openssl rand -hex 32`), update it in Vercel for each environment, and redeploy. Do this whenever the token has been shared in a screenshot, chat or ticket.

## Security

Implemented in `next.config.ts` and the routes:

- **Headers on every response:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation off), plus `Strict-Transport-Security` from Vercel.
- **Content-Security-Policy-Report-Only.** It currently only *reports*. To enforce: load a Production preview, check the browser console for violations, then rename the header key to `Content-Security-Policy`. It allows scripts from the site, GA and Clarity only.
- **`/api/posts`:** Bearer token compared with `timingSafeEqual`, field-by-field validation, duplicate check.
- **`/api/subscribe`:** server-side email validation and rate limit.
- **Mermaid** runs with `securityLevel: "strict"`.
- **`robots.txt`** disallows `/api/`.
- JSON-LD is injected with `dangerouslySetInnerHTML` from build-time data only (not user input). Keep it that way.
- Dependencies: run `npm audit` periodically. After the Next 16.4.0 upgrade only two low-severity advisories (Mermaid, katex) remained. The fix would downgrade Mermaid, so it was skipped.

Never commit secrets. `.env*` files are for local use only.

## Pre-release checklist

Run before opening the `Stage` → `main` pull request:

- [ ] `npx tsc --noEmit` and `npm run build` pass; `npm run lint` shows no errors
- [ ] Home page, one structured post and one legacy post load on the Stage preview
- [ ] `/sitemap.xml` lists every post; `/robots.txt` loads; a made-up URL shows the 404 page with status 404
- [ ] `curl -I` shows the security headers
- [ ] No hard-coded GA / GTM / Clarity IDs in `app/` (`grep -rniE "G-[A-Z0-9]{8}|GTM-|clarity.ms" app`)
- [ ] Production has the environment variables it needs (table above)
- [ ] After merge: Production loads over https, the consent banner appears, Accept triggers GA4 in Realtime

## After a launch or major change (manual steps)

1. Google Search Console: verify the domain (DNS method is easiest).
2. Submit `https://blog.ingversionsdigital.com/sitemap.xml`.
3. URL Inspection → request indexing for the home page.
4. GA4 → Realtime: open the live site, accept cookies, confirm the visit appears.

## Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| New post not on the site | Deploy has not finished, or it was added on a different branch. Check the Vercel deployment for the branch you are viewing |
| New post 404s locally | Dev server cached data. Restart `npm run dev` |
| Post on its page but not on the home page | Legacy post missing its card in `blogData.ts` |
| Wrong or generic cover on a legacy post | Missing entry in `articleImages.ts` |
| Build fails on type errors | Run `npx tsc --noEmit`. The JSON in `blogPosts.json` must satisfy the block types |
| Style change not visible on `npm start` | Production server serves a stale build. Rebuild |
| `Cannot find module 'lucide-react'` etc. | Run `npm install` |
| Everything shows as modified in git | Line-ending change. Restore LF |
| Banner never appears on a preview | By design: no `NEXT_PUBLIC_GA_ID`/`CLARITY_ID` means no banner |
