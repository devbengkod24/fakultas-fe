import EditPublikasiPage from "@/app/(root)/components/edit-publikasi-page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <EditPublikasiPage
      articleId={parseInt(id)}
      backUrl="/kerja-praktek/profile"
    />
  );
}