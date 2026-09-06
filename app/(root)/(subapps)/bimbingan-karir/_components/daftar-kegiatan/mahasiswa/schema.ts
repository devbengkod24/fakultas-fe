import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

export const feedbackSchema = z.object({
  komentar: z
    .string()
    .min(5, "Komentar harus memiliki minimal 5 karakter")
    .max(500, "Komentar tidak boleh lebih dari 500 karakter"),
  rating: z
    .number()
    .min(1, "Rating harus minimal 1 bintang")
    .max(5, "Rating maksimal 5 bintang"),
  kegiatan_id: z.number(),
});


export const izinSchema = z.object({
  kegiatan_id: z.string(),
  alasan: z
    .string()
    .min(10, "Alasan izin harus memiliki minimal 10 karakter")
    .max(500, "Alasan izin tidak boleh lebih dari 500 karakter"),
  bukti_izin: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran file maksimal 2MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Tipe file tidak valid. Hanya JPG, JPEG, PNG, atau PDF yang diperbolehkan"
    )
    .optional(),
});

export type IzinFormData = z.infer<typeof izinSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;