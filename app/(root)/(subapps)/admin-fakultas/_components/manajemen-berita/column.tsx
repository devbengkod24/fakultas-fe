"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Berita } from "@/types/admin-fakultas/manajemen-berita/berita";
import { Badge } from "@/components/ui/badge";
import { API_URL, IMAGE_URL } from "@/lib/constant";

// Helper to resolve image URL - handles relative paths from API
const resolveImageUrl = (src: string | undefined | null): string | null => {
  if (!src) return null;

  const value = src.trim();
  if (!value || value === "null" || value === "undefined") return null;

  // Accept valid absolute URLs directly.
  try {
    const absolute = new URL(value);
    if (absolute.protocol === "http:" || absolute.protocol === "https:") {
      return absolute.toString();
    }
    return null;
  } catch {
    // Not an absolute URL, continue handling as a relative path.
  }

  const normalizedPath = value.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalizedPath) return null;

  const apiRoot =
    API_URL?.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "") || "";

  if (
    /^(berita_images|storage|foto-profil|mitra-logo)\//i.test(normalizedPath)
  ) {
    const mediaCandidates: string[] = [];

    if (IMAGE_URL) {
      mediaCandidates.push(
        `${IMAGE_URL.replace(/\/+$/, "")}/${normalizedPath}`,
      );
    }

    if (apiRoot) {
      if (normalizedPath.startsWith("storage/")) {
        mediaCandidates.push(`${apiRoot}/${normalizedPath}`);
      } else {
        mediaCandidates.push(`${apiRoot}/storage/${normalizedPath}`);
        mediaCandidates.push(`${apiRoot}/${normalizedPath}`);
      }
    }

    for (const candidate of mediaCandidates) {
      try {
        const resolved = new URL(candidate);
        if (resolved.protocol === "http:" || resolved.protocol === "https:") {
          return resolved.toString();
        }
      } catch {
        // try next candidate
      }
    }
  }

  const baseCandidates = [IMAGE_URL, apiRoot, API_URL].filter(
    (base): base is string => !!base,
  );

  for (const base of baseCandidates) {
    const cleanBase = base.replace(/\/+$/, "");
    const hasStorageSuffix = /\/storage$/i.test(cleanBase);

    const withStoragePath = normalizedPath.startsWith("storage/")
      ? normalizedPath.replace(/^storage\//, "")
      : normalizedPath;

    const candidate = hasStorageSuffix
      ? `${cleanBase}/${withStoragePath}`
      : normalizedPath.startsWith("storage/")
        ? `${cleanBase}/${normalizedPath}`
        : `${cleanBase}/storage/${withStoragePath}`;

    try {
      const resolved = new URL(candidate);
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        return resolved.toString();
      }
    } catch {
      // Try next base candidate.
    }
  }

  return `/${normalizedPath}`;
};

const TIPE_LABELS: Record<Berita["tipe"], string> = {
  prestasi: "Prestasi",
  kegiatan: "Kegiatan",
  berita: "Berita",
};

const TIPE_COLORS: Record<Berita["tipe"], string> = {
  prestasi: "bg-green-100 text-green-800 border-green-200",
  kegiatan: "bg-blue-100 text-blue-800 border-blue-200",
  berita: "bg-purple-100 text-purple-800 border-purple-200",
};

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: Berita) => Promise<void>,
  onDelete?: (id: number) => Promise<void>,
): ColumnDef<Berita>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "gambar",
      header: "Gambar",
      cell: ({ row }) => {
        const src = resolveImageUrl(row.original.gambar);
        if (!src) {
          return (
            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
              Tidak ada gambar
            </div>
          );
        }
        return (
          <Image
            src={src}
            alt={row.original.judul || "Berita"}
            width={80}
            height={80}
            unoptimized
            style={{
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        );
      },
    },
    {
      accessorKey: "judul",
      header: "Judul",
      cell: ({ row }) => (
        <div
          className="max-w-[300px] truncate font-medium text-gray-900"
          title={row.original.judul}
        >
          {row.original.judul}
        </div>
      ),
    },
    {
      accessorKey: "tipe",
      header: "Tipe",
      enableSorting: false,
      cell: ({ row }) => {
        const tipe = row.original.tipe;
        return <Badge className={TIPE_COLORS[tipe]}>{TIPE_LABELS[tipe]}</Badge>;
      },
    },
    {
      accessorKey: "published_at",
      header: "Dipublikasi",
      cell: ({ row }) => {
        const date = row.original.published_at;
        if (!date) return <span className="text-gray-400">-</span>;
        const formatted = new Date(date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        return <span className="text-sm">{formatted}</span>;
      },
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const berita = row.original;

        const handleDelete = async () => {
          if (!onDelete || !berita.id) {
            return;
          }

          try {
            await onDelete(berita.id);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div className="flex gap-2">
            <DialogPopUp
              mode="edit"
              initialData={berita}
              onSubmit={async (data: any) => {
                if (onEdit && berita.id) {
                  await onEdit({ ...data, id: berita.id });
                }
              }}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="border border-gray-300 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="border border-red-500 rounded-lg"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Berita</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus berita "{berita.judul}"?
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
};
