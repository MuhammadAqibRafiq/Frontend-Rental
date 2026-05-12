"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import { Receipt } from "lucide-react";
import { createBillAction } from "@/controllers/bills.actions";
import { prepareBillAction } from "@/controllers/bills.actions";
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
  const [charges, setCharges] = useState<BillCharge[]>([]);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [state, action, pending] = useActionState(createBillAction, undefined);
  const [loadingPrepare, startPrepare] = useTransition();

  const [amountReceived, setAmountReceived] = useState(0);

  useEffect(() => {
    if (!pending && state === undefined && open) {
      handleClose();
    }
  }, [pending]);

  const chargesSum = charges.reduce((sum, c) => sum + c.amount, 0);
  const totalDue = chargesSum + previousBalance;
  const remainingBalance = totalDue - amountReceived;

  function handleOpen() {
    setOpen(true);
    startPrepare(async () => {
      const prepared = await prepareBillAction(tenant.id);
      if (prepared) {
        setCharges(prepared.charges.map((c) => ({ label: c.label, amount: c.amount ?? 0 })));
        setPreviousBalance(prepared.previousBalance ?? 0);
      } else {
        setCharges(
          tenant.charges.map((c) => ({
            label: c.label,
            amount: c.chargeType === "fixed" ? (c.amount ?? 0) : 0,
          })),
        );
        setPreviousBalance(0);
      }
    });
  }

  function handleClose() {
    setOpen(false);
    setCharges([]);
    setPreviousBalance(0);
    setAmountReceived(0);
  }

  function updateAmount(i: number, value: string) {
    setCharges((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, amount: Number(value) || 0 } : c)),
    );
  }

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
        <form action={action} className="space-y-4">
          <input type="hidden" name="tenantId" value={tenant.id} />
          <input type="hidden" name="homeId" value={tenant.homeId} />

          <div className="space-y-1.5">
            <Label htmlFor="bill-month">Month *</Label>
            <Input id="bill-month" name="month" type="month" defaultValue={defaultMonth} />
            {state?.errors?.month && (
              <p className="text-xs text-destructive">{state.errors.month[0]}</p>
            )}
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
                      <input type="hidden" name="chargeLabel" value={charge.label} />
                      <span className="flex-1 text-sm capitalize">{charge.label}</span>
                      <Input
                        name="chargeAmount"
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

              {state?.errors?.charges && (
                <p className="text-xs text-destructive">{state.errors.charges[0]}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bill-prev-balance">Previous Balance ()</Label>
              <Input
                id="bill-prev-balance"
                name="previousBalance"
                type="number"
                value={previousBalance}
                onChange={(e) => setPreviousBalance(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bill-received">Amount Received ()</Label>
              <Input
                id="bill-received"
                name="amountReceived"
                type="number"
                min="0"
                value={amountReceived === 0 ? "" : amountReceived}
                placeholder="0"
                onChange={(e) => setAmountReceived(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          {charges.length > 0 && (
            <div className="rounded-lg border border-border divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-muted-foreground">Charges Total</span>
                <span className="text-sm font-medium">{chargesSum.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
                <span className="text-sm font-semibold">Total Due</span>
                <span className="text-base font-bold">{totalDue.toLocaleString()} PKR</span>
              </div>
              {amountReceived > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-orange-50 dark:bg-orange-950/20">
                  <span className="text-sm font-semibold text-orange-600">Remaining</span>
                  <span className="text-base font-bold text-orange-600">{remainingBalance.toLocaleString()} PKR</span>
                </div>
              )}
            </div>
          )}

          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || charges.length === 0 || loadingPrepare}>
              {pending ? "Saving…" : "Save Bill"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
