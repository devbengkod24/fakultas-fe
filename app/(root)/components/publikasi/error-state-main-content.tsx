import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateMainContentProps {
  error?: string;
  onRetry?: () => void;
  type?: "artikel" | "penelitian";
}

const ErrorStateMainContent = ({
  onRetry,
  type = "artikel",
}: ErrorStateMainContentProps) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Gagal Memuat Data
      </h3>
      <p className="text-red-600 mb-6 max-w-md mx-auto">
        Terjadi kesalahan saat memuat data{" "}
        {type === "artikel" ? "artikel" : "penelitian"}. Silakan coba lagi atau
        hubungi administrator jika masalah berlanjut.
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

export default ErrorStateMainContent;
