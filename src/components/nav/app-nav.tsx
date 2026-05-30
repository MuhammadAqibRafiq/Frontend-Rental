"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Users, LogOut, Menu } from "lucide-react";
import { routes } from "@/lib/routes";
import { logoutAction } from "@/controllers/auth.controller";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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

function MobileBottomSheet({
  open,
  onClose,
  userName,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
  pathname: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 98,
          background: "rgba(15,10,40,0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 99,
          padding: "0 12px 12px",
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{
          background: "white",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 -4px 60px rgba(109,40,217,0.18), 0 0 0 1px rgba(124,58,237,0.08)",
        }}>
          {/* Drag handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 999, background: "#e2e8f0" }} />
          </div>

          {/* User info */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px 16px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>
              {initials(userName)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1733", lineHeight: 1 }}>{userName}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>Owner</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(124,58,237,0.08)", margin: "0 16px" }} />

          {/* Nav links */}
          <div style={{ padding: "8px 12px" }}>
            {NAV_LINKS.map(({ href, label, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 14,
                    fontSize: 15, fontWeight: 600,
                    color: active ? "#6d28d9" : "#334155",
                    background: active ? "#f5f3ff" : "transparent",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                >
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: active ? "#ede9fe" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: active ? "#6d28d9" : "#64748b", flexShrink: 0 }}>
                    <Icon size={17} strokeWidth={2.2} />
                  </span>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(124,58,237,0.08)", margin: "0 16px" }} />

          {/* Logout */}
          <div style={{ padding: "12px 12px 8px" }}>
            <form action={logoutAction}>
              <button
                type="submit"
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, fontSize: 15, fontWeight: 600, color: "#ef4444", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fef2f2"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{ width: 36, height: 36, borderRadius: 10, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <LogOut size={17} strokeWidth={2.2} />
                </span>
                Logout
              </button>
            </form>
          </div>

          {/* Safe area */}
          <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
        </div>
      </div>
    </>,
    document.body
  );
}

export function AppNav({ userName = "User" }: { userName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
            className="flex items-center justify-center rounded-xl border border-violet-200/60 bg-white p-2 md:hidden"
            onClick={() => setOpen(v => !v)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={2.2} />
          </button>

        </div>
      </header>

      <MobileBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        userName={userName}
        pathname={pathname}
      />
    </>
  );
}
