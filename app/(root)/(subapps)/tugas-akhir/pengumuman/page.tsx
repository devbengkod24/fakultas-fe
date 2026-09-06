import { Metadata } from "next";
import PengumumanClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Pengumuman - Tugas Akhir",
  description: "Pengumuman Tugas Akhir",
};

const Pengumuman = () => {
  return <PengumumanClientPage />;
};

export default Pengumuman;
