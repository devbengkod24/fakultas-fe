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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Pencil, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { RuanganSidang, RuanganSidangFormData } from "@/types/fakultas/ruangan-sidang/ruangan-sidang";

const formSchema = z.object({
  nama_ruangan: z.string().min(1, "Nama ruangan harus diisi"),
  kapasitas: z.string().optional(),
  gedung: z.string().optional(),
  is_active: z.boolean().default(true),
  is_online: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: RuanganSidang;
  onSubmit?: (data: RuanganSidangFormData) => Promise<void>;
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
      nama_ruangan: initialData?.nama_ruangan || "",
      kapasitas: initialData?.kapasitas?.toString() || "",
      gedung: initialData?.gedung || "",
      is_active: initialData?.is_active ?? true,
      is_online: initialData?.is_online ?? false,
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData && mode === "edit") {
        form.reset({
          nama_ruangan: initialData.nama_ruangan,
          kapasitas: initialData.kapasitas?.toString() || "",
          gedung: initialData.gedung || "",
          is_active: initialData.is_active,
          is_online: initialData.is_online ?? false,
        });
      } else if (mode === "add") {
        form.reset({ nama_ruangan: "", kapasitas: "", gedung: "", is_active: true, is_online: false });
      }
    }
  }, [initialData, mode, open, form]);

  const handleFormSubmit = async (data: FormData) => {
    if (!onSubmit) return;

    const formData: RuanganSidangFormData = {
      nama_ruangan: data.nama_ruangan,
      kapasitas: data.kapasitas ? parseInt(data.kapasitas, 10) : null,
      gedung: data.gedung || null,
      is_active: data.is_active,
      is_online: data.is_online,
    };

    try {
      await onSubmit(formData);
      setOpen(false);
    } catch (error) {
      console.error("[handleFormSubmit] Error:", error);
    }
  };

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Ruangan Sidang" : "Tambah Ruangan Sidang";
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
            <span className="ml-2">
              {isEditMode ? "Edit" : "Tambah Ruangan"}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
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
              name="nama_ruangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ruangan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama ruangan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gedung"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gedung</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama gedung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kapasitas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kapasitas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Masukkan kapasitas ruangan"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mb-0">Ruangan Aktif</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_online"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mb-0">Ruangan Online</FormLabel>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ruangan online (mis. Google Meet) bisa dipakai banyak sidang
                    di jam yang sama — tidak dicek bentrok ruangan, hanya bentrok dosen.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPopUp;