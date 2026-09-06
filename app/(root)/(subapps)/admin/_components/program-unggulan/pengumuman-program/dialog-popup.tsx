"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Pencil } from "lucide-react";
import { PengumumanProgram } from "@/types/admin/program-unggulan/pengumuman-program/pengumuman-program";
import { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";
import useSWR from "swr";
import { ProgramUnggulanSuperAdminService } from "@/api/superadmin";
import { useProfile } from "@/context/profileUseContext";

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: PengumumanProgram;
  onSubmit?: (data: PengumumanProgram) => Promise<void>;
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
  const [form, setForm] = React.useState<PengumumanProgram>({
    id: initialData?.id || undefined,
    title: initialData?.title || "",
    description: initialData?.description || "",
    date: initialData?.date || "",
    program_id: initialData?.program_id || 0,
    type: initialData?.type || "pendaftaran",
  });

  // Fetch program excelencia list for dropdown
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
        date: initialData?.date || "",
        program_id: initialData?.program_id || 0,
        type: initialData?.type || "pendaftaran",
      });
    } else if (mode === "add") {
      setForm({
        id: undefined,
        title: "",
        description: "",
        date: "",
        program_id: 0,
        type: "pendaftaran",
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
    if (!form.title.trim()) {
      return;
    }

    if (!form.description.trim()) {
      return;
    }

    if (!form.date) {
      return;
    }

    if (form.program_id === 0) {
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
    ? "Edit Pengumuman Program"
    : "Tambah Pengumuman Program";
  const buttonText = isEditMode ? "Perbarui" : "Simpan";

  const typeOptions = [
    { value: "pendaftaran", label: "Pendaftaran" },
    { value: "hasil", label: "Hasil" },
    { value: "acara", label: "Acara" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={isEditMode ? "outline" : "default"}
            className="h-full"
          >
            {isEditMode ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            <span>{isEditMode ? "Edit" : "Tambah Pengumuman Program"}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Judul Pengumuman</Label>
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
            <Label htmlFor="description">Deskripsi Pengumuman</Label>
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
            <Label htmlFor="date">Tanggal Pengumuman</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
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
            {programUnggulanList.length === 0 && effectiveProdiId && (
              <p className="text-xs text-red-500 mt-1 italic">
                *Tidak ada program confira untuk prodi ini.
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="type">Tipe Pengumuman</Label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
  );
};

export default DialogPopUp;