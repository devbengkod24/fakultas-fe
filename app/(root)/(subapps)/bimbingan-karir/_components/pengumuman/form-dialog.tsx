"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Pengumuman } from "../../pengumuman/client-page";
import { toast } from "sonner";
import { PengumumanFormData, pengumumanSchema } from "./schema";
import RichTextEditor from "@/components/rich-text-editor";

interface PengumumanFormDialogProps {
  pengumuman?: Pengumuman;
  onSave: (data: Pengumuman) => Promise<void>;
  onClose: () => void;
}

export default function PengumumanFormDialog({
  pengumuman,
  onSave,
  onClose,
}: PengumumanFormDialogProps) {
  const form = useForm<PengumumanFormData>({
    resolver: zodResolver(pengumumanSchema),
    defaultValues: {
      judul: pengumuman?.judul ?? "",
      user: "Koordinator BK",
      isi: pengumuman?.isi ?? "",
      type: "bk",
    },
  });

  const onSubmit = async (data: PengumumanFormData) => {
    try {
      await onSave({
        id: pengumuman?.id ?? 0,
        ...data,
        published_at: pengumuman?.published_at ?? new Date().toISOString(),
      });
      form.reset();
      onClose();
    } catch {
      toast.error("Gagal menyimpan pengumuman");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {pengumuman ? "Edit Pengumuman" : "Tambah Pengumuman"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="judul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan judul pengumuman" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pengirim</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama pengirim" {...field} disabled/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Isi Pengumuman</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      {...field}
                      content={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
