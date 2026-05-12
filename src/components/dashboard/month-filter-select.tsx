"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function lastMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function MonthFilterSelect({ home, month }: { home?: string; month?: string }) {
  const router = useRouter();
  const thisMonth = currentMonth();
  const prevMonth = lastMonth();

  const preset =
    !month ? "all"
    : month === thisMonth ? "this"
    : month === prevMonth ? "last"
    : "custom";

  const [showCustom, setShowCustom] = useState(preset === "custom");

  function buildUrl(m?: string, h?: string) {
    const params = new URLSearchParams();
    if (h) params.set("home", h);
    if (m) params.set("month", m);
    return `/users?${params.toString()}`;
  }

  function handlePreset(value: string) {
    if (value === "all") { setShowCustom(false); router.push(buildUrl(undefined, home)); }
    else if (value === "this") { setShowCustom(false); router.push(buildUrl(thisMonth, home)); }
    else if (value === "last") { setShowCustom(false); router.push(buildUrl(prevMonth, home)); }
    else { setShowCustom(true); }
  }

  return (
    <div className="space-y-1.5">
      <select
        value={showCustom ? "custom" : preset}
        onChange={(e) => handlePreset(e.target.value)}
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="all">All Time</option>
        <option value="this">This Month</option>
        <option value="last">Last Month</option>
        <option value="custom">Custom</option>
      </select>

      {showCustom && (
        <input
          type="month"
          defaultValue={preset === "custom" ? month : thisMonth}
          onChange={(e) => e.target.value && router.push(buildUrl(e.target.value, home))}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}
    </div>
  );
}
