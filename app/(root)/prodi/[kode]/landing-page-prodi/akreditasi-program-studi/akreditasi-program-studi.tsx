import AkreditasiClient from "./akreditasi-program-studi-client";
import type { Akreditasi } from "@/types/admin/profile-page/akreditasi/akreditasi";
import ErrorState from "../../../../components/error-state";

interface AkreditasiSectionProps {
  akreditasi?: Akreditasi[] | null;
  error?: string | null;
  isEmpty?: boolean;
  prodiNama?: string;
}
export const revalidate = 86400; // 1 hari

const AkreditasiProgramStudi = ({ akreditasi, error, isEmpty, prodiNama }: AkreditasiSectionProps) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Akreditasi"
        description="Terjadi kesalahan saat memuat data akreditasi. Silakan coba lagi."
      />
    );
  }

  return <AkreditasiClient akreditasi={akreditasi || []} isEmpty={isEmpty} prodiNama={prodiNama} />;
};

export default AkreditasiProgramStudi;
