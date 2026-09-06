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
import { SambutanDekan } from "@/types/admin-fakultas/sambutan-dekan/sambutan-dekan";
import { handleToastResponse } from "@/lib/toast-response";

const formSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  paragraph: z.string().min(1, "Kata sambutan harus diisi"),
  image: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: SambutanDekan;
  onSubmit?: (data: SambutanDekan & { imageFile?: File }) => Promise<void>;
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
    initialData?.image || "",
  );
  const [webpSupported, setWebpSupported] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Check WebP support
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
      name: initialData?.name || "",
      paragraph: initialData?.paragraph || "",
      image: initialData?.image || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData && mode === "edit") {
        form.reset({
          name: initialData.name || "",
          paragraph: initialData?.paragraph || "",
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
          paragraph: "",
          image: "",
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
      // Validate file type
      const allowedTypes = webpSupported
        ? ["image/jpeg", "image/png", "image/webp"]
        : ["image/jpeg", "image/png"];

      // Additional check for file extension as backup
      const allowedExtensions = webpSupported
        ? [".jpg", ".jpeg", ".png", ".webp"]
        : [".jpg", ".jpeg", ".png"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      // Check if file is valid (either by MIME type OR file extension)
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

      // Validate file size (optional - max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
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

    const formData: SambutanDekan & { imageFile?: File } = {
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
  const title = isEditMode ? "Edit Kata Sambutan" : "Tambah Kata Sambutan";
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
              {isEditMode ? "Edit" : "Tambah Kata Sambutan Dekan"}
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
                  <FormLabel>Gambar Dekan</FormLabel>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Dekan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama Dekan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paragraph"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sambutan Dekan</FormLabel>
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
