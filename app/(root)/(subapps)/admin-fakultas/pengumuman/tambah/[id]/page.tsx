import React from "react";
import TambahPengumumanDetailClient from "@/app/(root)/(subapps)/admin-fakultas/_components/pengumuman/tambah/detail-client";

const TambahPengumumanDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TambahPengumumanDetailClient id={Number(id)} />;
};

export default TambahPengumumanDetailPage;
