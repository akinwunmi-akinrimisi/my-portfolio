import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects, type Project } from '../content'
import { useReveal } from '../hooks'
import { Chip, FlowStrip, SectionHeading } from './primitives'

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted">{title}</h4>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-secondary">
            <span
              className="mt-[0.55rem] shrink-0 w-1 h-1 rounded-full"
              style={{ backgroundColor: 'var(--accent-1)' }}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const panelId = `${project.id}-detail`

  return (
    <article className="reveal card card-hover spotlight overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-mono text-xs gradient-text font-medium">{project.index}</span>
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
            {project.domain}
          </span>
          <span className="font-mono text-[11px] text-muted ml-auto">{project.year}</span>
        </div>

        <h3 className="mt-3.5 text-2xl sm:text-[1.7rem] font-semibold tracking-tight">
          {project.name}
        </h3>
        <p className="mt-1.5 text-base text-secondary">{project.tagline}</p>

        <p className="mt-5 text-sm sm:text-[0.95rem] leading-relaxed text-secondary max-w-2xl">
          {project.problem}
        </p>

        <div className="mt-6">
          <FlowStrip nodes={project.flow} />
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group/btn mt-5 inline-flex items-center gap-2 min-h-11 py-2 pr-3 text-sm font-medium transition-opacity duration-300 hover:opacity-75"
          style={{ color: 'var(--accent-1)' }}
        >
          {open ? 'Hide the build' : 'How it was built'}
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 sm:px-8 pb-8 pt-2 grid gap-8 lg:grid-cols-2 border-t border-subtle mt-2">
              <div className="pt-7">
                <DetailList title="What I built" items={project.build} />
              </div>
              <div className="lg:pt-7">
                <DetailList title="What it does now" items={project.result} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

export function Work() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} id="work" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Automation work"
          title={
            <>
              Five systems that replaced <span className="gradient-text">recurring human work</span>
            </>
          }
          lead="Each of these started as something a person did on a schedule. Every one now runs unattended, reports its own failures, and is documented well enough that it does not need me."
        />

        <div className="mt-14 space-y-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
