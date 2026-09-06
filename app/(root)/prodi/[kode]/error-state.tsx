import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: string;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

const ErrorState = ({
  onRetry,
  title = "Gagal Memuat Konten",
  description = "Terjadi kesalahan saat memuat konten. Silakan coba lagi atau muat ulang halaman.",
}: ErrorStateProps) => {
  return (
    <section className="py-4 md:py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-3">{title}</h3>
          <p className="text-red-600 mb-8 max-w-md">{description}</p>
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
      </div>
    </section>
  );
};

export default ErrorState;
