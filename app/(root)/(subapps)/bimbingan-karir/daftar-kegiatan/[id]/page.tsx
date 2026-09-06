import ClientPage from "./client-page"

export default async function PresensiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <ClientPage id={(await params).id} />
}
