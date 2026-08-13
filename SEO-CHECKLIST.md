# Getting this site into Google

Status as of 2026-08-13. Everything in "Done" is deployed and verified live.

## Done — in code

| Item | Verified |
|---|---|
| `robots.txt` allowing crawl, pointing at the sitemap | `curl /robots.txt` returns the real file, `text/plain` |
| `sitemap.xml` | returns real XML, `application/xml` |
| Meta title + description (description trimmed under ~155 chars so Google does not truncate) | in `index.html` |
| `robots` / `googlebot` meta: `index, follow, max-image-preview:large` | in `index.html` |
| Canonical URL | `<link rel="canonical">` |
| JSON-LD structured data: `ProfilePage` + `WebSite` + `Person` | parses; `sameAs` links LinkedIn + GitHub |
| Open Graph + Twitter card with a real 1200×630 image | unfurls on LinkedIn/WhatsApp/Slack |
| **Prerendered HTML** — 10,324 chars of crawlable text | was an empty `<div id="root">` |
| **Real 404s** — `/anything-else` returns 404, not 200 | previously every URL returned the full page |
| Mobile-friendly, no horizontal overflow, 44px tap targets | `npm run audit` across 5 device widths |
| Semantic headings, one `h1`, image alt text | — |

## You must do these — they need your Google account

Google will not index a brand-new site quickly on its own. These three steps are the
difference between "indexed this week" and "indexed eventually".

### 1. Google Search Console  ← the single highest-value action

1. Go to <https://search.google.com/search-console>
2. **Add property → URL prefix** → `https://akinwunmi-akinrimisi.netlify.app`
3. Choose **HTML tag** verification. It gives you a line like
   `<meta name="google-site-verification" content="XXXXX" />`
4. Send me that line and I will add it to `index.html` and redeploy — or paste it
   yourself just below the `<meta name="author">` tag, then `npm run build` and deploy.
5. Back in Search Console, click **Verify**.

*(Alternative with no code change: Netlify → Domain settings → DNS. But the HTML tag is
faster here since the domain is a Netlify subdomain.)*

### 2. Submit the sitemap

In Search Console → **Sitemaps** → enter `sitemap.xml` → Submit.

### 3. Request indexing

Search Console → **URL Inspection** → paste the homepage URL → **Request indexing**.
This pushes you into the crawl queue instead of waiting to be discovered. Expect
anywhere from a day to two weeks for the first appearance.

Check progress by searching `site:akinwunmi-akinrimisi.netlify.app` — when that returns
the page, you are indexed.

## Worth doing next

- **Bing Webmaster Tools** (<https://www.bing.com/webmasters>) — imports directly from
  Search Console in two clicks, and also feeds ChatGPT search results.
- **A custom domain.** `akinwunmi-akinrimisi.netlify.app` will always rank below a real
  domain like `akinrimisi.com`, and it looks stronger on a CV. If you buy one, point it
  at Netlify and then update the hardcoded URLs in `index.html` (canonical, OG, JSON-LD),
  `public/robots.txt` and `public/sitemap.xml`.
- **Link to it from profiles you already own** — LinkedIn "Website" field, GitHub
  profile README and bio. Google discovers new sites primarily through links, and these
  are the fastest legitimate backlinks available to you.
- Keep `<lastmod>` in `sitemap.xml` current when you make real content changes.

## Keyword targets

The page is written to rank for: *Cloud DevOps Engineer*, *AI automation engineer*,
*n8n automation*, *AWS DevOps Nigeria*, and the exact-name query *Akinwunmi Akinrimisi*.
The name query is the realistic near-term win — the generic role terms are highly
competitive and would need a custom domain plus backlinks to compete.
