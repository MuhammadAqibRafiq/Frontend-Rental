"use client";

import { useState, useTransition } from "react";
import { Zap, CheckCheck } from "lucide-react";
import { createBulkBillsAction, prepareBillAction } from "@/controllers/bills.actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Tenant } from "@/lib/types";

interface TenantEntry {
  tenant: Tenant;
  variableAmounts: Record<number, string>;
  previousBalance: number;
  amountReceived: number;
}

interface GenerateAllBillsModalProps {
  homeId: string;
  tenants: Tenant[];
  defaultMonth: string;
}

function getChargesSum(entry: TenantEntry): number {
  return entry.tenant.charges.reduce((s, c, i) => {
    const amt = c.chargeType === "fixed" ? (c.amount ?? 0) : Number(entry.variableAmounts[i]) || 0;
    return s + amt;
  }, 0);
}

function isVariableFilled(entry: TenantEntry): boolean {
  return entry.tenant.charges.every((c, i) =>
    c.chargeType === "fixed" || (Number(entry.variableAmounts[i]) || 0) > 0,
  );
}

export function GenerateAllBillsModal({ homeId, tenants, defaultMonth }: GenerateAllBillsModalProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(defaultMonth);
  const [entries, setEntries] = useState<TenantEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loadingPrepare, startPrepare] = useTransition();

  function handleOpen() {
    setMonth(defaultMonth);
    setError(null);
    setEntries(tenants.map((t) => ({ tenant: t, variableAmounts: {}, previousBalance: 0, amountReceived: 0 })));
    setOpen(true);
    startPrepare(async () => {
      const prepared = await Promise.all(tenants.map((t) => prepareBillAction(t.id).catch(() => null)));
      setEntries(tenants.map((tenant, i) => ({
        tenant,
        variableAmounts: {},
        previousBalance: prepared[i]?.previousBalance ?? 0,
        amountReceived: 0,
      })));
    });
  }

  function handleClose() { setOpen(false); }

  function updateEntry(tenantId: string, field: "previousBalance" | "amountReceived", value: string) {
    setEntries((prev) =>
      prev.map((e) => e.tenant.id !== tenantId ? e : { ...e, [field]: Number(value) || 0 }),
    );
  }

  function setVariableAmount(tenantIdx: number, chargeIdx: number, value: string) {
    setEntries((prev) =>
      prev.map((e, i) => i !== tenantIdx ? e : { ...e, variableAmounts: { ...e.variableAmounts, [chargeIdx]: value } }),
    );
  }

  function markAsPaid(tenantId: string) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.tenant.id !== tenantId) return e;
        const totalDue = getChargesSum(e) + e.previousBalance;
        return { ...e, amountReceived: totalDue };
      }),
    );
  }

  function markAllPaid() {
    setEntries((prev) =>
      prev.map((e) => {
        if (!isVariableFilled(e)) return e;
        const totalDue = getChargesSum(e) + e.previousBalance;
        return { ...e, amountReceived: totalDue };
      }),
    );
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const bills = entries.map(({ tenant, variableAmounts, previousBalance, amountReceived }) => ({
        tenantId: tenant.id,
        homeId,
        month,
        previousBalance,
        amountReceived,
        charges: tenant.charges.map((c, i) => ({
          label: c.label,
          amount: c.chargeType === "fixed" ? (c.amount ?? 0) : Number(variableAmounts[i]) || 0,
        })),
      }));
      const err = await createBulkBillsAction(bills);
      if (err) setError(err);
      else setOpen(false);
    });
  }

  if (tenants.length === 0) return null;

  const allCanBePaid = entries.every(isVariableFilled);

  return (
    <>
      <Button size="sm" onClick={handleOpen}>
        <Zap className="h-4 w-4" />
        Generate All Bills
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        title={
          <div className="flex items-center gap-3">
            <span>Generate All Bills</span>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-7 w-36 text-sm" />
          </div>
        }
        description={`${tenants.length} tenant${tenants.length !== 1 ? "s" : ""}`}
        className="max-w-xl"
      >
        <div className="space-y-4">
          {loadingPrepare && <p className="text-sm text-muted-foreground">Loading previous balances…</p>}

          {/* Mark All Paid */}
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!allCanBePaid}
              onClick={markAllPaid}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark All Paid
            </Button>
          </div>

          {entries.map(({ tenant, variableAmounts, previousBalance, amountReceived }, globalIdx) => {
            const initials = tenant.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
            const chargesSum = getChargesSum({ tenant, variableAmounts, previousBalance, amountReceived });
            const totalDue = chargesSum + previousBalance;
            const remainingBalance = totalDue - amountReceived;
            const canMarkPaid = isVariableFilled({ tenant, variableAmounts, previousBalance, amountReceived });

            return (
              <div key={tenant.id} className="rounded-xl border border-border overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {initials}
                  </div>
                  <p className="text-sm font-medium flex-1">
                    {tenant.name}
                    {tenant.unit && <span className="ml-1 text-muted-foreground font-normal">({tenant.unit})</span>}
                  </p>
                  <button
                    type="button"
                    disabled={!canMarkPaid}
                    onClick={() => markAsPaid(tenant.id)}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Mark as Paid
                  </button>
                </div>

                {/* Charges */}
                <div className="divide-y divide-border">
                  {tenant.charges.map((c, ci) => (
                    <div key={ci} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm capitalize text-muted-foreground">{c.label}</span>
                      {c.chargeType === "fixed" ? (
                        <span className="text-sm font-semibold">{(c.amount ?? 0).toLocaleString()}</span>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          placeholder="Enter amount"
                          value={variableAmounts[ci] ?? ""}
                          onChange={(e) => setVariableAmount(globalIdx, ci, e.target.value)}
                          className="h-8 w-36 text-sm text-right"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Previous Balance + Amount Received */}
                <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
                  <div className="px-4 py-2.5 space-y-1">
                    <p className="text-xs text-muted-foreground">Previous Balance ()</p>
                    <Input
                      type="number"
                      value={previousBalance}
                      onChange={(e) => updateEntry(tenant.id, "previousBalance", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="px-4 py-2.5 space-y-1">
                    <p className="text-xs text-muted-foreground">Amount Received ()</p>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={amountReceived === 0 ? "" : amountReceived}
                      onChange={(e) => updateEntry(tenant.id, "amountReceived", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="divide-y divide-border border-t border-border bg-muted/30">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-xs text-muted-foreground">Total Due</span>
                    <span className="text-sm font-bold">{totalDue.toLocaleString()}</span>
                  </div>
                  {amountReceived > 0 && (
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-xs text-orange-600 font-medium">Remaining</span>
                      <span className="text-sm font-bold text-orange-600">{remainingBalance.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending || loadingPrepare || !month}>
              {isPending ? "Generating…" : `Generate ${tenants.length} Bill${tenants.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
