/**
 * Bakes the rendered app into dist/index.html.
 *
 * Why: a Vite SPA ships `<div id="root"></div>` and nothing else. Googlebot does
 * execute JavaScript, but rendering is a deferred second pass, and most other
 * crawlers (Bing, LinkedIn, Slack, AI answer engines) either do not render or do
 * so unreliably. Baking the markup in means every crawler sees the full text on
 * the first request.
 *
 * This is not hydration — React still mounts with createRoot and replaces the
 * markup. The baked HTML exists for crawlers and for a faster first paint; the
 * reveal classes it carries stay hidden only when the `js` class is present, so
 * a non-JS reader sees everything.
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const PORT = 4399

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0])
  const rel = url === '/' ? 'index.html' : normalize(url).replace(/^[/\\]+/, '')
  const file = join(DIST, rel)
  if (!existsSync(file)) {
    res.writeHead(404)
    res.end('not found')
    return
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' })
  res.end(await readFile(file))
})

await new Promise((resolve) => server.listen(PORT, resolve))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' })
await page.waitForSelector('#root h1', { timeout: 30000 })

// Mark every reveal as visible in the baked markup. A crawler that does execute
// JS but bails before IntersectionObserver fires would otherwise index a page of
// elements sitting at opacity 0.
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
  document.querySelectorAll('[style*="transition-delay"]').forEach((el) => {
    el.style.transitionDelay = ''
  })
})

const rendered = await page.evaluate(() => document.getElementById('root').innerHTML)
const textLength = await page.evaluate(() => document.getElementById('root').innerText.length)

if (errors.length) {
  console.error('Page errors during prerender:\n  ' + errors.join('\n  '))
  process.exitCode = 1
}
if (textLength < 2000) {
  console.error(`Prerender produced only ${textLength} characters of text — refusing to write.`)
  process.exitCode = 1
} else {
  const indexPath = join(DIST, 'index.html')
  const html = await readFile(indexPath, 'utf8')
  const out = html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`)

  if (out === html) {
    console.error('Could not find <div id="root"></div> to inject into.')
    process.exitCode = 1
  } else {
    await writeFile(indexPath, out, 'utf8')
    console.log(`Prerendered ${textLength.toLocaleString()} characters of text into dist/index.html`)
    console.log(`index.html: ${(html.length / 1024).toFixed(1)} KB -> ${(out.length / 1024).toFixed(1)} KB`)
  }
}

await browser.close()
server.close()
