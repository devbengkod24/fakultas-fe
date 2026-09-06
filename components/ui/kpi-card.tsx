import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type KpiColor = 'blue' | 'purple' | 'amber' | 'red' | 'green';

const KPI_THEMES: Record<KpiColor, { border: string; bg: string; text: string }> = {
  blue: { border: 'border-l-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { border: 'border-l-purple-500', bg: 'bg-purple-100', text: 'text-purple-600' },
  amber: { border: 'border-l-amber-500', bg: 'bg-amber-100', text: 'text-amber-600' },
  red: { border: 'border-l-red-500', bg: 'bg-red-100', text: 'text-red-600' },
  green: { border: 'border-l-green-500', bg: 'bg-green-100', text: 'text-green-600' },
};

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  color?: KpiColor;
  icon?: React.ElementType;
  valueTitle?: string;
  className?: string;
}

const KpiCard = ({
  label,
  value,
  color = 'blue',
  icon: IconComponent,
  valueTitle,
  className,
}: KpiCardProps) => {
  const theme = KPI_THEMES[color] ?? KPI_THEMES.blue;

  return (
    <Card
      className={cn(
        'rounded-xl border border-gray-100 border-l-4 shadow-none overflow-hidden',
        theme.border,
        className,
      )}
    >
      <CardContent className="p-3 flex items-center gap-3">
        {IconComponent && (
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
              theme.bg,
              theme.text,
            )}
          >
            <IconComponent className="w-4 h-4" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p
            className="text-lg font-semibold leading-tight text-slate-800 truncate"
            title={valueTitle ?? (typeof value === 'string' ? value : undefined)}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

KpiCard.displayName = 'KpiCard';

export default KpiCard;
