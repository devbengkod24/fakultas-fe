import { Metadata } from "next";
import PengumumanClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Pengumuman - Kerja Praktek",
};

export default function PengumumanPage() {
  return <PengumumanClientPage />;
}