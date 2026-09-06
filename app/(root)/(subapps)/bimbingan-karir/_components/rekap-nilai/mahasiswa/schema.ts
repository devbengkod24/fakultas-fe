import { z } from "zod";

export const feedbackSchema = z.object({
  komentar: z
    .string()
    .min(10, "Komentar harus memiliki minimal 10 karakter")
    .max(500, "Komentar tidak boleh lebih dari 500 karakter"),
  rating: z
    .number()
    .min(1, "Rating harus minimal 1 bintang")
    .max(5, "Rating maksimal 5 bintang"),
  kegiatan_id: z.number(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;