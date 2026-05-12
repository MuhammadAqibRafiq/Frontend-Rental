export const routes = {
  home: "/",
  contact: "/contact",

  login: "/login",
  register: "/register",

  dashboard: "/dashboard",
  bills: "/bills",
  users: "/users",

  logout: "/api/logout",
} as const;

export const PUBLIC_ONLY_ROUTES: string[] = [routes.login, routes.register];

export const PROTECTED_PREFIXES: string[] = [routes.dashboard, routes.bills, routes.users];
