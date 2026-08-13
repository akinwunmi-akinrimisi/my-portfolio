import { chromium } from 'playwright'

const URL = process.env.TARGET || 'http://localhost:4321'
const OUT = process.env.OUT || './shots'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(URL, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })

// Which nav item is highlighted at each section? Active = full-opacity colour.
const activeAt = async (id) => {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    window.scrollTo({ top: el.offsetTop + 200, behavior: 'instant' })
  }, `#${id}`)
  await page.waitForTimeout(700)
  return page.evaluate(() => {
    const wanted = ['#work', '#cloud', '#process', '#experience', '#contact']
    const links = [...document.querySelectorAll('nav a')].filter((a) =>
      wanted.includes(a.getAttribute('href')),
    )
    // The active underline is scaleX(1); inactive ones are scaleX(0).
    const hit = links.find((a) => {
      const underline = a.querySelector(':scope > span')
      if (!underline) return false
      const m = new DOMMatrixReadOnly(getComputedStyle(underline).transform)
      return m.a > 0.9
    })
    return hit ? hit.getAttribute('href') : null
  })
}

const results = {}
for (const id of ['work', 'cloud', 'process', 'experience', 'contact']) {
  results[id] = await activeAt(id)
}
console.log('nav highlight per section:', JSON.stringify(results))

// Light mode, work section.
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await page.click('button[aria-label*="light theme"]')
await page.waitForTimeout(500)
await page.evaluate(async () => {
  const step = window.innerHeight * 0.5
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 200))
  }
})
await page.evaluate(() => {
  window.scrollTo({ top: document.querySelector('#work').offsetTop + 60, behavior: 'instant' })
})
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/light-work.png` })

// Contrast sample in light mode.
const contrast = await page.evaluate(() => {
  const s = getComputedStyle(document.querySelector('#work p'))
  return { color: s.color, bg: getComputedStyle(document.body).backgroundColor }
})
console.log('light body text:', JSON.stringify(contrast))
console.log('errors:', errors.length ? errors.join(' | ') : 'none')

await browser.close()
