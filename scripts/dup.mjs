import { chromium } from 'playwright'
const b=await chromium.launch()
const p=await b.newPage({viewport:{width:1440,height:900}})
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()))
await p.goto(process.env.TARGET||'http://localhost:4321',{waitUntil:'networkidle'})
await p.waitForTimeout(1500)
console.log(await p.evaluate(()=>({
  h1count: document.querySelectorAll('h1').length,
  rootChildren: document.getElementById('root').children.length,
  navCount: document.querySelectorAll('header nav').length,
  workCards: document.querySelectorAll('#work article').length,
  revealTotal: document.querySelectorAll('.reveal').length,
  bodyTextLen: document.body.innerText.length,
})))
console.log('errors:', errs.length?errs.join(' | '):'none')
await b.close()
