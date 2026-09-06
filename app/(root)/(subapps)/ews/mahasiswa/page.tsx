import { Metadata } from "next";
import MahasiswaClient from "./mahasiswa-client";

export const metadata: Metadata = {
  title: "Detail Mahasiswa EWS",
  description: "Detail Mahasiswa per Angkatan - Early Warning System",
};

export default function MahasiswaPage() {
  return <MahasiswaClient />;
}