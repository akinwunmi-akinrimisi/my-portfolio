import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const violations = [], errs = [], reqs = []
p.on('console', m => { const t=m.text(); if (/Content Security Policy|Refused to/i.test(t)) violations.push(t); else if (m.type()==='error') errs.push(t) })
p.on('pageerror', e => errs.push(e.message))
p.on('request', r => { const u=new URL(r.url()); if (!u.host.includes('netlify.app') && u.protocol!=='data:') reqs.push(u.origin) })
await p.goto(process.env.TARGET, { waitUntil: 'networkidle' })
await p.waitForTimeout(2500)
console.log('CSP violations :', violations.length ? violations.slice(0,6).join('\n  ') : 'NONE')
console.log('console errors :', errs.length ? errs.slice(0,5).join(' | ') : 'none')
console.log('3rd-party origins requested:', [...new Set(reqs)].length ? [...new Set(reqs)] : 'NONE — fully first-party')
console.log('render check   :', JSON.stringify(await p.evaluate(()=>({
  h1: document.querySelectorAll('h1').length,
  cards: document.querySelectorAll('#work article').length,
  theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  font: getComputedStyle(document.querySelector('h1')).fontFamily.split(',')[0],
  fontsLoaded: document.fonts.size,
}))))
await b.close()
