import { Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateLeaderboardProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

const EmptyStateLeaderboard = ({
  title = "Belum Ada Data",
  description = "Leaderboard akan muncul ketika ada data tersedia.",
  onRefresh,
}: EmptyStateLeaderboardProps) => {
  return (
    <div className="text-center py-6 px-4">
      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
        <Trophy className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-xs text-gray-500 mb-3">{description}</p>
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
  );
};

export default EmptyStateLeaderboard;
