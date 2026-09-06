"use client";

import { useState } from "react";
import { ListFilter, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useSWR from "swr";
import { ManajemenProdiSuperAdminService } from "@/api/superadmin";

export interface FilterState {
  prodi: string | null;
  type: string | null;
}

export interface AnnouncementFilterProps {
  selectedProdi: string | null;
  selectedType: string | null;
  onFilterChange: (filter: FilterState) => void;
}

export const LAYANAN_LIST = [
  { id: "ta", label: "Tugas Akhir" },
  { id: "kp", label: "Kerja Praktek" },
  { id: "bk", label: "Bimbingan Karir" },
];

export const FAKULTAS_LIST = [
  { id: "general", label: "Umum" },
];

export function AnnouncementFilter({
  selectedProdi,
  selectedType,
  onFilterChange,
}: AnnouncementFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: prodiData } = useSWR(
    "prodi-list",
    () => ManajemenProdiSuperAdminService.getAll(1, 50),
    { revalidateOnFocus: false }
  );

  const rawProdis = Array.isArray(prodiData)
    ? prodiData
    : Array.isArray(prodiData?.data)
    ? prodiData.data
    : Array.isArray((prodiData as any)?.data?.data)
    ? (prodiData as any).data.data
    : [];

  const isActive = !!(selectedProdi || selectedType) || isOpen;

  const handleLayananOrFakultasClick = (typeId: string) => {
    const isFakultas = FAKULTAS_LIST.some((f) => f.id === typeId);
    onFilterChange({
      prodi: isFakultas ? null : selectedProdi,
      type: selectedType === typeId ? null : typeId,
    });
    setIsOpen(false);
  };

  const handleProdiClick = (prodiId: string) => {
    const isCurrentlyFakultas = FAKULTAS_LIST.some((f) => f.id === selectedType);
    onFilterChange({
      prodi: selectedProdi === prodiId ? null : prodiId,
      type: isCurrentlyFakultas ? null : selectedType,
    });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`h-full px-6 inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all border focus:outline-none focus-visible:ring-0 ${
            isActive
              ? "bg-primary text-white border-primary shadow-none"
              : "bg-white text-slate-600 border-gray-300 hover:border-primary hover:text-primary shadow-none"
          }`}
        >
          <ListFilter className="mr-2 h-4 w-4" />
          Filter
          {isActive && (
            <span className="ml-2 bg-white/30 text-white text-xs rounded-full px-2 py-0.5 leading-none font-bold">
              {[selectedProdi, selectedType].filter(Boolean).length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-64 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        style={{
          maxHeight: "calc(var(--radix-dropdown-menu-content-available-height) - 16px)",
        }}
      >
        {/* Section: Program Studi */}
        <div className="mb-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Program Studi
          </p>
          <div className="space-y-0.5">
            {rawProdis.map((p: any) => {
              const id = p.id.toString();
              const isSelected = selectedProdi === id;
              const isFakultasActive = FAKULTAS_LIST.some((f) => f.id === selectedType);
              return (
                <button
                  key={id}
                  onClick={() => handleProdiClick(id)}
                  disabled={isFakultasActive}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${
                    isFakultasActive
                      ? "text-slate-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-gradient-to-r from-primary to-primary-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                  }`}
                >
                  <span className="font-medium">{p.nama || p.name}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Section: Layanan */}
        <div className="mb-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Layanan
          </p>
          <div className="space-y-0.5">
            {LAYANAN_LIST.map((item) => {
              const isSelected = selectedType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLayananOrFakultasClick(item.id)}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-primary-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Section: Fakultas */}
        <div className="mb-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Fakultas
          </p>
          <div className="space-y-0.5">
            {FAKULTAS_LIST.map((item) => {
              const isSelected = selectedType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLayananOrFakultasClick(item.id)}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-primary-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {(selectedProdi || selectedType) && (
          <>
            <DropdownMenuSeparator className="my-2 bg-slate-100" />
            <div>
              <button
                onClick={() => {
                  onFilterChange({ prodi: null, type: null });
                  setIsOpen(false);
                }}
                className="w-full text-center text-xs font-semibold text-red-500 hover:text-red-600 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}