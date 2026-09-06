import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/empty-state";

export interface StatCardItem {
  title: string;
  icon: LucideIcon;
  count: number;
  bg: string;
  iconBg: string;
  titleColor: string;
}

interface StatCardGroupViewProps {
  title?: string;
  items: StatCardItem[];
  loading: boolean;
  error: boolean;
}

export function StatCardGroupView({
  title = "Informasi Kuota Bimbingan",
  items,
  loading,
  error,
}: StatCardGroupViewProps) {
  if (error) {
    return (
      <Card className="p-3 shadow-none">
        <p className="mb-3 text-sm font-medium">{title}</p>
        <EmptyState
          icon={AlertCircle}
          title="Data tidak tersedia"
          subtitle="Gagal memuat data"
          variant="small"
        />
      </Card>
    );
  }

  return (
    <Card className="p-3 shadow-none">
      <p className="mb-3 text-sm font-medium">{title}</p>
      <div className="grid grid-cols-2 items-center gap-3">
        {loading
          ? Array(items.length || 2)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="rounded-xl bg-gray-50 p-2.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="mt-1 h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))
          : items.map((card, index) => (
              <div key={index} className={`${card.bg} rounded-xl p-2.5`}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${card.iconBg}`}>
                    <card.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className={card.titleColor}>
                      {card.count}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {card.title}
                    </CardDescription>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </Card>
  );
}
