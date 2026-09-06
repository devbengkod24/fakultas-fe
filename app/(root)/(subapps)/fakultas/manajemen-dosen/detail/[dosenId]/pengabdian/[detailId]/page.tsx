import DashboardHeader from "@/components/dashboard-header";
import { PengabdianDetailClient } from "./pengabdian-dosen-client";

interface Props {
  params: Promise<{ id: string; pengabdianId: string }>;
}

const dummyPengabdian = [
  {
    id: 1,
    judul: "Pelatihan Digital Marketing untuk UMKM Desa Sukamaju",
    abstrak:
      "Kegiatan pengabdian ini bertujuan meningkatkan kapasitas pelaku UMKM di Desa Sukamaju dalam memanfaatkan platform digital untuk pemasaran produk. Pelatihan meliputi penggunaan media sosial, marketplace online, dan pembuatan konten yang efektif. Sebanyak 45 pelaku usaha mengikuti program selama tiga hari dengan metode workshop dan pendampingan langsung.",
    lokasi: "Desa Sukamaju, Jawa Barat",
    mitra: "Pemerintah Desa Sukamaju & Dinas Koperasi Kab. Bandung",
    tahun: "2023",
    sumberDana: "Hibah PKM Dikti",
    besarDana: "Rp 25.000.000",
    label: "Pengabdian",
    anggota: [
      { nama: "Dr. Ahmad Fauzi, M.Kom.", peran: "Ketua Pelaksana" },
      { nama: "Siti Rahayu, M.T.", peran: "Anggota" },
      { nama: "Mahasiswa TI — 3 orang", peran: "Asisten" },
    ],
    luaran: ["Laporan Akhir PKM", "Artikel Pengabdian Sinta 4", "Modul Pelatihan Digital Marketing"],
    peserta: 45,
    status: "Selesai",
  },
  {
    id: 2,
    judul: "Sosialisasi Cyber Security untuk Guru SMA Negeri 1",
    abstrak:
      "Program ini menyasar guru-guru SMA Negeri 1 Bandung dalam meningkatkan kesadaran dan kemampuan menghadapi ancaman siber. Materi meliputi phishing, social engineering, keamanan akun digital, dan perlindungan data pribadi. Kegiatan dilaksanakan dalam format seminar dan simulasi serangan siber berbasis skenario nyata.",
    lokasi: "SMA Negeri 1 Bandung",
    mitra: "SMA Negeri 1 Bandung",
    tahun: "2022",
    sumberDana: "Dana Mandiri Universitas",
    besarDana: "Rp 15.000.000",
    label: "Pengabdian",
    anggota: [
      { nama: "Dr. Ahmad Fauzi, M.Kom.", peran: "Ketua Pelaksana" },
      { nama: "Eko Prasetyo, M.Sc.", peran: "Anggota" },
    ],
    luaran: ["Laporan Kegiatan", "Materi Sosialisasi (PDF)"],
    peserta: 62,
    status: "Selesai",
  },
  {
    id: 3,
    judul: "Workshop Programming untuk Siswa SMKN 3",
    abstrak:
      "Workshop ini dirancang untuk membekali siswa SMKN 3 Jakarta dengan keterampilan dasar pemrograman Python dan logika komputasional. Peserta diajak membuat proyek sederhana berbasis automasi dan web scraping. Kegiatan ini merupakan bagian dari program link-and-match antara universitas dan sekolah kejuruan.",
    lokasi: "SMKN 3 Jakarta",
    mitra: "SMKN 3 Jakarta & Dinas Pendidikan DKI Jakarta",
    tahun: "2022",
    sumberDana: "Hibah Internal Universitas",
    besarDana: "Rp 20.000.000",
    label: "Pengabdian",
    anggota: [
      { nama: "Dr. Ahmad Fauzi, M.Kom.", peran: "Ketua Pelaksana" },
      { nama: "Dewi Anggraeni, M.Kom.", peran: "Anggota" },
      { nama: "Mahasiswa TI — 5 orang", peran: "Asisten" },
    ],
    luaran: ["Laporan Akhir", "Modul Python Dasar", "Artikel Pengabdian"],
    peserta: 80,
    status: "Selesai",
  },
];

export default async function PengabdianDetailPage({ params }: Props) {
  const { id: dosenId, pengabdianId } = await params;
  const pengabdian = dummyPengabdian.find((p) => p.id === Number(pengabdianId));

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Manajemen Dosen", url: "/fakultas/manajemen-dosen" },
          { name: "Detail Dosen", url: `/fakultas/manajemen-dosen/detail/${dosenId}` },
          { name: "Detail Pengabdian", url: "#" },
        ]}
        titleItems={[{ title: "Detail Pengabdian" }]}
      />
      <div className="mt-4">
        <PengabdianDetailClient pengabdian={pengabdian ?? null} dosenId={dosenId} />
      </div>
    </div>
  );
}