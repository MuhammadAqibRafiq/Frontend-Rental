"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import { usePrepareBill, useCreateBill, buildFormData } from "@/hooks/use-bills";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BillCharge, Tenant } from "@/lib/types";

interface CreateBillModalProps {
  tenant: Tenant;
  defaultMonth: string;
}

export function CreateBillModal({ tenant, defaultMonth }: CreateBillModalProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(defaultMonth);
  const [charges, setCharges] = useState<BillCharge[]>([]);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: prepared, isLoading: loadingPrepare } = usePrepareBill(tenant.id, open);
  const { mutateAsync: createBill, isPending } = useCreateBill(tenant.homeId, month);

  // Sync charges/previousBalance when prepared data arrives
  const [synced, setSynced] = useState(false);
  if (open && prepared && !synced) {
    setCharges(prepared.charges.map((c) => ({ label: c.label, amount: c.amount ?? 0 })));
    setPreviousBalance(prepared.previousBalance ?? 0);
    setSynced(true);
  }

  function handleOpen() {
    setSynced(false);
    setCharges(tenant.charges.map((c) => ({
      label: c.label,
      amount: c.chargeType === "fixed" ? (c.amount ?? 0) : 0,
    })));
    setPreviousBalance(0);
    setAmountReceived(0);
    setFormError(null);
    setMonth(defaultMonth);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setSynced(false);
  }

  function updateAmount(i: number, value: string) {
    setCharges((prev) => prev.map((c, idx) => (idx === i ? { ...c, amount: Number(value) || 0 } : c)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!month) return setFormError("Month is required.");
    if (charges.length === 0) return setFormError("At least one charge is required.");
    setFormError(null);

    const fd = buildFormData(
      { tenantId: tenant.id, homeId: tenant.homeId, month, previousBalance, amountReceived },
      charges,
    );

    const result = await createBill(fd);
    if (result?.message) {
      setFormError(result.message);
    } else if (result?.errors) {
      setFormError(Object.values(result.errors).flat().join(", "));
    } else {
      handleClose();
    }
  }

  const chargesSum = charges.reduce((s, c) => s + c.amount, 0);
  const totalDue = chargesSum + previousBalance;
  const remainingBalance = totalDue - amountReceived;

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Receipt className="h-3.5 w-3.5" />
        Generate Bill
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        title={`Bill — ${tenant.name}`}
        description={`Generating bill for ${defaultMonth}`}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bill-month">Month *</Label>
            <Input
              id="bill-month"
              name="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          {loadingPrepare ? (
            <p className="text-sm text-muted-foreground">Loading charges…</p>
          ) : (
            <div className="space-y-2">
              <Label>Charges</Label>
              {charges.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  No charges configured for this tenant.
                </div>
              ) : (
                <div className="space-y-2 rounded-lg border border-border p-3">
                  {charges.map((charge, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex-1 text-sm capitalize">{charge.label}</span>
                      <Input
                        type="number"
                        min="0"
                        value={charge.amount}
                        onChange={(e) => updateAmount(i, e.target.value)}
                        className="w-32"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bill-prev-balance">Previous Balance</Label>
              <Input
                id="bill-prev-balance"
                type="number"
                value={previousBalance}
                onChange={(e) => setPreviousBalance(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bill-received">Amount Received</Label>
              <Input
                id="bill-received"
                type="number"
                min="0"
                value={amountReceived === 0 ? "" : amountReceived}
                placeholder="0"
                onChange={(e) => setAmountReceived(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          {charges.length > 0 && (
            <div className="divide-y divide-border rounded-lg border border-border">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-muted-foreground">Charges Total</span>
                <span className="text-sm font-medium">{chargesSum.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between bg-muted/50 px-4 py-2.5">
                <span className="text-sm font-semibold">Total Due</span>
                <span className="text-base font-bold">{totalDue.toLocaleString()} PKR</span>
              </div>
              {amountReceived > 0 && (
                <div className="flex items-center justify-between bg-orange-50 px-4 py-2.5 dark:bg-orange-950/20">
                  <span className="text-sm font-semibold text-orange-600">Remaining</span>
                  <span className="text-base font-bold text-orange-600">{remainingBalance.toLocaleString()} PKR</span>
                </div>
              )}
            </div>
          )}

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isPending || charges.length === 0 || loadingPrepare}>
              {isPending ? "Saving…" : "Save Bill"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
