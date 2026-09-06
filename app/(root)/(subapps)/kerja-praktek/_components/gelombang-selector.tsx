"use client"

import { GelombangService } from "@/api/kerja-praktek";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState, useCallback } from "react"
import useSWR from "swr"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Gelombang } from "@/types/kerja-praktek/gelombang";
import { useProfile } from "@/context/profileUseContext";

interface GelombangResponse {
  data: Gelombang[];
  meta: {
    success: boolean;
    message: string;
  };
}

interface GelombangSelectorProps {
  onChange?: (value: string) => void;
  defaultAktif?: boolean;
  periodeId?: string;
  className?: string;
  showAllOption?: boolean;
}

const fetcher = (periodeId?: string, prodiId?: number) =>
  GelombangService.getAllGelombang(
    periodeId ? Number(periodeId) : undefined,
    undefined,
    prodiId,
  ).then((res) => res);

export const GelombangSelector = ({
  onChange,
  defaultAktif = true,
  periodeId,
  className,
  showAllOption = true
}: GelombangSelectorProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();

  const { data, error, isLoading } = useSWR<GelombangResponse>(
    ["gelombang-list", periodeId, activeProdiId ?? "all"],
    () => fetcher(periodeId, activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const gelombangIdFromUrl = searchParams.get("gelombang_id");
  const [value, setValue] = useState<string>(gelombangIdFromUrl ?? "all");

  const selectedGelombang = value && value !== "all"
    ? data?.data?.find(g => g.id?.toString() === value)
    : undefined;

  const updateUrl = useCallback((gelombangId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (gelombangId === "all") {
      // Hapus parameter gelombang_id ketika "Semua Gelombang" dipilih
      params.delete("gelombang_id");
    } else {
      params.set("gelombang_id", gelombangId);
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  useEffect(() => {
    if (gelombangIdFromUrl) {
      setValue(gelombangIdFromUrl);
      return;
    }

    // Default ke "all" (Semua Gelombang) jika showAllOption true
    if (showAllOption) {
      setValue("all");
      if (onChange) {
        onChange("all");
      }
      return;
    }

    // Fallback ke gelombang aktif jika showAllOption false
    if (data?.data && defaultAktif && !gelombangIdFromUrl) {
      const aktivGelombang = data.data.find(g => g.status === 1);
      if (aktivGelombang) {
        const newValue = aktivGelombang.id?.toString() ?? "";
        setValue(newValue);

        updateUrl(newValue);

        if (onChange) {
          onChange(newValue);
        }
      }
    }
  }, [data, defaultAktif, onChange, gelombangIdFromUrl, updateUrl, showAllOption]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);

    updateUrl(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const gelombangList = data?.data || [];
  
  const sortedGelombang = [...gelombangList].sort((a, b) => {
    if ((a.status ?? 0) !== (b.status ?? 0)) {
      return (b.status ?? 0) - (a.status ?? 0);
    }
    const dateA = a.tgl_awal ? new Date(a.tgl_awal).getTime() : 0;
    const dateB = b.tgl_awal ? new Date(b.tgl_awal).getTime() : 0;
    return dateA - dateB;
  });

  // Skeleton untuk value saat loading
  const getPlaceholder = () => {
    if (isLoading) {
      return (
        <div className="flex items-center">
          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      );
    }

    if (value === "all") return "Semua Gelombang";
    if (selectedGelombang) return selectedGelombang.nama_gelombang;
    return "Pilih Gelombang";
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={isLoading}>
      <SelectTrigger className={`h-full ${className ?? ''}`}>
        <SelectValue placeholder={getPlaceholder()} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="px-2 py-4 text-center text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
              <span>Memuat data...</span>
            </div>
          </div>
        ) : error ? (
          <div className="px-2 py-4 text-center text-sm text-red-500">Gagal memuat data</div>
        ) : gelombangList.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm">Tidak ada gelombang</div>
        ) : (
          <SelectGroup>
            {/* Opsi Semua Gelombang */}
            {showAllOption && (
              <SelectItem value="all" className="font-medium">
                <span>Semua Gelombang</span>
              </SelectItem>
            )}
            
            {/* Daftar Gelombang */}
            {sortedGelombang.map(gelombang => (
              <SelectItem
                key={gelombang.id}
                value={gelombang.id?.toString() ?? ""}
                className={gelombang.status === 1 ? "font-medium" : ""}
              >
                <div className="flex flex-col">
                  <span>
                    {gelombang.nama_gelombang} {gelombang.status === 1 ? "(Aktif)" : ""}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};