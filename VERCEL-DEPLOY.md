# Deploying a second copy to Vercel

Everything on the code side is ready — `npm run build` now emits `dist/vercel.json`
carrying the same security headers as the Netlify copy. All that is missing is a token.

## Add these to `.env`

```bash
# --- Vercel ---
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
```

### `VERCEL_TOKEN` — required

1. Go to <https://vercel.com/account/settings/tokens>
   (avatar → **Settings** → **Tokens**)
2. **Create Token**
   - **Name:** `portfolio-deploy`
   - **Scope:** select your personal account, or the team that will own the project.
     Choosing the narrowest scope that works limits the blast radius if it leaks.
   - **Expiration:** pick a real expiry, not "never" — 90 days is a sensible default.
3. Copy it **immediately**; Vercel shows it exactly once.

### `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — required for non-interactive deploys

Easiest route — let the CLI generate them:

```bash
npx vercel@latest login
npx vercel@latest link          # answer the prompts, creates the project
cat .vercel/project.json        # contains orgId and projectId
```

Copy `orgId` → `VERCEL_ORG_ID`, `projectId` → `VERCEL_PROJECT_ID`.

Or read them from the dashboard: **Project → Settings → General → Project ID**, and
**Account/Team → Settings → General → Team ID** (for a personal account the org ID is
your user ID, shown in the same place).

> `.vercel/` is already covered by `.gitignore` via the `.netlify`-style entries? **It is
> not** — add `.vercel` to `.gitignore` before this directory becomes a git repository.

## Then tell me and I will deploy

The deploy itself is:

```bash
npm run build
npx vercel@latest deploy --prod --archive=tgz \
  --token "$VERCEL_TOKEN" --yes ./dist
```

Deploying `./dist` (not the project root) matters: Vercel then reads the freshly
generated `dist/vercel.json`, so the CSP script hashes always match the build being
served.

---

## ⚠️ Read this before going live — duplicate content

Two public copies of the same site is an **SEO problem, not a bonus**. Google will see
identical content on two domains, pick one itself, and may split ranking signals across
both. That directly undercuts the indexing work already done.

Pick one before deploying:

**A. Netlify stays primary (recommended if you keep the current URL).**
The Vercel copy is a warm standby. Give it `noindex` so it never competes:
add to `dist/vercel.json` headers → `X-Robots-Tag: noindex, nofollow`.
I can wire this behind a build flag.

**B. Vercel becomes primary.**
Then the canonical URL, `og:url`, JSON-LD `@id`s, `robots.txt` sitemap line and
`sitemap.xml` `<loc>` must all be updated to the Vercel domain, and Search Console
re-verified against it. Roughly a ten-minute change — tell me and I will do it.

**C. Buy a custom domain and point it at whichever host you prefer.**
This is the strongest option: `akinrimisi.com` outranks any `*.netlify.app` or
`*.vercel.app`, reads better on a CV, and makes the host an implementation detail you
can switch without touching SEO again.

My recommendation: **C if you are willing to spend ~$12/year, otherwise A.**

## Also worth knowing

- Netlify and Vercel both auto-provision HTTPS, so HSTS stays valid on either.
- The Vercel copy will **not** inherit Netlify's automatic 404 handling for
  `404.html` — Vercel serves it for unmatched routes only if the file exists at the
  output root, which it does. Verify with `curl -o /dev/null -w '%{http_code}'` against
  a nonsense path after the first deploy; if it returns 200, tell me and I will add an
  explicit route.
- Run `cd scripts && TARGET=<vercel-url> node csp-test.mjs` after deploying. It fails
  loudly on any CSP violation, console error, or third-party request.
