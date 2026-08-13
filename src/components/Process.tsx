import { process } from '../content'
import { useReveal, useSectionProgress } from '../hooks'
import { SectionHeading } from './primitives'

export function Process() {
  const ref = useReveal<HTMLElement>()
  const { ref: spineRef, progress: spineProgress } = useSectionProgress<HTMLOListElement>()

  return (
    <section ref={ref} id="process" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="How I build"
          title={
            <>
              Five steps, and the fifth is the one <span className="gradient-text">most people skip</span>
            </>
          }
          lead="Most automation fails not because the build was wrong but because nobody instrumented it and nobody documented it. This is the order I work in, every time."
        />

        <ol ref={spineRef} className="mt-14 relative">
          {/* The unlit spine. */}
          <span
            className="absolute left-[1.4rem] top-3 bottom-3 w-px hidden sm:block"
            style={{ backgroundColor: 'var(--border-subtle)' }}
            aria-hidden="true"
          />
          {/* The lit spine, drawn downward as the reader descends the section. */}
          <span
            className="absolute left-[1.4rem] top-3 bottom-3 w-px hidden sm:block origin-top"
            style={{
              background: 'linear-gradient(180deg, var(--accent-1), var(--accent-2))',
              transform: `scaleY(${spineProgress})`,
              boxShadow: '0 0 12px -2px var(--accent-1)',
            }}
            aria-hidden="true"
          />

          {process.map((item) => (
            <li key={item.step} className="reveal reveal-left group relative sm:pl-20 pb-10 last:pb-0">
              <span
                className="hidden sm:grid place-items-center absolute left-0 top-0 w-[2.8rem] h-[2.8rem] rounded-xl border font-mono text-xs font-medium transition-all duration-500 group-hover:scale-110 group-hover:border-[var(--accent-1)]"
                style={{
                  backgroundColor: 'var(--surface-raised)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--accent-1)',
                }}
                aria-hidden="true"
              >
                {item.step}
              </span>

              <h3 className="text-xl font-semibold tracking-tight">
                <span className="sm:hidden font-mono text-xs gradient-text mr-2.5">{item.step}</span>
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm sm:text-[0.95rem] leading-relaxed text-secondary max-w-2xl">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
