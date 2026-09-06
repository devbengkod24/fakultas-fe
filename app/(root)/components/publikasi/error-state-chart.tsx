import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateChartProps {
  error?: string;
  onRetry?: () => void;
}

const ErrorStateChart = ({ onRetry }: ErrorStateChartProps) => {
  return (
    <div className="h-[150px] flex items-center justify-center">
      <div className="text-center p-4">
        <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-sm font-medium text-red-800 mb-2">
          Gagal Memuat Chart
        </h3>
        <p className="text-xs text-red-600 mb-3 max-w-xs mx-auto">
          Terjadi kesalahan saat memuat data chart.
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-50 text-xs px-3 py-1 h-auto"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Coba Lagi
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorStateChart;
