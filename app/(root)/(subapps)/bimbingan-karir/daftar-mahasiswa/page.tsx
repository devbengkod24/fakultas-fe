import { Metadata } from "next";
import DaftarMahasiswaClient from "./client-page";

export const metadata: Metadata = {
  title: "Daftar Mahasiswa - Bimbingan Karir",
  description: "Daftar Mahasiswa Bimbingan Karir",
};

const DaftarMahasiswaBK = () => {
  return <DaftarMahasiswaClient />;
};

export default DaftarMahasiswaBK;