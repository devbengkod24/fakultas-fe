"use client";

import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dosen } from "@/types/fakultas/penelitian/penelitian";

const PRODI_LIST = [
  { value: "coba", label: "Coba" },
  { value: "ti", label: "Teknik Informatika" },
  { value: "si", label: "Sistem Informasi" },
  { value: "dkv", label: "Desain Komunikasi Visual" },
  { value: "film", label: "Film & Televisi" },
  { value: "mti", label: "Magister Teknik Informatika" },
  { value: "pjj", label: "PJJ Informatika" },
  { value: "animasi", label: "Animasi" },
  { value: "ikom", label: "Ilmu Komunikasi" },
  { value: "pik", label: "Program Ilmu Komputer" },
];

const formSchema = z.object({
  npp: z.string().min(1, "NPP wajib diisi"),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  gelar_depan: z.string().optional(),
  gelar_belakang: z.string().optional(),
  prodi_homebase: z.string().min(1, "Pilih prodi homebase"),
  prodi_tugas: z.array(z.string()).min(1, "Pilih minimal 1 prodi tugas"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
  status: z.enum(["Aktif", "Nonaktif"], {
    required_error: "Pilih status",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: Dosen;
  onSubmit?: (data: Dosen) => Promise<void>;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const getProdiValue = (prodi: any): string => {
  if (!prodi) return "";
  if (typeof prodi === "object" && prodi !== null) return prodi.kode_prodi || "";
  return String(prodi);
};

const getProdiTugasValue = (prodiTugas: any): string[] => {
  if (!prodiTugas) return [];
  if (Array.isArray(prodiTugas)) {
    return prodiTugas.map((p) =>
      typeof p === "object" ? p.kode_prodi || "" : String(p)
    );
  }
  return [String(prodiTugas)];
};

const DialogPopUp: React.FC<DialogPopUpProps> = ({
  mode = "add",
  initialData,
  onSubmit,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Dosen" : "Tambah Dosen";
  const buttonText = isEditMode ? "Perbarui" : "Simpan";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      npp: "",
      nama: "",
      gelar_depan: "",
      gelar_belakang: "",
      prodi_homebase: "",
      prodi_tugas: [],
      jabatan: "",
      status: undefined,
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData && isEditMode) {
        form.reset({
          npp: initialData.npp || "",
          nama: initialData.nama || "",
          gelar_depan: initialData.gelar_depan || "",
          gelar_belakang: initialData.gelar_belakang || "",
          prodi_homebase: getProdiValue(initialData.prodi_homebase as any),
          prodi_tugas: getProdiTugasValue(initialData.prodi_tugas as any),
          jabatan: initialData.jabatan || "",
          status: (initialData.status as "Aktif" | "Nonaktif") || undefined,
        });
      } else {
        form.reset({
          npp: "",
          nama: "",
          gelar_depan: "",
          gelar_belakang: "",
          prodi_homebase: "",
          prodi_tugas: [],
          jabatan: "",
          status: undefined,
        });
      }
    }
  }, [open, initialData, isEditMode, form]);

  const handleFormSubmit = async (data: FormData) => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      const formData: Dosen = {
        npp: data.npp,
        nama: data.nama,
        gelar_depan: data.gelar_depan,
        gelar_belakang: data.gelar_belakang,
        prodi_homebase: data.prodi_homebase,
        prodi_tugas: data.prodi_tugas as any,
        jabatan: data.jabatan,
        status: data.status,
        dosen_id: initialData?.dosen_id ?? 0,
        user_id: initialData?.user_id ?? 0,
        email: initialData?.email ?? "",
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          {trigger || (
            <Button variant={isEditMode ? "outline" : "default"} className="gap-2">
              {isEditMode ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <PlusCircle className="h-4 w-4" />
              )}
              <span>{isEditMode ? "Edit" : "Tambah Dosen"}</span>
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="npp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NPP</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan NPP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Dosen (tanpa gelar)</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gelar_depan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gelar Depan</FormLabel>
                    <FormControl>
                      <Input placeholder="cth: Dr." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gelar_belakang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gelar Belakang</FormLabel>
                    <FormControl>
                      <Input placeholder="cth: M.Kom." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="prodi_homebase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prodi Homebase</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prodi homebase" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODI_LIST.map((prodi) => (
                        <SelectItem key={prodi.value} value={prodi.value}>
                          {prodi.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prodi_tugas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prodi Tugas</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                      {PRODI_LIST.map((prodi) => (
                        <label
                          key={prodi.value}
                          className="flex items-center gap-2 text-sm cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            value={prodi.value}
                            checked={field.value?.includes(prodi.value) ?? false}
                            onChange={(e) => {
                              const current = field.value ?? [];
                              if (e.target.checked) {
                                field.onChange([...current, prodi.value]);
                              } else {
                                field.onChange(current.filter((v) => v !== prodi.value));
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                          />
                          {prodi.label}
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jabatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jabatan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Guru Besar">Guru Besar</SelectItem>
                      <SelectItem value="Lektor Kepala">Lektor Kepala</SelectItem>
                      <SelectItem value="Lektor">Lektor</SelectItem>
                      <SelectItem value="Asisten Ahli">Asisten Ahli</SelectItem>
                      <SelectItem value="Tenaga Pengajar">Tenaga Pengajar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isSubmitting ? "Menyimpan..." : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPopUp;