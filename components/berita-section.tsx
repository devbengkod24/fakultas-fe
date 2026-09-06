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
}

interface BeritaResponse {
  success: boolean;
  data: BeritaItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export function BeritaSection({ limit = 6 }: { limit?: number }) {
  const [berita, setBerita] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { baseUrl, config } = useApi();

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setLoading(true);
        const url = `${baseUrl}/cms/public/berita?page=1&limit=${limit}&search=`;
        const response = await fetch(url, {
          method: "GET",
          headers: config().headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: BeritaResponse = await response.json();
        if (data.success && data.data) {
          setBerita(data.data);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching berita:", err);
        setError(err instanceof Error ? err.message : "Gagal memuat berita");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
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

  if (berita.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Tidak ada berita tersedia</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {berita.map((item) => (
        <Link key={item.id} href={`/berita/${item.slug}`}>
          <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
            {item.gambar && (
              <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-muted">
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2 text-base">{item.judul}</CardTitle>
              <CardDescription className="text-xs">
                {format(new Date(item.tanggal_dibuat), "dd MMMM yyyy", {
                  locale: id,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {item.konten.replace(/<[^>]*>/g, "")}
              </p>
            </CardContent>
            <CardFooter>
              <span className="text-xs font-medium text-primary">Baca selengkapnya →</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
