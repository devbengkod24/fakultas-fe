"use client";

import SearchControl from "@/components/search-control";
import DialogPopUp from "./dialog-popup";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AkunUser } from "@/types/fakultas/users/user";

interface FilterKoordinatorProps {
  onAdd?: (data: AkunUser) => Promise<void>;
}

export function FilterKoordinator({ onAdd }: FilterKoordinatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to page 1 when searching

    router.push(`?${params.toString()}`);
  };

  const handleAddUser = async (data: AkunUser) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3">
      <form onSubmit={handleSearch} className="w-full sm:w-80">
        <SearchControl
          placeholder="Cari Koordinator..."
          className="w-full"
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
      </form>
      <div>
        <DialogPopUp mode="add" onSubmit={handleAddUser} />
      </div>
    </div>
  );
}
