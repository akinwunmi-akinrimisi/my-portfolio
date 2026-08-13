import { useState } from 'react'
import { nav, profile } from '../content'
import { useActiveSection, useScrolled, useScrollProgress, useTheme } from '../hooks'

const SECTION_IDS = nav.map((n) => n.href.slice(1))

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.5 1.5M6.8 17.2l-1.5 1.5M18.7 18.7l-1.5-1.5M6.8 6.8L5.3 5.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.5 14.6A8.6 8.6 0 019.4 3.5a8.6 8.6 0 1011.1 11.1z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Nav() {
  const scrolled = useScrolled()
  const progress = useScrollProgress()
  const active = useActiveSection(SECTION_IDS)
  const { isDark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px) saturate(150%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(150%)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border-subtle)' : 'transparent'}`,
      }}
    >
      <nav className="shell flex items-center justify-between h-16 sm:h-[4.5rem]" aria-label="Primary">
        <a
          href="#top"
          className="flex items-center gap-2.5 group shrink-0 h-11"
          aria-label={`${profile.name} — back to top`}
        >
          <span
            className="grid place-items-center w-10 h-10 rounded-[11px] font-display font-bold text-[13px] text-ink-950 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{
              background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            }}
          >
            {profile.monogram}
          </span>
          <span className="hidden sm:block font-display font-semibold text-[15px] tracking-tight">
            {profile.name}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {nav.map((item) => {
            const isActive = active === item.href.slice(1)
            return (
              <a
                key={item.href}
                href={item.href}
                className="relative flex items-center h-11 px-3.5 text-sm font-medium transition-colors duration-300 hover:text-[var(--text-primary)]"
                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {item.label}
                <span
                  className="absolute left-3.5 right-3.5 bottom-1.5 h-px origin-left transition-transform duration-500 gradient-rule"
                  style={{ transform: `scaleX(${isActive ? 1 : 0})` }}
                />
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="grid place-items-center w-11 h-11 rounded-lg border border-subtle text-secondary transition-colors duration-300 hover:text-[var(--text-primary)]"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <a
            href={profile.cv}
            download
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-strong px-3.5 h-11 text-sm font-medium transition-all duration-300 hover:border-[var(--accent-1)] hover:-translate-y-0.5"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 2v8m0 0L4.8 6.8M8 10l3.2-3.2M2.5 12.5v1h11v-1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            CV
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden grid place-items-center w-11 h-11 rounded-lg border border-subtle text-secondary"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Reading progress. Sits on the nav's lower edge and fills as the page scrolls. */}
      <div
        className="absolute inset-x-0 bottom-0 h-px origin-left gradient-rule transition-opacity duration-500"
        style={{ transform: `scaleX(${progress})`, opacity: scrolled ? 1 : 0 }}
        aria-hidden="true"
      />

      {menuOpen && (
        <div
          className="md:hidden border-t border-subtle"
          style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(14px)' }}
        >
          <div className="shell py-3 flex flex-col">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center min-h-11 py-2.5 text-sm font-medium text-secondary transition-colors duration-300 hover:text-[var(--text-primary)]"
              >
                {item.label}
              </a>
            ))}
            <a
              href={profile.cv}
              download
              className="flex items-center min-h-11 py-2.5 text-sm font-medium gradient-text w-fit"
            >
              Download CV
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
