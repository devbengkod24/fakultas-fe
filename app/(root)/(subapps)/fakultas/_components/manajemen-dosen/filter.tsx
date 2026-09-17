"use client";

import SearchControl from "@/components/search-control";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DosenFakultasService } from "@/api";
import useSWR from "swr";

interface FilterDosenProps {
  hideProdi?: boolean;
}

export function FilterDosen({ hideProdi = false }: FilterDosenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [prodi, setProdi] = useState(searchParams.get("prodi") || "all");
  const [jabatan, setJabatan] = useState(searchParams.get("jabatan") || "all");

  const { data: prodiResponse } = useSWR(
    hideProdi ? null : "prodi-list", // tidak fetch kalau hideProdi
    () => DosenFakultasService.getProdi(),
    { revalidateOnFocus: false }
  );
  const prodiList = prodiResponse?.data?.data ?? [];

  const { data: jabatanResponse } = useSWR(
    "dosen-jabatan-options",
    () => DosenFakultasService.getJabatanOptions(),
    { revalidateOnFocus: false }
  );
  const jabatanList: string[] = jabatanResponse?.data ?? [];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

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

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <form onSubmit={handleSearch} className="w-full">
        <SearchControl
          placeholder="Cari nama dosen..."
          className="w-full"
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
      </form>

      {!hideProdi && (
        <Select
          value={prodi}
          onValueChange={(value) => {
            setProdi(value);
            handleFilterChange("prodi", value);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Prodi Homebase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Prodi</SelectItem>
            {prodiList.map((p: any) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={jabatan}
        onValueChange={(value) => {
          setJabatan(value);
          handleFilterChange("jabatan", value);
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Jabatan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Jabatan</SelectItem>
          {jabatanList.map((j) => (
            <SelectItem key={j} value={j}>
              {j}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}