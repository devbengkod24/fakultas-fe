import { z } from "zod";

export const pengumumanSchema = z.object({
  judul: z
    .string()
    .min(3, "Judul harus memiliki minimal 3 karakter")
    .max(255, "Judul tidak boleh lebih dari 255 karakter"),
  user: z.string().optional().default("Koordinator BK"),
  isi: z.string().min(10, "Isi pengumuman harus memiliki minimal 10 karakter"),
  type: z.string().optional().default("bk"),
});

export type PengumumanFormData = z.infer<typeof pengumumanSchema>;
