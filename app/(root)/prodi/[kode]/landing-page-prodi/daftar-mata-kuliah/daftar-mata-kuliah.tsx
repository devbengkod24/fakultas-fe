import { Suspense } from "react";
import DaftarMataKuliahClient from "./daftar-mata-kuliah-client";
import DaftarMataKuliahSkeleton from "./daftar-mata-kuliah-skeleton";

const DaftarMataKuliah = ({ prodiId }: { prodiId?: number }) => {
  return (
    <Suspense fallback={<DaftarMataKuliahSkeleton />}>
      <DaftarMataKuliahClient prodiId={prodiId} />
    </Suspense>
  );
};



export default DaftarMataKuliah;
