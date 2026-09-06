"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { SortConfig, SortOption } from "@/types/kerja-praktek/sortconfig"

const sortOptionsDosen: SortOption[] = [
  {
    value: "name-asc",
    label: "Nama (A-Z)",
    sortConfig: { name: "asc" }
  },
  {
    value: "name-desc",
    label: "Nama (Z-A)",
    sortConfig: { name: "desc" }
  },
  {
    value: "npp-asc",
    label: "NPP (A-Z)",
    sortConfig: { npp: "asc" }
  },
  {
    value: "npp-desc",
    label: "NPP (Z-A)",
    sortConfig: { npp: "desc" }
  },
]

const sortOptionsMahasiswa: SortOption[] = [
  {
    value: "name-asc",
    label: "Nama (A-Z)",
    sortConfig: { name: "asc" }
  },
  {
    value: "name-desc",
    label: "Nama (Z-A)",
    sortConfig: { name: "desc" }
  },
  {
    value: "nim-asc",
    label: "NIM (A-Z)",
    sortConfig: { nim: "asc" }
  },
  {
    value: "nim-desc",
    label: "NIM (Z-A)",
    sortConfig: { nim: "desc" }
  },
  {
    value: "pembimbing-asc",
    label: "Pembimbing (A-Z)",
    sortConfig: { pembimbing: "asc" }
  },
  {
    value: "pembimbing-desc",
    label: "Pembimbing (Z-A)",
    sortConfig: { pembimbing: "desc" }
  },
]

const sortOptionsDefault: SortOption[] = [
  {
    value: "name-asc",
    label: "Nama (A-Z)",
    sortConfig: { name: "asc" }
  },
  {
    value: "name-desc",
    label: "Nama (Z-A)",
    sortConfig: { name: "desc" }
  },
]

interface SortSelectorProps {
  onChange?: (sortConfig: SortConfig | null) => void;
  className?: string;
  type?: "dosen" | "mahasiswa" | "default";
}

const getSortOptions = (type?: "dosen" | "mahasiswa" | "default"): SortOption[] => {
  switch (type) {
    case "dosen":
      return sortOptionsDosen;
    case "mahasiswa":
      return sortOptionsMahasiswa;
    default:
      return sortOptionsDefault;
  }
};

export const SortSelector = ({ onChange, className, type }: SortSelectorProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sortOptions = getSortOptions(type)

  const sortFromUrl = searchParams.get("sort")

  const handleValueChange = (newValue: string) => {
    if (newValue === "default") {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("sort")
      router.push(`${pathname}?${params.toString()}`)
      onChange?.(null)
      return
    }

    const selectedOption = sortOptions.find(option => option.value === newValue)
    if (selectedOption) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sort", encodeURIComponent(JSON.stringify(selectedOption.sortConfig)))
      router.push(`${pathname}?${params.toString()}`)
      onChange?.(selectedOption.sortConfig)
    }
  }

  const currentValue = sortFromUrl || "default"

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger className={`h-full min-w-[160px] ${className ?? ''}`}>
        <SelectValue placeholder="Urutkan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const SortSelectorDosen = (props: Omit<SortSelectorProps, "type">) => (
  <SortSelector {...props} type="dosen" />
);

export const SortSelectorMahasiswa = (props: Omit<SortSelectorProps, "type">) => (
  <SortSelector {...props} type="mahasiswa" />
);
