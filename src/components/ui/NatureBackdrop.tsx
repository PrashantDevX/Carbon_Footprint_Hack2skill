/**
 * Decorative, non-interactive nature backdrop: soft blurred blobs plus
 * hand-drawn-style leaf / branch line art. Sits behind all content, adapts to
 * light & dark themes, and is hidden from assistive tech.
 */
export function NatureBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Ambient colour blobs */}
      <div className="absolute -left-[12%] -top-[10%] h-[42vw] w-[42vw] rounded-full bg-forest-300/25 blur-3xl dark:bg-forest-700/20" />
      <div className="absolute -right-[10%] top-[35%] h-[38vw] w-[38vw] rounded-full bg-earth-300/25 blur-3xl dark:bg-earth-900/15" />
      <div className="absolute bottom-[-15%] left-[25%] h-[40vw] w-[40vw] rounded-full bg-forest-200/20 blur-3xl dark:bg-forest-800/15" />

      {/* Tiled leaf doodle pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%2316a34a' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='M48 20C34 26 27 44 36 62C52 56 59 38 48 20Z'/%3E%3Cpath d='M48 20C62 26 69 44 60 62C44 56 37 38 48 20Z'/%3E%3Cpath d='M48 20L48 62'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      />

      {/* Corner branch / leaf line art */}
      <svg className="absolute -bottom-6 -left-6 h-56 w-56 text-forest-500/15 dark:text-forest-400/15" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M40 200C40 130 60 80 120 50" />
        <path d="M120 50c-18-4-34 2-44 16 14 8 32 6 44-16z" />
        <path d="M96 92c-16-2-30 6-38 20 16 6 32 0 38-20z" />
        <path d="M78 132c-14 0-26 8-32 22 14 4 28-2 32-22z" />
        <path d="M120 50c8-14 6-30-2-44-12 10-16 28 2 44z" />
      </svg>

      <svg className="absolute -right-8 top-10 h-48 w-48 rotate-12 text-earth-500/15 dark:text-earth-400/15" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M160 10C110 40 70 90 60 160" />
        <path d="M60 160c-12-10-18-26-16-44 16 6 28 22 16 44z" />
        <path d="M86 110c-12-12-16-30-10-46 16 10 22 30 10 46z" />
        <path d="M118 64c-10-14-10-32 0-46 14 12 14 32 0 46z" />
      </svg>
    </div>
  );
}
