import { Fragment } from 'react'
import { flowNodes } from '../content'

/**
 * The site's signature motif: an n8n-style node canvas that slides continuously
 * left to right across the full width of the page.
 *
 * The loop is seamless because the animated wrapper holds two identical tracks
 * and translates from -50% to 0 — at the moment the animation resets, the second
 * track sits exactly where the first began, so there is no visible jump. Every
 * node carries a trailing connector (including the last of each set) so the join
 * between repeats is indistinguishable from any other gap.
 */

const SETS = 4

function Connector({ delay }: { delay: number }) {
  return (
    <svg
      className="shrink-0"
      width="56"
      height="22"
      viewBox="0 0 56 22"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 11 H54" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M2 11 H54"
        stroke="url(#connector-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="14 42"
        className="animate-flow"
        style={{ animationDelay: `${delay}s`, animationDuration: '3.2s' }}
      />
    </svg>
  )
}

function Node({ label, index }: { label: string; index: number }) {
  // The first node of each set is accented, giving the marquee a visible pulse
  // point rather than an undifferentiated chain.
  const isLead = index === 0
  return (
    <div className="shrink-0 flex flex-col items-center gap-2.5">
      <div
        className="relative grid place-items-center w-11 h-11 rounded-xl border"
        style={{
          backgroundColor: 'var(--surface-raised)',
          borderColor: isLead ? 'var(--accent-1)' : 'var(--border-strong)',
          boxShadow: isLead ? '0 0 26px -8px var(--accent-1)' : 'none',
        }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            opacity: isLead ? 1 : 0.6,
          }}
        />
      </div>
      <span className="font-mono text-[11.5px] tracking-tight text-muted whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}

function Track() {
  return (
    <div className="flex items-start shrink-0">
      {Array.from({ length: SETS }).map((_, set) => (
        <Fragment key={set}>
          {flowNodes.map((node, i) => (
            <div key={`${set}-${node}`} className="flex items-center">
              <Node label={node} index={i} />
              <div className="pt-[0.6875rem]">
                <Connector delay={i * 0.55} />
              </div>
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export function WorkflowCanvas() {
  return (
    <div
      className="relative w-full overflow-hidden py-1"
      role="img"
      aria-label={`A continuously running automation pipeline: ${flowNodes.join(' to ')}`}
    >
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <linearGradient id="connector-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-1)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
      </svg>

      {/* aria-hidden: the label above already describes this for assistive tech,
          so the repeated node names are not announced forty times over. */}
      <div className="flex w-max animate-marquee" aria-hidden="true">
        <Track />
        <Track />
      </div>

      {/* Edge fades so nodes dissolve into the page rather than clipping. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32"
        style={{ background: 'linear-gradient(90deg, var(--surface), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32"
        style={{ background: 'linear-gradient(270deg, var(--surface), transparent)' }}
        aria-hidden="true"
      />
    </div>
  )
}
