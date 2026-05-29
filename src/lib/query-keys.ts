export const billKeys = {
  all: ["bills"] as const,
  byHome: (homeId: string, month?: string) => ["bills", "home", homeId, month] as const,
  byTenant: (tenantId: string) => ["bills", "tenant", tenantId] as const,
  prepare: (tenantId: string) => ["bills", "prepare", tenantId] as const,
};

export const homeKeys = {
  all: ["homes"] as const,
  detail: (homeId: string) => ["homes", homeId] as const,
  tenants: (homeId: string) => ["homes", homeId, "tenants"] as const,
};
