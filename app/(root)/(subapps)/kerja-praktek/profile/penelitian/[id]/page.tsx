import EditPenelitianPage from "@/app/(root)/components/edit-penelitian-page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <EditPenelitianPage 
      penelitianId={id}
      backUrl="/kerja-praktik/profile"
    />
  );
}