import StrukturOrganisasiClient from "./struktur-organisasi-client";
import type { StrukturOrganisasi } from "@/types/admin/profile-page/struktur-organisasi/struktur-organisasi";
import ErrorState from "../../error-state";

interface StrukturOrganisasiSectionProps {
  strukturOrganisasi: StrukturOrganisasi[] | null;
  error?: string | null;
}

export const revalidate = 86400; // 1 hari

const StrukturOrganisasiSection = ({
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

  if (!strukturOrganisasi || strukturOrganisasi.length === 0) {
    return null;
  }

  return <StrukturOrganisasiClient strukturOrganisasi={strukturOrganisasi} />;
};

export default StrukturOrganisasiSection;
