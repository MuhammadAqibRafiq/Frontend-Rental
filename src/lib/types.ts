export type ChargeKind = "fixed" | "variable";

export type Charge = {
  label: string;
  chargeType: ChargeKind;
  amount?: number;
};

// ─── App types (clean, id not _id) ───────────────────────────────────────────

export type Home = {
  id: string;
  name: string;
  address?: string;
};

export type Tenant = {
  id: string;
  homeId: string;
  name: string;
  unit?: string;
  phone?: string;
  charges: Charge[];
  active: boolean;
};

// ─── Bills ───────────────────────────────────────────────────────────────────

export type BillCharge = {
  label: string;
  amount: number;
};

export type Bill = {
  id: string;
  tenantId: string;
  homeId: string;
  month: string; // "YYYY-MM"
  charges: BillCharge[];
  previousBalance: number;
  totalDue: number;
  total: number; // alias for totalDue — backward compat
  amountReceived: number;
  remainingBalance: number;
  createdAt: string;
};

export type ApiBill = {
  _id: string;
  tenantId: string;
  homeId: string;
  month: string;
  charges: BillCharge[];
  previousBalance?: number;
  totalDue?: number;
  total?: number;
  amountReceived?: number;
  remainingBalance?: number;
  createdAt: string;
};

export type PreparedBill = {
  tenantId: string;
  charges: BillCharge[];
  previousBalance: number;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

// ─── Raw API shapes (MongoDB _id, nested data) ────────────────────────────────

export type ApiHome = {
  _id: string;
  owner: string;
  name: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiTenant = {
  _id: string;
  homeId: string;
  name: string;
  unit?: string;
  phone?: string;
  charges: Charge[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};
