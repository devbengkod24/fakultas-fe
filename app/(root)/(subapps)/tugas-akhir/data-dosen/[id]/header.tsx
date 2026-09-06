"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import useSWR from "swr";
import { DosenService } from "@/api/tugas-akhir";

interface DosenHeaderProps {
  dosenId: string;
}

export function DosenHeader({ dosenId }: DosenHeaderProps) {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(`dosen-${dosenId}`, () => DosenService.getById(Number(dosenId)));

  const dosen = response?.success
    ? {
        id: response.data.dosen_id.toString(),
        name: `${
          response.data.gelar_depan ? response.data.gelar_depan + " " : ""
        }${response.data.name}${
          response.data.gelar_belakang
            ? ", " + response.data.gelar_belakang
            : ""
        }`,
        npp: response.data.npp,
      }
    : null;

  if (error) {
    console.error("Error fetching dosen data:", error);
  }

  if (isLoading) {
    return (
      <div className="mb-6">
        <Link
          href="/tugas-akhir/data-dosen"
          className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary text-sm w-fit"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Daftar Dosen
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!dosen) {
    return null;
  }
  return (
    <div className="mb-6">
      <Link
        href="/tugas-akhir/data-dosen"
        className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary text-sm w-fit"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Daftar Dosen
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">{dosen.name}</h1>
          <p className="text-muted-foreground">{dosen.npp}</p>
        </div>
        {/* <Button asChild size={"sm"}>
          <Link href={`/tugas-akhir/data-dosen/edit/${dosen.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Dosen
          </Link>
        </Button> */}
      </div>
    </div>
  );
}
