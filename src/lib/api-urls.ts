export const apiUrls = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
  },
  homes: {
    list: "/api/homes",
    detail: (id: string) => `/api/homes/${id}`,
  },
  tenants: {
    create: "/api/tenants",
    byHome: (homeId: string) => `/api/tenants/home/${homeId}`,
    detail: (id: string) => `/api/tenants/${id}`,
  },
  bills: {
    prepare: (tenantId: string) => `/api/bills/prepare/${tenantId}`,
    create: "/api/bills",
    byHome: (homeId: string, month?: string) =>
      `/api/bills/home/${homeId}${month ? `?month=${month}` : ""}`,
    byTenant: (tenantId: string) => `/api/bills/tenant/${tenantId}`,
    detail: (id: string) => `/api/bills/${id}`,
  },
} as const;
