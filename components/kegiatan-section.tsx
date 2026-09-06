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

interface KegiatanItem {
  id: number;
  nama: string;
  deskripsi: string;
  slug?: string;
  gambar?: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  lokasi?: string;
  kategori?: string;
  status?: string;
}

interface KegiatanResponse {
  success: boolean;
  data: KegiatanItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export function KegiatanSection({ limit = 6 }: { limit?: number }) {
  const [kegiatan, setKegiatan] = useState<KegiatanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { baseUrl, config } = useApi();

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        setLoading(true);
        // Adjust the endpoint based on your actual API
        const url = `${baseUrl}/pengumuman?type=kegiatan&page=1&limit=${limit}&search=`;
        const response = await fetch(url, {
          method: "GET",
          headers: config().headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: KegiatanResponse = await response.json();
        if (data.success && data.data) {
          setKegiatan(data.data);
        } else if (Array.isArray(data)) {
          // Handle if API returns array directly
          setKegiatan(data);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching kegiatan:", err);
        setError(err instanceof Error ? err.message : "Gagal memuat kegiatan");
      } finally {
        setLoading(false);
      }
    };

    fetchKegiatan();
  }, [limit, baseUrl, config]);

  if (loading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(limit)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (kegiatan.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Tidak ada kegiatan tersedia</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kegiatan.map((item) => (
        <Link
          key={item.id}
          href={item.slug ? `/kegiatan/${item.slug}` : "#"}
        >
          <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
            {item.gambar && (
              <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-muted">
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-2 text-base">{item.nama}</CardTitle>
                {item.status && (
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                    {item.status}
                  </span>
                )}
              </div>
              <CardDescription className="text-xs">
                {format(new Date(item.tanggal_mulai), "dd MMMM yyyy", {
                  locale: id,
                })}
                {item.tanggal_selesai &&
                  ` - ${format(new Date(item.tanggal_selesai), "dd MMMM yyyy", {
                    locale: id,
                  })}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {item.deskripsi}
              </p>
              {item.lokasi && (
                <p className="mt-2 text-xs text-muted-foreground">
                  📍 {item.lokasi}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <span className="text-xs font-medium text-primary">Lihat detail →</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
