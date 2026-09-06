"use client";

import type React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  total: number;
  limit?: number;
  limitOptions?: number[];
  defaultLimit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export default function PaginationControls({
  currentPage,
  lastPage,
  total,
  limit: limitProp,
  limitOptions = [5, 10, 20, 50],
  defaultLimit = 5,
  onPageChange,
  onLimitChange,
}: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const limit = limitProp ?? (Number(searchParams.get("limit")) || defaultLimit);

  const updateSearchParams = (newParams: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      updateSearchParams({ page: newPage.toString() });
    }
  };

  const handleLimitChange = (value: string) => {
    if (onLimitChange) {
      onLimitChange(Number(value));
    } else {
      updateSearchParams({ limit: value, page: "1" });
    }
  };

  // Generate pagination buttons dengan logika yang lebih fleksibel
  const renderPageButtons = () => {
    const buttons: ReactNode[] = [];

    // Jika lastPage <= 5, tampilkan semua halaman
    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) {
        buttons.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Selalu tampilkan halaman pertama
      buttons.push(
        <Button
          key={1}
          variant={1 === currentPage ? "default" : "outline"}
          size="icon"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );

      // Logika untuk menentukan halaman mana yang ditampilkan
      if (currentPage <= 3) {
        // Jika currentPage <= 3: 1 2 3 ... lastPage
        for (let i = 2; i <= 3; i++) {
          buttons.push(
            <Button
              key={i}
              variant={i === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Button>
          );
        }

        // Tambahkan ellipsis jika ada gap
        if (lastPage > 4) {
          buttons.push(
            <span
              key="ellipsis-end"
              className="text-sm text-muted-foreground px-2"
            >
              ...
            </span>
          );
        }
      } else if (currentPage >= lastPage - 2) {
        // Jika currentPage >= lastPage - 2: 1 ... (lastPage-2) (lastPage-1) lastPage
        if (lastPage > 4) {
          buttons.push(
            <span
              key="ellipsis-start"
              className="text-sm text-muted-foreground px-2"
            >
              ...
            </span>
          );
        }

        for (let i = Math.max(2, lastPage - 2); i <= lastPage - 1; i++) {
          buttons.push(
            <Button
              key={i}
              variant={i === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Button>
          );
        }
      } else {
        // Jika currentPage di tengah: 1 ... (currentPage-1) currentPage (currentPage+1) ... lastPage
        buttons.push(
          <span
            key="ellipsis-start"
            className="text-sm text-muted-foreground px-2"
          >
            ...
          </span>
        );

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(
            <Button
              key={i}
              variant={i === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Button>
          );
        }

        buttons.push(
          <span
            key="ellipsis-end"
            className="text-sm text-muted-foreground px-2"
          >
            ...
          </span>
        );
      }

      // Selalu tampilkan halaman terakhir (jika bukan halaman 1)
      if (lastPage > 1) {
        buttons.push(
          <Button
            key={lastPage}
            variant={lastPage === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => handlePageChange(lastPage)}
          >
            {lastPage}
          </Button>
        );
      }
    }

    return buttons;
  };

  return (
    <div className="pt-4 bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {lastPage} ({total} total items)
        </span>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {renderPageButtons()}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= lastPage}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[145px] h-10 !bg-white">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {limitOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  <span className="text-sm">Show</span> {option} items
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
