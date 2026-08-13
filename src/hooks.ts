import { useCallback, useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Light/dark theme, persisted. The initial class is set in index.html before paint. */
export function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true,
  )

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light')
      } catch {
        // Private browsing — the toggle still works for this session.
      }
      return next
    })
  }, [])

  return { isDark, toggle }
}

/**
 * Adds `is-visible` to elements carrying `.reveal` inside the returned ref,
 * once each scrolls into view. One observer per section rather than per element.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    if (targets.length === 0) return

    if (prefersReducedMotion()) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Stagger per batch, not per section: elements arriving together cascade,
        // while something scrolled to later still animates immediately rather
        // than inheriting a stale delay from its position in the section.
        let staggerIndex = 0
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.style.transitionDelay = `${Math.min(staggerIndex, 5) * 80}ms`
          el.classList.add('is-visible')
          observer.unobserve(el)
          staggerIndex += 1
        })
      },
      // Fires when the element is ~18% up from the bottom edge rather than the
      // instant it clips the viewport. On a phone, triggering at the very edge
      // meant the animation finished below the reader's eyeline and the page
      // felt static — the motion has to happen where it will actually be seen.
      { threshold: 0.05, rootMargin: '0px 0px -18% 0px' },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return ref
}

/**
 * Drives the pinned project stack. Every `.stack-item` inside `ref` sticks at
 * the same offset, so each card rides up and covers the one before it: the
 * reader keeps scrolling while the page appears to hold still and the projects
 * change in place. This hook only supplies the depth — the shrink applied to a
 * card once it is buried.
 *
 * `scale = 1 - buried * STEP`, where `buried` counts how many cards have
 * stacked on top so far, fractionally, so the shrink tracks the scroll rather
 * than stepping when each card lands.
 *
 * Nothing here may be measured from a sticky element's own position. Both
 * `getBoundingClientRect().top` and `offsetTop` report where a pinned card is
 * *painted*, not where it sits in layout, so a pin computed from either one
 * travels with the scroll, `y - pin` stays constant, and the shrink freezes —
 * which is exactly what happened first time round. Pins are therefore built
 * from the non-sticky container plus each card's layout height, neither of
 * which the pinning or the scale can affect.
 */
const STACK_STEP = 0.018

export function useScrollStack(ref: { current: HTMLElement | null }) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const stack = root.querySelector<HTMLElement>('.stack')
    const items = Array.from(root.querySelectorAll<HTMLElement>('.stack-item'))
    if (!stack || items.length < 2) return
    if (prefersReducedMotion()) return

    const last = items.length - 1
    let frame = 0

    const update = () => {
      frame = 0
      // Re-measured every frame rather than cached: expanding a card's detail
      // panel changes the pitch between pins, and a stale pin list would leave
      // the shrink out of step with the scroll for the rest of the section.
      const offset = parseFloat(getComputedStyle(items[0]).top) || 0
      let cursor = stack.getBoundingClientRect().top + window.scrollY
      const pins = items.map((el, i) => {
        if (i > 0) cursor += parseFloat(getComputedStyle(el).marginTop) || 0
        const pin = cursor - offset
        cursor += el.offsetHeight
        return pin
      })
      const y = window.scrollY

      let buried = 0
      for (let i = 0; i < last; i += 1) {
        const span = pins[i + 1] - pins[i]
        if (span > 0) buried += Math.max(0, Math.min((y - pins[i]) / span, 1))
      }

      items.forEach((el, i) => {
        const depth = Math.min(Math.max(buried - i, 0), last - i)
        el.style.setProperty('--stack-scale', (1 - depth * STACK_STEP).toFixed(4))
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      items.forEach((el) => el.style.removeProperty('--stack-scale'))
    }
  }, [ref])
}

/** Counts from zero to `target` once the element enters view. */
export function useCountUp(target: number, durationMs = 1600) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      setValue(target)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1)
          // easeOutExpo — fast arrival, gentle settle.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
          setValue(Math.round(target * eased))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, durationMs])

  return { ref, value }
}

/**
 * Feeds --mx/--my to any `.spotlight` element under the pointer, so its radial
 * wash tracks the cursor. One delegated listener for the whole page rather than
 * one per card, and a no-op on touch devices where there is no hover.
 */
export function useSpotlight() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    let frame = 0
    let pending: { el: HTMLElement; x: number; y: number } | null = null

    const flush = () => {
      frame = 0
      if (!pending) return
      pending.el.style.setProperty('--mx', `${pending.x}px`)
      pending.el.style.setProperty('--my', `${pending.y}px`)
      pending = null
    }

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      const card = target?.closest?.('.spotlight') as HTMLElement | null
      if (!card) return
      const rect = card.getBoundingClientRect()
      pending = { el: card, x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (!frame) frame = requestAnimationFrame(flush)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])
}

/**
 * Drives any `[data-parallax]` element inside the ref, translating it against
 * the scroll at the rate given by the attribute (e.g. data-parallax="0.18").
 * Transform-only and rAF-batched, so it composites without layout work.
 */
export function useParallax() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    if (layers.length === 0) return

    let frame = 0
    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      layers.forEach((layer) => {
        const rect = layer.getBoundingClientRect()
        // -1 above the viewport, 0 centred, 1 below.
        const offset = (rect.top + rect.height / 2 - viewport / 2) / viewport
        const rate = parseFloat(layer.dataset.parallax || '0.15')
        layer.style.transform = `translate3d(0, ${(offset * rate * 100).toFixed(2)}px, 0)`
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
}

/**
 * How far a section has travelled through the viewport, 0–1. Used to draw the
 * process spine progressively as the reader descends it.
 */
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const viewport = window.innerHeight
      // 0 when the top reaches 80% down the screen, 1 once the bottom passes 50%.
      const start = viewport * 0.8
      const span = rect.height + viewport * 0.3
      const travelled = start - rect.top
      setProgress(Math.max(0, Math.min(travelled / span, 1)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return { ref, progress }
}

/** Fraction of the page scrolled, 0–1, for the reading-progress bar. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return progress
}

/** True once the page has scrolled past `offset` — used to condense the nav. */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return scrolled
}

/** Tracks which section anchor is currently in view, for nav highlighting. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    // Ratios are accumulated across callbacks rather than read from `entries`
    // alone: a callback only reports sections whose intersection *changed*, so
    // picking the winner from that slice alone leaves the highlight stale.
    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        })

        let bestId = ''
        let bestRatio = 0
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        })
        setActive(bestId)
      },
      { rootMargin: '-20% 0px -50% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
