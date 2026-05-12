import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getHomes, getHomeTenants } from "@/controllers/homes.controller";
import { getBillsByHome } from "@/controllers/bills.controller";
import { CreateBillModal } from "@/components/dashboard/create-bill-modal";
import { MonthPicker } from "@/components/dashboard/month-picker";
import { TenantBillHistoryModal } from "@/components/dashboard/tenant-bill-history-modal";
import { GenerateAllBillsModal } from "@/components/dashboard/generate-all-bills-modal";
import { RecordPaymentModal } from "@/components/dashboard/record-payment-modal";
import type { Bill, Home, Tenant } from "@/lib/types";

interface BillsPageProps {
  searchParams: Promise<{ month?: string }>;
}

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function BillsPage({ searchParams }: BillsPageProps) {
  const { month } = await searchParams;
  const homes = await getHomes().catch(() => [] as Home[]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Bills</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage and review tenant bills.</p>
      </div>
      <OverviewTab homes={homes} month={month} />
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

async function OverviewTab({ homes, month }: { homes: Home[]; month?: string }) {
  const activeMonth = month ?? currentMonth();

  const homeData = await Promise.all(
    homes.map(async (home) => ({
      home,
      tenants: await getHomeTenants(home.id).catch(() => [] as Tenant[]),
      bills: await getBillsByHome(home.id, activeMonth).catch(() => [] as Bill[]),
    })),
  );

  const totalBilled = homeData.flatMap(({ bills }) => bills).reduce((s, b) => s + b.totalDue, 0);
  const totalPending = homeData.flatMap(({ bills }) => bills).reduce((s, b) => s + b.remainingBalance, 0);
  const billedCount = homeData.flatMap(({ bills }) => bills).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-3 gap-4 flex-1 mr-6">
          <SummaryCard label={`Total Due (${activeMonth})`} value={`${totalBilled.toLocaleString()}`} highlight />
          <SummaryCard label="Pending Recovery" value={`${totalPending.toLocaleString()}`} />
          <SummaryCard label="Bills Generated" value={`${billedCount}`} />
        </div>
        <MonthPicker value={activeMonth} />
      </div>

      {homes.length === 0 ? (
        <EmptyState message="No homes yet." />
      ) : (
        <div className="space-y-10">
          {homeData.map(({ home, tenants, bills }) => (
            <OverviewHomeSection
              key={home.id}
              home={home}
              tenants={tenants}
              bills={bills}
              activeMonth={activeMonth}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OverviewHomeSection({
  home, tenants, bills, activeMonth,
}: {
  home: Home; tenants: Tenant[]; bills: Bill[]; activeMonth: string;
}) {
  const billMap = new Map(bills.map((b) => [b.tenantId, b]));
  const homeTotal = bills.reduce((s, b) => s + b.totalDue, 0);

  const unbilledTenants = tenants.filter((t) => !billMap.has(t.id) && t.active);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h2 className="font-semibold text-lg">{home.name}</h2>
        <div className="flex items-center gap-3">
          {homeTotal > 0 && (
            <span className="text-sm font-semibold">{homeTotal.toLocaleString()} billed</span>
          )}
          <GenerateAllBillsModal homeId={home.id} tenants={unbilledTenants} defaultMonth={activeMonth} />
        </div>
      </div>

      {tenants.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">No tenants in this home.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tenants.map((tenant) => (
            <TenantBillCard
              key={tenant.id}
              tenant={tenant}
              bill={billMap.get(tenant.id)}
              activeMonth={activeMonth}
            />
          ))}
        </div>
      )}
    </div>
  );
}


function TenantBillCard({ tenant, bill, activeMonth }: { tenant: Tenant; bill?: Bill; activeMonth: string }) {
  const initials = tenant.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-sm truncate">{tenant.name}</p>
            <TenantBillHistoryModal tenantId={tenant.id} tenantName={tenant.name} />
          </div>
          <p className={`text-xs ${tenant.active ? "text-emerald-600" : "text-orange-500"}`}>
            {tenant.active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {bill ? (
        <>
          <div className="space-y-1.5">
            {bill.charges.map((c, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="capitalize text-muted-foreground">{c.label}</span>
                <span className="font-medium">{c.amount.toLocaleString()}</span>
              </div>
            ))}
            {bill.previousBalance > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-orange-500">Previous Balance</span>
                <span className="font-medium text-orange-500">{bill.previousBalance.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border divide-y divide-border text-xs">
            <div className="flex items-center justify-between px-3 py-1.5">
              <span className="text-muted-foreground">Total Due</span>
              <span className="font-bold">{bill.totalDue.toLocaleString()}</span>
            </div>
            {bill.amountReceived > 0 && (
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-muted-foreground">Received</span>
                <span className="font-medium text-emerald-600">{bill.amountReceived.toLocaleString()}</span>
              </div>
            )}
            {bill.remainingBalance > 0 && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-orange-50 dark:bg-orange-950/20">
                <span className="text-orange-600 font-medium">Remaining</span>
                <span className="font-bold text-orange-600">{bill.remainingBalance.toLocaleString()}</span>
              </div>
            )}
            {bill.remainingBalance === 0 && bill.amountReceived > 0 && (
              <div className="flex items-center justify-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20">
                <span className="text-emerald-600 font-medium text-xs">Paid ✓</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {bill.remainingBalance > 0 && (
              <RecordPaymentModal
                billId={bill.id}
                tenantName={tenant.name}
                totalDue={bill.totalDue}
                amountReceived={bill.amountReceived}
              />
            )}
            {tenant.phone && (
              <a
                href={buildWhatsAppUrl(tenant.phone, tenant.name, bill)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-medium py-2 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-start gap-2">
          <p className="text-xs text-muted-foreground">No bill for {activeMonth}</p>
          {tenant.active ? (
            <CreateBillModal tenant={tenant} defaultMonth={activeMonth} />
          ) : (
            <span className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium bg-muted text-muted-foreground cursor-not-allowed opacity-50">
              Generate Bill
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function SummaryCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-16">
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
