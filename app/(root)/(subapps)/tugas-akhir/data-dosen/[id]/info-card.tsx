"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, GraduationCap, Album } from "lucide-react";
import useSWR from "swr";
import { DosenService } from "@/api/tugas-akhir";

interface DosenInfoCardProps {
  dosenId: string;
}

export function DosenInfoCard({ dosenId }: DosenInfoCardProps) {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(`dosen-${dosenId}`, () => DosenService.getById(Number(dosenId)));

  const dosen = response?.success
    ? {
        npp: response.data.npp,
        email: response.data.email,
        telp: response.data.telepon || "-",
        bidang_kajian: response.data.bidang_kajian || "-",
        scholar: response.data.scholar_link,
      }
    : null;

  if (error) {
    console.error("Error fetching dosen data:", error);
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Informasi Dosen</CardTitle>
        <CardDescription>
          Detail informasi dosen pembimbing tugas akhir
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          <>
            <div className="grid grid-cols-3 items-center">
              <span className="font-medium">Email</span>
              <div className="col-span-2">
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="font-medium">No HP</span>
              <div className="col-span-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="font-medium">Bidang Kajian</span>
              <div className="col-span-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </>
        ) : dosen ? (
          <>
            <div className="grid grid-cols-3 items-center">
              <span className="font-medium">Email</span>
              <div className="col-span-2 flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${dosen.email}`} className="hover:underline">
                  {dosen.email}
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="font-medium">No HP</span>
              <div className="col-span-2 flex items-center">
                <Phone className="mr-2 size-4 text-muted-foreground" />
                <a href={`tel:${dosen.telp}`} className="hover:underline">
                  {dosen.telp}
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="font-medium">Bidang Kajian</span>
              <div className="col-span-2 flex items-center">
                <GraduationCap className="mr-2 size-4 text-muted-foreground" />
                <span className="col-span-2">{dosen.bidang_kajian}</span>
              </div>
            </div>
            {dosen.scholar && (
              <div className="grid grid-cols-3 items-center">
                <span className="font-medium">Google Scholar</span>
                <div className="col-span-2 flex items-center">
                  <Album className="mr-2 size-4 text-muted-foreground" />
                  <a
                    href={dosen.scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Lihat Profil
                  </a>
                </div>
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
