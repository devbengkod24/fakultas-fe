"use client";

import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogbookService } from "@/api/tugas-akhir";
import {
  StudentHeaderView,
  type StudentHeaderBaseData,
} from "@/components/shared-ta-kp/logbook/student-header-view";

interface StudentDetail {
  id: number;
  nim: string;
  name: string;
  email: string;
  foto: string;
  ipk: number;
  telepon: string;
  transkrip: string;
  jalur_ta: string;
  judul_ta: string;
  topik_ta: string;
  deskripsi_ta: string;
  bidang_kajian_ta: string;
  minat_ta: string[];
  jml_bimbingan: number;
  bab_terakhir: number;
  status_tugas_akhir: string;
  folder_ta: string | null;
}

interface StudentHeaderProps {
  data?: StudentDetail;
  onMutateFolder?: () => void;
  role?: string;
  studentId?: number;
}

const folderFetcher = () => LogbookService.getFolder().then((res) => res);

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function StudentHeader({ data, role }: StudentHeaderProps) {
  const searchParams = useSearchParams();
  const isKoor = searchParams.get("isKoor") === "true";

  const isStudent = role === "mahasiswa";
  const isCoordinator = isKoor || role === "koordinator";

  const { data: folderData, mutate: mutateFolder } = useSWR(
    isStudent ? "folder-ta" : null,
    folderFetcher
  );

  if (!data) return null;

  const folderLink = isStudent
    ? (folderData?.data?.link_folder ?? data.folder_ta)
    : data.folder_ta;

  const progressPercent = Math.min(100, ((data.bab_terakhir ?? 0) / 5) * 100);

  const viewData: StudentHeaderBaseData = {
    name: data.name,
    nim: data.nim,
    foto: data.foto,
    jml_bimbingan: data.jml_bimbingan,
    progressPercent,
    progressLabel: `Bab Terakhir: ${data.bab_terakhir ?? 0}`,
    statusBadgeLabel:
      data.status_tugas_akhir === "2" ? "Tugas Akhir 2" : "Tugas Akhir 1",
    statusBadgeVariant: data.status_tugas_akhir === "2" ? "secondary" : "primary",
  };

  // TA-specific detail dialog content
  const detailContent = (
    <div className="space-y-4 py-4 pb-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border">
          <AvatarImage src={data.foto || ""} alt={data.name} className="object-cover" />
          <AvatarFallback className="text-xl">{initials(data.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold capitalize">{data.name.toLowerCase()}</h3>
          <p className="text-sm text-gray-500">{data.nim}</p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-sm">{data.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">IPK</p>
          <p className="text-sm">{data.ipk}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">No. Telepon</p>
          <p className="text-sm">{data.telepon}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Transkrip</p>
          <a
            href={data.transkrip}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Lihat Transkrip
          </a>
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="font-medium mb-2">Pengajuan Tugas Akhir</h4>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Jalur</p>
            <p className="text-sm">{data.jalur_ta}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Judul</p>
            <p className="text-sm">{data.judul_ta}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Topik</p>
            <p className="text-sm">{data.topik_ta}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Deskripsi</p>
            <p className="text-sm">{data.deskripsi_ta}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Bidang Kajian</p>
            <p className="text-sm">{data.bidang_kajian_ta}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Minat</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {data.minat_ta.map((item, index) => (
                <Badge key={index} variant="primary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <StudentHeaderView
      data={viewData}
      folderLink={folderLink}
      folderLabel="Folder TA"
      onSaveFolder={
        isStudent && !isCoordinator
          ? async (link) => {
              const response = await LogbookService.updateFolder({ link_folder: link });
              mutateFolder();
              return response;
            }
          : undefined
      }
      isStudent={isStudent && !isCoordinator}
      detailContent={detailContent}
      detailTitle="Detail Informasi Mahasiswa"
    />
  );
}
