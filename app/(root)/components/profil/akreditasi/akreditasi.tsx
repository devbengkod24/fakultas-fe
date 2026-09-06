import AkreditasiClient from "./akreditasi-client";
import type { Akreditasi } from "@/types/admin/profile-page/akreditasi/akreditasi";
import ErrorState from "../../error-state";

interface AkreditasiSectionProps {
  akreditasi: Akreditasi[] | null;
  error?: string | null;
}

// Dummy data fallback
const dummyAkreditasiData: Akreditasi[] = [
  {
    id: 1,
    title: "Akreditasi BAN-PT",
    description:
      "Terakreditasi Unggul oleh Badan Akreditasi Nasional Perguruan Tinggi",
    accred: "Unggul",
    image: "/assets/landingpage/img/akreditasi/ban-pt.jpeg",
  },
  {
    id: 2,
    title: "Akreditasi Internasional",
    description:
      "Terakreditasi oleh Indonesian Accreditation Board for Engineering Education",
    accred: "Internasional",
    image: "/assets/landingpage/img/akreditasi/internasional.jpg",
  },
];

export const revalidate = 86400; // 1 hari

const AkreditasiSection = ({ akreditasi, error }: AkreditasiSectionProps) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Akreditasi"
        description="Terjadi kesalahan saat memuat data akreditasi. Silakan coba lagi."
      />
    );
  }

  // Jika data kosong/null, gunakan dummy
  const akreditasiToShow = akreditasi ?? dummyAkreditasiData;

  return <AkreditasiClient akreditasi={akreditasiToShow} />;
};

export default AkreditasiSection;
