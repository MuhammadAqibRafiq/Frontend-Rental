import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { tenantTotal } from "@/controllers/homes.controller";
import { DeleteTenantButton } from "./delete-tenant-button";
import { EditTenantModal } from "./edit-tenant-modal";
import type { Tenant } from "@/lib/types";

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({ tenant }: TenantCardProps) {
  const total = tenantTotal(tenant);
  const initials = tenant.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 flex flex-col gap-3 transition-colors hover:bg-accent/30",
        !tenant.active && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {initials}
          </div>
          <div>
            <p className="font-medium text-sm leading-tight">{tenant.name}</p>
            {tenant.phone && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Phone className="h-3 w-3" />
                {tenant.phone}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              tenant.active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-orange-100 text-orange-700",
            )}
          >
            {tenant.active ? "Active" : "Inactive"}
          </span>
          <EditTenantModal tenant={tenant} />
          <DeleteTenantButton tenantId={tenant.id} tenantName={tenant.name} homeId={tenant.homeId} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {tenant.charges.map((charge, i) => (
          <div key={i} className="rounded-md bg-muted px-2.5 py-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground capitalize">
              {charge.label}
            </p>
            {charge.chargeType === "fixed" ? (
              <p className="text-sm font-semibold">{(charge.amount ?? 0).toLocaleString()}</p>
            ) : (
              <p className="text-sm font-medium text-muted-foreground italic">variable</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-2.5">
        <span className="text-xs text-muted-foreground">Monthly total</span>
        <span className="text-sm font-bold">{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
