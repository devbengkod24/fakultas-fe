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
import { PlusCircle, Pencil, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// Pastikan path ini sesuai dengan letak komponen RichTextEditor kamu
import RichTextEditor from "@/components/rich-text-editor"; 
import { VisiMisi } from "@/types/fakultas/profile-page/visi-misi/visi-misi";

const formSchema = z.object({
  visi: z.string().min(10, "Visi harus memiliki minimal 10 karakter"),
  misi: z.string().min(10, "Misi harus memiliki minimal 10 karakter"),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: VisiMisi;
  onSubmit?: (data: VisiMisi) => Promise<void>;
  trigger?: React.ReactNode;
}

const DialogPopUp: React.FC<DialogPopUpProps> = ({
  mode = "add",
  initialData,
  onSubmit,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Visi Misi Fakultas" : "Tambah Visi Misi Fakultas";
  const buttonText = isEditMode ? "Perbarui" : "Simpan";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visi: "",
      misi: "",
    },
  });

  // Reset form when dialog opens/closes or initialData changes
  React.useEffect(() => {
    if (open) {
      if (isEditMode && initialData) {
        form.reset({
          visi: initialData.visi || "",
          misi: Array.isArray(initialData.misi) 
            ? initialData.misi.join("") 
            : (initialData.misi || ""),
        });
      } else {
        form.reset({
          visi: "",
          misi: "",
        });
      }
    }
  }, [initialData, open, isEditMode, form]);

  const handleFormSubmit = async (data: FormData) => {
    if (!onSubmit) return;
    setIsSubmitting(true);

    try {
      const submitData: VisiMisi = {
        ...data,
        id: initialData?.id, // Kirim undefined jika tambah baru, agar backend auto-generate ID
      };

      await onSubmit(submitData);
      setOpen(false); // Tutup dialog jika sukses
    } catch (error) {
      console.error("Gagal mensubmit Visi Misi:", error);
    } finally {
      setIsSubmitting(false); // Matikan loading state terlepas dari sukses/gagal
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={isEditMode ? "outline" : "default"}
            className={isEditMode ? "" : "gap-2"}
          >
            {isEditMode ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                <span>Tambah Visi Misi Fakultas</span>
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      
      {/* Menggunakan max-w-4xl agar editor teks lebih luas dan nyaman digunakan */}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Visi */}
            <FormField
              control={form.control}
              name="visi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Visi Fakultas</FormLabel>
                  <FormControl>
                    <div className="border rounded-md overflow-hidden bg-white">
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        className="min-h-[150px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Misi */}
            <FormField
              control={form.control}
              name="misi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Misi Fakultas</FormLabel>
                  <FormControl>
                     <div className="border rounded-md overflow-hidden bg-white">
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          className="min-h-[200px]"
                        />
                     </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="w-32"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan
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