# Verification scripts

Headless-browser checks for this site. They exist because **screenshots alone hid two
real defects** during the build: a set of headings that never became visible at all, and
a decorative layer that widened the document past the viewport. Both were invisible to
the eye in a still image and obvious the moment something measured them.

## Setup

`playwright` is already a devDependency. The browser binary is not, so once per machine:

```bash
npx playwright install chromium
```

Every script targets `http://localhost:4321` by default, so start a preview first or you
will get `net::ERR_CONNECTION_REFUSED` — that error means only that, not a broken script:

```bash
npm run build && npx vite preview --port 4321 --strictPort   # terminal 1
npm run audit                                                # terminal 2
```

Shortcuts: `npm run audit` · `npm run shots` · `npm run diagnose` · `npm run images`.

Point any script at production instead with `TARGET` (bash/git-bash — PowerShell needs
`$env:TARGET=...` on its own line first):

```bash
cd scripts && TARGET=https://akinwunmi-akinrimisi.netlify.app node mobile-audit.mjs
```

## What each one does

| Script | Answers |
|---|---|
| `mobile-audit.mjs` | Across 5 device widths: tap targets under 44px, text under 12px, real horizontal overflow, console errors. **The main gate — run before every deploy.** |
| `verify.mjs` | Does the nav highlight track each section? Light-mode contrast sample. |
| `shot.mjs` | Screenshots dark/light, desktop/mobile, full-page. Reports unrevealed `.reveal` count. |
| `why.mjs` | Diagnoses *which* elements are unrevealed or overflowing, by selector. Use when a gate above fails. |
| `marquee.mjs` | Samples the hero marquee transform over time to prove it is moving; checks card hover lift and spotlight vars. |
| `light.mjs` | Computes WCAG contrast ratios for the accent tokens against the light canvas. |
| `dup.mjs` | After prerendering, proves React replaced the baked markup instead of appending to it: counts `h1`, nav, cards, reveals. |
| `images.py` | Regenerates `public/akin-*.webp|jpg` and the OG card from `akin.png`. Run after changing the photo or the palette. |
| `prerender.mjs` | **Runs automatically as part of `npm run build`** — see below. |

## prerender.mjs

Bakes the rendered app into `dist/index.html`, because a Vite SPA otherwise ships an
empty `<div id="root">` and non-rendering crawlers see no content at all.

It serves `dist/` on a throwaway port, loads it in Chromium, force-adds `is-visible` to
every `.reveal` (otherwise the baked markup would be indexed at `opacity: 0`), and
injects the rendered `#root` innerHTML back into the file.

**It refuses to write** if the page threw, if it cannot find `<div id="root"></div>`, or
if under 2,000 characters of text rendered — a silently empty prerender is worse than
none. Use `npm run build:nopre` to skip it.

This is not hydration. React still mounts with `createRoot` and replaces the markup;
`dup.mjs` is the check that it replaces rather than duplicates.

## Gotchas that cost time

- **Scroll with `behavior: 'instant'` and inject `html{scroll-behavior:auto}`.** The
  site sets smooth scrolling; stepped scrolling in a test otherwise never settles and
  every scroll-triggered reveal reports as still hidden.
- **A `fullPage` screenshot does not fire IntersectionObserver.** Walk the page first or
  the whole thing photographs blank below the hero.
- **Decorative blur glows inside `overflow-hidden` are flagged as overflow** by the
  audit's element sweep. `doc width vs vw` on the same line is the authoritative check —
  trust that, not the element list.
