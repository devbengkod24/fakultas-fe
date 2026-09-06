import { BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateChartProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

const EmptyStateChart = ({
  title = "Tidak Ada Data",
  description = "Belum ada data untuk ditampilkan di chart ini.",
  onRefresh,
}: EmptyStateChartProps) => {
  return (
    <div className="h-[150px] flex items-center justify-center">
      <div className="text-center p-4">
        <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <p className="text-xs text-gray-500 mb-3 max-w-xs mx-auto">
          {description}
        </p>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-600 hover:bg-gray-50 text-xs px-3 py-1 h-auto"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Muat Ulang
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyStateChart;
