import { Wallet, Clock, Receipt } from "lucide-react";
import { homeColor } from "@/lib/utils";
import { HomeSectionAccordion } from "@/components/dashboard/home-section-accordion";
import { BillCard } from "@/components/dashboard/bill-card";
import { getHomes, getHomeTenants } from "@/controllers/homes.controller";
import { getBillsByHome } from "@/controllers/bills.controller";
import { MonthPicker } from "@/components/dashboard/month-picker";
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
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-violet-600">Billing</p>
          <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight">Monthly billing overview</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Track due amounts, recovery, and outstanding balances across all your properties.
          </p>
        </div>
        <MonthPicker value={month ?? currentMonth()} />
      </div>

      <OverviewTab homes={homes} month={month} />
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

async function OverviewTab({ homes, month }: { homes: Home[]; month?: string }) {
  const activeMonth = month ?? currentMonth();

  const homeData = await Promise.all(
    homes.map(async (home) => {
      const [tenants, bills] = await Promise.all([
        getHomeTenants(home.id).catch(() => [] as Tenant[]),
        getBillsByHome(home.id, activeMonth).catch(() => [] as Bill[]),
      ]);
      return { home, tenants, bills };
    }),
  );

  const allBills = homeData.flatMap(({ bills }) => bills);
  const totalBilled = allBills.reduce((s, b) => s + b.totalDue, 0);
  const totalPending = allBills.reduce((s, b) => s + b.remainingBalance, 0);
  const billedCount = allBills.length;
  const recoveryRate = totalBilled > 0 ? Math.round(((totalBilled - totalPending) / totalBilled) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={Wallet}
          label="Total Due"
          value={totalBilled.toLocaleString()}
          hint={`Across ${billedCount} bills · ${activeMonth}`}
          accent="violet"
        />
        <StatCard
          icon={Clock}
          label="Pending Recovery"
          value={totalPending.toLocaleString()}
          hint={totalPending > 0 ? "Follow up with tenants" : "All caught up"}
          accent="orange"
        />
        <StatCard
          icon={Receipt}
          label="Bills Generated"
          value={String(billedCount)}
          hint={`${recoveryRate}% recovered so far`}
          accent="emerald"
          trend={`${recoveryRate}%`}
        />
      </div>

      {homes.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border py-16">
          <p className="text-sm text-muted-foreground">No homes yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {homeData.map(({ home, tenants, bills }) => (
            <HomeSection
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

// ─── Stat Card ────────────────────────────────────────────────────────────────

const ACCENTS = {
  violet:  { bg: "#ede9fe", fg: "#7c3aed", grad: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)" },
  orange:  { bg: "#ffedd5", fg: "#c2410c", grad: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" },
  emerald: { bg: "#d1fae5", fg: "#065f46", grad: "linear-gradient(135deg, #10b981 0%, #34d399 100%)" },
};

function StatCard({ icon: Icon, label, value, hint, accent = "violet", trend }: {
  icon: React.ElementType; label: string; value: string;
  hint?: string; accent?: keyof typeof ACCENTS; trend?: string;
}) {
  const a = ACCENTS[accent];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-white px-5 py-4">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40" style={{ background: a.bg }} />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: a.grad }}>
            <Icon size={16} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-muted-foreground">{label}</p>
            <p className="mt-1 text-[22px] font-extrabold leading-none tracking-tight">{value}</p>
            {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
          </div>
        </div>
        {trend && (
          <span className="rounded-lg px-2 py-0.5 text-[11px] font-bold" style={{ background: a.bg, color: a.fg }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Home Section ─────────────────────────────────────────────────────────────

function HomeSection({ home, tenants, bills, activeMonth }: {
  home: Home; tenants: Tenant[]; bills: Bill[]; activeMonth: string;
}) {
  const billMap = new Map(bills.map((b) => [b.tenantId, b]));
  const totalDue = bills.reduce((s, b) => s + b.remainingBalance, 0);
  const pendingCount = bills.filter((b) => b.remainingBalance > 0).length;
  const unbilledTenants = tenants.filter((t) => !billMap.has(t.id) && t.active);
  const color = homeColor(home.id);

  return (
    <HomeSectionAccordion
      home={home}
      tenants={tenants}
      unbilledTenants={unbilledTenants}
      activeMonth={activeMonth}
      totalDue={totalDue}
      pendingCount={pendingCount}
      billsCount={bills.length}
    >
      {tenants.map((tenant) => (
        <BillCard
          key={tenant.id}
          tenant={tenant}
          bill={billMap.get(tenant.id)}
          activeMonth={activeMonth}
          color={color}
        />
      ))}
    </HomeSectionAccordion>
  );
}

