/**
 * Refuses to let a secret reach a commit.
 *
 * Scans the *staged* blobs — not the working tree — because staged content is
 * what a commit actually captures. It checks two ways:
 *
 *   1. Literal match of every value currently in .env. This is the check that
 *      matters: it catches a real credential regardless of its format.
 *   2. Pattern match for common credential shapes, to catch secrets that were
 *      never in .env (a key pasted into a source file, for example).
 *
 * Exits non-zero on any hit, and never prints a secret value.
 *
 * Usage: node scripts/scan-secrets.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const git = (args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

// --- 1. Values from .env -----------------------------------------------------
const envValues = new Map()
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!m) continue
    const [, key, rawValue] = m
    const value = rawValue.trim().replace(/^["']|["']$/g, '')
    // Short values are identifiers, not credentials, and produce false positives.
    if (value.length >= 12) envValues.set(key, value)
  }
}

// --- 2. Credential-shaped patterns ------------------------------------------
const PATTERNS = [
  [/nfp_[A-Za-z0-9]{20,}/, 'Netlify personal access token'],
  [/monid_(live|test)_[A-Za-z0-9]{10,}/, 'Monid API key'],
  [/\bghp_[A-Za-z0-9]{30,}\b/, 'GitHub personal access token'],
  [/\bgithub_pat_[A-Za-z0-9_]{50,}\b/, 'GitHub fine-grained PAT'],
  [/\bsk-[A-Za-z0-9]{20,}\b/, 'OpenAI-style secret key'],
  [/\bsk-ant-[A-Za-z0-9-]{20,}\b/, 'Anthropic API key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
  [/\bASIA[0-9A-Z]{16}\b/, 'AWS temporary access key id'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, 'Slack token'],
  [/-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/, 'Private key block'],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, 'JWT'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
]

const staged = git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean)
const findings = []

for (const file of staged) {
  let content
  try {
    content = execFileSync('git', ['show', `:${file}`], { maxBuffer: 64 * 1024 * 1024 })
  } catch {
    continue
  }
  // Skip binaries — a NUL byte in the first 8KB is the usual heuristic.
  if (content.subarray(0, 8192).includes(0)) continue
  const text = content.toString('utf8')

  for (const [key, value] of envValues) {
    if (text.includes(value)) findings.push({ file, why: `literal value of ${key} from .env` })
  }
  for (const [re, label] of PATTERNS) {
    const m = text.match(re)
    if (m) {
      // .env.example legitimately names the variables; only flag real-looking values.
      findings.push({ file, why: `${label} (pattern ${re.source.slice(0, 28)}…)` })
    }
  }
}

// The file itself must never be staged, regardless of content.
for (const forbidden of ['.env', '.env.local', '.env.production']) {
  if (staged.includes(forbidden)) findings.push({ file: forbidden, why: 'secret file is staged' })
}

console.log(`Scanned ${staged.length} staged files against ${envValues.size} .env values and ${PATTERNS.length} patterns.`)

if (findings.length) {
  console.error('\n❌ SECRETS DETECTED — commit blocked:\n')
  for (const f of findings) console.error(`   ${f.file}\n     -> ${f.why}`)
  console.error('\nRemove the secret, re-stage, and run this again.')
  process.exit(1)
}

console.log('✅ No secrets found in staged content.')
