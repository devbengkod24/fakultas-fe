"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ExternalLink, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Mahasiswa } from "@/types/kerja-praktek/mahasiswa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SortConfig } from "@/types/kerja-praktek/sortconfig";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: keyof SortConfig;
  currentSort?: SortConfig;
  onSort: (sortConfig: SortConfig) => void;
}

const SortableHeader = ({ children, sortKey, currentSort, onSort }: SortableHeaderProps) => {
  const currentDirection = currentSort?.[sortKey];

  const handleClick = () => {
    const newDirection = currentDirection === "asc" ? "desc" : "asc";
    onSort({ [sortKey]: newDirection } as SortConfig);
  };

  const getSortIcon = () => {
    if (currentDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    } else if (currentDirection === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      {getSortIcon()}
    </Button>
  );
};

interface PembimbingHeaderProps {
  currentSort?: SortConfig;
  onSort: (sortConfig: SortConfig) => void;
}

const PembimbingHeader = ({ currentSort, onSort }: PembimbingHeaderProps) => {
  const currentValue = currentSort?.pembimbing;

  const handleClick = () => {
    let newValue: string | null;
    if (currentValue === 'asc') {
      newValue = 'desc';
    } else if (currentValue === 'desc') {
      newValue = 'none';
    } else {
      newValue = 'asc';
    }
    onSort({ pembimbing: newValue } as SortConfig);
  };

  const getIcon = () => {
    if (currentValue === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    } else if (currentValue === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    } else if (currentValue === 'none') {
      return <ArrowDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const getTooltip = () => {
    if (currentValue === 'asc') return "A-Z";
    if (currentValue === 'desc') return "Z-A";
    if (currentValue === 'none') return "Tidak ada pembimbing";
    return "Sortir pembimbing";
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="h-auto p-0 font-medium hover:bg-transparent"
      title={getTooltip()}
    >
      Dosen Pembimbing
      {getIcon()}
    </Button>
  );
};

export const Columns = (
    currentPage: number,
    perPage: number,
    currentSort?: SortConfig,
    onSort?: (sortConfig: SortConfig) => void
): ColumnDef<Mahasiswa>[] => {
    return [
        {
            header: "No",
            size: 50,
            cell: ({ row }) => {
                const number = (currentPage - 1) * perPage + row.index + 1;
                return <div className="text-sm">{number}</div>;
            },
        },
        {
            id: "nama",
            header: () => {
                if (onSort) {
                    return (
                        <SortableHeader
                            sortKey="name"
                            currentSort={currentSort}
                            onSort={onSort}
                        >
                            Nama
                        </SortableHeader>
                    );
                }
                return "Nama";
            },
            size: 300,
            cell: ({ row }) => {
                const mahasiswa = row.original;
                const raw = mahasiswa as unknown as Record<string, string | undefined>;
                const photoUrl = raw.foto || raw.photo || raw.avatar || raw.profile_photo || "";

                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            {photoUrl ? <AvatarImage src={photoUrl} alt={mahasiswa.nama ?? ""} className="object-cover rounded-full" /> : null}
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                                {(mahasiswa.nama || "?").charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{mahasiswa.nama ?? "-"}</span>
                            {mahasiswa.nim && <span className="text-xs text-muted-foreground">{mahasiswa.nim}</span>}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "kontak",
            header: "Kontak",
            size: 240,
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <p className="truncate text-sm" title={row.original.email ?? ""}>{row.original.email ?? "-"}</p>
                    <p className="text-xs text-muted-foreground">{row.original.telepon ?? "-"}</p>
                </div>
            ),
        },
        {
            id: "dosen_pembimbing",
            header: () => {
                if (onSort) {
                    return (
                        <PembimbingHeader
                            currentSort={currentSort}
                            onSort={onSort}
                        />
                    );
                }
                return "Dosen Pembimbing";
            },
            size: 280,
            cell: ({ row }) => {
                const dosen = row.original.dosen_pembimbing;
                if (!dosen) return <span className="text-sm text-muted-foreground">-</span>;

                const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : "";
                const nama = dosen.nama ?? "";
                const gelarBelakang = dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : "";

                return (
                    <p className="text-sm">{gelarDepan}{nama}{gelarBelakang}</p>
                );
            },
        },
        {
            id: "periode",
            header: "Periode",
            size: 160,
            cell: ({ row }) => {
                const raw = row.original as unknown as Record<string, any>;
                const kodePeriode = raw.kode_periode;
                const tahunAjaran = raw.tahun_ajaran;

                if (!kodePeriode && !tahunAjaran) {
                    return <span className="text-sm text-muted-foreground">-</span>;
                }

                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{kodePeriode ?? "-"}</span>
                        {tahunAjaran && <span className="text-xs text-muted-foreground">{tahunAjaran}</span>}
                    </div>
                );
            },
        },
        {
            id: "status",
            header: "Status",
            size: 120,
            cell: ({ row }) => {
                const raw = row.original as unknown as Record<string, any>;
                const tipeKp = raw.tipe_kp;

                if (tipeKp === 'konversi') {
                    return (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            Konversi
                        </span>
                    );
                }

                if (tipeKp === 'reguler') {
                    return (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                            Reguler
                        </span>
                    );
                }

                return (
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded">
                        Belum Ada
                    </span>
                );
            },
        },
    ];
};