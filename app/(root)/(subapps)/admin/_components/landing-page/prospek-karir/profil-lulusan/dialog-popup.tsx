"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { Plus } from "lucide-react";
import { ProfilLulusan } from "@/types/admin/landing-page/prospek-karir/profil-lulusan";

interface DialogPopUpProps {
  mode: "add" | "edit";
  initialData?: ProfilLulusan;
  onSubmit: (data: ProfilLulusan) => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogPopUp: React.FC<DialogPopUpProps> = ({
  mode,
  initialData,
  onSubmit,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const { control, handleSubmit, reset } = useForm<ProfilLulusan>({
    defaultValues: {
      kode: "",
      deskripsi: "",
    },
  });

  useEffect(() => {
    if (dialogOpen) {
      if (mode === "edit" && initialData) {
        reset({ ...initialData });
      } else {
        reset({ kode: "", deskripsi: "" });
      }
    }
  }, [dialogOpen, mode, initialData, reset]);

  const handleFormSubmit = async (data: ProfilLulusan) => {
    setLoading(true);
    try {
      await onSubmit(data);
      handleOpenChange(false);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {mode === "add" && !isControlled && (
        <DialogTrigger asChild>
          <Button className="bg-[#194090]">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Profil Lulusan
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Tambah Profil Lulusan" : "Edit Profil Lulusan"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Kode Profil (misal: PL01)</label>
            <Controller
              name="kode"
              control={control}
              render={({ field }: any) => <Input {...field} placeholder="Masukkan Kode" />}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Kompetensi/Profil</label>
            <Controller
              name="deskripsi"
              control={control}
              render={({ field }: any) => (
                <Textarea {...field} placeholder="Deskripsi Profil Lulusan" required />
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#194090]">
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPopUp;
