import { profile } from '../content'

/**
 * The hero portrait. Warm-toned against the navy canvas, so it is framed with a
 * cyan/violet ring and a soft glow to tie it back to the palette rather than
 * letting it read as a foreign object dropped onto the page.
 */
export function Portrait() {
  return (
    <div className="relative w-full max-w-[15.5rem] sm:max-w-[18rem] lg:max-w-none">
      {/* Accent glow behind the frame. */}
      <div
        className="absolute -inset-6 rounded-[2rem] blur-2xl animate-drift"
        style={{
          background: 'radial-gradient(circle at 60% 40%, var(--glow-a), transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Gradient ring — 1px of accent around the image. */}
      <div
        className="relative rounded-[1.35rem] p-px"
        style={{
          background:
            'linear-gradient(150deg, var(--accent-1), transparent 45%, transparent 60%, var(--accent-2))',
        }}
      >
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
            className="block w-full h-auto rounded-[1.3rem] object-cover"
            style={{ backgroundColor: 'var(--surface-raised)' }}
          />
        </picture>

        {/* Subtle inner vignette so the photo settles into the dark canvas. */}
        <div
          className="pointer-events-none absolute inset-px rounded-[1.3rem]"
          style={{
            background:
              'linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--surface) 55%, transparent))',
          }}
          aria-hidden="true"
        />
      </div>

      {/* A node tag pinned to the frame, echoing the workflow canvas. */}
      <div
        className="absolute -bottom-4 -left-3 sm:-left-5 flex items-center gap-2 rounded-xl border px-3 py-2"
        style={{
          backgroundColor: 'var(--surface-raised)',
          borderColor: 'var(--border-strong)',
        }}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            background:
              'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
          }}
          aria-hidden="true"
        />
        <span className="font-mono text-[11.5px] tracking-tight text-secondary whitespace-nowrap">
          Build · Solve · Scale
        </span>
      </div>
    </div>
  )
}
