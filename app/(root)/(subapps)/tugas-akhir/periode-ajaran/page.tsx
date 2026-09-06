import { Metadata } from "next";
import PeriodeClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Periode Ajaran - Tugas Akhir",
  description: "Periode Ajaran Tugas Akhir",
};

const PeriodeAjaran = () => {
  return <PeriodeClientPage />;
};

export default PeriodeAjaran;
