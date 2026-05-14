"use client";

import { useState } from "react";
import Link from "next/link";
import { Home as HomeIcon, X, ChevronRight, ChevronDown, MapPin } from "lucide-react";
import { homeColor } from "@/lib/utils";
import { routes } from "@/lib/routes";
import type { Home } from "@/lib/types";

interface MobilePropertyPickerProps {
  homes: Home[];
  activeHomeId: string;
}

export function MobilePropertyPicker({ homes, activeHomeId }: MobilePropertyPickerProps) {
  const [open, setOpen] = useState(false);
  const active = homes.find((h) => h.id === activeHomeId);
  const color = active ? homeColor(active.id) : "#7c3aed";

  return (
    <>
      {/* Trigger — shows active property */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-left transition-colors hover:bg-muted/30 md:hidden"
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}BB 100%)` }}
        >
          <HomeIcon className="h-4 w-4 text-white" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-[14px] font-bold leading-tight">{active?.name ?? "Select property"}</p>
          {active?.address && (
            <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              {active.address}
            </p>
          )}
        </div>
        <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
      </button>

      {/* Bottom sheet */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />

          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white pb-8 shadow-2xl md:hidden">
            {/* Handle */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-muted" />

            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-[15px] font-bold">Your Properties</p>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-3">
              {homes.map((home) => {
                const isActive = home.id === activeHomeId;
                const c = homeColor(home.id);
                return (
                  <Link
                    key={home.id}
                    href={`${routes.dashboard}?home=${home.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 no-underline transition-colors"
                    style={{ background: isActive ? `${c}12` : "transparent" }}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${c} 0%, ${c}BB 100%)`, boxShadow: isActive ? `0 4px 12px ${c}40` : "none" }}
                    >
                      <HomeIcon className="h-5 w-5 text-white" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[14px] font-semibold" style={{ color: isActive ? c : "hsl(var(--foreground))" }}>
                        {home.name}
                      </p>
                      {home.address && (
                        <p className="truncate text-[11px] text-muted-foreground">{home.address}</p>
                      )}
                    </div>
                    {isActive && <ChevronRight size={16} style={{ color: c }} />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
