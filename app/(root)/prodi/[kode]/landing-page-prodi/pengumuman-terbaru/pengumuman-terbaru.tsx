import { Suspense } from "react";
import PengumumanTerbaruClient from "./pengumuman-terbaru-client";
import PengumumanTerbaruSkeleton from "./pengumuman-terbaru-skeleton";

const PengumumanTerbaru = ({ prodiId }: { prodiId?: number }) => {
  return (
    <Suspense fallback={<PengumumanTerbaruSkeleton />}>
      <PengumumanTerbaruClient prodiId={prodiId} />
    </Suspense>
  );
};

export default PengumumanTerbaru;
