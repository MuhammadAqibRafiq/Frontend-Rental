import Link from "next/link";
import { Home as HomeIcon } from "lucide-react";
import { AddHomeModal } from "./add-home-modal";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Home } from "@/lib/types";

interface SidebarProps {
  homes: Home[];
  activeHomeId: string;
}

export function Sidebar({ homes, activeHomeId }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-muted/40">
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          My Homes
        </span>
        <AddHomeModal />
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {homes.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">
            No homes yet. Add one.
          </p>
        ) : (
          homes.map((home) => {
            const isActive = home.id === activeHomeId;
            return (
              <Link
                key={home.id}
                href={`${routes.dashboard}?home=${home.id}`}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent",
                  isActive && "bg-accent border-r-2 border-primary",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                    isActive ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground",
                  )}
                >
                  <HomeIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {home.name}
                  </p>
                  {home.address && (
                    <p className="truncate text-xs text-muted-foreground">{home.address}</p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </nav>
    </aside>
  );
}
