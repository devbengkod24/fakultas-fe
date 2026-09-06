"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const dosenSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  npp: z.string().min(1, "NPP wajib diisi"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  bidang_kajian: z.string().optional(),
  scholar_link: z.string().optional(),
  telepon: z.string().optional(),
  gelar_depan: z.string().optional(),
  gelar_belakang: z.string().optional(),
});

type FormData = z.infer<typeof dosenSchema>;

interface DosenFormProps {
  onClose: () => void;
  onSave: (formData: FormData) => void;
  dosen?: {
    dosen_id?: number;
    name: string;
    npp: string;
    email: string;
    bidang_kajian?: string;
    gelar_depan: string;
    gelar_belakang?: string;
  };
  editMode: boolean;
  isSubmitting?: boolean;
}

export function DosenForm({
  onClose,
  onSave,
  dosen,
  editMode,
  isSubmitting = false,
}: DosenFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(dosenSchema),
    defaultValues: {
      name: "",
      npp: "",
      email: "",
      bidang_kajian: "",
      scholar_link: "",
      telepon: "",
      gelar_depan: "",
      gelar_belakang: "",
    },
  });

  useEffect(() => {
    if (dosen && editMode) {
      form.reset({
        name: dosen.name || "",
        npp: dosen.npp || "",
        email: dosen.email || "",
        bidang_kajian: dosen.bidang_kajian || "",
        scholar_link: "",
        telepon: "",
        gelar_depan: dosen.gelar_depan || "",
        gelar_belakang: dosen.gelar_belakang || "",
      });
    }
  }, [dosen, editMode, form]);

  const onSubmit = (data: FormData) => {
    onSave(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] ">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Data Dosen" : "Tambah Dosen Baru"}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Ubah informasi dosen pada form di bawah ini."
              : "Masukkan informasi dosen baru pada form di bawah ini. Field dengan tanda (*) wajib diisi."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <div className="grid gap-6 py-4 max-h-[50vh] overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="npp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        NPP <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan NPP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gelar_depan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gelar Depan</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr., Prof., dll" {...field} />
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
                        <Input
                          placeholder="S.Kom., M.Kom., Ph.D., dll"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nama.dosen@dsn.dinus.ac.id"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bidang_kajian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bidang Kajian</FormLabel>
                      <FormControl>
                        <Input placeholder="RPLD, SC, SE, dll" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telepon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan No. Telepon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="scholar_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Scholar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://scholar.google.com/citations?user=..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Menyimpan..."
                  : editMode
                  ? "Simpan Perubahan"
                  : "Tambah Dosen"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
