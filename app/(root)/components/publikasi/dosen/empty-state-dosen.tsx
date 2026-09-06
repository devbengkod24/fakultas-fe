import { FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateDosenProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

const EmptyStateDosen = ({
  title = "Data Tidak Ditemukan",
  description = "Data dosen yang Anda cari tidak dapat ditemukan. Silakan periksa kembali atau muat ulang.",
  onRefresh,
}: EmptyStateDosenProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
        <FileText className="w-10 h-10 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {onRefresh && (
        <Button
          onClick={onRefresh}
          variant="outline"
          className="border-primary-600 text-primary-600 hover:bg-primary-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Muat Ulang
        </Button>
      )}
    </div>
  );
};

export default EmptyStateDosen;
