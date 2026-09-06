"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Bimbingan" | "Lulus";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        status === "Bimbingan"
          ? "bg-blue-100 text-blue-700"
          : "bg-emerald-100 text-emerald-700"
      )}
    >
      {status}
    </span>
  );
}