"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FeedbackRating } from "@/types/bimbingan-karir/koordinator/feedback-rating/feedback-rating";
import { Badge } from "@/components/ui/badge";
import { formatDateFull } from "@/lib/utils";

const getRatingBadgeVariant = (rating: number) => {
  if (rating <= 2) return "destructiveOutline";
  if (rating === 3) return "secondary";
  if (rating >= 4) return "success";
  return "default";
};

export const Columns = (currentPage: number, perPage: number): ColumnDef<FeedbackRating>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      id: "nama_mahasiswa",
      header: "Nama Mahasiswa",
      cell: ({ row }) => {
        const nim = row.original.mahasiswa.nim;
        const nama = row.original.mahasiswa.nama_mahasiswa;

        return (
          <div className="flex flex-col">
            <span className="font-semibold">{nama}</span>
            <span className="text-sm text-gray-500">{nim}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "kegiatan_name",
      header: "Nama Kegiatan",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.original.rating;
        return (
          <Badge variant={getRatingBadgeVariant(rating)}>
            {rating}
          </Badge>
        );
      },
    },
    {
      accessorKey: "komentar",
      header: "Komentar",
    },
    {
      accessorKey: "tanggal_kirim",
      header: "Tanggal Dikirim",
      cell: ({ row }) => {
        const tanggalKirim = row.original.tanggal_kirim;
        return tanggalKirim ? formatDateFull(tanggalKirim) : "-";
      },
    },
  ];
};