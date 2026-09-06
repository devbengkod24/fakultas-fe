import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthService } from "@/api";
import useSWR from "swr";
import { Minat } from "@/types/bimbingan-karir/koordinator/daftar-mahasiswa/daftar-mahasiswa";

const fetcherMinat = () => {
  return AuthService.getMinatMahasiswa().then((res) => res)
}

const MinatForm = ({ handleMinatUpdate }: { handleMinatUpdate: (minatId: number, minatName: string) => Promise<void> }) => {
  const [selectedMinat, setSelectedMinat] = useState<number | null>(null);
  const [selectedMinatLabel, setSelectedMinatLabel] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data, isLoading: isLoadingMinat } = useSWR(
    ["minat-mahasiswa-pilih"],
    () => fetcherMinat(),
    { revalidateOnFocus: false }
  )

  const minatOptions: Minat[] = data?.data || [];

  const handleSelectChange = (value: string) => {
    const selectedOption = minatOptions.find(opt => opt.id === parseInt(value));
    if (selectedOption) {
      setSelectedMinat(selectedOption.id);
      setSelectedMinatLabel(selectedOption.nama_minat);
      setIsAlertOpen(true);
    }
  };

  const handleConfirm = async () => {
    if (!selectedMinat) return;
    
    setIsLoading(true);
    try {
      await handleMinatUpdate(selectedMinat, selectedMinatLabel);
      setIsAlertOpen(false);
      setSelectedMinat(null);
      setSelectedMinatLabel("");
    } catch {
      toast.error("Gagal memperbarui minat. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAlertOpen(false);
    setSelectedMinat(null);
    setSelectedMinatLabel("");
  };

  if (isLoadingMinat) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (minatOptions.length === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <p className="text-sm text-muted-foreground">Tidak ada minat tersedia</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <Select onValueChange={handleSelectChange} value="">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih minat Anda..." />
          </SelectTrigger>
          <SelectContent>
            {minatOptions.map((option) => (
              <SelectItem key={option.id} value={option.id.toString()}>
                {option.nama_minat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div>
                <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                  Konfirmasi Pilihan Minat
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Anda akan memilih <strong>{selectedMinatLabel}</strong> sebagai minat Anda.
              Tindakan ini tidak dapat dibatalkan dan diulang. Pastikan pilihan Anda sudah benar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              onClick={handleCancel} 
              disabled={isLoading}
              className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm} 
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                <>
                  Ya, Pilih Minat
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MinatForm;