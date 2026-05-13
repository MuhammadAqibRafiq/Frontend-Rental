import Link from "next/link";
import { Receipt, MessageCircle, TrendingUp, Home as HomeIcon } from "lucide-react";

const features = [
  {
    Icon: Receipt,
    title: "Auto-generated bills",
    body: "Rent, electricity, gas, water — itemised every month, ready to send.",
  },
  {
    Icon: MessageCircle,
    title: "One-tap WhatsApp reminders",
    body: "Nudge tenants directly from the bill or table view.",
  },
  {
    Icon: TrendingUp,
    title: "See where dues sit",
    body: "Color-coded balances — orange means follow up, green means done.",
  },
];

export function AuthShell({
  children,
  eyebrow = "Welcome back",
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-10 md:py-16">
      <div className="grid w-full overflow-hidden rounded-3xl border border-violet-200/60 bg-card shadow-[0_24px_80px_-20px_rgba(124,58,237,0.25)] md:grid-cols-[1.05fr_1fr]">
        {/* Left: gradient hero */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-800 via-violet-600 to-violet-400 p-10 text-white md:flex md:min-h-[640px] md:p-12">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[360px] w-[360px] rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-[280px] w-[280px] rounded-full bg-pink-400/30 blur-3xl" />
          {/* Grid mask */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            }}
          />

          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/15 backdrop-blur">
              <HomeIcon className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-bold leading-none tracking-tight">RentalApp</div>
              <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] opacity-80">
                Landlord Dashboard
              </div>
            </div>
          </Link>

          {/* Tagline + mini preview */}
          <div className="relative my-8">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              For property owners
            </div>
            <h1 className="text-[2.25rem] font-extrabold leading-[1.1] tracking-tight">
              Manage every rental,
              <br />
              <span className="bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                without the spreadsheets.
              </span>
            </h1>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/80">
              Track tenants, generate monthly bills, record payments and chase pending dues — all
              from one place.
            </p>

            <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.08em] opacity-80">
                  This Month
                </div>
                <span className="rounded-md bg-emerald-400/25 px-2 py-0.5 text-[11px] font-bold text-emerald-100">
                  92% recovered
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Properties", value: "4" },
                  { label: "Tenants", value: "17" },
                  { label: "Pending", value: "8,420" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[22px] font-extrabold tracking-tight">{s.value}</div>
                    <div className="mt-0.5 text-[11px] opacity-75">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="relative flex flex-col gap-4">
            {features.map(({ Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="text-sm font-bold">{title}</div>
                  <div className="mt-0.5 text-[13px] leading-snug text-white/75">{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form panel */}
        <div className="flex flex-col justify-center bg-card p-8 md:p-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              {eyebrow}
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
