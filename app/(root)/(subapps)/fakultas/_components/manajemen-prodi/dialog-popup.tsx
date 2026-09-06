"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Pencil, Loader2 } from "lucide-react";
import type { ProdiData, ProdiCategory } from "@/types/fakultas/manajemen-prodi/manajemen-prodi";
import useSWR from "swr";
import { ManajemenProdiSuperAdminService } from "@/api/superadmin";

const prodiSchema = z.object({
  nama: z.string().min(3, "Nama program studi minimal 3 karakter"),
  kode_prodi: z
    .string()
    .min(2, "Kode prodi minimal 2 karakter")
    .regex(/^[a-z0-9-]+$/, "Kode prodi hanya boleh huruf kecil, angka, dan tanda hubung"),
  category_id: z.string().min(1, "Kategori prodi harus dipilih"),
  gelar: z.string().min(2, "Gelar minimal 2 karakter"),
});

type ProdiFormData = z.infer<typeof prodiSchema>;

interface DialogPopUpProps {
  mode: "add" | "edit";
  initialData?: ProdiData;
  onSubmit: (data: ProdiData) => Promise<void>;
}

export default function DialogPopUp({
  mode,
  initialData,
  onSubmit,
}: DialogPopUpProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categoryRes, isLoading: isLoadingCategories } = useSWR(
    open ? "prodi-categories" : null,
    () => ManajemenProdiSuperAdminService.getCategories()
  );

  const categories = React.useMemo(() => {
    const raw = categoryRes?.data?.data ?? categoryRes?.data ?? categoryRes ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [categoryRes]);

  const form = useForm<ProdiFormData>({
    resolver: zodResolver(prodiSchema),
    defaultValues: {
      nama: "",
      kode_prodi: "",
      category_id: "",
      gelar: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        let matchedCategoryId = "";
        
        if (initialData.category_id) {
          matchedCategoryId = String(initialData.category_id);
        } else if (initialData.category && categories.length > 0) {
          const foundCategory = categories.find(
            (c: ProdiCategory ) => c.nama === initialData.category
          );
          if (foundCategory) {
            matchedCategoryId = String(foundCategory.id);
          }
        }

        form.reset({
          nama: initialData.nama || "",
          kode_prodi: initialData.kode_prodi || "",
          category_id: matchedCategoryId,
          gelar: initialData.gelar || "",
        });
      } else {
        form.reset({
          nama: "",
          kode_prodi: "",
          category_id: "",
          gelar: "",
        });
      }
    }
  }, [open, mode, initialData, form, categories]);

  const handleFormSubmit = async (data: ProdiFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        id: initialData?.id || 0,
        nama: data.nama,
        kode_prodi: data.kode_prodi,
        category_id: Number(data.category_id),
        gelar: data.gelar,
      } as ProdiData);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button size="sm" className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            Tambah Prodi
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {mode === "add"
                  ? "Tambah Program Studi"
                  : "Edit Program Studi"}
              </DialogTitle>
              <DialogDescription>
                {mode === "add"
                  ? "Isi data program studi baru yang akan ditambahkan."
                  : "Ubah data program studi yang dipilih."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Program Studi</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Teknik Informatika" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="kode_prodi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Prodi</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ti" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gelar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gelar</FormLabel>
                      <FormControl>
                        <Input placeholder="S.Kom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Program</FormLabel>
                    <Select
                      disabled={isLoadingCategories}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormDescription className="text-xs">
                Kode prodi digunakan untuk URL unik (contoh: /prodi/ti).
              </FormDescription>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : mode === "add" ? (
                  "Tambah"
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
