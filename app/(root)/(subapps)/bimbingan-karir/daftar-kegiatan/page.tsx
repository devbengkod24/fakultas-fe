import { Metadata } from "next";
import DaftarKegiatanClient from "./client-page";

export const metadata: Metadata = {
  title: "Daftar Kegiatan - Bimbingan Karir",
  description: "Daftar Kegiatan Bimbingan Karir",
};

const DaftarKegiatanBK = () => {
  return <DaftarKegiatanClient />;
};

export default DaftarKegiatanBK;
