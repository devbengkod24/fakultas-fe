export interface PublikasiSync {
  id: number;
  judul: string;
  jurnal: string;
  penulis: string;
  tahun: number;
  sitasi: number;
  akreditasi: string[];
}

export interface PenelitianSync {
  id: number;
  judul: string;
  ketua: string;
  tahun: number;
  sumber_dana: string;
  status: string;
}

export const INITIAL_MOCK_PUBLIKASI: PublikasiSync[] = [
  {
    id: 1,
    judul: "Developing an Integrated Capital Assistance Model for Small Business",
    jurnal: "Sinkron: jurnal dan penelitian teknik informatika",
    penulis: "GALUH WILUJENG SARASWATI",
    tahun: 2026,
    sitasi: 0,
    akreditasi: ["GOOGLE_SCHOLAR"],
  },
  {
    id: 2,
    judul: "Evaluasi Dampak Pelatihan Portofolio Digital",
    jurnal: "BERNAS: Jurnal Pengabdian Kepada Masyarakat",
    penulis: "HARUN AL AZIES, T SUTOJO",
    tahun: 2026,
    sitasi: 0,
    akreditasi: ["Sinta 4", "GARUDA"],
  },
  {
    id: 3,
    judul: "Comparative Evaluation of Rule-Based and Machine Learning Approaches",
    jurnal: "Sinkron: jurnal dan penelitian teknik informatika",
    penulis: "GALUH WILUJENG SARASWATI",
    tahun: 2026,
    sitasi: 0,
    akreditasi: ["GOOGLE_SCHOLAR"],
  },
];

export const SYNCABLE_PUBLIKASI: PublikasiSync[] = [
  {
    id: 4,
    judul: "Decision Support System (DSS) for Rodent Pest Detection",
    jurnal: "Sinkron: jurnal dan penelitian teknik informatika",
    penulis: "GALUH WILUJENG SARASWATI",
    tahun: 2026,
    sitasi: 0,
    akreditasi: ["GOOGLE_SCHOLAR"],
  },
  {
    id: 5,
    judul: "PERBANDINGAN KINERJA SVM DAN BERT untuk Klasifikasi Teks",
    jurnal: "Rabit: Jurnal Teknologi dan Sistem Informasi",
    penulis: "NURUL ANISA SRI WINARSIH",
    tahun: 2026,
    sitasi: 0,
    akreditasi: ["GOOGLE_SCHOLAR"],
  },
];

export const INITIAL_MOCK_PENELITIAN: PenelitianSync[] = [
  {
    id: 1,
    judul: "Pengembangan Model Prediksi Curah Hujan Berbasis IoT dan AI",
    ketua: "HERU LESTIAWAN",
    tahun: 2025,
    sumber_dana: "SIMLITABMAS",
    status: "Approved",
  },
  {
    id: 2,
    judul: "Riset Ketahanan Siber pada Infrastruktur Jaringan Kampus",
    ketua: "ADHITYA NUGRAHA",
    tahun: 2024,
    sumber_dana: "INTERNAL_SOURCE",
    status: "Approved",
  },
];

export const SYNCABLE_PENELITIAN: PenelitianSync[] = [
  {
    id: 3,
    judul: "Analisis Big Data untuk Deteksi Dini Wabah Penyakit",
    ketua: "EDI FAISAL",
    tahun: 2025,
    sumber_dana: "BIMA_SOURCE",
    status: "Approved",
  },
];