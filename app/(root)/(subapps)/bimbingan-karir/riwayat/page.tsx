import { Metadata } from "next";
import KoordinatorRiwayat from "./client-page";

export const metadata: Metadata = {
  title: "Daftar Kegiatan - Bimbingan Karir",
  description: "Daftar Kegiatan Bimbingan Karir",
};

const Riwayat = () => {
  return <KoordinatorRiwayat />;
};

export default Riwayat;
