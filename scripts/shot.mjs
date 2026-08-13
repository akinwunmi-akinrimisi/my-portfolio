import { chromium } from 'playwright'

const URL = process.env.TARGET || 'http://localhost:4321'
const OUT = process.env.OUT || './shots'

const browser = await chromium.launch()
const errors = []

/** Scroll the whole page so every IntersectionObserver-driven reveal fires. */
async function scrollThrough(page) {
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.5
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 220))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 500))
  })
}

async function shoot(name, width, height, opts = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 })
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${name}] console: ${m.text()}`))
  page.on('pageerror', (e) => errors.push(`[${name}] pageerror: ${e.message}`))
  page.on('requestfailed', (r) => errors.push(`[${name}] failed: ${r.url()} ${r.failure()?.errorText}`))

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  if (opts.light) {
    await page.click('button[aria-label*="light theme"]').catch(() => {})
    await page.waitForTimeout(400)
  }
  await scrollThrough(page)
  if (opts.expand) {
    await page.locator('#work').scrollIntoViewIfNeeded()
    await page.click('button:has-text("How it was built")').catch(() => {})
    await page.waitForTimeout(700)
  }
  if (opts.scrollTo) {
    await page.locator(opts.scrollTo).scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
  }
  await page.waitForTimeout(opts.wait ?? 900)

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: !!opts.full })

  if (opts.report) {
    const info = await page.evaluate(() => {
      const cs = getComputedStyle(document.body)
      return {
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        bg: cs.backgroundColor,
        revealsHidden: [...document.querySelectorAll('.reveal')].filter(
          (e) => !e.classList.contains('is-visible'),
        ).length,
        revealsTotal: document.querySelectorAll('.reveal').length,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        metricValues: [...document.querySelectorAll('.tabular-nums')].map((e) => e.textContent),
      }
    })
    console.log(name, JSON.stringify(info))
  }
  await page.close()
}

await shoot('d-hero', 1440, 900, { report: true })
await shoot('d-full', 1440, 900, { full: true, report: true })
await shoot('d-light-full', 1440, 900, { full: true, light: true, report: true })
await shoot('d-work', 1440, 950, { expand: true })
await shoot('d-cloud', 1440, 950, { scrollTo: '#cloud' })
await shoot('d-process', 1440, 950, { scrollTo: '#process' })
await shoot('d-contact', 1440, 950, { scrollTo: '#contact' })
await shoot('m-full', 390, 844, { full: true, report: true })

console.log('\n=== ISSUES ===')
console.log(errors.length ? [...new Set(errors)].join('\n') : 'none')
await browser.close()
