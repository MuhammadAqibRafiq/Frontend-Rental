import { MapPin, AlertTriangle, Users } from "lucide-react";
import { TenantList } from "./tenant-list";
import { AddTenantModal } from "./add-tenant-modal";
import { DeleteHomeButton } from "./delete-home-button";
import { calcTotal } from "@/controllers/homes.controller";
import type { Home, Tenant } from "@/lib/types";

interface HomeDetailProps {
  home: Home;
  tenants: Tenant[];
}

export function HomeDetail({ home, tenants }: HomeDetailProps) {
  const activeTenants = tenants.filter((t) => t.active);
  const inactiveTenants = tenants.filter((t) => !t.active);
  const monthlyTotal = calcTotal(activeTenants);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{home.name}</h1>
            <DeleteHomeButton homeId={home.id} homeName={home.name} />
          </div>
          {home.address && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {home.address}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <StatBadge label="Tenants" value={`${activeTenants.length}`} />
          <StatBadge label="Monthly Total" value={`${monthlyTotal.toLocaleString()}`} highlight />
          <AddTenantModal homeId={home.id} />
        </div>
      </div>

      {inactiveTenants.length > 0 && (
        <div className="flex items-center gap-2.5 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">{inactiveTenants.length}</span>{" "}
            {inactiveTenants.length === 1 ? "tenant is" : "tenants are"} currently inactive.
          </span>
        </div>
      )}

      {tenants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No tenants yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Add a tenant to get started.</p>
        </div>
      ) : (
        <TenantList tenants={tenants} />
      )}
    </div>
  );
}

function StatBadge({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-2.5 text-center min-w-[100px]">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-base font-bold ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
