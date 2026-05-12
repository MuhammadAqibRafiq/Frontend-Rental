"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";
import { apiUrls } from "@/lib/api-urls";
import { routes } from "@/lib/routes";
import type { Bill, ApiBill, BillCharge, PreparedBill, ApiResponse } from "@/lib/types";

export type BillFormState =
  | { errors?: { month?: string[]; charges?: string[] }; message?: string }
  | undefined;

export type PaymentFormState =
  | { message?: string }
  | undefined;

export async function getTenantBillsAction(tenantId: string): Promise<Bill[]> {
  try {
    const res = await apiFetch<ApiResponse<{ bills: ApiBill[] }>>(
      apiUrls.bills.byTenant(tenantId),
    );
    return (res.data?.bills ?? []).map((b) => {
      const charges = (b.charges ?? []).map((c) => ({
        label: c.label ?? "",
        amount: Number(c.amount) || 0,
      }));
      const previousBalance = Number(b.previousBalance) || 0;
      const chargesSum = charges.reduce((s, c) => s + c.amount, 0);
      const totalDue = Number(b.totalDue) || Number(b.total) || chargesSum + previousBalance;
      const amountReceived = Number(b.amountReceived) || 0;
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
        remainingBalance: Number(b.remainingBalance) ?? totalDue - amountReceived,
        createdAt: b.createdAt,
      };
    });
  } catch {
    return [];
  }
}

export async function prepareBillAction(tenantId: string): Promise<PreparedBill | null> {
  try {
    const res = await apiFetch<ApiResponse<PreparedBill>>(
      apiUrls.bills.prepare(tenantId),
    );
    return res.data;
  } catch {
    return null;
  }
}

export async function createBillAction(
  _state: BillFormState,
  formData: FormData,
): Promise<BillFormState> {
  const tenantId = formData.get("tenantId")?.toString() ?? "";
  const homeId = formData.get("homeId")?.toString() ?? "";
  const month = formData.get("month")?.toString() ?? "";
  const labels = formData.getAll("chargeLabel").map((v) => v.toString());
  const amounts = formData.getAll("chargeAmount").map((v) => Number(v) || 0);

  if (!month) return { errors: { month: ["Month is required."] } };

  const charges: BillCharge[] = labels.map((label, i) => ({ label, amount: amounts[i] }));

  if (charges.length === 0) return { errors: { charges: ["At least one charge is required."] } };

  const previousBalance = Number(formData.get("previousBalance")) || 0;
  const amountReceived = Number(formData.get("amountReceived")) || 0;

  try {
    await apiFetch(apiUrls.bills.create, {
      method: "POST",
      body: { tenantId, homeId, month, charges, previousBalance, amountReceived },
    });
    revalidatePath(routes.bills);
  } catch (err) {
    return { message: err instanceof Error ? err.message : "Failed to create bill." };
  }
}

export async function recordPaymentAction(billId: string, amountReceived: number): Promise<string | null> {
  try {
    await apiFetch(apiUrls.bills.detail(billId), {
      method: "PUT",
      body: { amountReceived },
    });
    revalidatePath(routes.bills);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : "Failed to record payment.";
  }
}

export type BulkBillPayload = {
  tenantId: string;
  homeId: string;
  month: string;
  charges: BillCharge[];
};

export async function createBulkBillsAction(bills: BulkBillPayload[]): Promise<string | null> {
  try {
    await Promise.all(
      bills.map((b) =>
        apiFetch(apiUrls.bills.create, { method: "POST", body: b }),
      ),
    );
    revalidatePath(routes.bills);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : "Failed to generate bills.";
  }
}

export async function updateBillAction(
  id: string,
  _state: BillFormState,
  formData: FormData,
): Promise<BillFormState> {
  const month = formData.get("month")?.toString() ?? "";
  const labels = formData.getAll("chargeLabel").map((v) => v.toString());
  const amounts = formData.getAll("chargeAmount").map((v) => Number(v) || 0);

  if (!month) return { errors: { month: ["Month is required."] } };

  const charges: BillCharge[] = labels.map((label, i) => ({ label, amount: amounts[i] }));

  try {
    await apiFetch(apiUrls.bills.detail(id), {
      method: "PUT",
      body: { month, charges },
    });
    revalidatePath(routes.bills);
  } catch (err) {
    return { message: err instanceof Error ? err.message : "Failed to update bill." };
  }
}
