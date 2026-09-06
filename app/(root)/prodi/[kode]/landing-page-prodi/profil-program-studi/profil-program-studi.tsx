import ProfilProgramStudiClient from "./profil-program-studi-client";
import type { VisiMisi } from "@/types/admin/profile-page/visi-misi/visi-misi";
import ErrorState from "../../../../components/error-state";

interface ProfileProgramStudiProps {
  deskripsi: string;
  visi?: string;
  misi?: string[];
  visiMisi?: VisiMisi | null;
  error?: string | null;
  prodiNama?: string;
}

const ProfilProgramStudi = ({ deskripsi, visi, misi, visiMisi, error, prodiNama }: ProfileProgramStudiProps) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Profil Program Studi"
        description="Terjadi kesalahan saat memuat data profil. Silakan coba lagi nanti."
      />
    );
  }

  const currentVisiMisi: VisiMisi | null = visiMisi || (visi ? { id: 0, visi, misi: misi || [] } : null);

  return (
    <ProfilProgramStudiClient 
      deskripsi={deskripsi || "Informasi profil dan deskripsi umum program studi sedang dalam proses pengkinian data resmi."} 
      visiMisi={currentVisiMisi || { visi: "Visi program studi sedang dalam penyusunan.", misi: ["Misi program studi sedang dalam penyusunan."] }} 
      prodiNama={prodiNama}
    />
  );
};

export default ProfilProgramStudi;
