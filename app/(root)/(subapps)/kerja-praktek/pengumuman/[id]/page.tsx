import PengumumanDetailPage from "./client-page";

export default async function PengumumanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PengumumanDetailPage id={Number(id)} />;
}
