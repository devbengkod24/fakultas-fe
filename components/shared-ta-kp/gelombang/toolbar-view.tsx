"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchControl from "@/components/search-control";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export interface PeriodeOption {
  id: number;
  tahun_ajaran: string;
  status: number;
  tgl_awal?: string;
  tgl_akhir?: string;
  tgl_awal_ta?: string;
  tgl_akhir_ta?: string;
}

export interface TipeOption {
  value: string;
  label: string;
}

interface GelombangToolbarViewProps {
  periodeList: PeriodeOption[];
  tipeOptions: TipeOption[];
  onModalClick: () => void;
  onAktifPeriodeChange?: (isAktif: boolean) => void;
  showTambah?: boolean;
  searchPlaceholder?: string;
}

export function GelombangToolbarView({
  periodeList,
  tipeOptions,
  onModalClick,
  onAktifPeriodeChange,
  showTambah = true,
  searchPlaceholder = "Cari gelombang...",
}: GelombangToolbarViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const periodeIdFromUrl = searchParams.get("periode_id") ?? "";
  const tipeFromUrl = searchParams.get("tipe") ?? "";

  const [periodeId, setPeriodeId] = useState(periodeIdFromUrl);
  const [tipe, setTipe] = useState(tipeFromUrl);

  useEffect(() => {
    setPeriodeId(periodeIdFromUrl);
    setTipe(tipeFromUrl);
  }, [periodeIdFromUrl, tipeFromUrl]);

  const updateUrl = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    if (periodeList.length === 0) return;
    const selected = periodeList.find((p) => p.id.toString() === periodeId);
    onAktifPeriodeChange?.(selected?.status === 1);
  }, [periodeId, periodeList, onAktifPeriodeChange]);

  // Auto-select active periode on first load
  useEffect(() => {
    if (periodeIdFromUrl || periodeList.length === 0) return;
    const aktif = periodeList.find((p) => p.status === 1);
    if (aktif) {
      setPeriodeId(aktif.id.toString());
      updateUrl("periode_id", aktif.id.toString());
    }
  }, [periodeList, periodeIdFromUrl, updateUrl]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-center">
      <div className="w-1/3 sm:flex-shrink-0">
        <SearchControl placeholder={searchPlaceholder} className="w-full" />
      </div>

      <div className="w-full sm:w-[180px] sm:flex-shrink-0 sm:ml-auto">
        <Select
          value={periodeId}
          onValueChange={(v) => {
            setPeriodeId(v);
            updateUrl("periode_id", v);
          }}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Semua Periode" />
          </SelectTrigger>
          <SelectContent>
            {periodeList.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.tahun_ajaran}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {tipeOptions.length > 0 && (
        <div className="w-full sm:w-[150px] sm:flex-shrink-0">
          <Select
            value={tipe}
            onValueChange={(v) => {
              const actualValue = v === "semua" ? "" : v;
              setTipe(actualValue);
              updateUrl("tipe", actualValue);
            }}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Tipe</SelectItem>
              {tipeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showTambah && (
        <div className="w-full sm:w-auto">
          <Button onClick={onModalClick} className="h-10 w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Tambah Gelombang
          </Button>
        </div>
      )}
    </div>
  );
}
