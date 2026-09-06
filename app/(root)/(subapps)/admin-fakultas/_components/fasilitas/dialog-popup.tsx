"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import RichTextEditor from "@/components/rich-text-editor";
import { FasilitasFakultas } from "@/types/admin-fakultas/fasilitas/fasilitas";
import { handleToastResponse } from "@/lib/toast-response";

const formSchema = z.object({
  judul: z.string().min(1, "Judul fasilitas harus diisi"),
  deskripsi: z.string().min(1, "Deskripsi fasilitas harus diisi"),
  gambar: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: FasilitasFakultas;
  onSubmit?: (data: FasilitasFakultas & { imageFile?: File }) => Promise<void>;
  trigger?: React.ReactNode;
}

const DialogPopUp: React.FC<DialogPopUpProps> = ({
  mode = "add",
  initialData,
  onSubmit,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string>(
    initialData?.gambar || "",
  );
  const [webpSupported, setWebpSupported] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL("image/webp").indexOf("image/webp") === 5;
    };

    setWebpSupported(checkWebPSupport());
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: initialData?.judul || "",
      deskripsi: initialData?.deskripsi || "",
      gambar: initialData?.gambar || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData && mode === "edit") {
        form.reset({
          judul: initialData.judul || "",
          deskripsi: initialData?.deskripsi || "",
          gambar: initialData.gambar || "",
        });
        setPreviewImage(initialData.gambar || "");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else if (mode === "add") {
        form.reset({
          judul: "",
          deskripsi: "",
          gambar: "",
        });
        setPreviewImage("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  }, [initialData, mode, open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = webpSupported
        ? ["image/jpeg", "image/png", "image/webp"]
        : ["image/jpeg", "image/png"];

      const allowedExtensions = webpSupported
        ? [".jpg", ".jpeg", ".png", ".webp"]
        : [".jpg", ".jpeg", ".png"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      const isValidType = allowedTypes.includes(file.type);
      const isValidExtension = allowedExtensions.includes(fileExtension);

      if (!isValidType && !isValidExtension) {
        handleToastResponse({
          success: false,
          message: webpSupported
            ? "Format file tidak didukung. Gunakan format JPG, PNG, atau WebP"
            : "Format file tidak didukung. Gunakan format JPG atau PNG",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        handleToastResponse({
          success: false,
          message: "Ukuran file terlalu besar. Maksimal 5MB",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewImage(mode === "edit" ? initialData?.gambar || "" : "");
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!onSubmit) return;

    const formData: FasilitasFakultas & { imageFile?: File } = {
      ...data,
      id: initialData?.id || undefined,
      gambar:
        mode === "edit" && !selectedFile
          ? initialData?.gambar || ""
          : previewImage,
      imageFile: selectedFile || undefined,
    };

    try {
      await onSubmit(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Fasilitas" : "Tambah Fasilitas";
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
              {isEditMode ? "Edit" : "Tambah Fasilitas"}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              name="gambar"
              render={() => (
                <FormItem>
                  <FormLabel>Gambar Fasilitas</FormLabel>
                  <p className="text-sm text-gray-500 mb-2">
                    Format yang didukung: JPG, PNG
                    {webpSupported ? ", WebP" : ""} (Maksimal 5MB)
                    {!webpSupported && (
                      <span className="text-amber-600">
                        {" "}
                        - WebP tidak didukung di browser ini
                      </span>
                    )}
                  </p>
                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept={
                        webpSupported
                          ? "image/jpeg,image/png,image/webp"
                          : "image/jpeg,image/png"
                      }
                      onChange={handleFileChange}
                      required={!isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                  {previewImage && (
                    <div className="mt-2">
                      <Image
                         src={previewImage || "/placeholder.svg"}
                        alt="Preview"
                        width={160}
                        height={200}
                        className="max-h-60 rounded border object-cover"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="judul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Fasilitas</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan judul fasilitas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Fasilitas</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      className="min-h-[200px]"
                    />
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
              >
                Batal
              </Button>
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
