import { FileText, Beaker, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateMainContentProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  type?: "artikel" | "penelitian";
}

const EmptyStateMainContent = ({
  title,
  description,
  onRefresh,
  type = "artikel",
}: EmptyStateMainContentProps) => {
  const defaultTitle =
    type === "artikel" ? "Tidak Ada Artikel" : "Tidak Ada Penelitian";
  const defaultDescription =
    type === "artikel"
      ? "Belum ada artikel yang tersedia saat ini. Silakan coba lagi nanti atau ubah filter pencarian."
      : "Belum ada penelitian yang tersedia saat ini. Silakan coba lagi nanti atau ubah filter pencarian.";

  const Icon = type === "artikel" ? FileText : Beaker;

  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {description || defaultDescription}
      </p>
      {onRefresh && (
        <Button
          onClick={onRefresh}
          variant="outline"
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Muat Ulang
        </Button>
      )}
    </div>
  );
};

export default EmptyStateMainContent;
