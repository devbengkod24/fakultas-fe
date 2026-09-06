"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Book,
  BookText,
  ExternalLink,
  FileText,
  AlertCircle,
  CircleCheck,
  CircleX,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import PaginationControls from "@/components/pagination-control";
import EmptyState from "@/components/empty-state";
import { LogbookService } from "@/api/tugas-akhir";
import DashboardHeader from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { LogbookFilterBar } from "@/components/shared-ta-kp/logbook/logbook-filter-bar";
import { LogbookStudentCardView } from "@/components/shared-ta-kp/logbook/logbook-student-card-view";

interface LogbookStudent {
  mahasiswa: {
    id: number;
    name: string;
    nim: string;
    email: string;
    photo: string | null;
    no_telp: string;
    transkrip: string | null;
    status_mahasiswa: string | null;
  };
  jml_bimbingan: number;
  bab_terakhir: number | null;
  folder_ta: string | null;
  kode_periode: number;
  status_tugas_akhir: string;
  krs_ta1: string | null;
  krs_ta2: string | null;
}

interface LogbookResponse {
  data: LogbookStudent[];
  meta: {
    success: boolean;
    message: string;
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

const fetcher = (
  dosenId: number,
  page: number,
  limit: number,
  search: string,
  status_tugas_akhir?: string
) =>
  LogbookService.getLogbookListKoor(
    dosenId,
    page,
    limit,
    search,
    status_tugas_akhir
  ).then((res) => res);

interface StudentLogbookListKoorProps {
  dosenId: number;
}

export function StudentLogbookListKoor({
  dosenId,
}: StudentLogbookListKoorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlTab = searchParams.get("tab") || "ALL";
  const [activePathTab, setActivePathTab] = useState(urlTab);
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const statusTugasAkhir =
    activePathTab === "TA1" ? "1" : activePathTab === "TA2" ? "2" : "";

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<LogbookResponse>(
    ["logbook-list-koor", dosenId, page, limit, search, statusTugasAkhir],
    () => fetcher(dosenId, page, limit, search, statusTugasAkhir),
    {
      dedupingInterval: 1000,
    }
  );

  const pathTabs = [
    { status: "ALL", label: "Semua" },
    { status: "TA1", label: "Tugas Akhir 1" },
    { status: "TA2", label: "Tugas Akhir 2" },
  ];

  const handleTabChange = (tab: string) => {
    setActivePathTab(tab);

    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (tab !== "ALL") {
      params.set("tab", tab);
    } else {
      params.delete("tab");
    }

    router.push(`?${params.toString()}`);
  };

  const columns: ColumnDef<LogbookStudent>[] = [
    {
      id: "nomor",
      header: "No",
      cell: ({ row }) => {
        const page = Number(new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('page')) || 1;
        const limit = Number(new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('limit')) || 10;
        return (
          <div className="font-medium text-center w-8">
            {(page - 1) * limit + row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "mahasiswa.name",
      header: "Mahasiswa",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={student.mahasiswa.photo || ""}
                alt={student.mahasiswa.name}
                className="object-cover"
              />
              <AvatarFallback>
                {student.mahasiswa.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="font-semibold capitalize truncate max-w-[200px]">
                {student.mahasiswa.name.toLowerCase()}
              </span>
              <span className="text-sm text-muted-foreground">
                {student.mahasiswa.nim}
              </span>
              {student.mahasiswa.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate max-w-[180px]">
                    {student.mahasiswa.email}
                  </span>
                </div>
              )}
              {student.mahasiswa.no_telp && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{student.mahasiswa.no_telp}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "status_mahasiswa",
      header: () => <div className="text-center w-full">Status</div>,
      cell: ({ row }) => {
        const status = row.original.mahasiswa.status_mahasiswa;
        const variantMap: Record<string, "success" | "yellow" | "secondary" | "outline"> = {
          aktif: "success",
          mangkir: "yellow",
          "tidak-aktif": "secondary",
          lulus: "outline",
        };
        const variant = status ? (variantMap[status] ?? "secondary") : "secondary";
        return (
          <div className="flex justify-center">
            <Badge variant={variant} className="capitalize">
              {status ?? "-"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "krs_ta1",
      header: () => <div className="text-center w-full">KRS TA-1</div>,
      cell: ({ row }) => {
        const ta1 = Number(row.original.krs_ta1) === 1;
        return (
          <div className="flex justify-center items-center">
            {ta1 ? (
              <CircleCheck className="h-4 w-4 text-green-600" />
            ) : (
              <CircleX className="h-4 w-4 text-red-600" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "krs_ta2",
      header: () => <div className="text-center w-full">KRS TA-2</div>,
      cell: ({ row }) => {
        const ta2 = Number(row.original.krs_ta2) === 1;
        return (
          <div className="flex justify-center items-center">
            {ta2 ? (
              <CircleCheck className="h-4 w-4 text-green-600" />
            ) : (
              <CircleX className="h-4 w-4 text-red-600" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "bab_terakhir",
      header: "Bab Terakhir",
      cell: ({ row }) => {
        const babTerakhir = row.original.bab_terakhir || 0;
        return (
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <span>{babTerakhir}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "jml_bimbingan",
      header: "Total Bimbingan",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.jml_bimbingan}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const babTerakhir = row.original.bab_terakhir || 0;
        const progress = Math.min(100, (babTerakhir / 5) * 100);
        return (
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-2 w-20" />
            <span className="text-sm">{progress.toFixed(0)}%</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex gap-2">
            <Button size="sm" asChild>
              <Link
                href={`/tugas-akhir/logbook/${student.mahasiswa.id}?isKoor=true`}
              >
                <BookText className="mr-1 size-4" />
                Logbook
              </Link>
            </Button>
            {student.folder_ta && (
              <Button size="sm" variant="outline" asChild>
                <a
                  href={student.folder_ta}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-1 size-4" />
                  Folder
                </a>
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 justify-between items-center">
          <div className="flex gap-2">
            {pathTabs.map((tab) => (
              <Skeleton key={tab.status} className="h-10 w-24" />
            ))}
          </div>
          <Skeleton className="h-10 w-80" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden shadow-none">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal Memuat Data"
        subtitle="Terjadi kesalahan saat mengambil data logbook mahasiswa."
        button={
          <Button variant="outline" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/tugas-akhir" },
          {
            name: "Rekap Logbook",
            url: "/tugas-akhir/logbook",
          },
          {
            name: "Logbook Mahasiswa",
            url: `/tugas-akhir/logbook/${dosenId}`,
          },
        ]}
        titleItems={[
          {
            title: "Daftar Logbook Bimbingan",
            subtitle: "Berikut adalah daftar logbook mahasiswa bimbingan.",
          },
        ]}
      />
      <LogbookFilterBar
        tabs={pathTabs}
        activeTab={activePathTab}
        onTabChange={handleTabChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {!response?.data || response.data.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            icon={BookText}
            title="Tidak Ada Data Logbook"
            subtitle={
              activePathTab !== "ALL"
                ? "Tidak ada mahasiswa yang sesuai dengan filter yang dipilih."
                : "Belum ada mahasiswa yang terdaftar dalam logbook."
            }
          />
        </div>
      ) : viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={response.data}
          pagination={{
            currentPage: response.meta.pagination.current_page,
            lastPage: response.meta.pagination.last_page,
            limit: response.meta.pagination.per_page,
            total: response.meta.pagination.total,
          }}
          loading={isLoading}
        />
      ) : (
        <LogbookStudentCardView
          students={response.data}
          getDetailHref={(studentId) =>
            `/tugas-akhir/logbook/${studentId}?isKoor=true`
          }
          folderLabel="Folder TA"
        />
      )}

      {/* Pagination - only show for card view since DataTable handles its own */}
      {viewMode === "card" && response?.meta.pagination && (
        <PaginationControls
          currentPage={response.meta.pagination.current_page}
          lastPage={response.meta.pagination.last_page}
          total={response.meta.pagination.total}
        />
      )}
    </div>
  );
}
