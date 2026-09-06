export interface Pengajuan {
  tanggal: string;
  jalur: string;
  judul: string;
  topik: string;
  deskripsi?: string;
  bidang_kajian: string;
  minat: string[];
}

export interface Mahasiswa {
  id: number;
  name: string;
  email?: string;
  nim: string;
  ipk?: number;
  photo?: string;
  no_telp?: string;
  transkrip?: string;
  pengajuan?: Pengajuan;
}

export const data: Mahasiswa[] = [
  {
    id: 924,
    name: "ANANABILLA RIZKY MUHARDANIE",
    email: "111202315502@mhs.dinus.ac.id",
    nim: "A11.2023.15502",
    ipk: 3.81,
    no_telp: "081234567890",
    transkrip:
      "https://drive.google.com/file/d/1-Q7iqfL4ZlfsrjIOnp4V8-16ZX0PrSgb/view?usp=sharing",
    pengajuan: {
      tanggal: "2023-10-01",
      jalur: "Publikasi",
      judul:
        "Memperkirakan kualitas udara dengan menggunakan algoritma machine learning",
      topik: "Machine Learning, Kebencanaan mengenai polusi udara",
      deskripsi:
        "Penelitian ini bertujuan untuk mengembangkan model prediktif yang dapat memperkirakan kualitas udara berdasarkan berbagai parameter lingkungan menggunakan algoritma machine learning. Dengan memanfaatkan data historis dan real-time, model ini diharapkan dapat memberikan peringatan dini tentang potensi polusi udara berbahaya.",
      bidang_kajian: "SC",
      minat: ["Machine Learning", "Publikasi", "Forecasting"],
    },
  },
  {
    id: 925,
    name: "BUDI SANTOSO",
    email: "111202315503@mhs.dinus.ac.id",
    nim: "A11.2023.15503",
    ipk: 3.65,
    no_telp: "081234567890",
    transkrip: "https://drive.google.com/file/d/example",
    pengajuan: {
      tanggal: "2025-03-12",
      jalur: "Reguler",
      judul:
        "Pengembangan Sistem Informasi Manajemen Perpustakaan Berbasis Web",
      topik: "Sistem Informasi, Perpustakaan Digital",
      deskripsi:
        "Penelitian ini bertujuan untuk mengembangkan sistem informasi manajemen perpustakaan yang dapat memudahkan pengelolaan koleksi buku, peminjaman, dan pengembalian dengan antarmuka yang user-friendly.",
      bidang_kajian: "RPLD",
      minat: ["Web Development", "Database", "UI/UX"],
    },
  },
  {
    id: 926,
    name: "CITRA DEWI",
    email: "111202315504@mhs.dinus.ac.id",
    nim: "A11.2023.15504",
    ipk: 3.92,
    no_telp: "081234567890",
    transkrip: "https://drive.google.com/file/d/example2",
    pengajuan: {
      tanggal: "2023-10-01",
      jalur: "Publikasi",
      judul:
        "Implementasi Deep Learning untuk Deteksi Penyakit pada Tanaman Padi",
      topik: "Computer Vision, Deep Learning, Pertanian",
      deskripsi:
        "Penelitian ini mengimplementasikan teknik deep learning untuk mendeteksi berbagai penyakit pada tanaman padi melalui analisis citra daun. Sistem ini diharapkan dapat membantu petani mengidentifikasi penyakit lebih awal.",
      bidang_kajian: "SC",
      minat: ["Deep Learning", "Computer Vision", "Agriculture Tech"],
    },
  },
];
