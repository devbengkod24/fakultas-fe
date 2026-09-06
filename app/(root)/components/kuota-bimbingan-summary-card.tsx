"use client";

import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import EmptyState from "@/components/empty-state";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface KuotaBimbinganSummaryItem {
  title: string;
  icon: LucideIcon;
  count: number;
  bg: string;
  iconBg: string;
  titleColor: string;
}

interface KuotaBimbinganSummaryCardProps {
  title?: string;
  cards: KuotaBimbinganSummaryItem[];
  isLoading: boolean;
  error: boolean;
  errorSubtitle: string;
}

export function KuotaBimbinganSummaryCard({
  title = "Informasi Kuota Bimbingan",
  cards,
  isLoading,
  error,
  errorSubtitle,
}: KuotaBimbinganSummaryCardProps) {
  if (error) {
    return (
      <Card className="p-4 shadow-none">
        <p className="font-medium text-sm mb-4">{title}</p>
        <EmptyState
          icon={AlertCircle}
          title="Data tidak tersedia"
          subtitle={errorSubtitle}
          variant="small"
        />
      </Card>
    );
  }

  return (
    <Card className="p-4 shadow-none">
      <p className="font-medium text-sm mb-4">{title}</p>
      <div className="grid grid-cols-2 gap-3 items-center">
        {isLoading
          ? Array(cards.length)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-2.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-3 w-16 mt-1" />
                    </div>
                  </div>
                </div>
              ))
          : cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div key={index} className={`${card.bg} rounded-xl p-2.5`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${card.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className={card.titleColor}>{card.count}</CardTitle>
                      <CardDescription className="text-xs">{card.title}</CardDescription>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </Card>
  );
}