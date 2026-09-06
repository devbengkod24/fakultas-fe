import { z } from "zod";

export const fixedCategories = ["seminar", "toefl", "workshop", "softskill", "lsp"] as const;
export type Kategori = typeof fixedCategories[number];

// Aman untuk lingkungan SSR (Next.js): cek instance File jika tersedia
const isFileLike = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File;

export const PdfFileSchema = z.custom<File>((v) => {
  if (!isFileLike(v)) return false;
  return v.type === "application/pdf";
}, { message: "Hanya file PDF yang diperbolehkan" });

export const EditAddSchema = z.object({
  nama_kegiatan: z.string().trim().min(1, { message: "Judul wajib diisi" }),
  deskripsi: z.string().trim().optional().or(z.literal("")),
  pengajar_id: z.coerce.number({ required_error: "Pengajar wajib diisi" }).min(1, { message: "Pengajar wajib diisi" }),
  mahasiswa_ids: z.array(z.coerce.number()).optional().default([]),
  lokasi: z.string().trim().min(1, { message: "Lokasi wajib diisi" }),
  kategori: z.enum(fixedCategories, { required_error: "Kategori wajib dipilih" }),

  // Link WA opsional, boleh kosong atau URL valid
  link_grup_wa: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.string().url({ message: "URL tidak valid" }).optional()),

  // Date & time
  tanggal_mulai: z.date({ required_error: "Tanggal mulai wajib diisi" }),
  tanggal_selesai: z.date({ required_error: "Tanggal selesai wajib diisi" }),

  // Files
  existingPdfs: z.array(z.string().url()).default([]),
  uploadedPdfs: z.array(PdfFileSchema).default([]),

  // Optional: daftar file yang dihapus saat edit (URL)
  removedPdfs: z.array(z.string().url()).default([]),
}).refine(
  (v) => v.tanggal_selesai.getTime() >= v.tanggal_mulai.getTime(),
  { path: ["tanggal_selesai"], message: "Tanggal selesai harus sesudah atau sama dengan tanggal mulai" }
);

export type EditAddForm = z.infer<typeof EditAddSchema>;