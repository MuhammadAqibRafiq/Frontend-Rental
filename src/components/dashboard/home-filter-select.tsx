"use client";

import { useRouter } from "next/navigation";
import type { Home } from "@/lib/types";

export function HomeFilterSelect({ homes, value }: { homes: Home[]; value?: string }) {
  const router = useRouter();
  return (
    <select
      value={value ?? ""}
      onChange={(e) => router.push(e.target.value ? `/users?home=${e.target.value}` : "/users")}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <option value="">All Homes</option>
      {homes.map((h) => (
        <option key={h.id} value={h.id}>{h.name}</option>
      ))}
    </select>
  );
}
