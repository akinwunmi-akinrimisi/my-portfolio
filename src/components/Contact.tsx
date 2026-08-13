import { contact, profile } from '../content'
import { useReveal } from '../hooks'
import { ArrowIcon } from './primitives'

const links = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'LinkedIn', value: 'akinwunmi-akinrimisi', href: profile.linkedin },
  { label: 'GitHub', value: 'akinwunmi-akinrimisi', href: profile.github },
]

export function Contact() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} id="contact" className="relative overflow-hidden py-24 sm:py-32 bg-sunken border-t border-subtle">
      <div className="absolute inset-0 canvas-grid opacity-60" aria-hidden="true" />
      <div
        data-parallax="0.6"
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[44rem] h-[30rem] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, var(--glow-b), transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="reveal max-w-3xl">
          <p className="font-mono text-xs tracking-[0.22em] uppercase gradient-text font-medium">
            Contact
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.08]">
            {contact.heading}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-secondary leading-relaxed">{contact.body}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-2 rounded-xl px-5 h-12 font-medium text-ink-950 transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                background:
                  'linear-gradient(120deg, var(--accent-1), var(--accent-2))',
              }}
            >
              Email me
              <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-strong px-5 h-12 font-medium transition-colors duration-300 hover:border-[var(--accent-1)]"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>

        <dl className="reveal mt-16 grid gap-6 sm:grid-cols-3 pt-10 border-t border-subtle">
          {links.map((link) => (
            <div key={link.label}>
              <dt className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted">
                {link.label}
              </dt>
              <dd className="mt-1">
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  className="inline-flex items-center min-h-12 py-2 text-sm break-all transition-colors duration-300 hover:text-[var(--accent-1)]"
                >
                  {link.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="py-9 border-t border-subtle">
      <div className="shell flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-mono text-[11px] text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-mono text-[11px] text-muted">
          Built with React and Tailwind. Deployed on Netlify.
        </p>
        <a
          href="#top"
          className="inline-flex items-center min-h-11 py-2 font-mono text-[11.5px] text-muted transition-colors duration-300 hover:text-[var(--accent-1)]"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
