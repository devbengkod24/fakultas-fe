import { Metadata } from "next";
import KuotaDosenClient from "./client-page";

export const metadata: Metadata = {
  title: "Kuota Dosen - Tugas Akhir",
  description: "Kuota Dosen Tugas Akhir",
};

const KuotaDosen = () => {
  return <KuotaDosenClient />;
};

export default KuotaDosen;
