import { useState } from "react";
import Image from "next/image";
import { Calendar, Users, MapPin, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AktivitasProgramUnggulanSuperAdminService } from "@/api/superadmin";
import { toast } from "sonner";

interface Kegiatan {
  id: number;
  program_id?: number;
  title: string;
  description: string;
  image: string;
  date: string;
  program_name: string;
  period_label: string;
  location?: string;
}

interface KegiatanGalleryDetailProps {
  kegiatan: Kegiatan | null;
  isOpen: boolean;
  onClose: () => void;
  getImageUrl: (imagePath: string | null) => string;
  formatDate: (dateString: string) => string;
  isAdmin?: boolean;
  onDeleteSuccess?: () => void;
}

export default function KegiatanGalleryDetail({
  kegiatan,
  isOpen,
  onClose,
  getImageUrl,
  formatDate,
  isAdmin = false,
  onDeleteSuccess,
}: KegiatanGalleryDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!kegiatan || !kegiatan.program_id) return;

    if (!confirm("Apakah Anda yakin ingin menghapus foto kegiatan ini?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response =
        await AktivitasProgramUnggulanSuperAdminService.deleteActivityPhoto(
          kegiatan.program_id,
          kegiatan.id
        );

      if (response.success) {
        toast.success("Foto kegiatan berhasil dihapus");
        onDeleteSuccess?.();
        onClose();
      } else {
        toast.error(response.message || "Gagal menghapus foto kegiatan");
      }
    } catch (error) {
      console.error("Error deleting activity photo:", error);
      toast.error("Terjadi kesalahan saat menghapus foto kegiatan");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 shadow-2xl rounded-2xl [&>button]:bg-white [&>button]:opacity-100 [&>button]:rounded-full [&>button]:p-1.5 [&>button]:right-3 [&>button]:top-3 [&>button]:shadow-lg [&>button]:hover:bg-gray-100 [&>button]:transition-all"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {kegiatan && (
          <div className="flex flex-col">
            {/* Image */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden shrink-0">
              <Image
                src={getImageUrl(kegiatan.image)}
                alt={kegiatan.title}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              {/* Close button background overlay */}
              <div className="absolute top-0 right-0 p-4 pointer-events-none bg-gradient-to-bl from-black/20 to-transparent w-24 h-24" />
              
              {/* Admin Actions */}
              {isAdmin && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-3 text-xs gap-1.5 shadow-lg"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Hapus Foto
                  </Button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 md:p-6 space-y-4 bg-white">
              {/* Header */}
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-base md:text-lg font-bold text-gray-900 tracking-tight">
                  {kegiatan.title}
                </DialogTitle>
              </DialogHeader>

              {/* Meta info with badge */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[11px] md:text-xs text-gray-600">
                <Badge className="bg-primary-50 text-primary-700 hover:bg-primary-100 border-primary-200 transition-colors text-[10px] md:text-xs">
                  {kegiatan.period_label}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{formatDate(kegiatan.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{kegiatan.program_name}</span>
                </div>
                {kegiatan.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">{kegiatan.location}</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

              {/* Description */}
              <div className="prose prose-sm prose-primary max-w-none">
                <DialogDescription className="text-gray-600 leading-relaxed text-sm">
                  {kegiatan.description}
                </DialogDescription>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
