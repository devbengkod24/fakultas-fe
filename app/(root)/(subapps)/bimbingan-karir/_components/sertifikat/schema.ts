import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const sertifikatSchema = z.object({
  nama_template: z
    .string()
    .min(1, "Nama template wajib diisi")
    .min(3, "Nama template minimal 3 karakter")
    .max(100, "Nama template maksimal 100 karakter"),
  
  file_path: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran file maksimal 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Format file harus PNG, JPG, atau JPEG"
    )
    .or(z.string().min(1, "File template wajib diupload")),
});

export type SertifikatFormData = z.infer<typeof sertifikatSchema>;