/**
 * Proves the project cards actually pin into a stack, and that the portrait
 * blob/ring/chips are animating.
 *
 * Worth measuring rather than eyeballing: `position: sticky` fails *silently*
 * when an ancestor has an `overflow` other than `visible`/`clip`, and the
 * result is simply five normally-scrolling cards — which looks like a design
 * choice in a screenshot, not a defect.
 */
import { chromium } from 'playwright'

const TARGET = process.env.TARGET || 'http://localhost:4321'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await page.goto(TARGET, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })

let failures = 0
const check = (label, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
  if (!ok) failures += 1
}

const scrollTo = async (y) => {
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await page.waitForTimeout(260)
}

/* ---------------------------------------------------------- pinned stack -- */

const items = await page.$$('#work .stack-item')
check('five stack items exist', items.length === 5, `${items.length} found`)

check(
  'no ancestor cancels sticky',
  await page.$eval('#work .stack-item', (el) => {
    // Per-axis only. The `overflow` shorthand serialises to "clip visible",
    // which matches neither keyword and would fail a check on the whole string
    // even though `clip` on one axis leaves sticky working.
    for (let n = el.parentElement; n; n = n.parentElement) {
      const o = getComputedStyle(n)
      for (const v of [o.overflowX, o.overflowY]) {
        if (v !== 'visible' && v !== 'clip') return false
      }
    }
    return true
  }),
  'an overflow of hidden/auto/scroll on any ancestor silently disables it',
)

const stackTop = await page.$eval(
  '#work .stack-item',
  (el) => el.getBoundingClientRect().top + window.scrollY,
)
const pinOffset = await page.$eval('#work .stack-item', (el) => parseFloat(getComputedStyle(el).top))

// Walk through the section and record where each card is painted plus its scale.
const frames = []
for (let i = 0; i <= 12; i += 1) {
  const y = stackTop - 200 + i * 260
  await scrollTo(y)
  frames.push({
    y,
    cards: await page.$$eval('#work .stack-item', (els) =>
      els.map((e) => ({
        top: Math.round(e.getBoundingClientRect().top),
        scale: Number((getComputedStyle(e).transform.match(/matrix\(([\d.]+)/) || [, '1'])[1]),
      })),
    ),
  })
}

// A pinned card holds a constant viewport top equal to the CSS `top` offset.
const pinnedSamples = frames.flatMap((f) =>
  f.cards.filter((c) => Math.abs(c.top - pinOffset) < 2).length ? [f.y] : [],
)
check(
  'cards pin at the CSS top offset',
  pinnedSamples.length >= 6,
  `held at ${Math.round(pinOffset)}px in ${pinnedSamples.length}/13 samples`,
)

const overlapped = frames.some(
  (f) => f.cards.filter((c) => Math.abs(c.top - pinOffset) < 2).length >= 2,
)
check('cards stack on top of each other', overlapped, 'two or more sharing the pin line')

const deepest = Math.min(...frames.flatMap((f) => f.cards.map((c) => c.scale)))
check(
  'buried cards shrink to give the deck depth',
  deepest < 0.98 && deepest > 0.85,
  `smallest scale seen ${deepest.toFixed(4)}`,
)

const monotonic = frames.every((f) =>
  f.cards.every((c, i) => i === 0 || c.scale >= f.cards[i - 1].scale - 0.0005),
)
check('deeper cards are never larger than shallower ones', monotonic)

/* --------------------------------------------- reachability across sizes -- */

/*
 * A pinned card is fully readable only until the next one's top edge reaches
 * its bottom, so its controls can be on screen and still be covered by the
 * card above it in the deck. Only hit-testing answers that honestly — a
 * visibility or bounding-box check passes either way.
 */
for (const [w, h, name] of [
  [1280, 860, 'desktop'],
  [390, 844, 'phone'],
  [360, 800, 'small phone'],
]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } })
  await p.goto(TARGET, { waitUntil: 'networkidle' })
  await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })

  const meta = await p.evaluate(() => {
    const stack = document.querySelector('#work .stack')
    const els = [...document.querySelectorAll('#work .stack-item')]
    const offset = parseFloat(getComputedStyle(els[0]).top) || 0
    let cursor = stack.getBoundingClientRect().top + window.scrollY
    return {
      pos: getComputedStyle(els[0]).position,
      pins: els.map((el, i) => {
        if (i > 0) cursor += parseFloat(getComputedStyle(el).marginTop) || 0
        const pin = cursor - offset
        cursor += el.offsetHeight
        return pin
      }),
    }
  })

  if (meta.pos !== 'sticky') {
    console.log(`SKIP  ${name} ${w}x${h}: stack disabled at this size (position: ${meta.pos})`)
    await p.close()
    continue
  }

  const reach = []
  for (let i = 0; i < meta.pins.length; i += 1) {
    await p.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), meta.pins[i] + 30)
    await p.waitForTimeout(160)
    reach.push(
      await p.evaluate((idx) => {
        const btn = document.querySelectorAll('#work .stack-item')[idx].querySelector('button')
        const r = btn.getBoundingClientRect()
        if (r.top < 0 || r.bottom > window.innerHeight) return 'offscreen'
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        return btn.contains(hit) ? 'ok' : 'covered'
      }, i),
    )
  }
  check(
    `${name} ${w}x${h}: every card's control is tappable while pinned`,
    reach.every((r) => r === 'ok'),
    reach.join(', '),
  )
  await p.close()
}

/* ------------------------------------------------------------- portrait -- */

await scrollTo(0)
const blob = await page.$eval('.photo-inner', (e) => getComputedStyle(e).borderRadius)
check('portrait uses the organic blob mask', !/^0px/.test(blob) && blob.includes('%'), blob.slice(0, 46))

const r1 = await page.$eval('.photo-inner', (e) => getComputedStyle(e).borderRadius)
const ring1 = await page.$eval('.photo-ring', (e) => getComputedStyle(e).transform)
await page.waitForTimeout(1400)
const r2 = await page.$eval('.photo-inner', (e) => getComputedStyle(e).borderRadius)
const ring2 = await page.$eval('.photo-ring', (e) => getComputedStyle(e).transform)
check('blob morphs over time', r1 !== r2)
check('conic ring rotates', ring1 !== ring2)

const chips = await page.$$eval('.fchip', (els) =>
  els.map((e) => ({ text: e.innerText.replace(/\n/g, ' '), w: Math.round(e.getBoundingClientRect().width) })),
)
check('two floating chips render', chips.length === 2, JSON.stringify(chips))

/* --------------------------------------------------------------- global -- */

const overflow = await page.evaluate(() => ({
  doc: document.documentElement.scrollWidth,
  vw: window.innerWidth,
}))
check('no horizontal overflow', overflow.doc <= overflow.vw + 1, JSON.stringify(overflow))
check('no console errors', errors.length === 0, errors.join(' | '))

await browser.close()
console.log(failures === 0 ? '\nAll stack + portrait checks passed.' : `\n${failures} FAILED`)
process.exit(failures === 0 ? 0 : 1)
