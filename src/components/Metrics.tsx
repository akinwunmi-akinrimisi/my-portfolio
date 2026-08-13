import { metrics } from '../content'
import { useCountUp, useReveal } from '../hooks'

function Metric({
  value,
  suffix,
  label,
  sub,
}: {
  value: number
  suffix: string
  label: string
  sub: string
}) {
  const { ref, value: shown } = useCountUp(value)

  return (
    <div className="reveal relative pl-5 sm:pl-6">
      <span
        className="absolute left-0 top-1.5 bottom-1.5 w-px"
        style={{
          background: 'linear-gradient(180deg, var(--accent-1), var(--accent-2))',
        }}
        aria-hidden="true"
      />
      <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight tabular-nums">
        <span ref={ref}>{shown.toLocaleString('en-US')}</span>
        <span className="gradient-text">{suffix}</span>
      </p>
      <p className="mt-2 text-sm font-medium leading-snug">{label}</p>
      <p className="mt-1 text-xs text-muted leading-snug">{sub}</p>
    </div>
  )
}

export function Metrics() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="relative py-14 sm:py-16 border-y border-subtle bg-sunken">
      <div className="shell grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {metrics.map((m) => (
          <Metric key={m.label} {...m} />
        ))}
      </div>
    </section>
  )
}
