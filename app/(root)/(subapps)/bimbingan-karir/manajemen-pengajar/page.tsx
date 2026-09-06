import { Metadata } from "next";
import KoordinatorManajemenDosen from "./client-page";

export const metadata: Metadata = {
  title: "Manajemen Dosen - Bimbingan Karir",
  description: "Manajemen Dosen Bimbingan Karir",
};

const ManajemenDosenBK = () => {
  return <KoordinatorManajemenDosen/>;
};

export default ManajemenDosenBK;