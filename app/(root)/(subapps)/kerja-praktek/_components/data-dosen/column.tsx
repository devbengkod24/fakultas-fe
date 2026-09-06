"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Dosen } from "@/types/kerja-praktek/dosen";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, CheckCircle, XCircle, ArrowUpDown, ArrowUp, ArrowDown, CalendarClock, Users, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { SortConfig } from "@/types/kerja-praktek/sortconfig";

interface ColumnsProps {
  currentPage: number;
  perPage: number;
  onEdit: (dosen: Dosen) => void;
  onToggle: (dosen: Dosen) => void;
  onPlot?: (dosenId: number) => void;
  currentSort?: SortConfig;
  onSort?: (sortConfig: SortConfig) => void;
}

const SortableHeader = ({ children, sortKey, currentSort, onSort }: { children: React.ReactNode; sortKey: keyof SortConfig; currentSort?: SortConfig; onSort?: (sortConfig: SortConfig) => void }) => {
  const currentDirection = currentSort?.[sortKey];
  const handleClick = () => {
    const newDirection = currentDirection === "asc" ? "desc" : "asc";
    onSort?.({ [sortKey]: newDirection } as SortConfig);
  };
  const getSortIcon = () => {
    if (currentDirection === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    if (currentDirection === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Button variant="ghost" onClick={handleClick} className="h-auto p-0 font-medium hover:bg-transparent text-left">
      {children}
      {getSortIcon()}
    </Button>
  );
};

export const Columns = ({
  currentPage,
  perPage,
  onEdit,
  onToggle,
  onPlot,
  currentSort,
  onSort,
}: ColumnsProps): ColumnDef<Dosen>[] => {
  return [
    {
      header: "No",
      size: 50,
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "nama",
      header: () => (
        onSort ? (
          <SortableHeader sortKey="name" currentSort={currentSort} onSort={onSort}>Nama</SortableHeader>
        ) : "Nama"
      ),
      size: 300,
      cell: ({ row }) => {
        const dosen = row.original;
        const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : '';
        const gelarBelakang = dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : '';
        const namaLengkap = `${gelarDepan}${dosen.nama ?? ''}${gelarBelakang}`;
        const photo = (dosen as any).photo || (dosen as any).avatar || "";

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {photo ? <AvatarImage src={photo} alt={dosen.nama ?? ""} className="object-cover rounded-full" /> : null}
              <AvatarFallback className="bg-muted text-muted-foreground">{(dosen.nama || "?").charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{namaLengkap}</span>
              {dosen.npp && <span className="text-sm text-muted-foreground">{dosen.npp}</span>}
            </div>
          </div>
        );
      },
    },
    {
      id: "status_periode",
      header: () => <div className="w-full text-center">Status Periode</div>,
      size: 140,
      cell: ({ row }) => {
        const dosen = row.original;
        const isAktif = dosen.aktif_periode === true;
        return (
          <div className="w-full flex justify-center">
            <Button
              variant={isAktif ? "default" : "outline"}
              size="sm"
              className="h-8 min-w-[100px]"
              onClick={() => onToggle(dosen)}
            >
              {isAktif ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Aktif
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Nonaktif
                </>
              )}
            </Button>
          </div>
        );
      },
    },
    {
      id: "plotting",
      header: () => <div className="w-full text-center">Plotting Mahasiswa</div>,
      size: 140,
      cell: ({ row }) => {
        const dosen = row.original;
        const available = (dosen.sisa_kuota ?? 0) > 0;
        return (
          <div className="w-full flex justify-center">
            <Button
              size="sm"
              variant={available ? "outline" : "ghost"}
              className="h-8"
              onClick={() => onPlot?.(dosen.id!)}
              disabled={!available}
            >
              <Users className="h-3.5 w-3.5 mr-1" />
              {available ? `Sisa kuota (${dosen.sisa_kuota})` : "Kuota Penuh"}
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="w-full text-center">Aksi</div>,
      size: 120,
      cell: ({ row }) => {
        const dosen = row.original;
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/kerja-praktek/data-dosen/${dosen.id}`}>
                    <ExternalLink className="size-4 mr-2" />
                    Lihat Detail
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(dosen)}>
                  <div className="flex items-center gap-2">
                    <Pencil className="size-4" />
                    Edit Data Dosen
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};