import type { Tenant } from "./types";

export function tenantTotal(tenant: Tenant): number {
  return tenant.charges
    .filter((c) => c.chargeType === "fixed")
    .reduce((sum, c) => sum + (c.amount ?? 0), 0);
}

export function calcTotal(tenants: Tenant[]): number {
  return tenants.reduce((sum, t) => sum + tenantTotal(t), 0);
}
