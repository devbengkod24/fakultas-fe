import { Metadata } from "next";
import BeritaPageClient from "./client-page";

export const metadata: Metadata = {
  title: "Berita & Kegiatan | FIK UDINUS",
  description:
    "Informasi terkini mengenai kegiatan, prestasi, dan pengumuman di lingkungan FIK UDINUS.",
};

export default function BeritaPage() {
  return <BeritaPageClient />;
}
