import { toolbelt } from '../content'
import { useReveal } from '../hooks'

export function Toolbelt() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="relative py-20 sm:py-24 bg-sunken border-y border-subtle">
      <div className="shell">
        <p className="reveal font-mono text-xs tracking-[0.22em] uppercase gradient-text font-medium">
          Toolbelt
        </p>

        <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {toolbelt.map((group) => (
            <div key={group.group} className="reveal reveal-scale">
              <h3 className="text-sm font-semibold tracking-tight">{group.group}</h3>
              <span className="mt-3 block h-px w-10 gradient-rule" aria-hidden="true" />
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-[13px] text-secondary transition-all duration-300 hover:text-[var(--text-primary)] hover:translate-x-1"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
