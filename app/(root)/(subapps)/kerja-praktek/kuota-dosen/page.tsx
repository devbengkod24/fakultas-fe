import { Metadata } from "next";
import KuotaDosenClient from "../_components/kuota-dosen/koordinator";

export const metadata: Metadata = {
  title: "Kuota Dosen - Kerja Praktek",
  description: "Kuota Dosen Kerja Praktek",
};

const KuotaDosen = () => {
  return <KuotaDosenClient />;
};

export default KuotaDosen;