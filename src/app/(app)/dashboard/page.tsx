import { redirect } from "next/navigation";
import { getHomes, getHome, getHomeTenants } from "@/controllers/homes.controller";
import { Sidebar } from "@/components/dashboard/sidebar";
import { HomeDetail } from "@/components/dashboard/home-detail";
import { AddHomeModal } from "@/components/dashboard/add-home-modal";
import { MobilePropertyPicker } from "@/components/dashboard/mobile-property-picker";
import { routes } from "@/lib/routes";

interface DashboardPageProps {
  searchParams: Promise<{ home?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { home: homeId } = await searchParams;

  const rawHomes = await getHomes().catch(() => []);
  const homes = Array.isArray(rawHomes) ? rawHomes : [];

  if (homes.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="flex flex-1 items-center justify-center text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-medium">No homes yet</p>
            <p className="text-sm text-muted-foreground">Create your first home to get started.</p>
            <AddHomeModal />
          </div>
        </div>
      </div>
    );
  }

  const validIds = new Set(homes.map((h) => h.id));
  const activeId = homeId && validIds.has(homeId) ? homeId : homes[0]?.id;

  if (!activeId) return null;

  // homeId in URL is stale (e.g. deleted) — redirect to first valid home
  if (homeId && !validIds.has(homeId)) {
    redirect(`${routes.dashboard}?home=${activeId}`);
  }

  const [home, tenants] = await Promise.all([
    getHome(activeId),
    getHomeTenants(activeId),
  ]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-violet-600">Dashboard</p>
          <h1 className="mt-1 text-[18px] font-extrabold leading-tight tracking-tight md:text-[28px]">
            <span className="md:hidden">Your Properties</span>
            <span className="hidden md:inline">Properties at a glance</span>
          </h1>
          <p className="mt-1.5 hidden text-sm text-muted-foreground md:block">
            Manage your rental homes, track tenants, and stay on top of monthly charges.
          </p>
        </div>
        <AddHomeModal />
      </div>

      {/* Mobile property switcher — hidden on desktop */}
      <MobilePropertyPicker homes={homes} activeHomeId={activeId} />

      <div className="grid grid-cols-1 gap-6 items-start md:grid-cols-[340px_1fr]">
        <div className="hidden md:block md:sticky md:top-[88px]">
          <Sidebar homes={homes} activeHomeId={activeId} />
        </div>
        <HomeDetail home={home} tenants={tenants} />
      </div>
    </div>
  );
}
