export interface Activity {
  id: number
  nama_kegiatan: string
  deskripsi: string
  tanggal_mulai: Date
  tanggal_selesai: Date
  lokasi: string
  kategori: string
  waktu_mulai: string | null
  waktu_selesai: string | null
  pengajar_id: number
  pengajar?: { id: number; name: string }
  nilai_mentah: string
  nilai: number
  status_sertifikat: string
  is_presensi?: boolean
  is_feedback?: boolean
  status_izin?: string | null
  link_grup_wa?: string
  file_pdf?: File[] | string[]
  poster?: string | File
  batas_waktu_izin?: Date | string | null
  feedback?: string | null
  status_kehadiran: string
}