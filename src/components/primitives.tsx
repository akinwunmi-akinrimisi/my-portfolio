import type { ReactNode } from 'react'

export function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: ReactNode
  lead?: string
}) {
  return (
    <header className="max-w-3xl">
      <p className="reveal reveal-left font-mono text-xs tracking-[0.22em] uppercase gradient-text font-medium">
        {eyebrow}
      </p>
      <h2 className="reveal reveal-wipe mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.08]">
        <span className="wipe-inner">{title}</span>
      </h2>
      {lead && (
        <p className="reveal mt-5 text-base sm:text-lg text-secondary leading-relaxed">{lead}</p>
      )}
    </header>
  )
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-subtle bg-sunken px-2.5 py-1 font-mono text-[11.5px] tracking-tight text-secondary transition-colors duration-300 hover:border-[var(--accent-1)] hover:text-[var(--text-primary)]">
      {children}
    </span>
  )
}

/** A horizontal node-and-connector strip — the site's recurring visual idiom. */
export function FlowStrip({ nodes }: { nodes: readonly string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {nodes.map((node, i) => (
        <li key={node} className="flex items-center gap-1.5">
          <span className="rounded-md bg-sunken border border-subtle px-2 py-1 font-mono text-[11.5px] text-secondary whitespace-nowrap transition-colors duration-300 hover:border-[var(--accent-1)]">
            {node}
          </span>
          {i < nodes.length - 1 && (
            <svg width="14" height="8" viewBox="0 0 14 8" aria-hidden="true" className="shrink-0">
              <path
                d="M0 4 H10"
                stroke="var(--accent-1)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.55"
              />
              <path d="M9 1.5 L12.5 4 L9 6.5" fill="var(--accent-1)" opacity="0.55" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  )
}

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
