"use client";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Pencil } from "lucide-react";
import {
  MataKuliahPeminatanItem,
  Peminatan,
} from "@/types/admin/akademik-page/mata-kuliah-peminatan/mata-kuliah-peminatan";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PeminatanSuperAdminService } from "@/api/superadmin";
import useSWR from "swr";

const fetcherPeminatan = () =>
  PeminatanSuperAdminService.getPeminatan().then(
    (res: { data?: Peminatan[] }) => {
      if (res.data) {
        return {
          data: Array.isArray(res.data) ? res.data : [],
        };
      }
      return { data: [] };
    }
  );

const formSchema = z.object({
  kode: z.string().min(1, "Kode mata kuliah harus diisi"),
  name: z.string().min(1, "Nama mata kuliah harus diisi"),
  sks: z.number().min(1, "SKS minimal 1").max(12, "SKS maksimal 12"),
  peminatan_id: z.number().min(1, "Peminatan harus dipilih"),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: MataKuliahPeminatanItem;
  onSubmit?: (data: MataKuliahPeminatanItem) => Promise<void>;
  trigger?: React.ReactNode;
}

const DialogPopUp: React.FC<DialogPopUpProps> = ({
  mode = "add",
  initialData,
  onSubmit,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);

  const { data: peminatanResponse } = useSWR<{
    data: Peminatan[];
  }>(open ? "peminatan-options" : null, fetcherPeminatan, {
    revalidateOnFocus: false,
  });

  const peminatanOptions = peminatanResponse?.data || [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode: initialData?.kode || "",
      name: initialData?.name || "",
      sks: initialData?.sks || 1,
      peminatan_id: initialData?.peminatan_id || 0,
    },
  });

  React.useEffect(() => {
    if (open && peminatanOptions.length > 0) {
      if (initialData && mode === "edit") {
        form.reset({
          kode: initialData.kode || "",
          name: initialData.name || "",
          sks: initialData.sks || 1,
          peminatan_id: initialData.peminatan_id || 0,
        });
      } else if (mode === "add") {
        form.reset({
          kode: "",
          name: "",
          sks: 1,
          peminatan_id: 0,
        });
      }
    }
  }, [initialData, mode, open, form, peminatanOptions.length]);

  const handleFormSubmit = async (data: FormData) => {
    if (!onSubmit) return;

    const formData: MataKuliahPeminatanItem = {
      ...data,
      id: initialData?.id || undefined,
    };

    try {
      await onSubmit(formData);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const isEditMode = mode === "edit";
  const title = isEditMode
    ? "Edit Mata Kuliah Peminatan"
    : "Tambah Mata Kuliah Peminatan";
  const buttonText = isEditMode ? "Perbarui" : "Simpan";

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
            <span>{isEditMode ? "Edit" : "Tambah Mata Kuliah Peminatan"}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="kode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Mata Kuliah Peminatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan kode mata kuliah peminatan"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Mata Kuliah Peminatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama mata kuliah peminatan"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKS</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan SKS"
                      min="1"
                      max="6"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="peminatan_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peminatan</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={
                      field.value && field.value > 0 ? String(field.value) : ""
                    }
                    defaultValue={
                      initialData?.peminatan_id && initialData.peminatan_id > 0
                        ? String(initialData.peminatan_id)
                        : ""
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih peminatan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {peminatanOptions.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.peminatan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{buttonText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPopUp;
