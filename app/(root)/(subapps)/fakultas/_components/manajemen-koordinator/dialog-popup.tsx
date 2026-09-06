"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, PlusCircle, Pencil, EyeOff, Eye, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { AkunUser } from "@/types/fakultas/users/user";
import { ManajemenProdiSuperAdminService } from "@/api/superadmin";
import { DosenFakultasService } from "@/api";
import type { ProdiData, ProdiCategory } from "@/types/fakultas/manajemen-prodi/manajemen-prodi";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ApiProdiData extends ProdiData {
  prodi_category_id?: number;
}

const permissionOptions = [
  { value: "bimbingan-karir", label: "Bimbingan Karir" },
  { value: "tugas-akhir", label: "Tugas Akhir" },
  { value: "kerja-praktek", label: "Kerja Praktek" },
];

const baseFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  email: z.string().email("Format email tidak valid"),
  permissions: z.array(z.string()).min(1, "Pilih minimal 1 permission"),
  category_id: z.string().min(1, "Pilih kategori prodi"),
  prodi_id: z.string().min(1, "Pilih program studi"),
  dosen_id: z.string().optional(),
  password: z.string().optional(),
});

const addFormSchema = baseFormSchema.extend({
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const editFormSchema = baseFormSchema.extend({
  password: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.string().min(8, "Password minimal 8 karakter")),
});

type FormData = z.infer<typeof baseFormSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: AkunUser;
  onSubmit: (data: AkunUser) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function DialogPopUp({
  mode = "add",
  initialData,
  onSubmit,
  trigger,
}: DialogPopUpProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDosenSelect, setOpenDosenSelect] = useState(false);

  const { data: categoryRes, isLoading: isLoadingCategories } = useSWR(
    open ? "prodi-categories" : null,
    () => ManajemenProdiSuperAdminService.getCategories()
  );

  const categories = useMemo(() => {
    const raw = categoryRes?.data?.data ?? categoryRes?.data ?? categoryRes ?? [];
    return Array.isArray(raw) ? (raw as ProdiCategory[]) : [];
  }, [categoryRes]);

  // Fetch Prodis
  const { data: prodiRes, isLoading: isLoadingProdis } = useSWR(
    open ? "list-prodi-select" : null,
    () => ManajemenProdiSuperAdminService.getAll(1, 100)
  );

  const allProdis = useMemo(() => {
    const raw = prodiRes?.data?.data ?? prodiRes?.data ?? prodiRes ?? [];
    return Array.isArray(raw) ? (raw as ProdiData[]) : [];
  }, [prodiRes]);

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Akun Koordinator" : "Tambah Akun Koordinator";
  const buttonText = isEditMode ? "Perbarui" : "Simpan";

  const dynamicSchema = useMemo(() => {
    return isEditMode ? editFormSchema : addFormSchema;
  }, [isEditMode]);

  const form = useForm<FormData>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      name: "",
      email: "",
      permissions: [],
      category_id: "",
      prodi_id: "",
      dosen_id: "none",
      password: "",
    },
  });

  const selectedCategoryId = form.watch("category_id");
  const filteredProdis = useMemo(() => {
    if (!selectedCategoryId || allProdis.length === 0) return [];
    
    return (allProdis as ApiProdiData[]).filter((p) => {
      let catId: number | undefined = p.category_id || p.prodi_category_id;
      
      // Jika catId belum ketemu dan category adalah string, cari ID-nya di list categories
      if (!catId && typeof p.category === 'string') {
        const matchedCat = categories.find(c => c.nama === p.category);
        if (matchedCat) catId = matchedCat.id;
      }
      // Jika category adalah objek
      else if (!catId && typeof p.category === 'object' && p.category !== null) {
        catId = (p.category as ProdiCategory).id;
      }
      
      return String(catId) === selectedCategoryId;
    });
  }, [selectedCategoryId, allProdis, categories]); 

  const selectedProdiId = form.watch("prodi_id");

  // Fetch Dosen List for the selected prodi
  const { data: dosenRes, isLoading: isLoadingDosen } = useSWR(
    open && selectedProdiId ? ["list-dosen-select", selectedProdiId] : null,
    () => DosenFakultasService.getAll(1, 200, "", selectedProdiId)
  );

  const dosenList = useMemo(() => {
    const raw = dosenRes?.data?.data ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [dosenRes]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (initialData && isEditMode) {
        form.reset({
          name: initialData.name || "",
          email: initialData.email || "",
          permissions: initialData.permissions || [],
          category_id: "", // Will be discovered once allProdis is loaded
          prodi_id: initialData.prodi_id ? String(initialData.prodi_id) : "",
          dosen_id: initialData.dosen_id ? String(initialData.dosen_id) : "none",
          password: "",
        });
      } else if (!isEditMode) {
        form.reset({
          name: "",
          email: "",
          permissions: [],
          category_id: "",
          prodi_id: "",
          dosen_id: "none",
          password: "",
        });
      }
    }
  }, [open, initialData, isEditMode, form]);

  // Discover category_id and prodi_id when prodis are loaded in edit mode
  useEffect(() => {
    if (open && isEditMode && initialData && allProdis.length > 0) {
      let matchedProdi: ApiProdiData | undefined;

      if (initialData.prodi_id) {
        matchedProdi = (allProdis as ApiProdiData[]).find((p) => p.id === Number(initialData.prodi_id));
      } else if ('prodi' in initialData && initialData.prodi) {
        const prodiData = initialData.prodi as string | { nama?: string };
        const prodiName = typeof prodiData === 'string' 
          ? prodiData 
          : prodiData?.nama;
          
        matchedProdi = (allProdis as ApiProdiData[]).find((p) => p.nama === prodiName);
      }

      if (matchedProdi) {
        form.setValue("prodi_id", String(matchedProdi.id));
        form.setValue("dosen_id", initialData.dosen_id ? String(initialData.dosen_id) : "none");

        const currentCategory = form.getValues("category_id");
        if (!currentCategory) {
          let catId: number | undefined = matchedProdi.category_id || matchedProdi.prodi_category_id;
          
          if (!catId && typeof matchedProdi.category === 'string') {
            const matchedCat = categories.find(c => c.nama === matchedProdi.category);
            if (matchedCat) catId = matchedCat.id;
          } else if (!catId && typeof matchedProdi.category === 'object' && matchedProdi.category !== null) {
            catId = (matchedProdi.category as ProdiCategory).id;
          }
          
          if (catId) {
            form.setValue("category_id", String(catId));
          }
        }
      }
    }
  }, [open, isEditMode, initialData, allProdis, categories, form]);

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formData: AkunUser = {
        ...data,
        id: initialData?.id,
        prodi_id: Number(data.prodi_id),
        dosen_id: data.dosen_id && data.dosen_id !== "none" ? Number(data.dosen_id) : null,
        ...(data.password && data.password.length > 0 && { password: data.password }),
      };

      await onSubmit(formData);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPermissionBadgeVariant = useCallback((value: string) => {
    switch (value) {
      case "tugas-akhir": return "orange";
      case "kerja-praktek": return "primary";
      case "bimbingan-karir": return "yellow";
      default: return "default";
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isEditMode ? "outline" : "default"} className="gap-2">
            {isEditMode ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            <span>{isEditMode ? "Edit" : "Tambah Akun Koordinator"}</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Ubah informasi akun koordinator yang sudah ada." 
                  : "Tambahkan akun koordinator baru untuk mengelola modul tertentu."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Program</FormLabel>
                    <Select disabled={isLoadingCategories} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingCategories ? "Memuat kategori..." : "Pilih kategori"} />
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
            
              {/* Prodi Field */}
              <FormField
                control={form.control}
                name="prodi_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Studi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategoryId || isLoadingProdis}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            isLoadingProdis 
                              ? "Memuat prodi..." 
                              : selectedCategoryId 
                                ? "Pilih prodi" 
                                : "Pilih kategori dulu"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredProdis.length > 0 ? (
                          filteredProdis.map((prodi) => (
                            <SelectItem key={prodi.id} value={String(prodi.id)}>
                              {prodi.nama}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-center text-muted-foreground">
                            {isLoadingProdis ? "Memuat..." : "Tidak ada program studi"}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dosen Field */}
            <FormField
              control={form.control}
              name="dosen_id"
              render={({ field }) => {
                const selectedDosen = dosenList.find((d: any) => String(d.dosen_id) === field.value);
                const selectedDosenLabel = selectedDosen
                  ? [selectedDosen.gelar_depan, selectedDosen.name, selectedDosen.gelar_belakang]
                      .filter(Boolean)
                      .join(" ") + (selectedDosen.npp ? ` (${selectedDosen.npp})` : "")
                  : "-- Tidak di-assign (Kosong) --";

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dosen Terkait (untuk TTD & Nama Resmi)</FormLabel>
                    <Popover open={openDosenSelect} onOpenChange={setOpenDosenSelect} modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={!selectedProdiId || isLoadingDosen}
                            className={cn(
                              "w-full justify-between font-normal text-left",
                              (field.value === "none" || !field.value) && "text-muted-foreground"
                            )}
                          >
                            <span className="truncate">
                              {isLoadingDosen
                                ? "Memuat dosen..."
                                : !selectedProdiId
                                  ? "Pilih program studi dulu"
                                  : field.value === "none" || !field.value
                                    ? "Pilih dosen (opsional)"
                                    : selectedDosenLabel}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[450px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Cari dosen..." />
                          <CommandList>
                            <CommandEmpty>Dosen tidak ditemukan.</CommandEmpty>
                            <CommandGroup className="max-h-[220px] overflow-y-auto">
                              <CommandItem
                                value="none"
                                onSelect={() => {
                                  form.setValue("dosen_id", "none");
                                  setOpenDosenSelect(false);
                                }}
                                className="text-muted-foreground italic"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === "none" || !field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                -- Tidak di-assign (Kosong) --
                              </CommandItem>
                              {dosenList.map((d: any) => {
                                const fullName = [d.gelar_depan, d.name, d.gelar_belakang]
                                  .filter(Boolean)
                                  .join(" ") + (d.npp ? ` (${d.npp})` : "");
                                return (
                                  <CommandItem
                                    value={fullName}
                                    key={d.dosen_id}
                                    onSelect={() => {
                                      form.setValue("dosen_id", String(d.dosen_id));
                                      setOpenDosenSelect(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        String(d.dosen_id) === field.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {fullName}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="grid grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Masukkan email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password
                    {isEditMode && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (Kosongkan jika tidak ingin mengubah)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={isEditMode ? "Masukkan password baru" : "Masukkan password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <FormControl>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex flex-wrap gap-2">
                        {permissionOptions.map((option) => {
                          const isSelected = field.value?.includes(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                const current = field.value || [];
                                if (isSelected) {
                                  field.onChange(current.filter((v) => v !== option.value));
                                } else {
                                  field.onChange([...current, option.value]);
                                }
                              }}
                              className={`transition-all duration-200 ${
                                isSelected ? "scale-105" : "opacity-60 hover:opacity-100"
                              }`}
                            >
                              <Badge
                                variant={getPermissionBadgeVariant(option.value)}
                                className="cursor-pointer flex items-center gap-1.5 py-1"
                              >
                                <span>{option.label}</span>
                                {isSelected && (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </Badge>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                ) : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
