"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { usePrepareBill, useUpdateBill, buildFormData } from "@/hooks/use-bills";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Bill, BillCharge, Tenant } from "@/lib/types";

interface EditBillModalProps {
  bill: Bill;
  tenant: Tenant;
}

export function EditBillModal({ bill, tenant }: EditBillModalProps) {
  const [open, setOpen] = useState(false);
  const [charges, setCharges] = useState<BillCharge[]>(bill.charges);
  const [previousBalance, setPreviousBalance] = useState(bill.previousBalance);
  const [amountReceived, setAmountReceived] = useState(bill.amountReceived);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: prepared, isLoading: loadingPrepare } = usePrepareBill(tenant.id, open);
  const { mutateAsync: updateBill, isPending } = useUpdateBill(bill.id, tenant.homeId, bill.month);

  const [synced, setSynced] = useState(false);
  if (open && prepared && !synced) {
    setPreviousBalance(prepared.previousBalance ?? bill.previousBalance);
    setSynced(true);
  }

  function handleOpen() {
    setSynced(false);
    setCharges(bill.charges);
    setPreviousBalance(bill.previousBalance);
    setAmountReceived(bill.amountReceived);
    setFormError(null);
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
    setFormError(null);

    const fd = buildFormData(
      { month: bill.month, previousBalance, amountReceived },
      charges,
    );

    const result = await updateBill(fd);
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
        className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit Bill
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        title={`Edit Bill — ${tenant.name}`}
        description={`Editing bill for ${bill.month}`}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {loadingPrepare ? (
            <p className="text-sm text-muted-foreground">Loading charges…</p>
          ) : (
            <div className="space-y-2">
              <Label>Charges</Label>
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
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-prev-balance">Previous Balance</Label>
              <Input
                id="edit-prev-balance"
                type="number"
                value={previousBalance}
                onChange={(e) => setPreviousBalance(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-received">Amount Received</Label>
              <Input
                id="edit-received"
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
                <span className="text-base font-bold">{totalDue.toLocaleString()}</span>
              </div>
              {amountReceived > 0 && (
                <div className="flex items-center justify-between bg-orange-50 px-4 py-2.5">
                  <span className="text-sm font-semibold text-orange-600">Remaining</span>
                  <span className="text-base font-bold text-orange-600">{remainingBalance.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isPending || charges.length === 0 || loadingPrepare}>
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
