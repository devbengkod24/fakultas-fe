import ProgramUnggulanClient from "./program-unggulan-client";
import ErrorState from "../../../../components/error-state";
import type { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";

interface Props {
  programs: ProgramUnggulan[] | null | undefined;
  error?: string | null;
  isEmpty?: boolean;
  prodiNama?: string;
}
export const revalidate = 86400; // 1 hari

const ProgramUnggulan = ({ programs, error, isEmpty, prodiNama }: Props) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Program Unggulan"
        description="Terjadi kesalahan saat memuat data program unggulan. Silakan coba lagi."
      />
    );
  }

  return <ProgramUnggulanClient programs={programs || []} isEmpty={isEmpty} prodiNama={prodiNama} />;
};

export default ProgramUnggulan;
