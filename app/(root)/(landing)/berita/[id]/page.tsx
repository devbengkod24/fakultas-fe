import ContentDetail from "@/app/(root)/components/landingpage/berita-kegiatan/detail/content-detail";
import ErrorState from "@/app/(root)/components/error-state";
import type { Berita } from "@/types/admin-fakultas/manajemen-berita/berita";
import { API_URL } from "@/lib/constant";

export const revalidate = 60;

interface DetailBeritaPageProps {
  params: Promise<{ id: string }>;
}

async function getBeritaDetail(id: string): Promise<Berita | null> {
  if (!API_URL) {
    console.warn("[DetailBeritaPage] API_URL is not configured");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/cms/public/berita/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result?.data ?? null;
  } catch (error) {
    console.error("[DetailBeritaPage] Fetch error:", error);
    return null;
  }
}

export default async function DetailBeritaPage({
  params,
}: DetailBeritaPageProps) {
  const { id } = await params;
  const berita = await getBeritaDetail(id);

  return (
    <main className="bg-slate-50/70 min-h-screen pt-28 pb-16 md:pt-32 md:pb-24">
      {berita ? (
        <ContentDetail berita={berita} />
      ) : (
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState
            title="Gagal Memuat Berita"
            description="Berita tidak ditemukan atau terjadi kesalahan saat mengambil data dari server."
          />
        </div>
      )}
    </main>
  );
}
