"use client";

import { useState } from "react";
import Link from "next/link";
import { Home as HomeIcon, MapPin, ChevronRight, Search } from "lucide-react";
import { AddHomeModal } from "./add-home-modal";
import { EditHomeModal } from "./edit-home-modal";
import { routes } from "@/lib/routes";
import { homeColor } from "@/lib/utils";
import type { Home } from "@/lib/types";

interface SidebarProps {
  homes: Home[];
  activeHomeId: string;
}

export function Sidebar({ homes, activeHomeId }: SidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = homes.filter(
    (h) =>
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      (h.address ?? "").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <aside className="flex flex-col rounded-2xl border border-border bg-card/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-[16px]">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
            Your portfolio
          </p>
          <p className="mt-0.5 text-lg font-bold tracking-tight">
            {homes.length} {homes.length === 1 ? "property" : "properties"}
          </p>
        </div>
        {/* <AddHomeModal /> */}
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400/40"
            placeholder="Search properties…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-medium text-muted-foreground">No matches</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different search</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((home) => {
              const active = home.id === activeHomeId;
              const color = homeColor(home.id);
              return (
                <Link
                  key={home.id}
                  href={`${routes.dashboard}?home=${home.id}`}
                  className="group relative block overflow-hidden rounded-[18px] no-underline transition-all duration-150"
                  style={{
                    border: active ? `1.5px solid ${color}60` : "1px solid var(--border)",
                    background: active ? "var(--accent)" : "var(--card)",
                    boxShadow: active ? `0 4px 16px ${color}1e` : "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Active accent bar */}
                  {active && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[18px]"
                      style={{ background: color }}
                    />
                  )}

                  <div className="flex items-start gap-3.5 p-4">
                    {/* Icon */}
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${color} 0%, ${color}AA 100%)`,
                        boxShadow: active ? `0 4px 12px ${color}40` : "none",
                      }}
                    >
                      <HomeIcon className="h-5 w-5 text-white" strokeWidth={2.2} />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-[15px] font-bold tracking-tight"
                        style={{ color: "var(--foreground)" }}
                      >
                        {home.name}
                      </p>
                      {home.address && (
                        <p className="mt-0.5 flex items-center gap-1 truncate text-[12.5px] text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5 shrink-0" strokeWidth={2} />
                          {home.address}
                        </p>
                      )}
                    </div>

                    {/* Edit + Chevron */}
                    <div className="mt-2.5 flex items-center gap-1">
                      <EditHomeModal home={home} />
                      <ChevronRight
                        className="h-4 w-4 shrink-0 transition-colors"
                        style={{ color: active ? color : "var(--muted-foreground)" }}
                        strokeWidth={2.2}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
