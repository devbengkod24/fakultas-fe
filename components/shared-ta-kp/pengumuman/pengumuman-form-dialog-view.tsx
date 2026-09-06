"use client";

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
import { toast } from "sonner";
import { pengumumanSchema, PengumumanFormData } from "./schema";
import RichTextEditor from "@/components/rich-text-editor";
import { PengumumanItem } from "./types";

interface PengumumanFormDialogViewProps {
  pengumuman?: PengumumanItem;
  onSave: (data: PengumumanItem) => Promise<void>;
  onClose: () => void;
  defaultType?: string;
  defaultUser?: string;
}

export default function PengumumanFormDialogView({
  pengumuman,
  onSave,
  onClose,
  defaultType = "ta",
  defaultUser = "Koordinator",
}: PengumumanFormDialogViewProps) {
  const form = useForm<PengumumanFormData>({
    resolver: zodResolver(pengumumanSchema),
    defaultValues: {
      judul: pengumuman?.judul ?? "",
      user: pengumuman?.user ?? defaultUser,
      isi: pengumuman?.isi ?? "",
      type: pengumuman?.type ?? defaultType,
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
                    <Input placeholder="Masukkan nama pengirim" {...field} />
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
