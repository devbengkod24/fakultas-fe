import { Metadata } from "next";
import KoordinatorAnalisisKegiatan from "./client-page";


export const metadata: Metadata = {
  title: "Analisis Kegiatan - Bimbingan Karir",
  description: "Analisis Kegiatan Bimbingan Karir",
};

const AnalisisKegiatanBK = () => {
  return <KoordinatorAnalisisKegiatan />;
};

export default AnalisisKegiatanBK;
