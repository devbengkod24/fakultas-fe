import PengertianClient from "./pengertian-client";
import type { Pengertian } from "@/types/admin/profile-page/pengertian/pengertian";
import ErrorState from "../../error-state";

interface PengertianSectionProps {
  pengertian: Pengertian | null;
  error?: string | null;
}

// Dummy data fallback
const dummyPengertian: Pengertian = {
  id: 1,
  pengertian:
    "PS-STI UDINUS memiliki dasar hukum dan legitimasi dari SK Dirjen Dikti Nomor 010/D/O/1994. Keputusan ini menjadi landasan resmi untuk penyelenggaraan program pendidikan tinggi di bidang Teknik Informatika. Melalui SK BAN-PT Nomor 042/BAN-PT/Ak-XIII/S1/I/2011, PS-STI mendapatkan status akreditasi B dan menunjukkan komitmen dalam menjaga dan meningkatkan kualitas pendidikan. Pada tahun 2015, PS-STI memperoleh pengakuan resmi dari BAN-PT melalui SK BAN-PT Nomor 972/SK/BAN-PT/Akred/S/IX/2015 yang menyatakan status akreditasi A. Selanjutnya, Pada tahun 2022, PS-STI berhasil memperoleh akreditasi UNGGUL melalui SK BAN-PT Nomor 5507/SK/BAN-PT/Ak.KP/S/VIII/2022 dan berlaku hingga sekarang.",
};

export const revalidate = 86400; // 1 hari

const PengertianSection = ({ pengertian, error }: PengertianSectionProps) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Pengertian"
        description="Terjadi kesalahan saat memuat data pengertian. Silakan coba lagi."
      />
    );
  }

  // Jika data kosong/null, gunakan dummy
  const pengertianToShow = pengertian ?? dummyPengertian;

  return <PengertianClient pengertian={pengertianToShow} />;
};

export default PengertianSection;
