"use client"
import { PeriodeService } from "@/api/kerja-praktek";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState, useCallback } from "react"
import useSWR from "swr"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Periode {
  id: number;
  kode_periode: number;
  tahun_ajaran: string;
  status: number;
}

interface PeriodeResponse {
  success: boolean;
  message: string;
  data: Periode[];
}

interface PeriodeSelectorProps {
  onChange?: (value: string) => void;
  defaultAktif?: boolean;
  className?: string;
  readOnly?: boolean;
}

const fetcher = () =>
  PeriodeService.getAllPeriode().then((res) => res);

export const PeriodeSelector = ({ onChange, defaultAktif = true, className, readOnly = false }: PeriodeSelectorProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, error, isLoading } = useSWR<PeriodeResponse>(
    "periode-list",
    fetcher,
    { revalidateOnFocus: false }
  );

  const periodeIdFromUrl = searchParams.get("periode_id");
  const [value, setValue] = useState<string>(periodeIdFromUrl ?? "");

  const selectedPeriode = value 
    ? data?.data?.find(p => p.id.toString() === value)
    : undefined;

  const updateUrl = useCallback((periodeId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("periode_id", periodeId);
    
    // Reset page ke 1 saat periode berubah
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  useEffect(() => {
    if (periodeIdFromUrl) {
      setValue(periodeIdFromUrl);
      return;
    }

    if (data?.data && defaultAktif && !periodeIdFromUrl) {
      const aktivPeriode = data.data.find(p => p.status === 1);
      if (aktivPeriode) {
        const newValue = aktivPeriode.id.toString();
        setValue(newValue);

        updateUrl(newValue);

        if (onChange) {
          onChange(newValue);
        }
      }
    }
  }, [data, defaultAktif, onChange, periodeIdFromUrl, updateUrl]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);

    updateUrl(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  // Sort periodes by kode_periode descending (terbaru dulu)
  const sortedPeriodes = (data?.data || []).sort((a, b) => b.kode_periode - a.kode_periode);

  const groupedPeriodes: Record<string, Periode[]> = {};
  sortedPeriodes.forEach(periode => {
    const year = periode.tahun_ajaran.substring(0, 4);
    if (!groupedPeriodes[year]) {
      groupedPeriodes[year] = [];
    }
    groupedPeriodes[year].push(periode);
  });

  // Sort years descending dan sort periodes dalam grup berdasarkan semester (ganjil dulu, genap kemudian)
  const sortedYears = Object.keys(groupedPeriodes).sort((a, b) => parseInt(b) - parseInt(a));
  
  sortedYears.forEach(year => {
    groupedPeriodes[year].sort((a, b) => {
      // Ganjil (1) dulu, kemudian Genap (2)
      const getSemester = (kode: number) => kode % 10;
      return getSemester(a.kode_periode) - getSemester(b.kode_periode);
    });
  });

  // Skeleton untuk value saat loading
  const getPlaceholder = () => {
    if (isLoading) {
      return (
        <div className="flex items-center">
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      );
    }
    
    if (selectedPeriode) {
      return selectedPeriode.tahun_ajaran;
    }
    
    return "Pilih Periode";
  };

  if (readOnly) {
    return (
      <div className={`flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm ${className ?? ''}`}>
        {isLoading ? (
          <span className="text-muted-foreground">Memuat periode aktif...</span>
        ) : error ? (
          <span className="text-red-500">Gagal memuat periode</span>
        ) : selectedPeriode ? (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Periode aktif:</span>
            <Badge variant="secondary" className="font-medium">
              {selectedPeriode.tahun_ajaran}
            </Badge>
          </div>
        ) : (
          <span className="text-muted-foreground">Periode aktif tidak tersedia</span>
        )}
      </div>
    );
  }

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
        ) : sortedPeriodes.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm">Tidak ada periode</div>
        ) : (
          sortedYears.map(year => (
            <SelectGroup key={year}>
              <SelectLabel>{year}</SelectLabel>
              {groupedPeriodes[year].map(periode => (
                <SelectItem
                  key={periode.id}
                  value={periode.id.toString()}
                  className={periode.status === 1 ? "font-medium" : ""}
                >
                  <div className="flex flex-col">
                    <span>
                      {periode.tahun_ajaran}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))
        )}
      </SelectContent>
    </Select>
  );
};