export interface Periode {
  id: number
  kode_periode: string
  tahun_ajaran: string
  tgl_awal?: string
  tgl_akhir?: string
  alokasi_kuota?: number
  status?: number
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

export interface PeriodeUpdate {
  tgl_awal: string
  tgl_akhir: string
  tahun_ajaran: string
  alokasi_kuota: number
}

export interface PeriodeData {
  tgl_awal: string
  tgl_akhir: string
}