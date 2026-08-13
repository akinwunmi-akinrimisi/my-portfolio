import { chromium } from 'playwright'
const OUT='./shots'
const b=await chromium.launch()
const p=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2})
await p.goto(process.env.TARGET || 'http://localhost:4321',{waitUntil:'networkidle'})
await p.click('button[aria-label*="light theme"]'); await p.waitForTimeout(500)
await p.addStyleTag({content:'html{scroll-behavior:auto !important}'})
await p.evaluate(async()=>{const s=window.innerHeight*0.5;for(let y=0;y<document.body.scrollHeight;y+=s){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,180))}})
await p.evaluate(()=>window.scrollTo({top:document.querySelector('#cloud').offsetTop+80,behavior:'instant'}))
await p.waitForTimeout(900)
await p.screenshot({path:`${OUT}/light-cloud.png`})

// Contrast of amber accent text on the light canvas.
function lum([r,g,b]){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)}
const vals = await p.evaluate(()=>{
  const g=(s)=>getComputedStyle(document.documentElement).getPropertyValue(s).trim()
  return {a1:g('--accent-1'), a2:g('--accent-2'), surface:g('--surface'), raised:g('--surface-raised'), text:g('--text-primary'), sec:g('--text-secondary')}
})
const hex=h=>{h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))}
const ratio=(a,b)=>{const l1=lum(hex(a)),l2=lum(hex(b));const[hi,lo]=l1>l2?[l1,l2]:[l2,l1];return ((hi+0.05)/(lo+0.05)).toFixed(2)}
console.log('LIGHT MODE contrast ratios (WCAG AA body text needs 4.5):')
console.log('  accent-1 on surface :', ratio(vals.a1, vals.surface), `(${vals.a1} on ${vals.surface})`)
console.log('  accent-2 on surface :', ratio(vals.a2, vals.surface))
console.log('  text on surface     :', ratio(vals.text, vals.surface))
console.log('  secondary on surface:', ratio(vals.sec, vals.surface))
await b.close()
