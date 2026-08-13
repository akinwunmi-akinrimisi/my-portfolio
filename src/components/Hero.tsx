import { profile } from '../content'
import { ArrowIcon } from './primitives'
import { Portrait } from './Portrait'
import { WorkflowCanvas } from './WorkflowCanvas'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Ambient field: dot grid plus two slow-drifting accent glows. */}
      <div className="absolute inset-0 canvas-grid opacity-70" aria-hidden="true" />
      <div
        className="absolute -top-32 -left-24 w-[36rem] h-[36rem] rounded-full blur-3xl animate-drift"
        style={{ background: `radial-gradient(circle, var(--glow-a), transparent 68%)` }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-16 right-[-12rem] w-[34rem] h-[34rem] rounded-full blur-3xl animate-drift"
        style={{
          background: `radial-gradient(circle, var(--glow-b), transparent 68%)`,
          animationDelay: '3.5s',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{ background: 'linear-gradient(180deg, transparent, var(--surface))' }}
        aria-hidden="true"
      />

      <div className="shell relative">
        {/*
          Three grid children rather than two, so the portrait can sit between the
          headline and the supporting copy on mobile — a portfolio should show a
          face above the fold — while still occupying a single right-hand column
          alongside both text blocks from lg upward.
        */}
        <div className="grid gap-8 lg:gap-x-16 lg:gap-y-0 lg:items-center lg:grid-cols-[1.25fr_0.75fr]">
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <div className="reveal is-visible inline-flex items-center gap-2.5 rounded-full border border-subtle bg-raised px-3.5 py-1.5">
            <span className="relative flex w-2 h-2">
              <span
                className="absolute inline-flex w-full h-full rounded-full opacity-70 animate-ping"
                style={{ backgroundColor: 'var(--accent-1)' }}
              />
              <span
                className="relative inline-flex w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--accent-1)' }}
              />
            </span>
            <span className="font-mono text-[11.5px] tracking-wide text-secondary">
              {profile.availability}
            </span>
          </div>

          <h1 className="mt-7 font-display font-bold tracking-[-0.035em] text-[2.6rem] leading-[1.03] sm:text-[3.5rem] lg:text-[3.6rem] xl:text-[4.15rem]">
            {profile.headline.map((line, i) => (
              <span key={line} className="block">
                {i === profile.headlineAccentLine ? (
                  <span className="gradient-text">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
          </div>

          <div className="reveal is-visible flex justify-start lg:justify-end lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <Portrait />
          </div>

          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-secondary lg:mt-7">
            {profile.subline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-xl px-5 h-12 font-medium text-ink-950 transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                background:
                  'linear-gradient(120deg, var(--accent-1), var(--accent-2))',
              }}
            >
              See the work
              <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-xl border border-strong px-5 h-12 font-medium transition-colors duration-300 hover:border-[var(--accent-1)]"
            >
              Start a conversation
            </a>
          </div>

            <p className="mt-7 font-mono text-xs text-muted">{profile.location}</p>
          </div>
        </div>
      </div>

      {/* Full-bleed: the marquee runs edge to edge, outside the shell's gutters. */}
      <div className="relative mt-20 sm:mt-24">
        <WorkflowCanvas />
      </div>
    </section>
  )
}
