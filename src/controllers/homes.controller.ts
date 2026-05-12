import "server-only";
import { apiFetch } from "@/lib/api";
import { apiUrls } from "@/lib/api-urls";
import type { ApiHome, ApiResponse, ApiTenant, Home, Tenant } from "@/lib/types";

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function mapHome(h: ApiHome): Home {
  return { id: h._id, name: h.name, address: h.address };
}

export function mapTenant(t: ApiTenant): Tenant {
  return {
    id: t._id,
    homeId: t.homeId,
    name: t.name,
    unit: t.unit,
    phone: t.phone,
    charges: t.charges,
    active: t.active,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getHomes(): Promise<Home[]> {
  const res = await apiFetch<ApiResponse<{ homes: ApiHome[] }>>(apiUrls.homes.list);
  return (res.data?.homes ?? []).map(mapHome);
}

export async function getHome(id: string): Promise<Home> {
  const res = await apiFetch<ApiResponse<{ home: ApiHome }>>(apiUrls.homes.detail(id));
  return mapHome(res.data.home);
}

export async function getHomeTenants(homeId: string): Promise<Tenant[]> {
  const res = await apiFetch<ApiResponse<{ tenants: ApiTenant[] }>>(apiUrls.tenants.byHome(homeId));
  return (res.data?.tenants ?? []).map(mapTenant);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Sum of all fixed charges across tenants (template amounts, not billed). */
export function calcTotal(tenants: Tenant[]): number {
  return tenants
    .flatMap((t) => t.charges)
    .filter((c) => c.chargeType === "fixed")
    .reduce((sum, c) => sum + (c.amount ?? 0), 0);
}

/** Sum of fixed charges for a single tenant. */
export function tenantTotal(tenant: Tenant): number {
  return tenant.charges
    .filter((c) => c.chargeType === "fixed")
    .reduce((sum, c) => sum + (c.amount ?? 0), 0);
}
