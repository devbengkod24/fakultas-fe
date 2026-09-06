"use client";

import { Users, GraduationCap, TrendingUp, CalendarPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: "active" | "graduated" | "percentage" | "quota";
  isMain?: boolean;
}

export function StatsCard({ title, value, icon, isMain = false }: StatsCardProps) {
  const config = {
    active: {
      icon: <Users className="size-4 text-blue-600" />,
      iconBg: "bg-blue-100",
      borderColor: "border-l-blue-500",
    },
    graduated: {
      icon: <GraduationCap className="size-4 text-emerald-600" />,
      iconBg: "bg-emerald-100",
      borderColor: "border-l-emerald-500",
    },
    percentage: {
      icon: <TrendingUp className="size-4 text-purple-600" />,
      iconBg: "bg-purple-100",
      borderColor: "border-l-purple-500",
    },
    quota: {
      icon: <CalendarPlus className="size-4 text-amber-600" />,
      iconBg: "bg-amber-100",
      borderColor: "border-l-amber-500",
    },
  };

  const { icon: iconEl, iconBg, borderColor } = config[icon];

  return (
    <Card
      className={cn(
        "overflow-hidden border-l-4 shadow-none",
        borderColor
      )}
    >
      <CardContent className="p-4 flex items-center gap-3 min-h-[80px]">
  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", iconBg)}>
    {iconEl}
  </div>
  <div>
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-lg font-semibold leading-tight">{value}</p>
  </div>
</CardContent>
    </Card>
  );
}