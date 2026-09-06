import { Metadata } from "next";
import PeriodeClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Periode Ajaran - Bimbingan Karir",
  description: "Periode Ajaran Bimbingan Karir",
};

const PeriodeAjaran = () => {
  return <PeriodeClientPage />;
};

export default PeriodeAjaran;
