import ProfilDosenClient from "./struktur-organisasi-client";
import type { StrukturOrganisasi } from "@/types/admin/profile-page/struktur-organisasi/struktur-organisasi";
import ErrorState from "../../error-state";

interface StrukturOrganisasiProps {
  strukturOrganisasi?: StrukturOrganisasi[] | null;
  error?: string | null;
  isEmpty?: boolean;
  prodiNama?: string;
}

export const revalidate = 86400; // 1 hari

const StrukturOrganisasi = ({ strukturOrganisasi, error, isEmpty, prodiNama }: StrukturOrganisasiProps) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Struktur Organisasi"
        description="Terjadi kesalahan saat memuat data struktur organisasi. Silakan coba lagi."
      />
    );
  }

  return <ProfilDosenClient strukturOrganisasi={strukturOrganisasi || []} isEmpty={isEmpty} prodiNama={prodiNama} />;
};

export default StrukturOrganisasi;
