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
} as const;
