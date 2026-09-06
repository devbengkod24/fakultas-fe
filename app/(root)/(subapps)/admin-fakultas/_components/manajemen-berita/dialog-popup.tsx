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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Pencil, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RichTextEditor from "@/components/rich-text-editor";
import type {
  Berita,
  BeritaFormData,
} from "@/types/admin-fakultas/manajemen-berita/berita";
import { API_URL, IMAGE_URL } from "@/lib/constant";

const formSchema = z.object({
  tipe: z.enum(["prestasi", "kegiatan", "berita"], {
    required_error: "Tipe harus dipilih",
  }),
  judul: z.string().min(1, "Judul harus diisi"),
  konten: z.string().min(1, "Konten harus diisi"),
  gambar: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: Berita;
  onSubmit?: (data: BeritaFormData & { gambarFile?: File }) => Promise<void>;
  trigger?: React.ReactNode;
}

const resolvePreviewImageUrl = (
  src: string | undefined | null,
): string | null => {
  if (!src) return null;

  const value = src.trim();
  if (!value || value === "null" || value === "undefined") return null;

  if (value.startsWith("data:image/")) return value;

  try {
    const absolute = new URL(value);
    if (absolute.protocol === "http:" || absolute.protocol === "https:") {
      return absolute.toString();
    }
    return null;
  } catch {
    // Continue with relative URL handling.
  }

  const normalizedPath = value.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalizedPath) return null;

  const apiRoot =
    API_URL?.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "") || "";

  if (
    /^(berita_images|storage|foto-profil|mitra-logo)\//i.test(normalizedPath)
  ) {
    const mediaCandidates: string[] = [];

    if (IMAGE_URL) {
      mediaCandidates.push(
        `${IMAGE_URL.replace(/\/+$/, "")}/${normalizedPath}`,
      );
    }

    if (apiRoot) {
      if (normalizedPath.startsWith("storage/")) {
        mediaCandidates.push(`${apiRoot}/${normalizedPath}`);
      } else {
        mediaCandidates.push(`${apiRoot}/storage/${normalizedPath}`);
        mediaCandidates.push(`${apiRoot}/${normalizedPath}`);
      }
    }

    for (const candidate of mediaCandidates) {
      try {
        const resolved = new URL(candidate);
        if (resolved.protocol === "http:" || resolved.protocol === "https:") {
          return resolved.toString();
        }
      } catch {
        // try next candidate
      }
    }
  }

  const baseCandidates = [IMAGE_URL, apiRoot, API_URL].filter(
    (base): base is string => !!base,
  );

  for (const base of baseCandidates) {
    const cleanBase = base.replace(/\/+$/, "");
    const hasStorageSuffix = /\/storage$/i.test(cleanBase);

    const withStoragePath = normalizedPath.startsWith("storage/")
      ? normalizedPath.replace(/^storage\//, "")
      : normalizedPath;

    const candidate = hasStorageSuffix
      ? `${cleanBase}/${withStoragePath}`
      : normalizedPath.startsWith("storage/")
        ? `${cleanBase}/${normalizedPath}`
        : `${cleanBase}/storage/${withStoragePath}`;

    try {
      const resolved = new URL(candidate);
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        return resolved.toString();
      }
    } catch {
      // Try next base candidate.
    }
  }

  return `/${normalizedPath}`;
};

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
      tipe: initialData?.tipe || undefined,
      judul: initialData?.judul || "",
      konten: initialData?.konten || "",
      gambar: initialData?.gambar || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData && mode === "edit") {
        form.reset({
          tipe: initialData.tipe,
          judul: initialData.judul || "",
          konten: initialData.konten || "",
          gambar: initialData.gambar || "",
        });
        setPreviewImage(initialData.gambar || "");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else if (mode === "add") {
        form.reset({ tipe: undefined, judul: "", konten: "", gambar: "" });
        setPreviewImage("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
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
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        if (fileInputRef.current) fileInputRef.current.value = "";
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

    const formData = {
      tipe: data.tipe,
      judul: data.judul,
      konten: data.konten,
      gambar:
        mode === "edit" && !selectedFile
          ? initialData?.gambar || ""
          : previewImage,
      gambarFile: selectedFile || undefined,
    };

    console.log("[handleFormSubmit] Submitting:", {
      tipe: formData.tipe,
      judul: formData.judul,
      hasGameFile: !!formData.gambarFile,
      kontenLength: formData.konten.length,
    });

    try {
      await onSubmit(formData);
      console.log("[handleFormSubmit] Success!");
      setOpen(false);
    } catch (error) {
      console.error("[handleFormSubmit] Error:", error);
    }
  };

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Berita" : "Tambah Berita";
  const buttonText = isEditMode ? "Perbarui" : "Simpan";
  const previewImageSrc = resolvePreviewImageUrl(previewImage);

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
              {isEditMode ? "Edit" : "Tambah Berita"}
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
              name="judul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan judul berita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe berita" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="prestasi">Prestasi</SelectItem>
                      <SelectItem value="kegiatan">Kegiatan</SelectItem>
                      <SelectItem value="berita">Berita</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gambar"
              render={() => (
                <FormItem>
                  <FormLabel>Gambar</FormLabel>
                  <p className="text-sm text-gray-500 mb-2">
                    Format: JPG, PNG{webpSupported ? ", WebP" : ""} (Maksimal
                    5MB)
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
                  {previewImageSrc && (
                    <div className="mt-2">
                      <img
                        src={previewImageSrc}
                        alt="Preview"
                        width={200}
                        height={120}
                        className="max-h-30 rounded border object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="konten"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten</FormLabel>
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
