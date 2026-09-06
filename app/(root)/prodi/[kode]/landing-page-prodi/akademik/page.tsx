import { ProdiConfigService } from "@/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProdiConfig } from "../../../config";

export default async function ProdiAkademikPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  
  let prodi: ProdiConfig | null = null;
  try {
    const response = await ProdiConfigService.getByKode(kode);
    prodi = response?.data || null;
  } catch (error) {
    console.error("Error fetching prodi identity:", error);
  }

  if (!prodi) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">
            FIK
          </Link>
          <span>/</span>
          <Link href={`/prodi/${prodi.kode_prodi}`} className="hover:text-gray-700">
            {prodi.nama}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Akademik</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <Link
            href={`/prodi/${prodi.kode_prodi}`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke {prodi.nama}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Akademik {prodi.nama}
          </h1>
          <p className="text-gray-500 mt-2">
            Kurikulum, mata kuliah, dan peminatan
          </p>
        </div>

        {/* Konten Placeholder */}
        <div className="space-y-8">
          {["Kurikulum", "Daftar Mata Kuliah", "Peminatan", "Kalender Akademik"].map(
            (section) => (
              <div
                key={section}
                className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8"
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  {section}
                </h2>
                <p className="text-sm text-gray-400">
                  Konten {section.toLowerCase()} untuk {prodi.nama} akan diisi
                  secara dinamis dari API.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
