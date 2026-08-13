/**
 * Checks what each host actually *serves*, before any JavaScript runs.
 *
 * Every browser-based check in this directory passes on an un-prerendered
 * page, because the browser fills `#root` in milliseconds. Only fetching the
 * raw bytes shows whether the markup shipped — which is how the Vercel copy
 * served an empty `<div id="root"></div>` for hours while every gate was green.
 *
 * Run after any deploy:  node scripts/served.mjs
 */
const HOSTS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      'https://akinwunmi-akinrimisi.netlify.app',
      'https://my-portfolio-tau-ten-zyq6uxser0.vercel.app',
    ]

const MIN_BYTES = 60_000
let failures = 0

for (const host of HOSTS) {
  let html = ''
  let status = 0
  try {
    const res = await fetch(host, { redirect: 'follow' })
    status = res.status
    html = await res.text()
  } catch (err) {
    console.log(`FAIL  ${host} — unreachable: ${err.message}`)
    failures += 1
    continue
  }

  const emptyRoot = /<div id="root">\s*<\/div>/.test(html)
  const bytes = html.length
  const ok = status === 200 && !emptyRoot && bytes >= MIN_BYTES

  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${host}\n` +
      `        status ${status} · ${bytes.toLocaleString()} bytes · ` +
      `#root ${emptyRoot ? 'EMPTY — not prerendered' : 'contains baked markup'}`,
  )
  if (!ok) failures += 1
}

console.log(
  failures === 0
    ? '\nEvery host is serving prerendered HTML.'
    : `\n${failures} host(s) serving markup a non-rendering client cannot read.`,
)
process.exit(failures === 0 ? 0 : 1)
