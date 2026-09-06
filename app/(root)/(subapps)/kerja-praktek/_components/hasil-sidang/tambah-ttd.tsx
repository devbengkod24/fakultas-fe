import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";

interface TtdKoorProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function TambahTtdKoor({
  isOpen,
  onClose,
  onUpload,
  isUploading = false
}: TtdKoorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Format file tidak valid! Hanya PNG, JPG, dan JPEG yang diizinkan.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar! Maksimal 2MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambahkan Tanda Tangan {role === "koordinator" ? "Koordinator" : role === "dosen" ? "Dosen" : ""}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {previewUrl ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="border rounded-md p-2 w-64 h-64 relative">
                <Image
                  src={previewUrl}
                  alt="Preview TTD"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Label htmlFor="ttd-file">Pilih file gambar tanda tangan (PNG, JPG, JPEG)</Label>
              <div className="border border-dashed rounded-md p-8 text-center">
                <input
                  id="ttd-file"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Unggah File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Maksimal ukuran file 2MB
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Mengunggah..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}