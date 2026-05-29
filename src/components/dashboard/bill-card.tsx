"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/utils";
import { TenantBillHistoryModal } from "./tenant-bill-history-modal";
import { RecordPaymentModal } from "./record-payment-modal";
import { CreateBillModal } from "./create-bill-modal";
import { EditBillModal } from "./edit-bill-modal";
import type { Bill, Tenant } from "@/lib/types";

interface BillCardProps {
  tenant: Tenant;
  bill?: Bill;
  activeMonth: string;
  color: string;
}

export function BillCard({ tenant, bill, activeMonth, color }: BillCardProps) {
  const [open, setOpen] = useState(false);
  const initials = tenant.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const isPaid = bill ? bill.remainingBalance <= 0 : false;

  return (
    <div className={cn("overflow-hidden rounded-2xl border bg-white transition-shadow h-fit", open ? "border-violet-200 shadow-md" : "border-border shadow-sm")}>
      {/* Collapsed row — always visible */}
      <div
        role="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors"
      >
        {/* Avatar */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}AA 100%)` }}
        >
          {initials}
        </div>

        {/* Name + unit */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold tracking-tight">{tenant.name}</p>
          {tenant.unit && (
            <span
              className="mt-0.5 inline-block rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-bold"
              style={{ background: `${color}18`, color }}
            >
              {tenant.unit}
            </span>
          )}
        </div>

        {/* Remaining + status */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          {bill ? (
            <>
              <span className={cn(
                "text-[15px] font-extrabold leading-none tabular-nums",
                isPaid ? "text-emerald-600" : "text-orange-600"
              )}>
                {isPaid ? "Paid" : bill.remainingBalance.toLocaleString()}
              </span>
              <span className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                isPaid ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
              )}>
                <span className={cn("h-1.5 w-1.5 rounded-full", isPaid ? "bg-emerald-500" : "bg-orange-500")} />
                {isPaid ? "Paid" : "Pending"}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-muted-foreground">No bill</span>
          )}
        </div>

        {/* History */}
        <div onClick={(e) => e.stopPropagation()}>
          <TenantBillHistoryModal tenantId={tenant.id} tenantName={tenant.name} />
        </div>

        {/* Chevron */}
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </div>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          {bill ? (
            <>
              {/* Charges */}
              <div className="mb-3 divide-y divide-border">
                {bill.charges.map((c, i) => (
                  <div key={i} className="flex justify-between py-2 text-[12.5px]">
                    <span className="capitalize text-muted-foreground">{c.label}</span>
                    <span className="font-semibold tabular-nums">{c.amount.toLocaleString()}</span>
                  </div>
                ))}
                {bill.previousBalance > 0 && (
                  <div className="flex justify-between py-2 text-[12.5px]">
                    <span className="text-orange-500">Previous Balance</span>
                    <span className="font-semibold tabular-nums text-orange-500">{bill.previousBalance.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Total / Received */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-violet-50 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.04em] text-violet-700">Total</p>
                  <p className="mt-0.5 text-[15px] font-bold tabular-nums text-violet-700">{bill.totalDue.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.04em] text-emerald-700">Received</p>
                  <p className="mt-0.5 text-[15px] font-bold tabular-nums text-emerald-700">{bill.amountReceived.toLocaleString()}</p>
                </div>
              </div>

              {/* Remaining banner */}
              <div className={cn(
                "mb-3 flex items-center justify-between rounded-xl border px-4 py-3",
                isPaid ? "border-emerald-100 bg-emerald-50" : "border-orange-100 bg-orange-50"
              )}>
                <span className={cn("text-[11px] font-bold uppercase tracking-[0.04em]", isPaid ? "text-emerald-700" : "text-orange-700")}>
                  {isPaid ? "Fully paid" : "Remaining"}
                </span>
                <span className={cn("text-[20px] font-extrabold leading-none tracking-tight tabular-nums", isPaid ? "text-emerald-700" : "text-orange-700")}>
                  {isPaid ? bill.totalDue.toLocaleString() : bill.remainingBalance.toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <EditBillModal bill={bill} tenant={tenant} />
                {bill.remainingBalance > 0 && (
                  <RecordPaymentModal
                    billId={bill.id}
                    tenantName={tenant.name}
                    totalDue={bill.totalDue}
                    amountReceived={bill.amountReceived}
                  />
                )}
                {isPaid && (
                  <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-[13px] font-semibold text-emerald-700">
                    <Check className="h-3.5 w-3.5" />
                    Settled
                  </div>
                )}
                {tenant.phone && (
                  <a
                    href={buildWhatsAppUrl(tenant.phone, tenant.name, bill)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-[#1ebe5d]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start gap-2 pt-1">
              <p className="text-xs text-muted-foreground">No bill for {activeMonth}</p>
              {tenant.active ? (
                <CreateBillModal tenant={tenant} defaultMonth={activeMonth} />
              ) : (
                <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground opacity-50">
                  Inactive tenant
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
