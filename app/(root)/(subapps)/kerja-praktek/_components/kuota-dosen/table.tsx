"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Dosen } from "@/types/kerja-praktek/dosen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  FileText,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { DosenService } from "@/api/kerja-praktek";
import EmptyState from "@/components/empty-state";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import SearchControl from "@/components/search-control";
import { Skeleton } from "@/components/ui/skeleton";
import type { SortConfig } from "@/types/kerja-praktek/sortconfig";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/context/profileUseContext";

const fetchAllDosenFetcher = async (search: string, periode_id?: number, prodi_id?: number) => {
  const limit = 100;
  const firstRes = await DosenService.getAllDosen(1, limit, search, periode_id, undefined, prodi_id);
  const firstPageData: Dosen[] = firstRes?.data ?? [];
  const lastPage: number = firstRes?.meta?.pagination?.last_page ?? 1;

  let merged = [...firstPageData];

  if (lastPage > 1) {
    const pagePromises: Promise<any>[] = [];
    for (let page = 2; page <= lastPage; page += 1) {
      pagePromises.push(DosenService.getAllDosen(page, limit, search, periode_id, undefined, prodi_id));
    }

    const otherPages = await Promise.all(pagePromises);
    const otherData = otherPages.flatMap((res) => res?.data ?? []);
    merged = [...merged, ...otherData];
  }

  return merged;
};

const SortableHeader = ({
  children,
  sortKey,
  currentSort,
  onSort,
}: {
  children: ReactNode;
  sortKey: keyof SortConfig;
  currentSort: SortConfig;
  onSort: (sortConfig: SortConfig | null) => void;
}) => {
  const direction = currentSort[sortKey];

  const handleClick = () => {
    const nextDirection = direction === "asc" ? "desc" : "asc";
    onSort({ [sortKey]: nextDirection } as SortConfig);
  };

  const renderIcon = () => {
    if (direction === "asc") return <ArrowUp className="ml-1 h-4 w-4" />;
    if (direction === "desc") return <ArrowDown className="ml-1 h-4 w-4" />;
    return <ArrowUpDown className="ml-1 h-4 w-4" />;
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      className="h-auto justify-start p-0 font-medium hover:bg-transparent"
    >
      <span>{children}</span>
      {renderIcon()}
    </Button>
  );
};

const KuotaDosenTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();
  const searchTerm = searchParams.get("search") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
  const statusFilter = searchParams.get("status") ?? "all";

  const sortParam = searchParams.get("sort");
  const sortConfig: SortConfig = (() => {
    if (!sortParam) return {};
    try {
      return JSON.parse(decodeURIComponent(sortParam)) as SortConfig;
    } catch {
      return {};
    }
  })();

  const periode_id = Number(searchParams.get("periode_id")) || undefined;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const updateSort = (newSort: SortConfig | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort && Object.keys(newSort).length > 0) {
      params.set("sort", encodeURIComponent(JSON.stringify(newSort)));
    } else {
      params.delete("sort");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const { data: tableData, error, isLoading, mutate: mutateTable } = useSWR(
    ["kuota-dosen-all", searchTerm, periode_id, activeProdiId ?? undefined],
    () => fetchAllDosenFetcher(searchTerm, periode_id, activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const { data: summaryData, isLoading: isSummaryLoading, mutate: mutateSummary } = useSWR(
    ["kuota-dosen-summary", periode_id, activeProdiId ?? undefined],
    () => fetchAllDosenFetcher("", periode_id, activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  // Invalidate both SWR keys. Tabel di-render dari summaryData (filteredAktifDosen),
  // jadi summary wajib di-refresh supaya nilai kuota baru tampil.
  const mutate = () => {
    mutateTable();
    mutateSummary();
  };

  // Listen for plot/reset events from other pages to invalidate cache
  useEffect(() => {
    const handleDospemUpdated = () => {
      mutate();
    };
    window.addEventListener('kp-dospem-updated', handleDospemUpdated);
    return () => window.removeEventListener('kp-dospem-updated', handleDospemUpdated);
  }, [mutateTable, mutateSummary]);

  const allDosen: Dosen[] = tableData ?? [];
  const summaryDosen: Dosen[] = summaryData ?? [];
  const aktifDosen = summaryDosen.filter((d) => d.aktif_periode === true);
  const filteredAktifDosen = aktifDosen.filter((d) => {
    if (statusFilter === "all") return true;
    const isPenuh = (d.sisa_kuota ?? 0) <= 0;
    return statusFilter === "penuh" ? isPenuh : !isPenuh;
  });

  const filteredWithSearch = filteredAktifDosen.filter((d) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const gelarDepan = d.gelar_depan ? `${d.gelar_depan} ` : "";
    const gelarBelakang = d.gelar_belakang ? `, ${d.gelar_belakang}` : "";
    const namaLengkap = `${gelarDepan}${d.nama ?? ""}${gelarBelakang}`.toLowerCase();
    const npp = (d.npp ?? "").toString().toLowerCase();
    return namaLengkap.includes(q) || npp.includes(q);
  });

  const sortedWithSearch = [...filteredWithSearch].sort((a, b) => {
    if (sortConfig.npp) {
      const aVal = (a.npp ?? "").toString();
      const bVal = (b.npp ?? "").toString();
      return sortConfig.npp === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (sortConfig.name) {
      const aVal = a.nama ?? "";
      const bVal = b.nama ?? "";
      return sortConfig.name === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(bVal);
    }

    return 0;
  });

  const totalFiltered = sortedWithSearch.length;
  const lastPage = Math.max(1, Math.ceil(totalFiltered / limit));
  const currentPage = Math.min(page, lastPage);
  const startIndex = (currentPage - 1) * limit;
  const paginatedDosen = sortedWithSearch.slice(startIndex, startIndex + limit);

  const totalKuota = aktifDosen.reduce((sum, d) => sum + (d.kuota ?? 0), 0);
  const totalTerpakai = aktifDosen.reduce(
    (sum, d) => sum + ((d.kuota ?? 0) - (d.sisa_kuota ?? 0)),
    0
  );
  const totalSisaKuota = aktifDosen.reduce((sum, d) => sum + (d.sisa_kuota ?? 0), 0);
  const isInitialLoading = (isLoading && allDosen.length === 0) || (isSummaryLoading && summaryDosen.length === 0);

  const cardData = [
    {
      title: "Dosen Aktif",
      icon: Users,
      count: aktifDosen.length,
      bg: "bg-blue-500/10",
      iconBg: "bg-blue-500/10 text-blue-500",
      titleColor: "text-blue-500",
    },
    {
      title: "Total Kuota",
      icon: CheckCircle,
      count: totalKuota,
      bg: "bg-green-500/10",
      iconBg: "bg-green-500/10 text-green-500",
      titleColor: "text-green-500",
    },
    {
      title: "Terpakai",
      icon: Clock,
      count: totalTerpakai,
      bg: "bg-amber-500/10",
      iconBg: "bg-amber-500/10 text-amber-500",
      titleColor: "text-amber-500",
    },
    {
      title: "Sisa Kuota",
      icon: FileText,
      count: totalSisaKuota,
      bg: "bg-purple-500/10",
      iconBg: "bg-purple-500/10 text-purple-500",
      titleColor: "text-purple-500",
    },
  ];

  const handleKuotaChange = async (id: number, newQuota: number) => {
    try {
      const res = await DosenService.updateKuota(id, newQuota);
      handleToastResponse(res);
      if (res.success) {
        mutate();
      }
    } catch {
      toast.error("Gagal mengubah kuota dosen");
    }
  };

  const columns: ColumnDef<Dosen>[] = [
    {
      header: "No",
      size: 50,
      cell: ({ row }) => {
        const number = (currentPage - 1) * limit + row.index + 1;
        return <div className="text-start">{number}</div>;
      },
    },
    {
      accessorKey: "nama",
      header: () => (
        <SortableHeader sortKey="name" currentSort={sortConfig} onSort={updateSort}>
          Nama Dosen
        </SortableHeader>
      ),
      size: 250,
      cell: ({ row }) => {
        const d = row.original;
        const gelarDepan = d.gelar_depan ? `${d.gelar_depan} ` : "";
        const gelarBelakang = d.gelar_belakang ? `, ${d.gelar_belakang}` : "";
        const photo = (d as any).photo || (d as any).avatar || "";
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {photo ? (
                <AvatarImage src={photo} alt={d.nama ?? ""} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-muted text-muted-foreground">{(d.nama || "?").charAt(0).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium truncate">{gelarDepan}{d.nama ?? ""}{gelarBelakang}</span>
              <span className="text-sm text-muted-foreground truncate">{d.npp}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "kuota",
      header: () => <div className="text-center">Kuota</div>,
      size: 80,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex justify-center">
            <Input
              type="text"
              defaultValue={d.kuota?.toString() ?? "0"}
              onBlur={(e) => {
                const newQuota = parseInt(e.target.value) || 0;
                if (newQuota !== (d.kuota ?? 0)) {
                  handleKuotaChange(d.id!, newQuota);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="h-8 w-16 text-center"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "jumlah_ajuan",
      header: () => <div className="text-center">Jumlah Ajuan</div>,
      size: 70,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("jumlah_ajuan") ?? 0}</div>
      ),
    },
    {
      accessorKey: "ajuan_diterima",
      header: () => <div className="text-center">Ajuan Diterima</div>,
      size: 90,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("ajuan_diterima") ?? 0}</div>
      ),
    },
    {
      accessorKey: "ajuan_ditolak",
      header: () => <div className="text-center">Ajuan Ditolak</div>,
      size: 90,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("ajuan_ditolak") ?? 0}</div>
      ),
    },
    {
      accessorKey: "sisa_kuota",
      header: () => <div className="text-center">Sisa Kuota</div>,
      size: 70,
      cell: ({ row }) => {
        const d = row.original;
        return <div className="text-center">{d.sisa_kuota ?? 0}</div>;
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      size: 100,
      cell: ({ row }) => {
        const d = row.original;
        const isPenuh = (d.sisa_kuota ?? 0) === 0;
        return (
          <div className="flex justify-center">
            <Badge variant={isPenuh ? "destructiveOutline" : "success"} className="text-xs">
              {isPenuh ? "Penuh" : "Tersedia"}
            </Badge>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data kuota dosen."
        button={<Button onClick={() => window.location.reload()}>Coba Lagi</Button>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
        {cardData.map((card, index) => {
          const Icon = card.icon;

          return (
            <div key={index} className={`${card.bg} rounded-xl p-2.5`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className={card.titleColor}>
                    {isInitialLoading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      card.count
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">{card.title}</CardDescription>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 w-full flex-wrap">
        <SearchControl placeholder="Cari nama dosen..." className="w-1/4" />

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <Select
            value={sortConfig.npp ? `npp-${sortConfig.npp}` : sortConfig.name ? `name-${sortConfig.name}` : "default"}
            onValueChange={(value) => {
              if (value === "default") {
                updateSort(null);
                return;
              }

              const [key, direction] = value.split("-") as ["npp" | "name", "asc" | "desc"];
              updateSort({ [key]: direction } as SortConfig);
            }}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="npp-asc">NPP (A-Z)</SelectItem>
              <SelectItem value="npp-desc">NPP (Z-A)</SelectItem>
              <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="tersedia">Tersedia</SelectItem>
              <SelectItem value="penuh">Penuh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isInitialLoading ? (
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={[]}
            loading={true}
            pagination={{
              currentPage,
              lastPage,
              limit,
              total: 0,
            }}
          />
        </div>
      ) : filteredAktifDosen.length === 0 ? (
        <EmptyState
          icon={Users}
          title={aktifDosen.length === 0 ? "Belum ada dosen aktif" : "Tidak ada data sesuai filter"}
          subtitle={
            aktifDosen.length === 0
              ? "Belum ada dosen yang diaktifkan untuk periode ini. Silakan aktifkan dosen terlebih dahulu di Data Dosen."
              : "Ubah filter status atau kata kunci pencarian untuk melihat data lainnya."
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={paginatedDosen}
            loading={isLoading}
            pagination={{
              currentPage,
              lastPage,
              limit,
              total: totalFiltered,
            }}
          />
        </div>
      )}
    </div>
  );
};

export { KuotaDosenTable };