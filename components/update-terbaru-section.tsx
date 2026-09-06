"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/use-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

interface BeritaItem {
  id: number;
  judul: string;
  konten: string;
  slug: string;
  gambar?: string;
  tanggal_dibuat: string;
  penulis?: string;
  kategori?: string;
  type?: "BERITA" | "KEGIATAN";
}

interface BeritaResponse {
  success: boolean;
  data: BeritaItem[];
}

export function UpdateTerbaruSection({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { baseUrl, config } = useApi();

  useEffect(() => {
    const fetchUpdateTerbaru = async () => {
      try {
        setLoading(true);
        // Menggunakan endpoint berita sebagai contoh, sesuaikan jika ada endpoint khusus
        const url = `${baseUrl}/cms/public/berita?page=1&limit=${limit}&search=`;
        const response = await fetch(url, {
          method: "GET",
          headers: config().headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: BeritaResponse = await response.json();
        // Berikan default type KEGIATAN untuk menyamai design gambar jika kategori tidak ada
        if (data.success && data.data) {
          const formattedData = data.data.map(item => ({
            ...item,
            type: item.kategori ? item.kategori.toUpperCase() as any : "KEGIATAN"
          }));
          setItems(formattedData);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching update terbaru:", err);
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchUpdateTerbaru();
  }, [limit, baseUrl, config]);

  return (
    <section className="my-16 w-full max-w-6xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#0066b2] mb-4">
          Berita <span className="text-[#0d1b2a]">Terbaru</span><br/>
          <span className="text-[#0d1b2a]">FIK</span> <span className="text-[#0066b2]">UDINUS</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Ikuti perkembangan terbaru seputar kegiatan akademik, prestasi, dan inovasi mahasiswa FIK UDINUS.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-px bg-blue-500 w-12"></div>
        <h3 className="text-blue-600 font-semibold tracking-wider text-sm">UPDATE TERBARU</h3>
      </div>

      {loading ? (
        // Loading Skeleton
        <div className="space-y-6">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="flex flex-col md:flex-row overflow-hidden border-0 shadow-none animate-pulse">
              <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-xl" />
              <div className="w-full md:w-1/2 p-6 space-y-4">
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
                <div className="h-8 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-20 w-full bg-gray-200 rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Belum ada update terbaru</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {items.map((item) => (
             // Memakai struktur design Card Horizontal 
            <Card key={item.id} className="flex flex-col md:flex-row overflow-hidden border-0 shadow-none items-center gap-8">
              {/* Left Side: Image */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted">
                  <img
                    src={item.gambar || "https://placehold.co/600x400/eee/999?text=O"}
                    alt={item.judul}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-1/2 flex flex-col justify-start">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full tracking-wide">
                    {item.type}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {item.judul}
                </h3>
                
                <p className="text-sm text-gray-500 mb-6 font-medium">
                  oleh {item.penulis || "Humas FIK"} |{" "}
                  {format(new Date(item.tanggal_dibuat), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")}
                </p>
                
                <div 
                  className="text-gray-600 text-sm mb-8 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: item.konten }}
                />

                <div>
                  <Link
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center justify-center px-6 py-2.5 border border-blue-400 text-blue-500 font-medium text-sm rounded-full hover:bg-blue-50 transition-colors"
                  >
                    Baca selengkapnya →
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
