import PengumumanClient from "./client-page";

export default async function PengumumanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PengumumanClient id={Number(id)} />;
}
