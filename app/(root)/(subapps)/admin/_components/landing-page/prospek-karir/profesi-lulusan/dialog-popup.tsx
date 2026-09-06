"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { Plus } from "lucide-react";
import { ProfesiLulusan } from "@/types/admin/landing-page/prospek-karir/profesi-lulusan";

interface DialogPopUpProps {
  mode: "add" | "edit";
  initialData?: ProfesiLulusan;
  onSubmit: (data: ProfesiLulusan) => Promise<void>;
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

  const { control, handleSubmit, reset } = useForm<ProfesiLulusan>({
    defaultValues: {
      nama_profesi: "",
      icon: "",
    },
  });

  useEffect(() => {
    if (dialogOpen) {
      if (mode === "edit" && initialData) {
        reset({ ...initialData });
      } else {
        reset({ nama_profesi: "", icon: "" });
      }
    }
  }, [dialogOpen, mode, initialData, reset]);

  const handleFormSubmit = async (data: ProfesiLulusan) => {
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
            Tambah Profesi Lulusan
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Tambah Profesi Lulusan" : "Edit Profesi Lulusan"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Profesi</label>
            <Controller
              name="nama_profesi"
              control={control}
              render={({ field }: any) => (
                <Input {...field} placeholder="Contoh: Software Engineer" required />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Icon Lucide (Opsional)</label>
            <Controller
              name="icon"
              control={control}
              render={({ field }: any) => (
                <Input {...field} placeholder="Contoh: Code2, Server, Star" />
              )}
            />
            <p className="text-xs text-slate-500">
              Gunakan nama icon dari <a href="https://lucide.dev/icons" target="_blank" className="underline text-blue-500">lucide.dev</a>. Kosongkan jika tidak ada.
            </p>
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
