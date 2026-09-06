"use client"

import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import RichTextEditor from "@/components/rich-text-editor"
import type { Pengumuman } from "@/types/kerja-praktek/pengumuman"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PengumumanFormData, pengumumanSchema } from "../../pengumuman/schema";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PengumumanFormDialogProps {
  pengumuman?: Pengumuman;
  onSave: (data: Pengumuman) => Promise<void>;
  onClose: () => void;
}

export function PengumumanFormDialog({
  pengumuman,
  onSave,
  onClose,
}: PengumumanFormDialogProps) {

  const form = useForm<PengumumanFormData>({
    resolver: zodResolver(pengumumanSchema),
    defaultValues: {
      judul: pengumuman?.judul ?? "",
      user: pengumuman?.user ?? "Koordinator Kerja Praktek",
      isi: pengumuman?.isi ?? "",
      type: "kp",
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
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-full sm:max-w-[600px] h-[95vh] max-h-[95vh] sm:h-auto sm:max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-base sm:text-lg">
              {pengumuman ? "Edit Pengumuman" : "Tambah Pengumuman"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="judul"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Judul</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan judul pengumuman" 
                          className="text-sm h-10"
                          {...field} 
                        />
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
                      <FormLabel className="text-sm font-medium">Pengirim</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama pengirim" 
                          className="text-sm h-10"
                          {...field} 
                        />
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
                      <FormLabel className="text-sm font-medium">Isi Pengumuman</FormLabel>
                      <FormControl>
                        <div className="h-[200px] sm:h-[250px] border rounded-md">
                          <RichTextEditor
                            {...field}
                            content={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Buttons - Fixed at bottom on mobile */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 mt-6">
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
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-auto h-10 order-1 sm:order-2"
                    size="sm"
                  >
                    {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
