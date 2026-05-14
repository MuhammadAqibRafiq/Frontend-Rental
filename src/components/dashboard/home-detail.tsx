import { MapPin, AlertTriangle, Users } from "lucide-react";
import { TenantList } from "./tenant-list";
import { AddTenantModal } from "./add-tenant-modal";
import { DeleteHomeButton } from "./delete-home-button";
import { calcTotal } from "@/lib/charges";
import { homeColor } from "@/lib/utils";
import type { Home, Tenant } from "@/lib/types";

interface HomeDetailProps {
  home: Home;
  tenants: Tenant[];
}

export function HomeDetail({ home, tenants }: HomeDetailProps) {
  const activeTenants = tenants.filter((t) => t.active);
  const inactiveTenants = tenants.filter((t) => !t.active);
  const monthlyTotal = calcTotal(activeTenants);
  const color = homeColor(home.id);

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div
        className="relative isolate overflow-hidden rounded-2xl p-[16px]"
        style={{ border: "1px solid hsl(var(--border))", background: "white" }}
      >
        {/* Decorative blob */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full"
          style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }}
        />

        <div className="relative flex items-start justify-between gap-5 flex-wrap">
          {/* Left: icon + name */}
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px]"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                boxShadow: `0 8px 20px ${color}40`,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11 12 4l9 7" />
                <path d="M5 10v10h14V10" />
                <path d="M10 20v-5h4v5" />
              </svg>
            </div>
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.06em]"
                style={{ color }}
              >
                Property
              </p>
              <div className="flex items-center gap-2">
                <h2 className="text-[26px] font-extrabold leading-tight tracking-tight">
                  {home.name}
                </h2>
                <DeleteHomeButton homeId={home.id} homeName={home.name} />
              </div>
              {home.address && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {home.address}
                </p>
              )}
            </div>
          </div>

          {/* Right: stats + actions */}
          <div className="flex items-stretch gap-3 flex-wrap">
            <div
              className="flex flex-col justify-center rounded-[14px] px-5 py-3 text-right"
              style={{
                background: "hsl(var(--violet-50, 250 100% 97%))",
                borderLeft: `3px solid ${color}`,
                backgroundColor: "#f5f3ff",
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground">
                Active tenants
              </p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none tracking-tight">
                {activeTenants.length}
                <span className="text-base font-semibold text-muted-foreground">
                  /{tenants.length}
                </span>
              </p>
            </div>

            <div
              className="flex flex-col justify-center rounded-[14px] px-5 py-3 text-right text-white"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                boxShadow: `0 4px 12px ${color}40`,
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.04em] opacity-85">
                Monthly inflow
              </p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none tracking-tight">
                {monthlyTotal.toLocaleString()}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Inactive warning */}
      {inactiveTenants.length > 0 && (
        <div className="flex items-center gap-2.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">{inactiveTenants.length}</span>{" "}
            {inactiveTenants.length === 1 ? "tenant is" : "tenants are"} currently inactive.
          </span>
        </div>
      )}

      {/* Tenants */}
      {tenants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Users className="mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">No tenants yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Add a tenant to get started.</p>
          <div className="mt-4"><AddTenantModal homeId={home.id} /></div>
        </div>
      ) : (
        <TenantList tenants={tenants} homeColor={color} homeId={home.id} />
      )}
    </div>
  );
}
