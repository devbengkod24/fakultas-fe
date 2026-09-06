import { Suspense } from "react";
import PengumumanClient from "./pengumuman-client";
import PengumumanSkeleton from "./pengumuman-skeleton";

export const revalidate = 60;

export default function Pengumuman() {
  return (
    <Suspense fallback={<PengumumanSkeleton />}>
      <PengumumanClient />
    </Suspense>
  );
}