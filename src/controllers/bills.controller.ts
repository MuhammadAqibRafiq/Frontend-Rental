import "server-only";
import { apiFetch } from "@/lib/api";
import { apiUrls } from "@/lib/api-urls";
import type { ApiBill, Bill, PreparedBill, ApiResponse } from "@/lib/types";

function mapBill(b: ApiBill): Bill {
  const charges = (b.charges ?? []).map((c) => ({
    label: c.label ?? "",
    amount: Number(c.amount) || 0,
  }));
  const previousBalance = Number(b.previousBalance) || 0;
  const chargesSum = charges.reduce((s, c) => s + c.amount, 0);
  const totalDue = Number(b.totalDue) || Number(b.total) || chargesSum + previousBalance;
  const amountReceived = Number(b.amountReceived) || 0;
  const remainingBalance = Number(b.remainingBalance) ?? totalDue - amountReceived;
  return {
    id: b._id,
    tenantId: b.tenantId,
    homeId: b.homeId,
    month: b.month,
    charges,
    previousBalance,
    totalDue,
    total: totalDue,
    amountReceived,
    remainingBalance,
    createdAt: b.createdAt,
  };
}

export async function prepareBill(tenantId: string): Promise<PreparedBill> {
  const res = await apiFetch<ApiResponse<PreparedBill>>(
    apiUrls.bills.prepare(tenantId),
  );
  return res.data;
}

export async function getBillsByHome(homeId: string, month?: string): Promise<Bill[]> {
  const res = await apiFetch<ApiResponse<{ bills: ApiBill[] }>>(
    apiUrls.bills.byHome(homeId, month),
  );
  return (res.data?.bills ?? []).map(mapBill);
}

export async function getBillsByTenant(tenantId: string): Promise<Bill[]> {
  const res = await apiFetch<ApiResponse<{ bills: ApiBill[] }>>(
    apiUrls.bills.byTenant(tenantId),
  );
  return (res.data?.bills ?? []).map(mapBill);
}
