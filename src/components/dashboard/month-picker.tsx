"use client";

import { useRouter } from "next/navigation";

export function MonthPicker({ value }: { value: string }) {
  const router = useRouter();

  return (
    <input
      type="month"
      defaultValue={value}
      onChange={(e) => {
        if (e.target.value) router.push(`?month=${e.target.value}`);
      }}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}
