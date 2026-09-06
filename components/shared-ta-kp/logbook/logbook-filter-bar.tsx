"use client";

import { Grid3X3, TableProperties } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CustomSolidTabs } from "@/components/custom-solid-tabs";
import SearchControl from "@/components/search-control";

interface LogbookTab {
  status: string;
  label: string;
}

interface LogbookFilterBarProps {
  tabs: LogbookTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  viewMode: "card" | "table";
  onViewModeChange: (mode: "card" | "table") => void;
  searchPlaceholder?: string;
}

export function LogbookFilterBar({
  tabs,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  searchPlaceholder = "Cari berdasarkan nama atau NIM..",
}: LogbookFilterBarProps) {
  return (
    <div className="flex gap-4 justify-between items-center">
      <CustomSolidTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <div className="flex gap-2 items-center">
        <SearchControl
          className="flex-grow"
          placeholder={searchPlaceholder}
        />
        <Select
          value={viewMode}
          onValueChange={(value: "card" | "table") => onViewModeChange(value)}
        >
          <SelectTrigger className="w-[120px]">
            <div className="flex items-center">
              {viewMode === "card" ? (
                <Grid3X3 className="size-4 mr-2" />
              ) : (
                <TableProperties className="size-4 mr-2" />
              )}
              <span>{viewMode === "card" ? "Kartu" : "Tabel"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card">
              <div className="flex items-center">
                <Grid3X3 className="size-4 mr-2" />
                Tampilan Kartu
              </div>
            </SelectItem>
            <SelectItem value="table">
              <div className="flex items-center">
                <TableProperties className="size-4 mr-2" />
                Tampilan Tabel
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
