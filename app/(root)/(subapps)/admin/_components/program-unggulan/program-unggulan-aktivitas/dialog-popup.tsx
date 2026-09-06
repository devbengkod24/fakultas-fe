"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import Image from "next/image";
import useSWR from "swr";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";
import { ProgramUnggulanSuperAdminService } from "@/api/superadmin";
import { PhotoActivity } from "@/types/admin/program-unggulan/photos-program/program-unggulan-photos";
import { useProfile } from "@/context/profileUseContext";

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: PhotoActivity;
  onSubmit?: (data: PhotoActivity & { imageFile?: File }) => Promise<void>;
  trigger?: React.ReactNode;
  prodiId?: number | null;
}

const DialogPopUp: React.FC<DialogPopUpProps> = ({
  mode = "add",
  initialData,
  onSubmit,
  trigger,
  prodiId,
}) => {
  const { activeProdiId } = useProfile();
  const effectiveProdiId = prodiId ?? activeProdiId;

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<PhotoActivity>({
    id: initialData?.id || undefined,
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageFile: initialData?.imageFile,
    image: initialData?.image || "",
    program_id: initialData?.program_id || 0,
  });

  // Fetch program unggulan list for dropdown - Filtered by effectiveProdiId
  const { data: programUnggulanResponse } = useSWR(
    effectiveProdiId ? ["program-unggulan", effectiveProdiId] : ["program-unggulan"],
    () => ProgramUnggulanSuperAdminService.getProgramUnggulanList(1, 100, effectiveProdiId ?? undefined),
    {
      revalidateOnFocus: false,
    }
  );

  const programUnggulanList: ProgramUnggulan[] =
    programUnggulanResponse?.data && Array.isArray(programUnggulanResponse.data)
      ? programUnggulanResponse.data
      : programUnggulanResponse?.data?.data &&
        Array.isArray(programUnggulanResponse.data.data)
      ? programUnggulanResponse.data.data
      : [];

  // Reset form when dialog opens/closes or initialData changes
  React.useEffect(() => {
    if (initialData && mode === "edit") {
      setForm({
        id: initialData?.id || undefined,
        title: initialData?.title || "",
        description: initialData?.description || "",
        imageFile: initialData?.imageFile,
        image: initialData?.image || "",
        program_id: initialData?.program_id || 0,
      });
    } else if (mode === "add") {
      setForm({
        id: undefined,
        title: "",
        description: "",
        imageFile: undefined,
        image: "",
        program_id: 0,
      });
    }
  }, [initialData, open, mode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "program_id" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    // Validation
    if (!form.title.trim() || !form.description.trim()) {
      return;
    }

    if (mode === "add" && !form.imageFile) {
      return;
    }

    if (form.program_id === 0) {
      return;
    }

    // REVISI: Keamanan tambahan untuk memastikan program_id yang dipilih ada dalam list terfilter
    const isValidProgram = programUnggulanList.some(
      (p) => p.id === form.program_id
    );

    if (!isValidProgram) {
      console.error("Program Unggulan tidak valid untuk prodi ini.");
      return;
    }

    try {
      await onSubmit(form);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isEditMode = mode === "edit";
  const title = isEditMode
    ? "Edit Aktivitas Program Unggulan Program Studi"
    : "Tambah Aktivitas Program Unggulan Program Studi";
  const buttonText = isEditMode ? "Perbarui" : "Simpan";

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Tambah Program Unggulan
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="title">Judul Aktivitas Program Unggulan</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">
                Deskripsi Aktivitas Program Unggulan
              </Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="image">Foto Kegiatan Program Unggulan</Label>
              <p className="text-sm text-gray-500">
                Format yang didukung: JPG, PNG, WebP (Maksimal 5MB)
              </p>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setForm({ ...form, imageFile: file, image: "" });
                  }
                }}
              />
              {form.image && (
                <Image
                  src={form.image}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="mt-2 rounded-md"
                />
              )}
              {form.imageFile && (
                <div className="mt-2">
                  <p>File yang dipilih: {form.imageFile.name}</p>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="program_id">Program Unggulan</Label>
              <select
                id="program_id"
                name="program_id"
                value={form.program_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Pilih Program Unggulan</option>
                {programUnggulanList.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
              {/* Pesan bantuan jika list kosong */}
              {programUnggulanList.length === 0 && effectiveProdiId && (
                <p className="text-xs text-red-500 mt-1 italic">
                  *Tidak ada program unggulan untuk prodi ini.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">{buttonText}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogPopUp;