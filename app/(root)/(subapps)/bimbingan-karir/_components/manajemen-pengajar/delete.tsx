/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { ManajemenPengajarService } from "@/api/bimbingan-karir";
import { toast } from "sonner";
import { KeyedMutator } from "swr";

interface DeletePengajarButtonProps {
  id: number;
  name: string;
  mutate: KeyedMutator<any>;
}

export default function DeletePengajarButton({ id, name, mutate }: DeletePengajarButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await ManajemenPengajarService.deletePengajar(id);
      
      if (response.success) {
        toast.success(response.message || "Berhasil menghapus pengajar");
        // Revalidate table data
        mutate();
        setOpen(false);
      } else {
        toast.error(response.message || "Gagal menghapus pengajar");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus pengajar");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmationModal
        open={open}
        setOpen={setOpen}
        onConfirm={handleDelete}
        type="delete"
        title="Hapus Pengajar"
        description={`Apakah Anda yakin ingin menghapus pengajar "${name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
        cancelText="Batal"
      />
    </>
  );
}