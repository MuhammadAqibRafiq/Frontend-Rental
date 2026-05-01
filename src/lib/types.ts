export type ChargeType = "rent" | "bill" | "maintenance";

export type Charge = {
  type: ChargeType;
  amount: number;
  note?: string;
};

export type Home = {
  id: string;
  name: string;
  address?: string;
};

export type Tenant = {
  id: string;
  homeId: string;
  name: string;
  phone?: string;
  charges: Charge[];
  active: boolean;
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
