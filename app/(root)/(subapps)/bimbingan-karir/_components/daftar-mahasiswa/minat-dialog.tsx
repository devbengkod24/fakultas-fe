"use client";

import { useState } from "react";
import { Loader2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DaftarMhsService } from "@/api/bimbingan-karir";
import { handleToastResponse } from "@/lib/toast-response";
import { Minat } from "@/types/bimbingan-karir/koordinator/daftar-mahasiswa/daftar-mahasiswa";

interface EditMinatDialogProps {
  mahasiswaId: string;
  mahasiswaNama: string;
  currentMinat: string;
  minatList: Minat[];
  onSuccess: () => void;
}

export function EditMinatDialog({
  mahasiswaId,
  mahasiswaNama,
  currentMinat,
  minatList,
  onSuccess,
}: EditMinatDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMinat, setSelectedMinat] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMinat) {
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        minat_id: Number(selectedMinat),
      };

      const res = await DaftarMhsService.updateMinatMahasiswa(
        data,
        Number(mahasiswaId)
      );

      handleToastResponse(res);
      setOpen(false);
      setSelectedMinat("");
      onSuccess();
    } catch (error) {
      console.error("Error updating minat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Minat Mahasiswa</DialogTitle>
          <DialogDescription>
            Ubah minat untuk mahasiswa <strong>{mahasiswaNama}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Minat Saat Ini</label>
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
              {currentMinat}
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Pilih Minat Baru</label>
            <Select value={selectedMinat} onValueChange={setSelectedMinat}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih minat baru..." />
              </SelectTrigger>
              <SelectContent>
                {minatList && minatList.length > 0 ? (
                  minatList.map((minat) => (
                    <SelectItem key={minat.id} value={String(minat.id)}>
                      {minat.nama_minat}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>
                    Tidak ada data minat
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedMinat || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Simpan
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}