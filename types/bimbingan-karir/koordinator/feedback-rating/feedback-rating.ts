export interface FeedbackRating {
  id: number;
  rating: number;
  komentar: string;
  tanggal_kirim?: string; // jika backend ada timestamp
  mahasiswa: {
    id: number;
    nama_mahasiswa: string;
    nim: string;
  };
  kegiatan_name: string;
}
