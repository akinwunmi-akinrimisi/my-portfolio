import { capabilities, certifications } from '../content'
import { useCardSpread, useReveal } from '../hooks'
import { Chip, SectionHeading } from './primitives'

export function Cloud() {
  const ref = useReveal<HTMLElement>()
  useCardSpread(ref)

  return (
    <section
      ref={ref}
      id="cloud"
      className="relative overflow-hidden py-24 sm:py-32 bg-sunken border-y border-subtle"
    >
      <div className="absolute inset-0 canvas-grid opacity-50" aria-hidden="true" />
      <div
        data-parallax="0.5"
        className="absolute -top-24 right-[-10rem] w-[34rem] h-[34rem] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--glow-a), transparent 68%)' }}
        aria-hidden="true"
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Cloud & DevOps"
          title={
            <>
              The engineering <span className="gradient-text">underneath</span> the automation
            </>
          }
          lead="Automation is only as trustworthy as the infrastructure carrying it. Five years of AWS, infrastructure as code and CI/CD is what lets me promise a workflow will still be running next quarter."
        />

        <div className="spread-grid mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/*
            These are deliberately not `.reveal` targets. That class carries a
            0.95s transform transition, which makes a scroll-linked slide lag a
            full second behind the scroll, and its fade would hide the cards
            during the very moment they emerge from the centre one.
          */}
          {capabilities.map((cap) => (
            <article
              key={cap.title}
              className="spread-card card card-hover spotlight p-6 flex flex-col"
            >
              <h3 className="text-lg font-semibold tracking-tight">{cap.title}</h3>
              <p className="mt-2 text-sm text-secondary leading-relaxed">{cap.summary}</p>

              <ul className="mt-5 space-y-3 flex-1">
                {cap.evidence.map((line) => (
                  <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-secondary">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="mt-[0.2rem] shrink-0"
                    >
                      <path
                        d="M3 8.5l3.2 3.2L13 5"
                        stroke="var(--accent-1)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-subtle flex flex-wrap gap-1.5">
                {cap.tools.map((tool) => (
                  <Chip key={tool}>{tool}</Chip>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-8 card p-6 sm:p-8">
          <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted">
            AWS Certification
          </h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {certifications.map((cert) => {
              const certified = cert.status === 'Certified'
              return (
                <li key={cert.name} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 grid place-items-center w-7 h-7 rounded-lg shrink-0 border"
                    style={{
                      borderColor: certified ? 'var(--accent-1)' : 'var(--border-strong)',
                      backgroundColor: 'var(--surface-sunken)',
                    }}
                    aria-hidden="true"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1.5l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.3 4.2 13.3l.7-4.3-3.1-3 4.3-.6z"
                        stroke={certified ? 'var(--accent-1)' : 'var(--text-muted)'}
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                        fill={certified ? 'var(--accent-1)' : 'none'}
                        fillOpacity={certified ? 0.16 : 0}
                      />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-sm font-medium leading-snug">{cert.name}</span>
                    <span
                      className="mt-0.5 block font-mono text-[11px]"
                      style={{
                        color: certified ? 'var(--accent-1)' : 'var(--text-muted)',
                      }}
                    >
                      {cert.status}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
