import { chromium } from 'playwright'
const b=await chromium.launch()
const p=await b.newPage({viewport:{width:1440,height:900}})
await p.goto(process.env.TARGET || 'http://localhost:4321',{waitUntil:'networkidle'})
await p.addStyleTag({content:'html{scroll-behavior:auto !important}'})
await p.evaluate(async()=>{const s=window.innerHeight*0.5;for(let y=0;y<document.body.scrollHeight;y+=s){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,200))}window.scrollTo({top:0,behavior:'instant'})})
await p.waitForTimeout(600)
console.log('unrevealed:', await p.evaluate(()=>[...document.querySelectorAll('.reveal')].filter(e=>!e.classList.contains('is-visible')).map(e=>`<${e.tagName} class="${e.className.slice(0,60)}" text="${(e.textContent||'').trim().slice(0,30)}">`)))
console.log('\noverflowing elements:', await p.evaluate(()=>{
  const vw=window.innerWidth, out=[]
  document.querySelectorAll('body *').forEach(el=>{
    const r=el.getBoundingClientRect()
    if(r.width===0)return
    if(r.right>vw+1){
      let anc=el.parentElement,clipped=false
      while(anc&&anc!==document.body){const o=getComputedStyle(anc).overflowX;if(o==='hidden'||o==='auto'||o==='scroll'){clipped=true;break}anc=anc.parentElement}
      if(!clipped)out.push(`${el.tagName}.${el.className.toString().slice(0,55)} right=${Math.round(r.right)}`)
    }
  })
  return [...new Set(out)].slice(0,8)
}))
console.log('\ndoc vs vw:', await p.evaluate(()=>`${document.documentElement.scrollWidth} vs ${window.innerWidth}`))
await b.close()
