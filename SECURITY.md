# Security review

Reviewed and hardened 2026-08-13. Every line below was verified against the live
site, not inferred from the source.

## Threat model — read this first

This is a **static site**: no backend, no database, no authentication, no forms, no
user input, no cookies, no analytics. That eliminates whole vulnerability classes by
construction — SQL injection, broken auth, IDOR, SSRF, CSRF, session fixation, mass
assignment. None of them have anywhere to live here.

What genuinely remains: **credential hygiene** for the deploy pipeline, **supply-chain
exposure** through third-party origins and npm packages, **transport and header
hardening**, and **information disclosure** through published files.

Anyone claiming to have found a "critical XSS" or "SQLi" on this site is describing
something that does not exist. Judge findings against the surface that is actually here.

---

## Checklist

### 1. Credentials and secrets

| Check | Result |
|---|---|
| Secret patterns in built output (`dist/`) | ✅ none — grepped for `nfp_`, `monid_live_`, `sk-`, `ghp_`, `AKIA…` |
| `.env` inside the publish directory | ✅ no |
| `.env` reachable over HTTP | ✅ 404 |
| `VITE_`-prefixed vars (Vite **inlines these into the public bundle**) | ✅ none defined |
| `.env` in `.gitignore` | ✅ yes |
| Sourcemaps published (source disclosure) | ✅ none in `dist/` |

⚠️ **Outstanding, requires the owner — see "Rotate these credentials" below.**

### 2. Information disclosure

| Check | Result |
|---|---|
| `/.env`, `/.git/config`, `/package.json`, `/netlify.toml`, `/src/*`, `/scripts/*`, `/.netlify/state.json` | ✅ all 404 |
| `/akin.png` (2.1 MB unprocessed original) | ✅ 404 — not published |
| Unknown paths return 404, not 200 | ✅ fixed (was serving the full site at every URL) |
| Published CV PDF metadata | ✅ title + "Google Docs Renderer" only; no author path, no phone, address, DOB or national ID |
| EXIF/GPS in published images | ✅ 0 tags — stripped by the Pillow re-encode |
| Directory listing | ✅ not enabled by Netlify |

### 3. Transport and headers — all verified live

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `Content-Security-Policy` | `default-src 'self'` + per-build script hashes — see below |
| `X-Frame-Options` | `DENY` (clickjacking) |
| `X-Content-Type-Options` | `nosniff` (MIME confusion) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, mic, geolocation, USB, serial, payment + 15 more denied |
| `Cross-Origin-Opener-Policy` | `same-origin` (cross-window attacks) |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `X-DNS-Prefetch-Control` | `off` |

HTTPS is enforced by Netlify; HSTS is preload-eligible.

### 4. Content Security Policy

```
default-src 'self'; script-src 'self' 'sha256-…' 'sha256-…';
style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';
frame-ancestors 'none'; manifest-src 'self'; upgrade-insecure-requests
```

Verified in a real browser: **zero CSP violations, zero console errors.**

**Script hashes are generated at build time** by `scripts/gen-headers.mjs`, never
hardcoded. A hash that drifts from the script it authorises fails *silently* — the page
still serves, the script is simply blocked. Deriving it from the built artefact makes
drift impossible.

**`style-src` allows `'unsafe-inline'` — a deliberate, documented trade.** The
prerendered markup contains literal `style=""` attributes and React writes inline styles
at runtime. It is acceptable here *only* because the page renders zero user-supplied or
remote content, so there is no injection path to abuse it. **If this site ever accepts
input or renders remote data, that allowance must be removed first.**

### 5. Supply chain

| Check | Result |
|---|---|
| `npm audit` (production) | ✅ 0 vulnerabilities |
| `npm audit` (including dev) | ✅ 0 vulnerabilities |
| Third-party origins requested at runtime | ✅ **none — fully first-party** |
| Fonts | ✅ self-hosted from `/fonts` (were Google Fonts CDN) |

Self-hosting the fonts removed two origins (`fonts.googleapis.com`, `fonts.gstatic.com`).
Each third-party origin is both a supply-chain vector — a compromised CDN can serve
anything the CSP permits from it — and a privacy leak, since the CDN sees every
visitor's IP and Referer. Regenerate with `node scripts/fetch-fonts.mjs`.

### 6. Application code

| Check | Result |
|---|---|
| `dangerouslySetInnerHTML`, `innerHTML=`, `eval`, `new Function`, `document.write` | ✅ none present |
| `target="_blank"` without `rel="noopener"` (reverse tabnabbing) | ✅ 3 of 3 external links carry `rel="noreferrer noopener"` |
| User input rendered anywhere | ✅ none exists |
| Inline event handlers (`onclick=` in HTML) | ✅ none |

---

## Rotate these credentials — owner action required

`.env` holds two live secrets in plaintext. Neither is exposed by the website, but both
have been handled outside a secret manager and should be treated as compromised.

1. **`NETLIFY_AUTH_TOKEN`** — this is a **personal access token with full account
   access**, not scoped to one site. Anyone holding it can deploy to, reconfigure or
   delete *every* Netlify site on the account, including `cloudboosta-quiz`.
   → Rotate at **Netlify → User settings → Applications → Personal access tokens**:
   revoke the current token, create a new one, update `.env`.
2. **`MONID_KEY`** (`monid_live_…`) — a live key against a paid balance. Abuse costs
   real money.
   → Rotate in the Monid dashboard.

Do this even though nothing leaked. Rotation is cheap; assuming a plaintext token is
still private is not.

## Residual risks — accepted, with reasons

- **`style-src 'unsafe-inline'`** — see §4. Revisit if the site ever takes input.
- **Email address published in plain text** (`akinolaakinrimisi@gmail.com`) — will be
  harvested by scrapers. Accepted: a portfolio that hides its contact address defeats
  its own purpose.
- **CV PDF is public** and contains employment and education history. Intentional. It
  carries no phone number, home address, date of birth or ID number — verified.
- **No Subresource Integrity** — not applicable now that every asset is first-party and
  build-hashed.
- **Not a git repository**, so there is no commit history to audit and no protection
  against accidentally committing `.env` later. `.gitignore` already lists `.env`;
  run `git init` before sharing this code anywhere.

## Re-running this review

```bash
npm audit                              # dependency CVEs
npm run build                          # regenerates _headers with fresh hashes
cd scripts && TARGET=https://akinwunmi-akinrimisi.netlify.app node csp-test.mjs
```

`csp-test.mjs` fails loudly on any CSP violation, console error, or third-party request
— run it after any change that adds a script, style, image source or external link.
