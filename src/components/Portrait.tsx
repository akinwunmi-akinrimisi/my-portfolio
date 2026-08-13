import { profile } from '../content'

const icons = {
  bolt: 'M9.2 1.5 3 9.4h4l-1.2 5.1L12 6.6H8l1.2-5.1Z',
  cloud: 'M4.6 12.8a2.9 2.9 0 0 1-.2-5.8 4 4 0 0 1 7.6-1 3 3 0 0 1 .3 6H4.6Z',
} as const

function ChipIcon({ name }: { name: string }) {
  return (
    <span
      className="grid place-items-center w-6 h-6 rounded-lg shrink-0"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--accent-1) 16%, transparent)',
        color: 'var(--accent-1)',
      }}
      aria-hidden="true"
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path
          d={icons[name as keyof typeof icons] ?? icons.bolt}
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

/**
 * The hero portrait. A slowly morphing organic mask inside a rotating
 * conic-gradient ring, with two floating labels — warm amber against the dark
 * canvas so the photo reads as part of the palette rather than a rectangle
 * dropped onto it.
 *
 * `object-position` sits above centre on purpose: the blob is widest across
 * the middle, so a centred crop clips the top of the head as the shape morphs.
 */
export function Portrait() {
  const [chipA, chipB] = profile.photoChips

  return (
    <div className="relative w-full max-w-[15.5rem] sm:max-w-[18rem] lg:max-w-none">
      {/* Accent glow behind the blob. */}
      <div
        className="absolute -inset-8 blur-3xl animate-drift"
        style={{
          background: 'radial-gradient(circle at 55% 42%, var(--glow-a), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="photo-wrap">
        <div className="photo-ring" aria-hidden="true" />
        <div className="photo-inner">
          <picture>
            <source
              type="image/webp"
              srcSet={`${profile.photo.webp640} 640w, ${profile.photo.webp960} 960w, ${profile.photo.webp1280} 1280w`}
              sizes="(min-width: 1024px) 26rem, (min-width: 640px) 18rem, 15.5rem"
            />
            <img
              src={profile.photo.jpg}
              alt={`${profile.name}, ${profile.role}`}
              width={1122}
              height={1402}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="block w-full h-full object-cover"
              style={{ objectPosition: 'center 22%', backgroundColor: 'var(--surface-raised)' }}
            />
          </picture>

          {/* Vignette so the photo settles into the canvas at its lower edge. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, transparent 52%, color-mix(in srgb, var(--surface) 62%, transparent))',
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="fchip fchip-a -left-2 top-8 sm:-left-6 sm:top-12">
        <ChipIcon name={chipA.icon} />
        <span className="leading-tight">
          <span className="block font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
            {chipA.label}
          </span>
          <span className="block text-[13px] font-medium whitespace-nowrap">{chipA.value}</span>
        </span>
      </div>

      <div className="fchip fchip-b -right-2 bottom-10 sm:-right-6 sm:bottom-14">
        <ChipIcon name={chipB.icon} />
        <span className="leading-tight">
          <span className="block font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
            {chipB.label}
          </span>
          <span className="block text-[13px] font-medium whitespace-nowrap">{chipB.value}</span>
        </span>
      </div>
    </div>
  )
}
