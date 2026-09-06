import ProfilDosenClient from "./profil-dosen-client";
import type { StrukturOrganisasi } from "@/types/admin/profile-page/struktur-organisasi/struktur-organisasi";
import ErrorState from "../../error-state";

interface StrukturOrganisasiSectionProps {
  strukturOrganisasi: StrukturOrganisasi[] | null;
  error?: string | null;
}

// Dummy data fallback
const dummyDosenData: StrukturOrganisasi[] = [
  {
    id: 1,
    order_no: "1",
    image:
      "/assets/landingpage/img/dosen/struktur-organisasi/dosen-edymul.webp",
    name: "Dr. EDY MULYANTO, S.SI., M.KOM.",
    position: "Ketua Program Studi",
  },
  {
    id: 2,
    order_no: "2",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2014.585.jpg",
    name: "EGIA ROSI SUBHIYAKTO, M.KOM",
    position: "Sekretaris Program Studi",
  },
  {
    id: 3,
    order_no: "3",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2013.532.jpg",
    name: "YANI PARTI ASTUTI, S.SI., M.KOM",
    position: "Koordinator Kerja Praktek",
  },
  {
    id: 4,
    order_no: "4",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2018.747.jpg",
    name: "NURUL ANISA S.W., MCS",
    position: "Koordinator MBKM",
  },
  {
    id: 5,
    order_no: "5",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2014.583.jpg",
    name: "DANANG WAHYU UTOMO, M.KOM",
    position: "Koordinator Tugas Akhir 1",
  },
  {
    id: 6,
    order_no: "6",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2013.536.jpg",
    name: "DEFRI KURNIAWAN, M.KOM",
    position: "Koordinator Tugas Akhir 2",
  },
  {
    id: 7,
    order_no: "7",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2012.444.jpg",
    name: "ADHITYA NUGRAHA, M.CS",
    position: "Koordinator Bengkel Koding",
  },
  {
    id: 8,
    order_no: "8",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2012.460.jpg",
    name: "ARDYTHA LUTHFIARTA, M.KOM",
    position: "Koordinator Program Unggulan",
  },
  {
    id: 9,
    order_no: "9",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2012.459.jpg",
    name: "JUNTA ZENIARJA, M.KOM",
    position: "Koordinator Bimbingan Karier",
  },
  {
    id: 10,
    order_no: "10",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2016.843.jpg",
    name: "WISE HEROWATI, M.KOM",
    position: "Koordinator Kemitraan dan Alumni",
  },
  {
    id: 11,
    order_no: "11",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.1997.141.jpg",
    name: "FERI AGUSTINA, M.KOM",
    position: "Koordinator Kajian RPLD",
  },
  {
    id: 12,
    order_no: "12",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2009.371.jpg",
    name: "HANNY HARYANTO, M.T",
    position: "Koordinator Kajian SC",
  },
  {
    id: 13,
    order_no: "13",
    image: "https://simpeg.dinus.ac.id/updir/small_med_0686.11.2016.659.jpg",
    name: "WILDANIL GHOZI, M.KOM",
    position: "Koordinator Kajian SKKD",
  },
];

export const revalidate = 86400; // 1 hari

const ProfilDosenSection = ({
  strukturOrganisasi,
  error,
}: StrukturOrganisasiSectionProps) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Struktur Organisasi"
        description="Terjadi kesalahan saat memuat data struktur organisasi. Silakan coba lagi."
      />
    );
  }

  // Jika data kosong/null, gunakan dummy
  const strukturOrganisasiToShow = strukturOrganisasi ?? dummyDosenData;

  return <ProfilDosenClient strukturOrganisasi={strukturOrganisasiToShow} />;
};

export default ProfilDosenSection;
