"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import RichTextEditor from "@/components/rich-text-editor";
import type { FakultasPengumuman } from "@/data/fakultas/tambah-pengumuman";
const pengumumanSchema = z.object({
  judul: z
    .string()
    .min(5, "Judul harus memiliki minimal 5 karakter")
    .max(200, "Judul tidak boleh lebih dari 200 karakter"),
  isi: z.string().min(20, "Isi pengumuman harus memiliki minimal 20 karakter"),
  is_active: z.boolean().default(true),
  is_popup: z.boolean().default(false),
});

type PengumumanFormData = z.infer<typeof pengumumanSchema>;

interface PengumumanFormDialogProps {
  pengumuman?: FakultasPengumuman | null;
  onSave: (data: FakultasPengumuman) => Promise<void>;
  onClose: () => void;
  userName?: string;
}

export default function PengumumanFormDialog({
  pengumuman,
  onSave,
  onClose,
  userName,
}: PengumumanFormDialogProps) {
  const isEdit = !!pengumuman;

  const form = useForm<PengumumanFormData>({
    resolver: zodResolver(pengumumanSchema),
    defaultValues: {
      judul: pengumuman?.judul ?? "",
      isi: pengumuman?.isi ?? "",
      is_active: pengumuman?.is_active ?? true,
      is_popup: pengumuman?.is_popup ?? pengumuman?.is_pop_up ?? false,
    },
  });

  const onSubmit = async (data: PengumumanFormData) => {
    console.log("Form data received:", data);
    try {
      await onSave({
        ...data,
        id: pengumuman?.id,
        type: "general",
        status: data.is_active ? "published" : "archived",
        is_pop_up: data.is_popup,
        published_at: pengumuman?.published_at || new Date().toISOString(),
        created_at: pengumuman?.created_at || new Date().toISOString(),
        user: pengumuman?.user || userName || "Admin",
      } as any);
      form.reset();
      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Gagal menyimpan pengumuman");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-hidden flex flex-col p-0">
        <div className="overflow-y-auto flex-1 px-6 py-4">
        <DialogHeader className="mb-4">
          <DialogTitle>
            {isEdit ? "Edit Pengumuman Fakultas" : "Tambah Pengumuman Fakultas"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="judul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">Judul Pengumuman</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan judul pengumuman yang informatif" {...field} className="h-11 break-words" />
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
                  <FormLabel className="font-semibold text-foreground">Isi Pengumuman</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Tuliskan isi pengumuman secara detail..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm hover:border-primary/30 transition-colors">
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-sm font-semibold cursor-pointer">Publikasikan ke Berita</FormLabel>
                        <Badge variant="success" className="text-[9px] h-4 px-1.5">Dipublikasi</Badge>
                      </div>
                      <FormDescription className="text-[11px] leading-tight">
                        Tampilkan pengumuman ini di landing page fakultas.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_popup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm hover:border-primary/30 transition-colors">
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-sm font-semibold cursor-pointer">Aktifkan Pop-up</FormLabel>
                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-purple-500/10 text-purple-600 border-purple-500/20">Pop-up</Badge>
                      </div>
                      <FormDescription className="text-[11px] leading-tight">
                        Munculkan sebagai jendela pop-up otomatis.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        </div>
        <DialogFooter className="gap-2 p-6 border-t shrink-0 flex flex-col sm:flex-row justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto h-10 order-2 sm:order-1"
            size="sm"
          >
            Batal
          </Button>

          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto h-10 order-1 sm:order-2"
            size="sm"
          >
            {form.formState.isSubmitting ? "Menyimpan..." : (isEdit ? "Perbarui" : "Simpan")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}