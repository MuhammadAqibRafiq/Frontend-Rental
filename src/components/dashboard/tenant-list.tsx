"use client";

import { useState } from "react";
import { LayoutGrid, List, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditTenantModal } from "./edit-tenant-modal";
import { DeleteTenantButton } from "./delete-tenant-button";
import { AddTenantModal } from "./add-tenant-modal";
import type { Tenant } from "@/lib/types";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function TenantList({ tenants, homeColor = "#7c3aed", homeId }: { tenants: Tenant[]; homeColor?: string; homeId: string }) {
  const [view, setView] = useState<"card" | "table">("table");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold tracking-tight">
          Tenants{" "}
          <span className="ml-1.5 font-medium text-muted-foreground">· {tenants.length}</span>
        </h3>
        <div className="flex items-center gap-2">
          <AddTenantModal homeId={homeId} />
          <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1">
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
              view === "table" ? "bg-violet-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
            title="Table view"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("card")}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
              view === "card" ? "bg-violet-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
            title="Card view"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          </div>
        </div>
      </div>

      {view === "table" ? (
        <TableView tenants={tenants} homeColor={homeColor} />
      ) : (
        <CardView tenants={tenants} homeColor={homeColor} />
      )}
    </div>
  );
}

function TableView({ tenants, homeColor }: { tenants: Tenant[]; homeColor: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
            <th className="px-5 py-3">Tenant</th>
            <th className="px-5 py-3">Unit</th>
            <th className="px-5 py-3">Phone</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tenants.map((tenant) => (
            <tr
              key={tenant.id}
              className={cn("transition-colors hover:bg-muted/20", !tenant.active && "opacity-60")}
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${homeColor} 0%, ${homeColor}AA 100%)` }}
                  >
                    {initials(tenant.name)}
                  </div>
                  <span className="font-semibold">{tenant.name}</span>
                </div>
              </td>
              <td className="px-5 py-3">
                {tenant.unit ? (
                  <span
                    className="inline-block rounded-md px-2 py-0.5 text-[11px] font-bold"
                    style={{ background: `${homeColor}18`, color: homeColor }}
                  >
                    {tenant.unit}
                  </span>
                ) : <span className="text-muted-foreground">—</span>}
              </td>
              <td className="px-5 py-3 text-xs text-muted-foreground">
                {tenant.phone ? (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {tenant.phone}
                  </span>
                ) : "—"}
              </td>
              <td className="px-5 py-3">
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                  tenant.active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-orange-100 text-orange-700",
                )}>
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    tenant.active ? "bg-emerald-500" : "bg-orange-500",
                  )} />
                  {tenant.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <EditTenantModal tenant={tenant} />
                  <DeleteTenantButton tenantId={tenant.id} tenantName={tenant.name} homeId={tenant.homeId} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardView({ tenants, homeColor }: { tenants: Tenant[]; homeColor: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tenants.map((tenant) => (
        <TenantCard key={tenant.id} tenant={tenant} homeColor={homeColor} />
      ))}
    </div>
  );
}

function TenantCard({ tenant, homeColor }: { tenant: Tenant; homeColor: string }) {
  const ini = initials(tenant.name);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-border bg-white px-4 py-3 transition-shadow hover:shadow-sm",
        !tenant.active && "opacity-60",
      )}
    >
      {/* Avatar */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-[12px] font-bold text-white"
        style={{ background: `linear-gradient(135deg, ${homeColor} 0%, ${homeColor}AA 100%)` }}
      >
        {ini}
      </div>

      {/* Name + phone + unit */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold">{tenant.name}</p>
        {tenant.phone && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3 shrink-0" />
            {tenant.phone}
          </p>
        )}
        {tenant.unit && (
          <span
            className="mt-1.5 inline-block rounded-md px-1.5 py-0.5 text-[11px] font-bold"
            style={{ background: `${homeColor}18`, color: homeColor }}
          >
            {tenant.unit}
          </span>
        )}
      </div>

      {/* Status + actions aligned right */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
          tenant.active ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700",
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", tenant.active ? "bg-emerald-500" : "bg-orange-500")} />
          {tenant.active ? "Active" : "Inactive"}
        </span>
        <div className="flex items-center gap-1">
          <EditTenantModal tenant={tenant} />
          <DeleteTenantButton tenantId={tenant.id} tenantName={tenant.name} homeId={tenant.homeId} />
        </div>
      </div>
    </div>
  );
}
