export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-72px)] items-center justify-center overflow-hidden">
      {/* Blurred colour orbs — Apple-style depth */}
      <div className="absolute -top-32 -left-32 h-126 w-126 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl" />

      {/* Frosted glass card */}
      <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-10 py-8 shadow-2xl backdrop-blur-2xl">
        <div className="relative h-12 w-12">
          <svg className="animate-spin" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              </linearGradient>
            </defs>
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="url(#ring-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="75 25"
            />
          </svg>
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 h-2 w-2 rounded-full bg-primary blur-[2px] animate-spin [animation-duration:1s]" />
        </div>
        <p className="text-sm font-medium text-foreground/60 tracking-wide">Loading…</p>
      </div>
    </div>
  );
}
