/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { EWSDashboardService } from "@/api/ews";
import { useProfile } from "@/context/profileUseContext";
import {
  isGeneralProdiFilter,
  useProdiFilter,
} from "@/context/prodiFilterContext";
import Link from "next/link";
import { ChevronRight, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
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
import DashboardExport from "./dashboard-export";

const MahasiswaSummaryTable = () => {
  const { profile } = useProfile();
  const role = profile?.roles;
  const { selectedProdiIds } = useProdiFilter();
  const isGeneral = isGeneralProdiFilter(selectedProdiIds);
  const [expandedProdi, setExpandedProdi] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    setPage(1);
    setExpandedProdi(null);
  }, [selectedProdiIds]);

  const prodiIdParam = isGeneral ? undefined : selectedProdiIds.join(",");

  const {
    data: response,
    isLoading,
    error,
  } = useSWR(
    role ? [`ews-summary-table-${role}`, prodiIdParam || "general"] : null,
    () =>
      role === "super_fakultas"
        ? EWSDashboardService.getSuperFakultasDashboard({ prodi_id: prodiIdParam })
        : EWSDashboardService.getAdminDashboard({ prodi_id: prodiIdParam }),
    { revalidateOnFocus: false }
  );

  // Fetch detail data when a prodi is expanded
  const { data: detailResponse, isLoading: isDetailLoading } = useSWR(
    expandedProdi && role === "super_fakultas"
      ? [`ews-detail-${role}`, expandedProdi]
      : null,
    () =>
      role === "super_fakultas"
        ? EWSDashboardService.getSuperFakultasDashboardDetail({
            prodi_id: String(expandedProdi),
          })
        : EWSDashboardService.getAdminDashboardDetail(),
    { revalidateOnFocus: false }
  );

  const data = useMemo(() => {
    const allData = response?.data?.tabel_ringkasan_prodi || [];
    if (isGeneral) return allData;
    return allData.filter((item: any) => 
      selectedProdiIds.includes(String(item.prodi?.id))
    );
  }, [response, isGeneral, selectedProdiIds]);

  // Get detail data for expanded prodi
  const detailData = detailResponse?.data?.[0];
  const tahunAngkatan = useMemo(
    () => detailData?.tahun_angkatan || [],
    [detailData]
  );

  // Reset page when data changes
  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return data.slice(start, start + limit);
  }, [data, page, limit]);

  const lastPage = Math.max(1, Math.ceil(data.length / limit));
  const total = data.length;

  const toggleProdi = (prodiId: number) => {
    setExpandedProdi(expandedProdi === prodiId ? null : prodiId);
  };

  return (
    <Card className="shadow-none border-none p-0">
      <CardHeader className="pt-6 flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Tabel Ringkasan Mahasiswa</CardTitle>
          <CardDescription className="text-sm">
            Ringkasan data mahasiswa berdasarkan {role === "super_fakultas" ? "program studi" : "tahun masuk"}
          </CardDescription>
        </div>
        <DashboardExport />
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <EmptyState
            icon={AlertCircle}
            title="Gagal memuat data"
            subtitle="Terjadi kesalahan saat memuat data ringkasan mahasiswa"
            variant="small"
            className="py-8"
          />
        ) : (
          <>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-10">No</TableHead>
                    <TableHead>
                      {role === "super_fakultas" ? "Prodi" : "Tahun Masuk"}
                    </TableHead>
                    <TableHead className="text-center">Jmlh Mhs</TableHead>
                    <TableHead className="text-center">Aktif</TableHead>
                    <TableHead className="text-center">Cuti</TableHead>
                    <TableHead className="text-center">Mangkir</TableHead>
                    <TableHead className="text-center">DO</TableHead>
                    <TableHead className="text-center">Meninggal</TableHead>
                    <TableHead className="text-center">IPK Avg</TableHead>
                    <TableHead className="text-center">Eligible</TableHead>
                    <TableHead className="text-center">Tdk Eligible</TableHead>
                    <TableHead className="text-center">Tepat Waktu</TableHead>
                    <TableHead className="text-center">Normal</TableHead>
                    <TableHead className="text-center">Perhatian</TableHead>
                    <TableHead className="text-center">Kritis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {role === "super_fakultas" ? (
                    paginatedData.map((item: any, index: number) => (
                      <SuperFakultasRow
                        key={item.prodi?.id ?? index}
                        item={item}
                        index={index}
                        page={page}
                        limit={limit}
                        isExpanded={expandedProdi === item.prodi?.id}
                        onToggle={() => toggleProdi(item.prodi?.id)}
                        tahunAngkatan={expandedProdi === item.prodi?.id ? tahunAngkatan : []}
                        isDetailLoading={expandedProdi === item.prodi?.id && isDetailLoading}
                      />
                    ))
                  ) : (
                    paginatedData.map((item: any, index: number) => (
                      <AdminRow
                        key={`${item.tahun_masuk}-${index}`}
                        item={item}
                        index={index}
                        page={page}
                        limit={limit}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
              {data.length === 0 && (
                <EmptyState
                  icon={AlertCircle}
                  title="Tidak ada data"
                  subtitle="Belum ada data ringkasan mahasiswa tersedia"
                  variant="small"
                  className="py-8"
                />
              )}
            </div>
            {data.length > 0 && (
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
  );
};

function StatBadge({
  value,
  href,
  variant,
}: {
  value: number | string;
  href: string;
  variant: "default" | "success" | "destructiveOutline" | "destructive" | "orange" | "blue" | "yellow" | "secondary";
}) {
  return (
    <Link href={href} className="inline-block">
      <Badge variant={variant}>{value}</Badge>
    </Link>
  );
}

function SuperFakultasRow({
  item,
  index,
  page,
  limit,
  isExpanded,
  onToggle,
  tahunAngkatan,
  isDetailLoading,
}: {
  item: any;
  index: number;
  page: number;
  limit: number;
  isExpanded: boolean;
  onToggle: () => void;
  tahunAngkatan: any[];
  isDetailLoading: boolean;
}) {
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {(page - 1) * limit + index + 1}
        </TableCell>
        <TableCell>
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-2 hover:text-primary transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-semibold">{item.prodi?.kode_prodi}</span>
            <span className="text-muted-foreground">{item.prodi?.nama_prodi}</span>
          </button>
        </TableCell>
        <TableCell className="text-center font-medium">
          {item.jumlah_mahasiswa}
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.jumlah_mahasiswa_aktif}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&status_mahasiswa=aktif`}
            variant="success"
          />
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.jumlah_mahasiswa_cuti}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&status_mahasiswa=cuti`}
            variant="orange"
          />
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.jumlah_mahasiswa_mangkir}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&status_mahasiswa=mangkir`}
            variant="destructiveOutline"
          />
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.jumlah_do ?? 0}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&status_mahasiswa=do`}
            variant="destructiveOutline"
          />
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.jumlah_mahasiswa_tidak_aktif ?? item.jumlah_meninggal ?? 0}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&status_mahasiswa=tidak_aktif`}
            variant="secondary"
          />
        </TableCell>
        <TableCell className="text-center font-medium">
          {parseFloat(item.ipk_rata_rata || 0).toFixed(2)}
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.eligible ?? item.jumlah_eligible ?? 0}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&status_kelulusan=eligible`}
            variant="success"
          />
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.tidak_eligible ?? item.noneligible ?? item.jumlah_tidak_eligible ?? 0}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&status_kelulusan=noneligible`}
            variant="destructiveOutline"
          />
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.jumlah_tepat_waktu}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&ews_status=tepat_waktu`}
            variant="blue"
          />
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.jumlah_normal}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&ews_status=normal`}
            variant="success"
          />
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.jumlah_perhatian}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&ews_status=perhatian`}
            variant="yellow"
          />
        </TableCell>
        <TableCell className="text-center">
          <StatBadge
            value={item.jumlah_kritis}
            href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=semua&ews_status=kritis`}
            variant="destructiveOutline"
          />
        </TableCell>
      </TableRow>

      {isExpanded && (
        isDetailLoading ? (
          <TableRow>
            <TableCell colSpan={15} className="text-center py-6 bg-muted/30">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Memuat detail angkatan...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : tahunAngkatan.length === 0 ? (
          <TableRow>
            <TableCell colSpan={15} className="text-center py-4 text-muted-foreground text-xs bg-muted/30">
              Tidak ada data angkatan
            </TableCell>
          </TableRow>
        ) : (
          tahunAngkatan.map((ta: any, idx: number) => (
            <TableRow key={`detail-${idx}`} className="bg-muted/20">
              <TableCell></TableCell>
              <TableCell className="pl-10">
                <Link
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}`}
                  className="hover:text-primary hover:underline inline-flex items-center text-sm font-medium"
                >
                  {ta.tahun_masuk}
                </Link>
              </TableCell>
              <TableCell className="text-center font-medium">
                {ta.jumlah_mahasiswa}
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.mahasiswa_aktif ?? ta.jumlah_mahasiswa_aktif ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&status_mahasiswa=aktif`}
                  variant="success"
                />
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.jumlah_cuti ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&status_mahasiswa=cuti`}
                  variant="orange"
                />
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.jumlah_mangkir ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&status_mahasiswa=mangkir`}
                  variant="destructiveOutline"
                />
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.jumlah_do ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&status_mahasiswa=do`}
                  variant="destructiveOutline"
                />
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.jumlah_tidak_aktif ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&status_mahasiswa=tidak_aktif`}
                  variant="secondary"
                />
              </TableCell>
              <TableCell className="text-center font-medium">
                {parseFloat(ta.ipk_rata_rata || 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.eligible ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&status_kelulusan=eligible`}
                  variant="success"
                />
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.tidak_eligible ?? ta.noneligible ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&status_kelulusan=noneligible`}
                  variant="destructiveOutline"
                />
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.tepat_waktu ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&ews_status=tepat_waktu`}
                  variant="blue"
                />
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.normal ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&ews_status=normal`}
                  variant="success"
                />
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.perhatian ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&ews_status=perhatian`}
                  variant="yellow"
                />
              </TableCell>
              <TableCell className="text-center">
                <StatBadge
                  value={ta.kritis ?? 0}
                  href={`/ews/mahasiswa?prodi=${item.prodi?.id}&tahun_masuk=${ta.tahun_masuk}&ews_status=kritis`}
                  variant="destructiveOutline"
                />
              </TableCell>
            </TableRow>
          ))
        )
      )}
    </>
  );
}

function AdminRow({ item, index, page, limit }: { item: any; index: number; page: number; limit: number }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{(page - 1) * limit + index + 1}</TableCell>
      <TableCell>
        <span className="font-semibold">{item.tahun_masuk}</span>
      </TableCell>
      <TableCell className="text-center font-medium">{item.jumlah_mahasiswa}</TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.jumlah_mahasiswa_aktif}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&status_mahasiswa=aktif`}
          variant="success"
        />
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.jumlah_mahasiswa_cuti}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&status_mahasiswa=cuti`}
          variant="orange"
        />
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.jumlah_mahasiswa_mangkir}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&status_mahasiswa=mangkir`}
          variant="destructiveOutline"
        />
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.jumlah_do ?? 0}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&status_mahasiswa=do`}
          variant="destructiveOutline"
        />
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.jumlah_mahasiswa_tidak_aktif ?? item.jumlah_meninggal ?? 0}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&status_mahasiswa=tidak_aktif`}
          variant="secondary"
        />
      </TableCell>
      <TableCell className="text-center font-medium">
        {parseFloat(item.ipk_rata_rata || 0).toFixed(2)}
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.eligible ?? item.jumlah_eligible ?? 0}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&status_kelulusan=eligible`}
          variant="success"
        />
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.tidak_eligible ?? item.noneligible ?? item.jumlah_tidak_eligible ?? 0}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&status_kelulusan=noneligible`}
          variant="destructiveOutline"
        />
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.jumlah_tepat_waktu}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&ews_status=tepat_waktu`}
          variant="blue"
        />
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.jumlah_normal}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&ews_status=normal`}
          variant="success"
        />
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.jumlah_perhatian}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&ews_status=perhatian`}
          variant="yellow"
        />
      </TableCell>
      <TableCell className="text-center">
        <StatBadge
          value={item.jumlah_kritis}
          href={`/ews/mahasiswa?tahun_masuk=${item.tahun_masuk}&ews_status=kritis`}
          variant="destructiveOutline"
        />
      </TableCell>
    </TableRow>
  );
}

export default MahasiswaSummaryTable;
