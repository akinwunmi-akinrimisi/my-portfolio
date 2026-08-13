import { chromium } from 'playwright'

const URL = process.env.TARGET || 'http://localhost:4321'
const browser = await chromium.launch()

const VIEWPORTS = [
  ['iPhone SE', 320, 568],
  ['Android sm', 360, 800],
  ['iPhone 14', 390, 844],
  ['iPhone Plus', 430, 932],
  ['Tablet', 768, 1024],
]

for (const [name, width, height] of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.5
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 130))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.waitForTimeout(400)

  const report = await page.evaluate((vw) => {
    const out = { overflow: [], smallTap: [], smallText: [], clipped: [], notes: [] }

    // 1. Anything wider than the viewport.
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      if (r.right > vw + 1.5 || r.left < -1.5) {
        const cs = getComputedStyle(el)
        // An element inside a deliberate horizontal scroller is fine.
        let p = el.parentElement
        let inScroller = false
        while (p && p !== document.body) {
          const pcs = getComputedStyle(p)
          if (pcs.overflowX === 'auto' || pcs.overflowX === 'scroll') { inScroller = true; break }
          p = p.parentElement
        }
        if (!inScroller && cs.position !== 'fixed') {
          out.overflow.push(
            `${el.tagName}.${(el.className || '').toString().slice(0, 40)} L${Math.round(r.left)} R${Math.round(r.right)}`,
          )
        }
      }
    })

    // 2. Interactive targets below the 44px comfortable minimum.
    document.querySelectorAll('a, button').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      if (getComputedStyle(el).position === 'fixed' && r.top < 0) return
      if (r.height < 44 || r.width < 24) {
        out.smallTap.push(
          `${el.tagName} "${(el.textContent || '').trim().slice(0, 26)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
        )
      }
    })

    // 3. Text rendered below 12px.
    document.querySelectorAll('p, li, span, dt, dd, h3, h4, a').forEach((el) => {
      if (!el.textContent?.trim()) return
      if (el.children.length > 0) return
      const fs = parseFloat(getComputedStyle(el).fontSize)
      if (fs < 12) out.smallText.push(`${fs}px "${el.textContent.trim().slice(0, 30)}"`)
    })

    // 4. Body copy line length (characters per line is hard; use px width).
    const heroP = document.querySelector('#top p')
    if (heroP) out.notes.push(`hero copy width ${Math.round(heroP.getBoundingClientRect().width)}px`)

    out.notes.push(`page height ${document.body.scrollHeight}px`)
    out.notes.push(`doc width ${document.documentElement.scrollWidth} vs vw ${vw}`)
    return out
  }, width)

  const uniq = (a) => [...new Set(a)]
  console.log(`\n### ${name} (${width}x${height})`)
  console.log('  overflow  :', uniq(report.overflow).slice(0, 6).join(' | ') || 'none')
  console.log('  small tap :', uniq(report.smallTap).slice(0, 8).join(' | ') || 'none')
  console.log('  small text:', uniq(report.smallText).slice(0, 6).join(' | ') || 'none')
  console.log('  notes     :', report.notes.join(' | '))
  console.log('  errors    :', errs.length ? errs.join(' | ') : 'none')
  await page.close()
}

await browser.close()
