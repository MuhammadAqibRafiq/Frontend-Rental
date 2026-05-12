"use client";

import { useState } from "react";
import { LayoutGrid, List, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditTenantModal } from "./edit-tenant-modal";
import { DeleteTenantButton } from "./delete-tenant-button";
import type { Tenant } from "@/lib/types";

export function TenantList({ tenants }: { tenants: Tenant[] }) {
  const [view, setView] = useState<"card" | "table">("table");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Tenants · {tenants.length}
        </h2>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            title="Table view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("card")}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              view === "card" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            title="Card view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "table" ? (
        <TableView tenants={tenants} />
      ) : (
        <CardView tenants={tenants} />
      )}
    </div>
  );
}

function TableView({ tenants }: { tenants: Tenant[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2.5">Tenant</th>
            <th className="px-4 py-2.5">Phone</th>
            <th className="px-4 py-2.5">Status</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tenants.map((tenant) => {
            const initials = tenant.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
            return (
              <tr key={tenant.id} className={cn("hover:bg-muted/30 transition-colors", !tenant.active && "opacity-60")}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {initials}
                    </div>
                    <span className="font-medium">{tenant.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground text-xs">
                  {tenant.phone ? (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />{tenant.phone}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-2.5">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    tenant.active ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700",
                  )}>
                    {tenant.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <EditTenantModal tenant={tenant} />
                    <DeleteTenantButton tenantId={tenant.id} tenantName={tenant.name} homeId={tenant.homeId} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CardView({ tenants }: { tenants: Tenant[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tenants.map((tenant) => (
        <TenantCard key={tenant.id} tenant={tenant} />
      ))}
    </div>
  );
}

function TenantCard({ tenant }: { tenant: Tenant }) {
  const initials = tenant.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className={cn(
      "rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-colors hover:bg-accent/30",
      !tenant.active && "opacity-60",
    )}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm leading-tight truncate">{tenant.name}</p>
          {tenant.phone && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Phone className="h-3 w-3 shrink-0" />
              {tenant.phone}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          tenant.active ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700",
        )}>
          {tenant.active ? "Active" : "Inactive"}
        </span>
        <EditTenantModal tenant={tenant} />
        <DeleteTenantButton tenantId={tenant.id} tenantName={tenant.name} homeId={tenant.homeId} />
      </div>
    </div>
  );
}
