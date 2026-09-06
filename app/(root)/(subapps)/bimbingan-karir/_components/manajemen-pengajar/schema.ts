import { z } from "zod"

// Schema untuk form manual
export const addDosenManualSchema = z.object({
  name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
})

// Schema untuk pilih dari list
export const addDosenFromListSchema = z.object({
  selectedDosen: z
    .string()
    .min(1, "Pilih salah satu dosen dari list"),
})

export type AddDosenManualFormData = z.infer<typeof addDosenManualSchema>
export type AddDosenFromListFormData = z.infer<typeof addDosenFromListSchema>