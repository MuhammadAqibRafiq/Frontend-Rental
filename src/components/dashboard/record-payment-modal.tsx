"use client";

import { useState, useTransition } from "react";
import { Banknote } from "lucide-react";
import { recordPaymentAction } from "@/controllers/bills.actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RecordPaymentModalProps {
  billId: string;
  tenantName: string;
  totalDue: number;
  amountReceived: number;
}

export function RecordPaymentModal({ billId, tenantName, totalDue, amountReceived }: RecordPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(totalDue - amountReceived));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setAmount(String(totalDue - amountReceived));
    setError(null);
    setOpen(true);
  }

  function handleClose() { setOpen(false); }

  function handleSubmit() {
    const value = Number(amount) || 0;
    if (value <= 0) { setError("Amount must be greater than 0."); return; }
    setError(null);
    startTransition(async () => {
      const err = await recordPaymentAction(billId, value);
      if (err) setError(err);
      else setOpen(false);
    });
  }

  const remaining = totalDue - amountReceived;

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
      >
        <Banknote className="h-3.5 w-3.5" />
        Record Payment
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        title={`Payment — ${tenantName}`}
        description={`Total Due: ${totalDue.toLocaleString()} · Remaining: ${remaining.toLocaleString()}`}
        className="max-w-sm"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="payment-amount">Amount Received ()</Label>
            <Input
              id="payment-amount"
              type="number"
              min="0"
              max={totalDue}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Saving…" : "Save Payment"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
