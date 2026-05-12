import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Bill, Tenant } from "./types";

export function tenantTotal(tenant: Tenant): number {
  return tenant.charges
    .filter((c) => c.chargeType === "fixed")
    .reduce((sum, c) => sum + (c.amount ?? 0), 0);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildWhatsAppUrl(phone: string, tenantName: string, bill: Bill): string {
  const clean = phone.replace(/\D/g, "");
  const lines = [
    `Assalam o Alaikum ${tenantName},`,
    ``,
    `*Bill for ${bill.month}*`,
    ...bill.charges.map((c) => `• ${c.label}: ${c.amount.toLocaleString()}`),
    ...([`• Previous Balance: ${bill.previousBalance.toLocaleString()}`]),
    ``,
    ...( [`• Received: ${bill.amountReceived.toLocaleString()}`]),
    ...([`*Remaining: ${bill.remainingBalance.toLocaleString()}*`]),
    ``,
    `Please pay at your earliest convenience.`,
  ];
  return `https://wa.me/${clean}?text=${encodeURIComponent(lines.join("\n"))}`;
}
