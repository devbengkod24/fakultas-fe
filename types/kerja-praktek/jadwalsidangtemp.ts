// Define shared types for the Jadwal Sidang components
export type StudentStatus = "Lulus" | "Tidak Lulus"

export interface StudentData {
  id: string
  status: StudentStatus
  nim: string
  nama: string
  tanggal: string
  waktu: string
  statuspenilaian: string
}

export interface StudentDetail {
  nama: string
  nim: string
  judul: string
  nilaiPenyelia: number
  nilaiPembimbing: number
  nilaiPenguji: number
  laporanUrl: string
  penilaianUrl: string
}