"use client";

import { useState } from "react";
import { Banknote } from "lucide-react";
import { useRecordPayment } from "@/hooks/use-bills";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RecordPaymentModalProps {
  billId: string;
  tenantName: string;
  totalDue: number;
  amountReceived: number;
  homeId: string;
  month: string;
}

export function RecordPaymentModal({ billId, tenantName, totalDue, amountReceived, homeId, month }: RecordPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(totalDue - amountReceived));
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: recordPayment, isPending } = useRecordPayment(homeId, month);

  function handleOpen() {
    setAmount(String(totalDue - amountReceived));
    setError(null);
    setOpen(true);
  }

  async function handleSubmit() {
    const value = Number(amount) || 0;
    if (value <= 0) { setError("Amount must be greater than 0."); return; }
    setError(null);
    const err = await recordPayment({ billId, amount: value });
    if (err) setError(err);
    else setOpen(false);
  }

  const remaining = totalDue - amountReceived;

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
      >
        <Banknote className="h-3.5 w-3.5" />
        Record Payment
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Payment — ${tenantName}`}
        description={`Total Due: ${totalDue.toLocaleString()} · Remaining: ${remaining.toLocaleString()}`}
        className="max-w-sm"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="payment-amount">Amount Received</Label>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Saving…" : "Save Payment"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
