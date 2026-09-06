"use client";

import SearchControl from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

interface FilterSyncPublikasiProps {
  onSync?: () => Promise<void>;
  searchPlaceholder?: string;
}

export function FilterSyncPublikasi({ onSync, searchPlaceholder = "Cari berdasarkan judul..." }: FilterSyncPublikasiProps) {
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);

  const handleSync = async () => {
    if (!onSync) return;
    setIsSyncingLocal(true);
    try {
      await onSync();
    } finally {
      setIsSyncingLocal(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="w-full md:w-80">
        <SearchControl placeholder={searchPlaceholder} className="w-full" />
      </div>

      <Button
        onClick={handleSync}
        variant="default"
        size="sm"
        className="h-9 px-4 font-medium flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
        disabled={isSyncingLocal}
      >
        <RefreshCcw className={`h-3.5 w-3.5 ${isSyncingLocal ? "animate-spin" : ""}`} />
        Sync Data
      </Button>
    </div>
  );
}