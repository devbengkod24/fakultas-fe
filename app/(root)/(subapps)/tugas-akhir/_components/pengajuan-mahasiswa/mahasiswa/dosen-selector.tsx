/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  ExternalLink,
  Users,
  CheckCircle,
  AlertCircle,
  Phone,
} from "lucide-react";
import { PengajuanMahasiswaService } from "@/api/tugas-akhir";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import PaginationControls from "@/components/pagination-control";
import SearchControl from "@/components/search-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getInitials } from "@/lib/utils";

interface Dosen {
  id: number;
  npp: string;
  name: string;
  gelar_depan: string | null;
  gelar_belakang: string;
  kuota: number;
  jumlah_ajuan: number;
  jumlah_diterima: number;
  jumlah_ditolak: number;
  jumlah_pending: number;
  sisa_kuota: number;
  bidang_kajian: string | null;
  email: string;
  telepon: string | null;
  scholar_link: string;
}

interface DosenSelectorProps {
  onSelect: (dosen: Dosen) => void;
  selected: Dosen | null;
}

const fetcher = (
  page: number,
  limit: number,
  search: string,
  filter_kuota: string,
  bidang_kajian: string
) =>
  PengajuanMahasiswaService.getDosenPeriode(
    page,
    limit,
    search,
    filter_kuota,
    bidang_kajian
  ).then((res) => res);

export default function DosenSelector({
  onSelect,
  selected,
}: DosenSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const filter_kuota = searchParams.get("filter_kuota") || "";
  const bidang_kajian = searchParams.get("bidang_kajian") || "";

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR(
    ["dosen-periode", page, limit, search, filter_kuota, bidang_kajian],
    () => fetcher(page, limit, search, filter_kuota, bidang_kajian),
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
    }
  );

  const dosenList: Dosen[] = response?.data || [];
  const pagination = response?.meta?.pagination;

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const getQuotaStatus = (sisa: number) => {
    if (sisa === 0) return { color: "destructiveOutline", text: "Penuh" };
    if (sisa <= 3) return { color: "secondary", text: "Terbatas" };
    return { color: "success", text: "Tersedia" };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-none">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data dosen"
        subtitle="Terjadi kesalahan saat mengambil data dosen. Silakan coba lagi."
        button={
          <Button onClick={() => mutate()} variant="outline">
            Coba Lagi
          </Button>
        }
        className="h-[300px]"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <SearchControl placeholder="Search dosen.." className="flex-1" />
        <Select
          value={filter_kuota || "all"}
          onValueChange={(value) => handleFilterChange("filter_kuota", value)}
        >
          <SelectTrigger className="w-[150px] h-10">
            <SelectValue placeholder="Filter Kuota" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kuota</SelectItem>
            <SelectItem value="tersedia">Tersedia</SelectItem>
            <SelectItem value="penuh">Penuh</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={bidang_kajian || "all"}
          onValueChange={(value) => handleFilterChange("bidang_kajian", value)}
        >
          <SelectTrigger className="w-[150px] h-10">
            <SelectValue placeholder="Bidang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Bidang</SelectItem>
            <SelectItem value="RPLD">RPLD</SelectItem>
            <SelectItem value="SK3D">SK3D</SelectItem>
            <SelectItem value="SC">SC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid xl:grid-cols-3 md:grid-cols-2  gap-4">
        {dosenList.map((dosen, index) => {
          const quotaStatus = getQuotaStatus(dosen.sisa_kuota);
          const isSelected = selected?.id === dosen.id;

          return (
            <Card
              key={index}
              className={`cursor-pointer shadow-none ${
                isSelected
                  ? "ring-1 ring-primary-500 bg-blue-500/5 border-none"
                  : ""
              } ${dosen.sisa_kuota === 0 ? "opacity-60" : ""}`}
              onClick={() => dosen.sisa_kuota > 0 && onSelect(dosen)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="border">
                        {getInitials(dosen.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">
                          {dosen.gelar_depan && `${dosen.gelar_depan} `}
                          {dosen.name}
                          {dosen.gelar_belakang && `, ${dosen.gelar_belakang}`}
                        </h3>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-primary-500" />
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {dosen.email}
                        </div>
                      </div>

                      {dosen.telepon && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {dosen.telepon}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {dosen.bidang_kajian && (
                          <Badge variant="secondary">
                            {dosen.bidang_kajian}
                          </Badge>
                        )}
                        <Badge
                          variant={quotaStatus.color as any}
                          className="flex items-center gap-1"
                        >
                          <Users className="h-3 w-3" />
                          {quotaStatus.text} ({dosen.sisa_kuota} tersisa)
                        </Badge>
                      </div>

                      {dosen.scholar_link && (
                        <div className="flex items-center gap-2">
                          <a
                            href={dosen.scholar_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3" />
                            Google Scholar
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > limit && (
        <PaginationControls
          currentPage={page}
          lastPage={pagination.last_page}
          total={pagination.total}
        />
      )}

      {dosenList.length === 0 && !isLoading && (
        <EmptyState
          icon={Users}
          title="Tidak ada dosen yang ditemukan"
          subtitle="Coba ubah kata kunci pencarian untuk melihat hasil yang berbeda."
          className="h-[300px]"
        />
      )}
    </div>
  );
}
