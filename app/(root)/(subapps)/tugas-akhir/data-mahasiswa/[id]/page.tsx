import MahasiswaDetailClientPage from "./client-page";

export default async function MahasiswaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MahasiswaDetailClientPage mahasiswaId={Number(id)} />;
}
