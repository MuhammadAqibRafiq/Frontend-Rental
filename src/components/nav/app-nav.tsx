"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Users, LogOut, Menu, X } from "lucide-react";
import { routes } from "@/lib/routes";
import { logoutAction } from "@/controllers/auth.controller";
import { useState } from "react";

const NAV_LINKS = [
  { href: routes.dashboard, label: "Home",  Icon: Home    },
  { href: routes.bills,     label: "Bills", Icon: Receipt },
  { href: routes.users,     label: "Users", Icon: Users   },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function AppNav({ userName = "User" }: { userName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-violet-200/40 bg-[rgba(248,247,255,0.7)] backdrop-blur-xl backdrop-saturate-[180%]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4">

        {/* Logo */}
        <Link href={routes.home} className="flex items-center gap-2.5 no-underline">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-400 shadow-[0_4px_12px_rgba(124,58,237,0.35)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11 12 4l9 7" />
              <path d="M5 10v10h14V10" />
              <path d="M10 20v-5h4v5" />
            </svg>
          </div>
          <div>
            <div className="text-[17px] font-extrabold leading-none tracking-tight text-foreground">
              RentalApp
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Landlord Dashboard
            </div>
          </div>
        </Link>

        {/* Desktop nav pill */}
        <nav className="hidden items-center gap-1 rounded-2xl border border-violet-200/40 bg-violet-50/50 p-1 md:flex">
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-2 rounded-xl px-[18px] py-2.5 text-sm font-semibold transition-all duration-150 no-underline",
                  active
                    ? "bg-white text-violet-700 shadow-[0_2px_8px_rgba(124,58,237,0.12)]"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <Icon size={15} strokeWidth={2.2} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop: user + logout */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2.5 rounded-[14px] border border-border bg-white px-3 py-1.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-violet-300 text-[11px] font-bold text-white">
              {initials(userName)}
            </div>
            <div>
              <div className="text-[13px] font-bold leading-none">{userName}</div>
              <div className="mt-0.5 text-[11px] leading-none text-muted-foreground">Owner</div>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut size={14} strokeWidth={2.2} />
              Logout
            </button>
          </form>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="flex items-center justify-center rounded-xl border border-border bg-white p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>
    </header>

    {/* Mobile overlay + side drawer */}
    {open && (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <div className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl md:hidden">

          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-violet-300 text-[11px] font-bold text-white">
                {initials(userName)}
              </div>
              <div>
                <div className="text-[13px] font-bold leading-none">{userName}</div>
                <div className="mt-0.5 text-[11px] leading-none text-muted-foreground">Owner</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map(({ href, label, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all no-underline",
                    active
                      ? "bg-violet-50 text-violet-700"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Logout at bottom */}
          <div className="mt-auto border-t border-border p-4">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
              >
                <LogOut size={16} strokeWidth={2.2} />
                Logout
              </button>
            </form>
          </div>

        </div>
      </>
    )}
    </>
  );
}

