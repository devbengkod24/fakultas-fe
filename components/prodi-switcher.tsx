"use client";

import React from "react";
import { useProfile } from "@/context/profileUseContext";
import { Building2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

export const ProdiSwitcher = () => {
  const { profile, activeProdiId, setActiveProdiId } = useProfile();
  const router = useRouter();

  const handleSwitch = (id: number) => {
    if (id === activeProdiId) return;
    setActiveProdiId(id);
    mutate(() => true, undefined, { revalidate: true });
    router.refresh();
  };

  const prodiList = profile?.daftar_prodi || [];

  if (!prodiList || prodiList.length === 0) {
    return null;
  }

  const activeProdi =
    prodiList.find((p) => p.id === activeProdiId) || prodiList[0];

  if (prodiList.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted/50 rounded-md">
        <Building2 className="w-4 h-4" />
        <span className="truncate max-w-[200px]">{activeProdi.nama}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2 h-9 px-3"
        >
          <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="truncate flex-1 text-left font-medium">
            {activeProdi.nama}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className="w-[--radix-dropdown-menu-trigger-width]"
      >
        {prodiList.map((prodi) => (
          <DropdownMenuItem
            key={prodi.id}
            onClick={() => handleSwitch(prodi.id)}
            className={`cursor-pointer ${
              activeProdiId === prodi.id
                ? "bg-primary/10 font-medium text-primary"
                : ""
            }`}
          >
            {prodi.nama}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
