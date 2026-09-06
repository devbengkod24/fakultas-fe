import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
  borderColor?: string;
  iconBg?: string;
}

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "text-blue-600",
  borderColor = "border-l-blue-500",
  iconBg = "bg-blue-100",
}: SummaryCardProps) => {
  return (
    <Card className={`overflow-hidden border-l-4 ${borderColor} shadow-none`}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
            <Icon className={`size-4 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-lg font-semibold leading-tight">{value}</p>
            {description && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
