import BeritaPopupClient from "./berita-popup-client";
import type { FakultasPengumuman } from "@/data/fakultas/tambah-pengumuman";

export default function BeritaPopup({ pengumumans }: { pengumumans: FakultasPengumuman[] }) {
  return <BeritaPopupClient pengumumans={pengumumans} />;
}
