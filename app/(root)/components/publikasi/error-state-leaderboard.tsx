import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateLeaderboardProps {
  error?: string;
  onRetry?: () => void;
}

const ErrorStateLeaderboard = ({ onRetry }: ErrorStateLeaderboardProps) => {
  return (
    <div className="text-center py-6 px-4">
      <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-sm font-medium text-red-800 mb-2">
        Gagal Memuat Leaderboard
      </h3>
      <p className="text-xs text-red-600 mb-3">
        Terjadi kesalahan saat memuat data leaderboard.
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
  );
};

export default ErrorStateLeaderboard;
