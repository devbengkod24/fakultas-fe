import { Mahasiswa } from "./mahasiswa";

export interface LogbookMahasiswa {
  mahasiswa: Mahasiswa;
  jml_bimbingan: number;
  bab_terakhir: number;
  folder_ta: string | null;
}

export interface LogbookEntry {
  logbooks_id: number;
  id_mhs: number;
  tanggal_dibuat: string;
  bab: number;
  uraian: string;
  dokumen: string | null;
  status: "pending" | "accepted" | "rejected";
  rejection_reason?: string;
}

export const data: LogbookMahasiswa[] = [
  {
    mahasiswa: {
      id: 312,
      nim: "A11.2021.13366",
      name: "ITSNA MAULANA HASAN",
      email: "111202113366@mhs.dinus.ac.id",
      photo: "",
      ipk: 3.81,
      no_telp: "081234567890",
      transkrip:
        "https://drive.google.com/file/d/1-Q7iqfL4ZlfsrjIOnp4V8-16ZX0PrSgb/view?usp=sharing",
      pengajuan: {
        jalur: "Publikasi",
        judul: "Memperkirakan kualitas udara dengan menggunakan algoritma machine learning",
        topik: "Machine Learning, Kebencanaan mengenai polusi udara",
        deskripsi: "Penelitian ini bertujuan untuk mengembangkan model prediktif yang dapat memperkirakan kualitas udara berdasarkan berbagai parameter lingkungan menggunakan algoritma machine learning. Dengan memanfaatkan data historis dan real-time, model ini diharapkan dapat memberikan peringatan dini tentang potensi polusi udara berbahaya.",
        bidang_kajian: "SC",
        minat: ["Machine Learning", "Publikasi", "Forecasting"],
        tanggal: ""
      },
    },
    jml_bimbingan: 9,
    bab_terakhir: 5,
    folder_ta:
      "https://drive.google.com/drive/folders/18Im0q23j2J-yQIJ5ldHHu_9bwzq8uS77Fv07mzcgX3MCthYjl_Wc5tKRa3dyXjufADh_0ZuS",
  },
  {
    mahasiswa: {
      id: 313,
      nim: "A11.2021.13367",
      name: "AHMAD FAUZI",
      photo: "",
    },
    jml_bimbingan: 6,
    bab_terakhir: 3,
    folder_ta: "https://drive.google.com/drive/folders/example1",
  },
  {
    mahasiswa: {
      id: 314,
      nim: "A11.2021.13368",
      name: "SITI NURHALIZA",
      photo: "",
    },
    jml_bimbingan: 4,
    bab_terakhir: 2,
    folder_ta: "https://drive.google.com/drive/folders/example2",
  },
];

export const logbookEntries: LogbookEntry[] = [
  // Multiple entries for Chapter 1
  {
    logbooks_id: 50,
    id_mhs: 312,
    tanggal_dibuat: "2025-01-17 09:05:40",
    bab: 1,
    uraian: "Bimbingan pertama kali untuk pembahasan topik yang diambil",
    dokumen:
      "https://drive.google.com/drive/folders/18Im0q23j2J-yQIJ5ldHHu_9bwzq8uS77Fv07mzcgX3MCthYjl_Wc5tKRa3dyXjufADh_0ZuS",
    status: "accepted",
  },
  {
    logbooks_id: 51,
    id_mhs: 312,
    tanggal_dibuat: "2025-01-20 14:30:00",
    bab: 1,
    uraian: "Revisi latar belakang dan rumusan masalah",
    dokumen:
      "https://drive.google.com/drive/folders/18Im0q23j2J-yQIJ5ldHHu_9bwzq8uS77Fv07mzcgX3MCthYjl_Wc5tKRa3dyXjufADh_0ZuS",
    status: "accepted",
  },

  // Multiple entries for Chapter 2
  {
    logbooks_id: 52,
    id_mhs: 312,
    tanggal_dibuat: "2025-01-24 09:06:30",
    bab: 2,
    uraian: "Bimbingan awal bab 2 tentang tinjauan pustaka",
    dokumen:
      "https://drive.google.com/drive/folders/18Im0q23j2J-yQIJ5ldHHu_9bwzq8uS77Fv07mzcgX3MCthYjl_Wc5tKRa3dyXjufADh_0ZuS",
    status: "accepted",
  },
  {
    logbooks_id: 53,
    id_mhs: 312,
    tanggal_dibuat: "2025-01-28 11:15:00",
    bab: 2,
    uraian: "Revisi tinjauan pustaka dan penambahan referensi",
    dokumen:
      "https://drive.google.com/drive/folders/18Im0q23j2J-yQIJ5ldHHu_9bwzq8uS77Fv07mzcgX3MCthYjl_Wc5tKRa3dyXjufADh_0ZuS",
    status: "accepted",
  },
  {
    logbooks_id: 54,
    id_mhs: 312,
    tanggal_dibuat: "2025-01-30 13:45:00",
    bab: 2,
    uraian: "Finalisasi bab 2 dan diskusi landasan teori",
    dokumen:
      "https://drive.google.com/drive/folders/18Im0q23j2J-yQIJ5ldHHu_9bwzq8uS77Fv07mzcgX3MCthYjl_Wc5tKRa3dyXjufADh_0ZuS",
    status: "accepted",
  },

  // Chapter 3
  {
    logbooks_id: 55,
    id_mhs: 312,
    tanggal_dibuat: "2025-02-01 09:07:04",
    bab: 3,
    uraian: "Bimbingan bab 3 untuk pendaftaran sidang TA 1",
    dokumen:
      "https://drive.google.com/drive/folders/18Im0q23j2J-yQIJ5ldHHu_9bwzq8uS77Fv07mzcgX3MCthYjl_Wc5tKRa3dyXjufADh_0ZuS",
    status: "accepted",
  },

  // Chapter 4
  {
    logbooks_id: 56,
    id_mhs: 312,
    tanggal_dibuat: "2025-02-15 10:15:22",
    bab: 4,
    uraian: "Bimbingan bab 4 mengenai hasil implementasi sistem",
    dokumen:
      "https://drive.google.com/drive/folders/18Im0q23j2J-yQIJ5ldHHu_9bwzq8uS77Fv07mzcgX3MCthYjl_Wc5tKRa3dyXjufADh_0ZuS",
    status: "accepted",
  },

  // Chapter 5
  {
    logbooks_id: 57,
    id_mhs: 312,
    tanggal_dibuat: "2025-03-01 11:30:45",
    bab: 5,
    uraian: "Bimbingan bab 5 mengenai kesimpulan dan saran",
    dokumen:
      "https://drive.google.com/drive/folders/18Im0q23j2J-yQIJ5ldHHu_9bwzq8uS77Fv07mzcgX3MCthYjl_Wc5tKRa3dyXjufADh_0ZuS",
    status: "pending",
  },

  // Student 313 entries
  {
    logbooks_id: 58,
    id_mhs: 313,
    tanggal_dibuat: "2025-01-20 13:45:10",
    bab: 1,
    uraian: "Diskusi awal mengenai topik penelitian",
    dokumen: "https://drive.google.com/drive/folders/example1",
    status: "accepted",
  },
  {
    logbooks_id: 59,
    id_mhs: 313,
    tanggal_dibuat: "2025-01-25 10:30:00",
    bab: 1,
    uraian: "Revisi latar belakang dan tujuan penelitian",
    dokumen: "https://drive.google.com/drive/folders/example1",
    status: "accepted",
  },
  {
    logbooks_id: 60,
    id_mhs: 313,
    tanggal_dibuat: "2025-02-05 14:20:30",
    bab: 2,
    uraian: "Review literatur dan metodologi penelitian",
    dokumen: "https://drive.google.com/drive/folders/example1",
    status: "accepted",
  },
  {
    logbooks_id: 61,
    id_mhs: 313,
    tanggal_dibuat: "2025-02-20 09:15:00",
    bab: 3,
    uraian: "Pembahasan desain sistem dan arsitektur",
    dokumen: "https://drive.google.com/drive/folders/example1",
    status: "pending",
  },
];
