import { MessageCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getHomes, getHomeTenants } from "@/controllers/homes.controller";
import { getBillsByTenant } from "@/controllers/bills.controller";
import { fetchOr } from "@/lib/api";
import { buildWhatsAppUrl } from "@/lib/utils";
import { HomeFilterSelect } from "@/components/dashboard/home-filter-select";
import { MonthFilterSelect } from "@/components/dashboard/month-filter-select";
import type { Bill, Home, Tenant } from "@/lib/types";

interface UsersPageProps {
  searchParams: Promise<{ home?: string; month?: string }>;
}

type BillRow = Bill & { tenantName: string; homeName: string; tenantPhone?: string };

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { home: homeParam, month: monthParam } = await searchParams;
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const activeMonth = monthParam ?? defaultMonth;

  const homes = await fetchOr(getHomes(), [] as Home[]);
  const filteredHomes = homeParam ? homes.filter((h) => h.id === homeParam) : homes;

  const allTenants: (Tenant & { homeName: string })[] = (
    await Promise.all(
      filteredHomes.map(async (home) => {
        const tenants = await fetchOr(getHomeTenants(home.id), [] as Tenant[]);
        return tenants.map((t) => ({ ...t, homeName: home.name }));
      }),
    )
  ).flat();

  const billRows: BillRow[] = (
    await Promise.all(
      allTenants.map(async (tenant) => {
        const bills = await fetchOr(getBillsByTenant(tenant.id), [] as Bill[]);
        return bills.map((b) => ({
          ...b,
          tenantName: tenant.name,
          homeName: tenant.homeName,
          tenantPhone: tenant.phone,
        }));
      }),
    )
  )
    .flat()
    .filter((b) => b.month === activeMonth)
    .sort((a, b) => b.month.localeCompare(a.month));

  const grandTotal = billRows.reduce((s, r) => s + r.remainingBalance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Full bill history across all tenants.</p>
      </div>

      {/* Filters */}
      <div className="flex items-start gap-4">
        <div className="space-y-1.5 w-48">
          <Label>Home</Label>
          <HomeFilterSelect homes={homes} value={homeParam} />
        </div>
        <div className="space-y-1.5 w-48">
          <Label>Month</Label>
          <MonthFilterSelect home={homeParam} month={activeMonth} />
        </div>
      </div>

      {billRows.length > 0 && (
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span><span className="font-semibold text-foreground">{billRows.length}</span> bill{billRows.length !== 1 ? "s" : ""}</span>
          <span>Pending Recovery: <span className="font-semibold text-orange-500">{grandTotal.toLocaleString()}</span></span>
        </div>
      )}

      {billRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <p className="text-sm font-medium text-muted-foreground">No bill history found.</p>
          <p className="mt-1 text-xs text-muted-foreground">Generate bills from the Bills page.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Home</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Charges</th>
                <th className="px-4 py-3 text-right">Remaining</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {billRows.map((row) => (
                <HistoryRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function HistoryRow({ row }: { row: BillRow }) {
  const initials = row.tenantName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {initials}
          </div>
          <span className="font-medium">{row.tenantName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{row.homeName}</td>
      <td className="px-4 py-3 font-medium whitespace-nowrap">{row.month}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-x-4 gap-y-0.5">
          {row.charges.map((c, i) => (
            <span key={i} className="text-xs text-muted-foreground">
              <span className="capitalize">{c.label}</span>: {c.amount.toLocaleString()}
            </span>
          ))}
        </div>
      </td>
      <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${row.remainingBalance > 0 ? "text-orange-500" : row.remainingBalance < 0 ? "text-emerald-600" : "text-muted-foreground"}`}>
        {row.remainingBalance !== 0 ? `${row.remainingBalance.toLocaleString()}` : "—"}
      </td>
      <td className="px-4 py-3">
        {row.tenantPhone && (
          <a
            href={buildWhatsAppUrl(row.tenantPhone, row.tenantName, row)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-colors whitespace-nowrap"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        )}
      </td>
    </tr>
  );
}
