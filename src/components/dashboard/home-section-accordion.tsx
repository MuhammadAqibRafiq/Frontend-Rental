"use client";

import { useState } from "react";
import { ChevronDown, Home as HomeIcon } from "lucide-react";
import { GenerateAllBillsModal } from "./generate-all-bills-modal";
import { homeColor } from "@/lib/utils";
import type { Home, Tenant } from "@/lib/types";

interface Props {
  home: Home;
  tenants: Tenant[];
  unbilledTenants: Tenant[];
  activeMonth: string;
  totalDue: number;
  pendingCount: number;
  billsCount: number;
  children: React.ReactNode;
}

export function HomeSectionAccordion({
  home, tenants, unbilledTenants, activeMonth,
  totalDue, pendingCount, billsCount, children,
}: Props) {
  const [open, setOpen] = useState(true);
  const color = homeColor(home.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Header toggle */}
      <div
        role="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between px-6 py-5 transition-colors hover:bg-muted/20"
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`, boxShadow: `0 4px 12px ${color}33` }}
          >
            <HomeIcon size={20} strokeWidth={2.2} />
          </div>
          <div className="text-left">
            <p className="text-[17px] font-bold leading-tight tracking-tight">{home.name}</p>
            <p className="mt-0.5 flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <span>{billsCount} bills</span>
              <span className="text-border">·</span>
              <span className="font-semibold" style={{ color: pendingCount > 0 ? "#c2410c" : "#065f46" }}>
                {pendingCount > 0 ? `${pendingCount} pending` : "All settled"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {totalDue > 0 && (
            <div className="text-right">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.04em] text-muted-foreground">Outstanding</p>
              <p className="mt-0.5 text-[18px] font-extrabold leading-none tracking-tight" style={{ color: "#c2410c" }}>
                {totalDue.toLocaleString()}
              </p>
            </div>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <GenerateAllBillsModal homeId={home.id} tenants={unbilledTenants} defaultMonth={activeMonth} />
          </div>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[10px] transition-transform duration-200"
            style={{
              background: "var(--accent)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ChevronDown size={16} style={{ color: "#7c3aed" }} />
          </div>
        </div>
      </div>

      {/* Collapsible content */}
      {open && (
        <div className="border-t border-border">
          {tenants.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">No tenants in this home.</p>
          ) : (
            <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3 items-start">
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
