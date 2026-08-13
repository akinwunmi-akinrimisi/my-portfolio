# Portfolio Site — Design Spec

**Date:** 2026-08-13
**Owner:** Akinwunmi Akinola Akinrimisi
**Status:** Approved (design decisions confirmed 2026-08-13)

## Purpose

A single-page portfolio positioning Akinwunmi as a **Cloud DevOps Engineer who automates
businesses end-to-end**. Automation leads the narrative; cloud/DevOps supplies the
engineering credibility beneath it. The site exists to convert a visitor (recruiter,
founder, or prospective client) into an email or LinkedIn conversation.

## Approved decisions

| Decision | Choice |
|---|---|
| Featured projects | Operscale Dossier, Cloudboosta Learning Ops, AI Voice Sales Agent, Vision GridAI, Bridge |
| Public naming | Real product names, real figures (all products are self-owned) |
| Visual direction | "Workflow Canvas" — dark-first, cyan→violet accent, animated connector motif |
| Primary CTA | Email + LinkedIn (no form, no scheduler) |

## Content sources

- `Akinwunmi Akinola AKINRIMISI-cv.pdf` — experience, education, certifications, cloud evidence
- Claude memory stores across 24 project directories — automation project detail and metrics

## Architecture

Single-page React app, statically built, deployed to Netlify.

```
src/
  content.ts        Single source of truth for all copy and data. No copy lives in components.
  App.tsx           Section composition order.
  components/       One file per section; each is presentational and reads from content.ts.
  hooks/            useTheme (light/dark), useReveal (scroll-reveal), useCountUp (metrics)
  index.css         Tailwind v4 entry + design tokens as CSS custom properties.
```

**Boundary rule:** components never hardcode copy. Editing the site's content means editing
`content.ts` only. This keeps each component small enough to reason about and makes future
content edits a one-file change.

## Design system

- **Canvas:** deep navy `#070B14`; light mode inverts to warm off-white
- **Accent:** cyan `#22D3EE` → violet `#8B5CF6` gradient; one accent role per section
- **Type:** Space Grotesk (headings), Inter (body), JetBrains Mono (technical labels)
- **Signature motif:** the *flow line* — animated SVG connectors with a travelling pulse,
  echoing an n8n canvas. Appears in the hero and as section-to-section threading.
- **Icons:** inline SVG only. No emoji-as-icons.
- **Motion:** scroll-reveal, magnetic buttons, count-up metrics. All motion is disabled
  under `prefers-reduced-motion: reduce`.

## Section order

1. Sticky glass nav — monogram, anchors, CV download
2. Hero — availability pill, headline, dual CTA, animated workflow canvas
3. Impact strip — four count-up metrics
4. Automation work — five case cards (Problem → Build → Result), stack chips, expandable detail
5. Cloud & DevOps — six capability cards, each backed by concrete CV evidence
6. How I build — five-step method
7. Toolbelt — grouped technology chips
8. Experience timeline + education & certifications
9. Contact + footer

## Accessibility

- Semantic landmarks, one `h1`, ordered heading levels
- Visible focus rings on all interactive elements
- Expandable project detail uses real `<button aria-expanded>` semantics
- Colour contrast ≥ 4.5:1 for body text in both themes
- Theme choice persisted to `localStorage`, defaulting to system preference

## Deployment

Netlify, using `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` from `.env` (git-ignored).
Build command `npm run build`, publish directory `dist`. SPA redirect and long-lived
asset caching configured in `netlify.toml`.

## Out of scope

Blog, CMS, contact form backend, analytics, multi-page routing. Deliberately excluded —
the site's single job is to earn a reply.
