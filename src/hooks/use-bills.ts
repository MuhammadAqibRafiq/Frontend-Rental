"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billKeys } from "@/lib/query-keys";
import {
  getTenantBillsAction,
  prepareBillAction,
  createBillAction,
  updateBillAction,
  recordPaymentAction,
  createBulkBillsAction,
  type BulkBillPayload,
} from "@/controllers/bills.actions";
import type { BillCharge } from "@/lib/types";

// ─── Reads ────────────────────────────────────────────────────────────────────

export function useTenantBills(tenantId: string, enabled = true) {
  return useQuery({
    queryKey: billKeys.byTenant(tenantId),
    queryFn: () => getTenantBillsAction(tenantId),
    enabled,
  });
}

export function usePrepareBill(tenantId: string, enabled = true) {
  return useQuery({
    queryKey: billKeys.prepare(tenantId),
    queryFn: () => prepareBillAction(tenantId),
    enabled,
    staleTime: 0,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateBill(homeId: string, month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createBillAction(undefined, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billKeys.byHome(homeId, month) });
      queryClient.invalidateQueries({ queryKey: billKeys.all });
    },
  });
}

export function useUpdateBill(billId: string, homeId: string, month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => updateBillAction(billId, undefined, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billKeys.byHome(homeId, month) });
      queryClient.invalidateQueries({ queryKey: billKeys.all });
    },
  });
}

export function useRecordPayment(homeId: string, month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ billId, amount }: { billId: string; amount: number }) =>
      recordPaymentAction(billId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billKeys.byHome(homeId, month) });
      queryClient.invalidateQueries({ queryKey: billKeys.all });
    },
  });
}

export function useCreateBulkBills(homeId: string, month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bills: BulkBillPayload[]) => createBulkBillsAction(bills),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billKeys.byHome(homeId, month) });
      queryClient.invalidateQueries({ queryKey: billKeys.all });
    },
  });
}

// Re-export key shapes for inline invalidation
export { billKeys };

// ─── Charge helpers ───────────────────────────────────────────────────────────

export function buildFormData(
  fields: Record<string, string | number>,
  charges: BillCharge[],
): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, String(v));
  for (const c of charges) {
    fd.append("chargeLabel", c.label);
    fd.append("chargeAmount", String(c.amount));
  }
  return fd;
}
