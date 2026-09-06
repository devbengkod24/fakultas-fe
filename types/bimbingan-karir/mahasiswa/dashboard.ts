export type StudentInfo = {
  informasi_mahasiswa: {
    periode: {
      id: number
      tahun_ajaran: string
    }
    nilai_akhir: string
    progress_kegiatan: {
      kegiatan_diikuti: number
      total_kegiatan: number
    }
  }
  kegiatan_terdekat: {
    nama_kegiatan: string
    hari_mundur: number
  } | null
}

export type StudentInfoProps = {
  data: StudentInfo | null
}