"use client";

import { useState, useTransition } from "react";
import { History } from "lucide-react";
import { getTenantBillsAction } from "@/controllers/bills.actions";
import { Dialog } from "@/components/ui/dialog";
import type { Bill } from "@/lib/types";

interface TenantBillHistoryModalProps {
  tenantId: string;
  tenantName: string;
}

export function TenantBillHistoryModal({ tenantId, tenantName }: TenantBillHistoryModalProps) {
  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, startLoading] = useTransition();

  function handleOpen() {
    setOpen(true);
    startLoading(async () => {
      const data = await getTenantBillsAction(tenantId);
      setBills(data);
    });
  }

  function handleClose() {
    setOpen(false);
    setBills([]);
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Bill history"
      >
        <History className="h-3.5 w-3.5" />
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        title={`${tenantName} — Bill History`}
        description="All bills, latest first."
        className="max-w-2xl"
      >
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
        ) : bills.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No bills found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 pr-4">Month</th>
                  <th className="pb-2 pr-4">Charges</th>
                  <th className="pb-2 pr-4 text-right">Prev. Balance</th>
                  <th className="pb-2 pr-4 text-right">Received</th>
                  <th className="pb-2 text-right">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4 font-medium whitespace-nowrap">{bill.month}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                        {bill.charges.map((c, i) => (
                          <span key={i} className="text-xs text-muted-foreground">
                            <span className="capitalize">{c.label}</span>: {c.amount.toLocaleString()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`py-3 pr-4 text-right whitespace-nowrap font-medium ${bill.previousBalance < 0 ? "text-emerald-600" : bill.previousBalance > 0 ? "text-orange-500" : "text-muted-foreground"}`}>
                      {bill.previousBalance !== 0 ? `${bill.previousBalance.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3 pr-4 text-right whitespace-nowrap text-emerald-600 font-medium">
                      {bill.amountReceived > 0 ? `${bill.amountReceived.toLocaleString()}` : "—"}
                    </td>
                    <td className={`py-3 text-right font-semibold whitespace-nowrap ${bill.remainingBalance > 0 ? "text-orange-500" : "text-muted-foreground"}`}>
                      {bill.remainingBalance > 0 ? `${bill.remainingBalance.toLocaleString()}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Dialog>
    </>
  );
}
