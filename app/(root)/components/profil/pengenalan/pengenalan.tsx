/* eslint-disable @typescript-eslint/no-explicit-any */
import PengenalancClient from "./pengenalan-client";
import ErrorState from "../../error-state";

interface PengenalansectionProps {
  data: any | null;
  error?: string | null;
}

export const revalidate = 86400; // 1 hari

const Pengenalansection = ({ data, error }: PengenalansectionProps) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Pengenalan"
        description="Terjadi kesalahan saat memuat data pengenalan. Silakan coba lagi."
      />
    );
  }

  return <PengenalancClient pengertian={data} />;
};

export default Pengenalansection;
