"use client";

import Image from "next/image";
import { Copy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Berita } from "@/types/admin-fakultas/manajemen-berita/berita";
import { formatDate } from "@/lib/utils";
import { API_URL, IMAGE_URL } from "@/lib/constant";
import { toast } from "sonner";
import { sanitizeHtml } from "@/lib/sanitize-html";

interface ContentDetailProps {
  berita: Berita;
}

const normalizeImageUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  const path = value.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  if (!path || path === "null" || path === "undefined") return undefined;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiRoot =
    API_URL?.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "") || "";
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

export default function ContentDetail({ berita }: ContentDetailProps) {
  const imageUrl = normalizeImageUrl(berita.gambar);
  const rawTipe = String(berita.tipe ?? "berita").trim().toLowerCase();
  const tipe = rawTipe === "prestasi" ? "PRESTASI" : "KEGIATAN";

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `${berita.judul} ${url}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareFacebook = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareX = () => {
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        berita.judul
      )}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareLinkedIn = () => {
    const url = window.location.href;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyLink = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link berita berhasil disalin");
        return;
      }
      toast.error("Peramban ini tidak mendukung fitur salin link");
    } catch {
      toast.error("Gagal menyalin link berita");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-1 gap-8 items-start">
        {/* Article Column */}
        <article className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-all hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </div>

          <span className="inline-block bg-blue-50 text-[#114D91] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            {tipe}
          </span>

          {/* Detik Header */}
          <div className="detail__header">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight md:leading-snug tracking-tight mb-4">
              {berita.judul}
            </h1>

            {/* Author & Date (Detik style) */}
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-600 pb-4 border-b border-slate-100">
              <span className="font-bold text-slate-800">
                {berita.user_name || "Humas FIK"}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                {formatDate(berita.published_at || berita.created_at)}
              </span>
            </div>
          </div>

          {/* Media / Featured Image (Detik style) */}
          <div className="detail__media mt-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={berita.judul}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  No Image Available
                </div>
              )}
            </div>
            {imageUrl && (
              <figcaption className="text-xs md:text-sm text-slate-500 italic mt-2.5 flex items-start gap-2">
                <span className="w-1.5 h-4 bg-[#114D91] rounded-full mt-0.5 flex-shrink-0" />
                <span>
                  {berita.judul}.{" "}
                  <span className="not-italic text-slate-400">
                    Foto: Dok. Humas FIK
                  </span>
                </span>
              </figcaption>
            )}
          </div>

          {/* Article Body Content */}
          <div
            className="detail__body-text prose prose-slate max-w-none text-slate-800 text-base md:text-[17px] leading-relaxed text-justify mt-8"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(berita.konten) }}
          />

          {/* Bottom Share Section (Detik style: text left, icons right) */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-600">
              Bagikan berita ini:
            </span>
            <div className="flex items-center gap-2">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                title="Bagikan ke WhatsApp"
                aria-label="Bagikan ke WhatsApp"
                className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleShareFacebook}
                title="Bagikan ke Facebook"
                aria-label="Bagikan ke Facebook"
                className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* X / Twitter */}
              <button
                type="button"
                onClick={handleShareX}
                title="Bagikan ke X"
                aria-label="Bagikan ke X"
                className="w-9 h-9 rounded-full bg-[#000000] text-white flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={handleShareLinkedIn}
                title="Bagikan ke LinkedIn"
                aria-label="Bagikan ke LinkedIn"
                className="w-9 h-9 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>

              {/* Copy Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                title="Salin Link Berita"
                aria-label="Salin Link Berita"
                className="w-9 h-9 rounded-full bg-[#114D91] text-white flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

