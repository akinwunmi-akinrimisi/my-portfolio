import { education, experience } from '../content'
import { useReveal } from '../hooks'
import { SectionHeading } from './primitives'

export function Experience() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} id="experience" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Experience"
          title={
            <>
              From production lines to <span className="gradient-text">production pipelines</span>
            </>
          }
          lead="I started out keeping Coca-Cola bottling lines at 85% efficiency. The instinct is the same one I bring to software: find the step that keeps stopping, and engineer it so it cannot."
        />

        <div className="mt-14 space-y-10">
          {experience.map((role) => (
            <article
              key={role.org}
              className="reveal reveal-left grid gap-4 lg:grid-cols-[15rem_1fr] lg:gap-10"
            >
              <div>
                <p className="font-mono text-[11px] tracking-wide text-muted">{role.period}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight leading-snug">
                  {role.role}
                </h3>
                <p className="mt-1 text-sm text-secondary">{role.org}</p>
              </div>

              <ul className="space-y-2.5 lg:border-l lg:border-subtle lg:pl-10">
                {role.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-secondary">
                    <span
                      className="mt-[0.55rem] shrink-0 w-1 h-1 rounded-full"
                      style={{ backgroundColor: 'var(--accent-2)' }}
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="reveal mt-14 pt-10 border-t border-subtle">
          <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted">Education</h3>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {education.map((item) => (
              <li key={item.qualification}>
                <p className="text-sm font-medium leading-snug">{item.qualification}</p>
                <p className="mt-1 text-sm text-muted">{item.org}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
