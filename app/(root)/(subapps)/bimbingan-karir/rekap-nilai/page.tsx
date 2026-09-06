import { Metadata } from "next";
import RekapNilaiClient from "./client-page";

export const metadata: Metadata = {
  title: "Daftar Kegiatan - Bimbingan Karir",
  description: "Daftar Kegiatan Bimbingan Karir",
};

const DaftarKegiatanBK = () => {
  return <RekapNilaiClient />;
};

export default DaftarKegiatanBK;
