/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, Loader2, Download, AlertCircle, ArrowLeft } from "lucide-react";
import { EWSDashboardService, EWSStatistikKelulusanService } from "@/api/ews";
import { useProfile } from "@/context/profileUseContext";
import DashboardHeader from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/empty-state";
import PaginationControls from "@/components/pagination-control";

interface MahasiswaItem {
  mahasiswa_id: number;
  nim: string;
  nama_mahasiswa: string;
  prodi: { id: number; kode_prodi: string; nama_prodi: string };
  tahun_masuk: number;
  sks_total: number;
  ipk: number;
  status_mahasiswa: string;
  ews_status: string | null;
  status_kelulusan: string | null;
}

const ewsConfig: Record<
  string,
  { label: string; variant: "blue" | "success" | "yellow" | "destructiveOutline" }
> = {
  tepat_waktu: { label: "Tepat Waktu", variant: "blue" },
  normal: { label: "Normal", variant: "success" },
  perhatian: { label: "Perhatian", variant: "yellow" },
  kritis: { label: "Kritis", variant: "destructiveOutline" },
};

const statusMhsConfig: Record<
  string,
  { variant: "success" | "orange" | "secondary" }
> = {
  aktif: { variant: "success" },
  cuti: { variant: "orange" },
  mangkir: { variant: "secondary" },
};

const kelulusanConfig: Record<
  string,
  { label: string; variant: "success" | "destructiveOutline" | "secondary" }
> = {
  eligible: { label: "Eligible", variant: "success" },
  noneligible: { label: "Tidak Eligible", variant: "destructiveOutline" },
};

function EwsBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;
  const cfg = ewsConfig[status];
  if (!cfg) return <span className="text-xs text-muted-foreground">{status}</span>;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusMhsConfig[status] ?? { variant: "secondary" as const };
  return (
    <Badge variant={cfg.variant} className="capitalize">
      {status}
    </Badge>
  );
}

function KelulusanBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;
  const cfg = kelulusanConfig[status] ?? {
    label: status,
    variant: "secondary" as const,
  };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

function MahasiswaDetailView({
  prodiId,
  tahunMasuk,
  ewsStatus,
  statusMahasiswa,
  statusKelulusan,
  prodiLabel,
  role,
}: {
  prodiId: string | null;
  tahunMasuk: string;
  ewsStatus: string | null;
  statusMahasiswa: string | null;
  statusKelulusan: string | null;
  prodiLabel: string;
  role: string;
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [limit, setLimit] = useState(5);

  const { data: response, isLoading, error } = useSWR(
    [
      "mahasiswa-by-status",
      prodiId,
      tahunMasuk,
      ewsStatus,
      statusMahasiswa,
      statusKelulusan,
    ],
    () =>
      role === "super_fakultas"
        ? EWSDashboardService.getMahasiswaByStatus({
            prodi_id: prodiId ?? undefined,
            tahun_masuk: tahunMasuk === "semua" ? undefined : tahunMasuk,
            status_mahasiswa: statusMahasiswa ?? undefined,
            ews_status: ewsStatus ?? undefined,
            status_kelulusan: statusKelulusan ?? undefined,
          })
        : EWSDashboardService.getAdminMahasiswaByStatus({
            tahun_masuk: tahunMasuk === "semua" ? undefined : tahunMasuk,
            status_mahasiswa: statusMahasiswa ?? undefined,
            ews_status: ewsStatus ?? undefined,
            status_kelulusan: statusKelulusan ?? undefined,
          }),
    { revalidateOnFocus: false }
  );

  // Reset to page 1 whenever filter params change
  useEffect(() => {
    setPage(1);
  }, [prodiId, tahunMasuk, ewsStatus, statusMahasiswa, statusKelulusan]);

  const mahasiswaList = useMemo<MahasiswaItem[]>(() => {
    if (!response?.data) return [];
    if (response.data.mahasiswa && Array.isArray(response.data.mahasiswa)) {
      return response.data.mahasiswa;
    }
    const dataArray = Array.isArray(response.data)
      ? response.data
      : response.data.data && Array.isArray(response.data.data)
        ? response.data.data
        : [];

    const firstItem = dataArray[0];
    if (firstItem && Array.isArray(firstItem.mahasiswa)) {
      const isAllYears = !tahunMasuk || tahunMasuk === "semua";
      const filteredData = !isAllYears
        ? dataArray.filter(
            (item: any) => String(item.tahun_masuk) === String(tahunMasuk)
          )
        : dataArray;
      return filteredData.flatMap((item: any) => item.mahasiswa || []);
    }
    if (Array.isArray(response.data)) return response.data;
    return [];
  }, [response, tahunMasuk]);

  const total: number = mahasiswaList.length;
  const lastPage: number = Math.max(1, Math.ceil(total / limit));

  const paginatedMahasiswa = useMemo(() => {
    const start = (page - 1) * limit;
    return mahasiswaList.slice(start, start + limit);
  }, [mahasiswaList, page, limit]);

  let filterLabel = "";
  if (statusMahasiswa) {
    filterLabel = statusMahasiswa.charAt(0).toUpperCase() + statusMahasiswa.slice(1);
  } else if (statusKelulusan) {
    filterLabel = statusKelulusan === "eligible" ? "Eligible" : "Tidak Eligible";
  } else if (ewsStatus && ewsConfig[ewsStatus]) {
    filterLabel = ewsConfig[ewsStatus].label;
  }

  const handleExport = () => {
    setIsExporting(true);
    const params: any = {
      tahun_masuk: tahunMasuk === "semua" ? undefined : tahunMasuk,
      status_mahasiswa: statusMahasiswa ?? undefined,
      ews_status: ewsStatus ?? undefined,
    };
    if (role === "super_fakultas" && prodiId) params.prodi_id = prodiId;

    const exportTask =
      role === "super_fakultas"
        ? EWSStatistikKelulusanService.exportSuperFakultasMahasiswaByStatus(params)
        : EWSStatistikKelulusanService.exportAdminMahasiswaByStatus(params);

    exportTask
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-mahasiswa-by-status-${role === "super_fakultas" ? "super-fakultas" : "admin"}-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error: any) => alert("Export gagal: " + error.message))
      .finally(() => setIsExporting(false));
  };

  return (
    <>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/ews" },
          { name: "Detail Mahasiswa", url: "/ews/mahasiswa" },
          { name: prodiLabel, url: "#" },
        ]}
        titleItems={[
          {
            title: prodiLabel,
            subtitle: `${tahunMasuk === "semua" ? "Semua Angkatan" : `Angkatan ${tahunMasuk}`}${filterLabel ? ` — ${filterLabel}` : ""}`,
          },
        ]}
      />

      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground">Memuat data mahasiswa...</p>
          </div>
        )}

        {error && (
          <EmptyState
            icon={AlertCircle}
            title="Gagal memuat data"
            subtitle="Terjadi kesalahan saat memuat data mahasiswa. Silakan coba lagi."
            variant="small"
            className="py-16"
          />
        )}

        {!isLoading && !error && mahasiswaList.length === 0 && (
          <EmptyState
            icon={Users}
            title="Tidak ada mahasiswa"
            subtitle="Tidak ada mahasiswa yang sesuai dengan filter ini"
            variant="small"
            className="py-16"
          />
        )}

        {!isLoading && !error && mahasiswaList.length > 0 && (
          <Card className="shadow-none border-none p-0">
            <CardHeader className="pt-6 pb-3 px-0 flex flex-row items-center justify-between gap-4 space-y-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center h-7 w-7 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Kembali"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <CardTitle>Daftar Mahasiswa</CardTitle>
                  <CardDescription className="text-sm">
                    Total {total} mahasiswa ditemukan
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                  <Users className="w-3.5 h-3.5" />
                  <span>{total} mahasiswa</span>
                </div>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export XLSX
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-10">No</TableHead>
                      <TableHead>NIM</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead className="text-center">SKS</TableHead>
                      <TableHead className="text-center">IPK</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">EWS</TableHead>
                      <TableHead className="text-center">Kelulusan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMahasiswa.map((mhs, index) => (
                      <TableRow key={mhs.mahasiswa_id ?? mhs.nim ?? index}>
                        <TableCell className="font-medium">
                          {(page - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {mhs.nim}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="block truncate" title={mhs.nama_mahasiswa}>
                            {mhs.nama_mahasiswa}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">{mhs.sks_total}</TableCell>
                        <TableCell className="text-center font-semibold">
                          {parseFloat(String(mhs.ipk ?? 0)).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={mhs.status_mahasiswa} />
                        </TableCell>
                        <TableCell className="text-center">
                          <EwsBadge status={mhs.ews_status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <KelulusanBadge status={mhs.status_kelulusan} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationControls
                currentPage={page}
                lastPage={lastPage}
                total={total}
                defaultLimit={limit}
                onPageChange={setPage}
                onLimitChange={(l) => {
                  setLimit(l);
                  setPage(1);
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

function MahasiswaSummaryView({
  prodiId,
  prodiLabel,
  role,
}: {
  prodiId: string;
  prodiLabel: string;
  role: string;
}) {
  const [selectedFilter, setSelectedFilter] = useState<{
    tahun_masuk: string;
    ews_status?: string;
    status_mahasiswa?: string;
  } | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data: response, isLoading, error } = useSWR(
    ["super-fakultas-dashboard-detail", prodiId],
    () =>
      role === "super_fakultas"
        ? EWSDashboardService.getSuperFakultasDashboardDetail({ prodi_id: prodiId })
        : EWSDashboardService.getAdminDashboardDetail(),
    { revalidateOnFocus: false }
  );

  const data = response?.data?.[0];
  const tahunAngkatan = useMemo(
    () => data?.tahun_angkatan || [],
    [data]
  );

  const paginatedAngkatan = useMemo(() => {
    const start = (page - 1) * limit;
    return tahunAngkatan.slice(start, start + limit);
  }, [tahunAngkatan, page, limit]);

  const total = tahunAngkatan.length;
  const lastPage = Math.max(1, Math.ceil(total / limit));

  const handleStatClick = (
    tahunMasuk: string,
    filterType: "ews_status" | "status_mahasiswa",
    value: string
  ) => {
    setSelectedFilter({
      tahun_masuk: tahunMasuk,
      [filterType]: value,
    });
    const url = new URL(window.location.href);
    url.searchParams.set("tahun_masuk", tahunMasuk);
    if (filterType === "ews_status") {
      url.searchParams.set("ews_status", value);
      url.searchParams.delete("status_mahasiswa");
    } else {
      url.searchParams.set("status_mahasiswa", value);
      url.searchParams.delete("ews_status");
    }
    window.history.replaceState(null, "", url.toString());
  };

  if (selectedFilter) {
    return (
      <MahasiswaDetailView
        prodiId={prodiId}
        tahunMasuk={selectedFilter.tahun_masuk}
        ewsStatus={selectedFilter.ews_status ?? null}
        statusMahasiswa={selectedFilter.status_mahasiswa ?? null}
        statusKelulusan={null}
        prodiLabel={prodiLabel}
        role={role}
      />
    );
  }

  return (
    <>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/ews" },
          { name: "Detail Mahasiswa", url: "/ews/mahasiswa" },
          { name: prodiLabel, url: "#" },
        ]}
        titleItems={[
          {
            title: prodiLabel,
            subtitle: "Ringkasan mahasiswa per angkatan",
          },
        ]}
      />

      <div className="space-y-4 mt-4">
        <Card className="shadow-none border-none p-0">
          <CardHeader className="pt-6">
            <CardTitle>Ringkasan Mahasiswa per Angkatan</CardTitle>
            <CardDescription className="text-sm">
              Distribusi status dan EWS mahasiswa berdasarkan tahun angkatan
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {isLoading ? (
              <div className="px-4 py-6 space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : error ? (
              <EmptyState
                icon={AlertCircle}
                title="Gagal memuat data"
                subtitle="Terjadi kesalahan saat memuat data ringkasan"
                variant="small"
                className="py-8"
              />
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-10 text-center">No</TableHead>
                        <TableHead>Angkatan</TableHead>
                        <TableHead className="text-center">Jmlh Mhs</TableHead>
                        <TableHead className="text-center">Aktif</TableHead>
                        <TableHead className="text-center">Cuti</TableHead>
                        <TableHead className="text-center">Mangkir</TableHead>
                        <TableHead className="text-center">DO</TableHead>
                        <TableHead className="text-center">Meninggal</TableHead>
                        <TableHead className="text-center">IPK Rata-rata</TableHead>
                        <TableHead className="text-center">Tepat Waktu</TableHead>
                        <TableHead className="text-center">Normal</TableHead>
                        <TableHead className="text-center">Perhatian</TableHead>
                        <TableHead className="text-center">Kritis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAngkatan.map((item: any, index: number) => (
                        <TableRow key={`${item.tahun_masuk}-${index}`}>
                          <TableCell className="text-center font-medium">
                            {(page - 1) * limit + index + 1}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {item.tahun_masuk}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {item.jumlah_mahasiswa}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="success"
                              className="cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleStatClick(String(item.tahun_masuk), "status_mahasiswa", "aktif")
                              }
                            >
                              {item.mahasiswa_aktif ?? item.jumlah_mahasiswa_aktif ?? 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="orange"
                              className="cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleStatClick(String(item.tahun_masuk), "status_mahasiswa", "cuti")
                              }
                            >
                              {item.jumlah_cuti ?? 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="destructiveOutline"
                              className="cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleStatClick(String(item.tahun_masuk), "status_mahasiswa", "mangkir")
                              }
                            >
                              {item.jumlah_mangkir ?? 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="destructiveOutline"
                              className="cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleStatClick(String(item.tahun_masuk), "status_mahasiswa", "do")
                              }
                            >
                              {item.jumlah_do ?? 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="secondary"
                              className="cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleStatClick(String(item.tahun_masuk), "status_mahasiswa", "tidak_aktif")
                              }
                            >
                              {item.jumlah_tidak_aktif ?? 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {parseFloat(item.ipk_rata_rata || 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="blue"
                              className="cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleStatClick(String(item.tahun_masuk), "ews_status", "tepat_waktu")
                              }
                            >
                              {item.tepat_waktu ?? 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="success"
                              className="cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleStatClick(String(item.tahun_masuk), "ews_status", "normal")
                              }
                            >
                              {item.normal ?? 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="yellow"
                              className="cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleStatClick(String(item.tahun_masuk), "ews_status", "perhatian")
                              }
                            >
                              {item.perhatian ?? 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="destructiveOutline"
                              className="cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleStatClick(String(item.tahun_masuk), "ews_status", "kritis")
                              }
                            >
                              {item.kritis ?? 0}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {tahunAngkatan.length === 0 && (
                    <EmptyState
                      icon={Users}
                      title="Tidak ada data"
                      subtitle="Belum ada data angkatan tersedia"
                      variant="small"
                      className="py-8"
                    />
                  )}
                </div>
                {tahunAngkatan.length > 0 && (
                  <PaginationControls
                    currentPage={page}
                    lastPage={lastPage}
                    total={total}
                    defaultLimit={limit}
                    onPageChange={setPage}
                    onLimitChange={(l) => {
                      setLimit(l);
                      setPage(1);
                    }}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function MahasiswaClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useProfile();
  const role = profile?.roles ?? "admin";

  const prodiId = searchParams.get("prodi");
  const tahunMasuk = searchParams.get("tahun_masuk");
  const ewsStatus = searchParams.get("ews_status");
  const statusMahasiswa = searchParams.get("status_mahasiswa");
  const statusKelulusan = searchParams.get("status_kelulusan");

  const isDetailView = !!tahunMasuk && tahunMasuk !== "semua";
  const isAllYearsView =
    tahunMasuk === "semua" && (!!ewsStatus || !!statusMahasiswa || !!statusKelulusan);

  const { data: response, isLoading: summaryLoading } = useSWR(
    prodiId
      ? ["super-fakultas-dashboard-detail", prodiId]
      : role === "admin"
        ? ["admin-dashboard-detail"]
        : null,
    () =>
      role === "super_fakultas"
        ? EWSDashboardService.getSuperFakultasDashboardDetail({ prodi_id: prodiId || "" })
        : EWSDashboardService.getAdminDashboardDetail(),
    { revalidateOnFocus: false }
  );

  const data = response?.data?.[0];
  const prodi = data?.prodi;
  const prodiLabel = prodi
    ? `${prodi.kode_prodi} - ${prodi.nama_prodi}`
    : prodiId
      ? `Prodi ${prodiId}`
      : role === "admin"
        ? `Angkatan ${tahunMasuk || "Semua"}`
        : `Prodi ${prodiId}`;

  if (summaryLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isDetailView || isAllYearsView) {
    return (
      <MahasiswaDetailView
        prodiId={prodiId}
        tahunMasuk={tahunMasuk || "semua"}
        ewsStatus={ewsStatus}
        statusMahasiswa={statusMahasiswa}
        statusKelulusan={statusKelulusan}
        prodiLabel={prodiLabel}
        role={role}
      />
    );
  }

  if (prodiId) {
    return (
      <MahasiswaSummaryView
        prodiId={prodiId}
        prodiLabel={prodiLabel}
        role={role}
      />
    );
  }

  // For admin without specific prodi, show the detail view directly if tahunMasuk is set
  if (role === "admin" && tahunMasuk && tahunMasuk !== "semua") {
    return (
      <MahasiswaDetailView
        prodiId={null}
        tahunMasuk={tahunMasuk}
        ewsStatus={null}
        statusMahasiswa={null}
        statusKelulusan={statusKelulusan}
        prodiLabel={prodiLabel}
        role={role}
      />
    );
  }

  router.push("/ews");
  return null;
}
