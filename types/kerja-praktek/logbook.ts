export interface Logbook {
  kerja_praktek_id?: number;
  mahasiswa_id?: number;
  name?: string;
  nim?: string;
  bab_terakhir?: number;
  total_bimbingan?: number;
  progress?: string; // For now string dulu, bram blm push staging
  link_folder?: string;
  status?: string;
  hasUnapprovedLogbook?: boolean;
}

export interface LogbookEntry {
  logbooks_id: number;
  id_mhs: number;
  tanggal_dibuat: string;
  bab: number;
  uraian: string;
  dokumen: string | null;
  status: "pending" | "revised" | "accepted";
  rejection_reason?: string;
}

export interface LogbookForm {
  tanggal: string;
  bab: number;
  uraian: string;
  dokumen: string;
}