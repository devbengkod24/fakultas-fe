"use client";

import useSWR from "swr";
import { TAPengumumanService } from "@/api/tugas-akhir";
import { PengumumanDetailView } from "@/components/shared-ta-kp/pengumuman/pengumuman-detail-view";

const BREADCRUMBS = [
  { name: "Dashboard", url: "/tugas-akhir" },
  { name: "Pengumuman", url: "/tugas-akhir/pengumuman" },
  { name: "Detail Pengumuman", url: "" },
];

const fetcher = (id: number) =>
  TAPengumumanService.getById(id).then((res) => {
    if (!res.data) throw new Error("Pengumuman tidak ditemukan");
    return res.data;
  });

export default function PengumumanClient({ id }: { id: number }) {
  const { data, isLoading, error } = useSWR(
    ["pengumuman", id],
    () => fetcher(id),
    { revalidateOnFocus: false }
  );

  return (
    <PengumumanDetailView
      pengumuman={data}
      isLoading={isLoading}
      error={error}
      breadcrumbItems={BREADCRUMBS}
      authorFallback="Koordinator TA"
    />
  );
}
