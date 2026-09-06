import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateDosenProps {
  error?: string;
  onRetry?: () => void;
}

const ErrorStateDosen = ({
  error = "Terjadi kesalahan saat memuat data dosen.",
  onRetry,
}: ErrorStateDosenProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl shadow-sm p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-red-800 mb-3">
        Gagal Memuat Data Dosen
      </h3>
      <p className="text-red-600 mb-6 max-w-md mx-auto leading-relaxed">
        {error}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
};

export default ErrorStateDosen;
