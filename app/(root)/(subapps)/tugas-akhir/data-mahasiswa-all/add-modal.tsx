/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";

const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").trim(),
  nim: z.string().min(1, "NIM wajib diisi").trim(),
  email: z.string().email("Email tidak valid").min(1, "Email wajib diisi"),
  ipk: z
    .number({ invalid_type_error: "IPK harus berupa angka" })
    .min(0, "IPK harus antara 0 dan 4")
    .max(4, "IPK harus antara 0 dan 4")
    .optional(),
  telepon: z
    .string()
    .optional()
    .refine((val) => !val || /^(\+62|62|0)[0-9]{8,15}$/.test(val), {
      message: "Format nomor telepon tidak valid",
    }),
  transkrip: z.string().optional(),
  type: z.string().default("ta"),
});

type FormData = z.infer<typeof formSchema>;

interface MahasiswaFormProps {
  onClose: () => void;
  onSave: (formData: FormData) => Promise<any>;
  mahasiswa?: FormData;
  editMode: boolean;
}

export function MahasiswaForm({
  onClose,
  onSave,
  mahasiswa,
  editMode,
}: MahasiswaFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nim: "",
    email: "",
    ipk: 0,
    telepon: "",
    transkrip: "",
    type: "ta",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mahasiswa && editMode) {
      setFormData({
        name: mahasiswa.name || "",
        nim: mahasiswa.nim || "",
        email: mahasiswa.email || "",
        ipk: parseFloat(String(mahasiswa.ipk ?? 0).replace(",", ".")) || 0,
        telepon: mahasiswa.telepon || "",
        transkrip: mahasiswa.transkrip || "",
        type: "ta",
      });
    }
  }, [mahasiswa, editMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "ipk" ? parseFloat(String(value).replace(",", ".")) || 0 : value,
    });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = formSchema.parse(formData);
      const response = await onSave(validatedData);
      setErrors({});
      handleToastResponse(response, onClose);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Failed to save mahasiswa:", error);
        if (error.response?.data) {
          handleToastResponse(error.response.data);
        } else {
          toast.error(
            editMode
              ? "Gagal memperbarui data mahasiswa"
              : "Gagal menambah mahasiswa",
            {
              description: "Silakan coba lagi.",
            }
          );
        }
      }
    } finally {
      setIsSubmitting(false);
      // Hapus onClose() dari sini karena sudah ditangani oleh handleToastResponse
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Data Mahasiswa" : "Tambah Mahasiswa Baru"}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Ubah informasi mahasiswa pada form di bawah ini."
              : "Masukkan informasi mahasiswa baru pada form di bawah ini."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama Lengkap"
                  className={`col-span-3 ${
                    errors.name ? "border-destructive" : ""
                  }`}
                  required
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nim" className="text-right">
                NIM <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="nim"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  placeholder="NIM Mahasiswa"
                  className={`col-span-3 ${
                    errors.nim ? "border-destructive" : ""
                  }`}
                  required
                />
                {errors.nim && (
                  <p className="text-destructive text-sm mt-1">{errors.nim}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Mahasiswa"
                  className={`col-span-3 ${
                    errors.email ? "border-destructive" : ""
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ipk" className="text-right">
                IPK
              </Label>
              <div className="col-span-3">
                <Input
                  id="ipk"
                  name="ipk"
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={formData.ipk}
                  onChange={handleChange}
                  className={`col-span-3 ${
                    errors.ipk ? "border-destructive" : ""
                  }`}
                />
                {errors.ipk && (
                  <p className="text-destructive text-sm mt-1">{errors.ipk}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telepon" className="text-right">
                No. Telepon
              </Label>
              <div className="col-span-3">
                <Input
                  id="telepon"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  placeholder="No Telepon (contoh: +628123456789)"
                  className={`col-span-3 ${
                    errors.telepon ? "border-destructive" : ""
                  }`}
                />
                {errors.telepon && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.telepon}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transkrip" className="text-right">
                Transkrip
              </Label>
              <div className="col-span-3">
                <Input
                  id="transkrip"
                  name="transkrip"
                  value={formData.transkrip}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="https://drive.google.com/file/..."
                />
                {errors.transkrip && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.transkrip}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
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
                ? editMode
                  ? "Menyimpan..."
                  : "Menambah..."
                : editMode
                ? "Simpan Perubahan"
                : "Tambah Mahasiswa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
