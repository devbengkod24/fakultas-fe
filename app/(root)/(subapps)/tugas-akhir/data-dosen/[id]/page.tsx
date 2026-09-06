import DosenDetailClientPage from "./client-page";

export default async function DosenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DosenDetailClientPage dosenId={id} />;
}
