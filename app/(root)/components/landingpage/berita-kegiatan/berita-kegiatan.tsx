import BeritaKegiatanClient from "./berita-kegiatan-client";
import type { BeritaItem } from "./berita-kegiatan-client";
import ErrorState from "../../error-state";
import { API_URL, IMAGE_URL } from "@/lib/constant";

export const revalidate = 30;

type RawBeritaItem = {
  id: number | string;
  judul?: string;
  title?: string;
  konten?: string;
  content?: string;
  gambar?: string;
  image?: string;
  thumbnail?: string;
  type?: string;
  tipe?: string;
  user_name?: string;
  published_at?: string;
  created_at?: string;
};

const normalizeImageUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  const path = value.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  if (!path || path === "null" || path === "undefined") return undefined;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiRoot = API_URL?.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "") || "";
  const imageRoot = IMAGE_URL?.replace(/\/+$/, "") || "";

  if (/^(berita_images|storage|foto-profil|mitra-logo)\//i.test(path)) {
    if (imageRoot) {
      return `${imageRoot}/${path}`;
    }
    if (apiRoot) {
      if (path.startsWith("storage/")) {
        return `${apiRoot}/${path}`;
      }
      return `${apiRoot}/storage/${path}`;
    }
  }

  if (apiRoot) {
    return `${apiRoot}/${path}`;
  }

  return `/${path}`;
};

const extractRawBeritaArray = (result: unknown): RawBeritaItem[] => {
  if (result && typeof result === 'object' && 'data' in result) {
    const data = (result as { data: Record<string, unknown> }).data;
    const list = (data?.data ?? data) as RawBeritaItem[];
    return Array.isArray(list) ? list : [];
  }
  return [];
};

export default async function BeritaKegiatanSection() {
  try {
    if (!API_URL) {
      throw new Error("API_URL is not configured");
    }

    const url = `${API_URL}/cms/public/berita?page=1&limit=10&search=`;

    console.log("[BeritaKegiatanSection] Fetching from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[BeritaKegiatanSection] Fetch failed: ${response.status} ${response.statusText}`,
        errorText
      );
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`
      );
    }

    const result = await response.json();

    const rawItems = extractRawBeritaArray(result);

    if (rawItems.length === 0) {
      console.warn(
        "[BeritaKegiatanSection] Result data is empty or invalid:",
        result
      );
      return <BeritaKegiatanClient berita={[]} />;
    }

    const stripHtmlServer = (html: string) => html ? html.replace(/<[^>]*>?/gm, '') : '';

    const beritaList: BeritaItem[] = rawItems.map((item) => {
      const tipe = (item.tipe ?? item.type ?? "berita").toLowerCase();
      const title = item.judul ?? item.title ?? "Tanpa Judul";
      const content = item.konten ?? item.content ?? "";
      const cleanContent = stripHtmlServer(content);

      return {
        id: String(item.id),
        title,
        date: item.published_at || item.created_at || "",
        category: tipe === "prestasi" ? "PRESTASI" : "KEGIATAN",
        excerpt: cleanContent.length > 1000 ? `${cleanContent.substring(0, 1000)}...` : cleanContent,
        image: normalizeImageUrl(item.gambar ?? item.image ?? item.thumbnail),
        author: item.user_name || "Humas FIK",
        isFeatured: tipe === "berita",
      };
    });

    return <BeritaKegiatanClient berita={beritaList} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[BeritaKegiatanSection] Error:", errorMessage, error);
    return (
      <ErrorState
        title="Gagal Memuat Berita"
        description={`Terjadi kesalahan saat memuat section Berita & Kegiatan. ${process.env.NODE_ENV === "development" ? `Detail: ${errorMessage}` : "Silakan coba lagi."}`}
      />
    );
  }
}
