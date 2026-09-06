export interface Activity {
  id: number
  nama_kegiatan: string
  deskripsi: string
  tanggal_mulai: Date
  tanggal_selesai: Date
  waktu_mulai: Date
  waktu_selesai: Date
  lokasi: string
  kategori: string
  pengajar_id: number
  pengajar?: { id: number; name: string }
  mahasiswa_ids?: number[]
  mahasiswas?: { id: number; nim: string; user?: { name: string } }[]
  link_grup_wa?: string
  file_pdf?: (File | string)[]
  poster?: File | string
  batas_waktu_izin?: Date
}

export interface IzinPresensi {
  id: number
  nama: string
  alasan: string
  bukti_izin: string | null
  status: "menunggu" | "disetujui" | "ditolak"
}