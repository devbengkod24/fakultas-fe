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
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil } from "lucide-react";
import type { StrukturOrganisasi } from "@/types/fakultas/profile-page/struktur-organisasi/struktur-organisasi";
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

const formSchema = z.object({
  name: z.string().min(1, "Nama dosen harus diisi"),
  position: z.string().min(1, "Jabatan dosen harus diisi"),
  order_no: z.union([z.string(), z.number()]).refine(val => val !== "" && val !== undefined, {
    message: "Nomor urut harus diisi",
  }).transform(val => val.toString()),
  image: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: StrukturOrganisasi;
  onSubmit?: (data: StrukturOrganisasi & { imageFile?: File }) => Promise<void>;
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
    initialData?.image || ""
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      position: initialData?.position || "",
      order_no: initialData?.order_no || "",
      image: initialData?.image || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData && mode === "edit") {
        form.reset({
          name: initialData.name || "",
          position: initialData.position || "",
          order_no: initialData.order_no || "",
          image: initialData.image || "",
        });
        setPreviewImage(initialData.image || "");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else if (mode === "add") {
        form.reset({
          name: "",
          position: "",
          order_no: "",
          image: "",
        });
        setPreviewImage("");
        setSelectedFile(null);
      }
    }
  }, [initialData, mode, open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - accept all common image formats
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      // Additional check for file extension as backup
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      // Check if file is valid (either by MIME type OR file extension)
      const isValidType = allowedTypes.includes(file.type);
      const isValidExtension = allowedExtensions.includes(fileExtension);

      if (!isValidType && !isValidExtension) {
        e.target.value = "";
        return;
      }

      // Validate file size - maximum 5MB
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // File was cleared
      setSelectedFile(null);
      setPreviewImage(mode === "edit" ? initialData?.image || "" : "");
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!onSubmit) return;

    if (mode === "add" && !selectedFile) {
      form.setError("image", { message: "Foto harus diunggah" });
      return;
    }

    const formData: StrukturOrganisasi & { imageFile?: File } = {
      ...data,
      id: initialData?.id || undefined,
      image:
        mode === "edit" && !selectedFile
          ? initialData?.image || ""
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
  const title = isEditMode
    ? "Edit Struktur Organisasi Fakultas"
    : "Tambah Struktur Organisasi Fakultas";
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
            <span>
              {isEditMode ? "Edit" : "Tambah Struktur Organisasi Fakultas"}
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
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Foto Dosen</FormLabel>

                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                  {previewImage && (
                    <div className="mt-2">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={200}
                        height={150}
                        className="object-cover rounded border"
                        style={{ maxHeight: "150px", width: "auto" }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Dosen</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama dosen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan Dosen</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan jabatan dosen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Urut</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan nomor urut"
                      {...field}
                    />
                  </FormControl>
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
