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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle, Pencil } from "lucide-react";
import { MataKuliahItem } from "@/types/admin/akademik-page/daftar-mata-kuliah/daftar-mata-kuliah";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  kode: z.string().min(1, "Kode mata kuliah harus diisi"),
  name: z.string().min(1, "Nama mata kuliah harus diisi"),
  sks: z.number().min(1, "SKS minimal 1").max(12, "SKS maksimal 12"),
  semester: z
    .number()
    .min(1, "Semester minimal 1")
    .max(8, "Semester maksimal 8"),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: MataKuliahItem;
  onSubmit?: (data: MataKuliahItem) => Promise<void>;
  trigger?: React.ReactNode;
}

const DialogPopUp: React.FC<DialogPopUpProps> = ({
  mode = "add",
  initialData,
  onSubmit,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode: initialData?.kode || "",
      name: initialData?.name || "",
      sks: initialData?.sks || 1,
      semester: initialData?.semester || 1,
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData && mode === "edit") {
        form.reset({
          kode: initialData.kode || "",
          name: initialData.name || "",
          sks: initialData.sks || 1,
          semester: initialData.semester || 1,
        });
      } else if (mode === "add") {
        form.reset({
          kode: "",
          name: "",
          sks: 1,
          semester: 1,
        });
      }
    }
  }, [initialData, mode, open, form]);

  const handleFormSubmit = async (data: FormData) => {
    if (!onSubmit) return;

    const formData: MataKuliahItem = {
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
  const title = isEditMode ? "Edit Mata Kuliah" : "Tambah Mata Kuliah";
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
            <span>{isEditMode ? "Edit" : "Tambah Mata Kuliah"}</span>
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
                  <FormLabel>Kode Mata Kuliah</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan kode mata kuliah" {...field} />
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
                  <FormLabel>Nama Mata Kuliah</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama mata kuliah" {...field} />
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
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(parseInt(value, 10))
                    }
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Menyimpan..." : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPopUp;
