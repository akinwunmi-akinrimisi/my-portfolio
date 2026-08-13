import { chromium } from 'playwright'
const OUT='./shots'
const b = await chromium.launch()
const p = await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2})
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()))
await p.goto(process.env.TARGET || 'http://localhost:4321',{waitUntil:'networkidle'})
await p.waitForTimeout(1500)

// Is the marquee actually moving, and does it stay covered edge to edge?
const samples=[]
for (let i=0;i<3;i++){
  samples.push(await p.evaluate(()=>{
    const t=document.querySelector('.animate-marquee')
    const cs=getComputedStyle(t)
    return {matrix: cs.transform, anim: cs.animationName+' '+cs.animationDuration,
      trackW: t.getBoundingClientRect().width, firstNodeX: Math.round(t.getBoundingClientRect().left)}
  }))
  await p.waitForTimeout(900)
}
console.log('marquee samples:'); samples.forEach(s=>console.log('  ', JSON.stringify(s)))

// Full-bleed check + spotlight variable wiring.
const meta = await p.evaluate(()=>{
  const wrap=document.querySelector('[role="img"][aria-label*="pipeline"]')
  const r=wrap.getBoundingClientRect()
  return {marqueeLeft:Math.round(r.left), marqueeRight:Math.round(r.right), vw:window.innerWidth,
    spotlightCards:document.querySelectorAll('.spotlight').length,
    cardHover:document.querySelectorAll('.card-hover').length,
    gradAnim:getComputedStyle(document.querySelector('.gradient-text')).animationName}
})
console.log('meta:', JSON.stringify(meta))

// Hover a project card: does it lift and light up?
await p.locator('#work').scrollIntoViewIfNeeded(); await p.waitForTimeout(1200)
const card = p.locator('#work article').first()
const before = await card.evaluate(el=>getComputedStyle(el).transform)
await card.hover(); await p.waitForTimeout(700)
const after = await card.evaluate(el=>({t:getComputedStyle(el).transform, mx:el.style.getPropertyValue('--mx'), shadow:getComputedStyle(el).boxShadow.slice(0,40)}))
console.log('card transform before:', before)
console.log('card after hover     :', JSON.stringify(after))
await p.screenshot({path:`${OUT}/hover-card.png`})
console.log('errors:', errs.length?errs.join(' | '):'none')
await b.close()
