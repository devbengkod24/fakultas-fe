import ManajemenKategoriPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manajemen Kategori | SISFO STI",
    description: "Lihat dan kelola kategori kegiatan Bimbingan Karir Mahasiswa Sistem Informasi",
};

export default function Page() {
    return <ManajemenKategoriPage />;
}
