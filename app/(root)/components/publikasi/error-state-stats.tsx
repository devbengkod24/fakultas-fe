import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorStateStatsProps {
  error?: string;
  onRetry?: () => void;
}

const ErrorStateStats = ({ onRetry }: ErrorStateStatsProps) => {
  return (
    <>
      <Card className="p-2 bg-red-50 border border-red-100 rounded-xl shadow-sm">
        <div className="text-center py-4">
          <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-2" />
          <p className="text-red-500 text-sm">Gagal Memuat</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="ghost"
              size="sm"
              className="mt-2 text-red-500 hover:bg-red-100"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Coba Lagi
            </Button>
          )}
        </div>
      </Card>
      <Card className="p-2 bg-red-50 border border-red-100 rounded-xl shadow-sm">
        <div className="text-center py-4">
          <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-2" />
          <p className="text-red-500 text-sm">Gagal Memuat</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="ghost"
              size="sm"
              className="mt-2 text-red-500 hover:bg-red-100"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Coba Lagi
            </Button>
          )}
        </div>
      </Card>
    </>
  );
};

export default ErrorStateStats;
