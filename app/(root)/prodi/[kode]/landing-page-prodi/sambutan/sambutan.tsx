import SambutanClient from "./sambutan-client";
import type { SambutanKaprodi as SambutanType } from "@/types/admin/landing-page/sambutan-kaprodi/sambutan-kaprodi";
import ErrorState from "../../../../components/error-state";

interface SambutanKaprodiProps {
  sambutan: SambutanType | null;
  error?: string | null;
  slogan?: string;
  prodiNama?: string;
}

export const revalidate = 86400; // 1 hari

const SambutanKaprodi = ({ sambutan, error, slogan, prodiNama }: SambutanKaprodiProps) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Sambutan Ketua Program Studi"
        description="Terjadi kesalahan saat memuat data sambutan. Silakan coba lagi."
      />
    );
  }

  if (!sambutan || (Array.isArray(sambutan) && sambutan.length === 0)) {
    return null;
  }

  return <SambutanClient sambutan={sambutan} slogan={slogan} prodiNama={prodiNama} />;
};

export default SambutanKaprodi;
