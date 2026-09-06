import { Metadata } from "next";
import PengumumanClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Pengumuman - Bimbingan Karir",
  description: "Pengumuman Bimbingan Karir",
};

const Pengumuman = () => {
  return <PengumumanClientPage />;
};

export default Pengumuman;
