import React from "react";
import PengumumanDetailClient from "../../../_components/pengumuman/validasi/detail-client";

const PengumumanDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <PengumumanDetailClient id={Number(id)} />;
};

export default PengumumanDetailPage;
