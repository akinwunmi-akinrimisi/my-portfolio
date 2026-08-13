/**
 * Proves the Cloud cards slide out of their row's centre as the section
 * scrolls, and gather back when it leaves.
 *
 * Two things are checked that a screenshot cannot answer:
 *
 *  - **Occlusion.** At rest the outer cards must be *behind* the centre card,
 *    which only `elementFromPoint` can confirm. A coordinate check passes just
 *    as happily when they are stacked in front, which looks entirely different.
 *  - **Lag.** A scroll-linked transform that inherits a long CSS transition
 *    still reaches the right place, just a second late. Sampling the sweep and
 *    requiring the separation to track the scroll catches that; a single
 *    before/after pair does not.
 */
import { chromium } from 'playwright'

const TARGET = process.env.TARGET || 'http://localhost:4321'
const browser = await chromium.launch()
let failures = 0
const check = (label, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
  if (!ok) failures += 1
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await page.goto(TARGET, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })

const groupRows = (sel) =>
  page.$$eval(sel, (els) => {
    const groups = []
    els.forEach((e) => {
      const g = groups.find(([f]) => Math.abs(f.offsetTop - e.offsetTop) < 4)
      if (g) g.push(e)
      else groups.push([e])
    })
    return groups.map((g) => g.length)
  })

check(
  'two rows of three at desktop width',
  JSON.stringify(await groupRows('#cloud .spread-card')) === '[3,3]',
)

const gridTop = await page.$eval(
  '#cloud .spread-grid',
  (e) => e.getBoundingClientRect().top + window.scrollY,
)

/*
 * Probe near each card's top edge rather than its centre: the row is only
 * partly on screen while it is still gathered, and a centre point that falls
 * below the fold makes `elementFromPoint` return nothing at all.
 */
const sample = async (y) => {
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await page.waitForTimeout(200)
  return page.$$eval('#cloud .spread-card', (els) => {
    const all = [...els]
    return all.map((e) => {
      const r = e.getBoundingClientRect()
      const px = r.left + r.width / 2
      const py = r.top + 40
      // Above 140px the fixed nav owns the point, so `elementFromPoint`
      // answers "the nav" and every occlusion check reads as a failure.
      const onScreen = py > 140 && py < window.innerHeight - 10 && px > 0 && px < window.innerWidth
      const hit = onScreen ? document.elementFromPoint(px, py) : null
      return {
        x: Math.round(px),
        s: Number((getComputedStyle(e).transform.match(/matrix\(([\d.]+)/) || [, '1'])[1]),
        onScreen,
        owner: hit ? all.findIndex((c) => c.contains(hit)) : -1,
      }
    })
  })
}

const sweep = []
for (let i = 0; i <= 14; i += 1) sweep.push(await sample(gridTop - 1000 + i * 110))

const sep = (f) => Math.round(f[2].x - f[0].x) // row 1 outer-card separation
const seps = sweep.map(sep)
const full = Math.max(...seps)

check('cards start gathered on the centre card', Math.min(...seps) <= 4, `min separation ${Math.min(...seps)}px`)
check('cards end fully apart', full > 600, `max separation ${full}px`)
check(
  'separation only ever increases through the sweep',
  seps.every((v, i) => i === 0 || v >= seps[i - 1] - 1),
  seps.join(' '),
)
check(
  'separation tracks the scroll rather than lagging behind it',
  seps.filter((v, i) => i > 0 && v !== seps[i - 1]).length >= 3,
  `${seps.filter((v, i) => i > 0 && v !== seps[i - 1]).length} distinct steps: ${seps.join(' ')}`,
)

// Occlusion: the first frame where the row is on screen but still mostly gathered.
const hidden = sweep.find((f) => f[0].onScreen && sep(f) < full * 0.3)
check(
  'while gathered, the outer cards are BEHIND the centre card',
  !!hidden && hidden[0].owner === 1 && hidden[2].owner === 1,
  hidden ? `separation ${sep(hidden)}px, top card at each probe: ${hidden.map((c) => c.owner).join(', ')}` : 'no gathered on-screen frame found',
)

// The last frames have scrolled the row off the top, so probe the last one
// that is both fully spread and still on screen.
const spreadFrame =
  [...sweep].reverse().find((f) => f[0].onScreen && sep(f) > full * 0.9) || sweep[sweep.length - 1]
check(
  'once apart, each card is on top of itself',
  spreadFrame[0].owner === 0 && spreadFrame[2].owner === 2,
  spreadFrame.slice(0, 3).map((c) => c.owner).join(', '),
)
check(
  'cards scale up as they spread',
  sweep[0][0].s < spreadFrame[0].s && spreadFrame[0].s > 0.99,
  `${sweep[0][0].s} -> ${spreadFrame[0].s}`,
)
/*
 * Each row runs on its own progress, so at any single frame the lower row is
 * deliberately behind the upper one. The check is that it reaches the same
 * columns eventually, not that the two ever match mid-flight.
 */
const sep2 = (f) => Math.round(f[5].x - f[3].x)
const row2Best = sweep.reduce((best, f) => (sep2(f) > sep2(best) ? f : best), sweep[0])
check(
  'the second row spreads to the same columns',
  Math.abs(sep2(row2Best) - full) < 3 &&
    Math.abs(row2Best[3].x - spreadFrame[0].x) < 3 &&
    Math.abs(row2Best[5].x - spreadFrame[2].x) < 3,
  `row2 ${row2Best.slice(3).map((c) => c.x).join(', ')} vs row1 ${spreadFrame.slice(0, 3).map((c) => c.x).join(', ')}`,
)
check(
  'the lower row trails the upper one rather than moving with it',
  sweep.some((f) => sep(f) - sep2(f) > 60),
  `largest lead ${Math.max(...sweep.map((f) => sep(f) - sep2(f)))}px`,
)

const again = await sample(gridTop - 1000)
check('re-gathers when scrolled back up', sep(again) <= 4, `separation ${sep(again)}px`)

/* Two-column layout has no centre card, so nothing may be displaced. */
const narrow = await browser.newPage({ viewport: { width: 820, height: 900 } })
await narrow.goto(TARGET, { waitUntil: 'networkidle' })
await narrow.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
await narrow.evaluate(() => document.querySelector('#cloud').scrollIntoView({ behavior: 'instant' }))
await narrow.waitForTimeout(400)
const narrowState = await narrow.$$eval('#cloud .spread-card', (els) =>
  els.map((e) => e.style.getPropertyValue('--spread-x') || '0px'),
)
check(
  'two-column layout is left untouched',
  narrowState.every((v) => v === '0px'),
  `rows ${JSON.stringify(await groupRows.call(null, '#cloud .spread-card'))} offsets ${JSON.stringify(narrowState)}`,
)
const w = await narrow.evaluate(() => ({
  doc: document.documentElement.scrollWidth,
  vw: window.innerWidth,
}))
check('no horizontal overflow at 820px', w.doc <= w.vw + 1, JSON.stringify(w))
await narrow.close()

check('no console errors', errors.length === 0, errors.join(' | '))
await browser.close()
console.log(failures === 0 ? '\nAll spread checks passed.' : `\n${failures} FAILED`)
process.exit(failures === 0 ? 0 : 1)
