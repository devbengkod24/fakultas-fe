"use client";

import { ExternalLink, FileText, BookText, Plus, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/types/role";
import { toast } from "sonner";

interface LogbookHeaderProps {
  data: {
    mahasiswa_id?: number;
    name?: string;
    nim?: string;
    dosen_name?: string;
    totalLogbooks?: number;
    bab_terakhir?: number;
    jml_bimbingan?: number;
    progress?: string;
    link_folder?: string;
    status?: string;
  };
  userRole?: Role;
  onAddLogbook?: () => void;
  onEditLinkFolder?: () => void;
}

export function LogbookHeaderMhs({ 
  data, 
  userRole, 
  onAddLogbook, 
  onEditLinkFolder 
}: LogbookHeaderProps) {

  if (!data || (!data.name && !data.nim)) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-6 text-center text-gray-500">
          Data mahasiswa tidak tersedia.
        </CardContent>
      </Card>
    );
  }

  const progressValue = data.progress ? parseInt(data.progress.replace('%', '')) : 0;

  const isCompleted = progressValue === 100 || data.status === "Selesai";

  const handleAddLogbook = () => {
    if (!data.link_folder) {
      toast.error("Anda harus menambahkan folder KP terlebih dahulu sebelum dapat menambah logbook");
      return;
    }
    
    if (onAddLogbook) {
      onAddLogbook();
    }
  };

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={""} alt={data.name} />
              <AvatarFallback className="text-2xl">
                {(data.name ?? "")
                  .split(" ")
                  .map((name: string) => name[0])
                  .join("")
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between">
              <div>
                <h1 className="text-xl font-semibold capitalize">
                  {data.name?.toLowerCase() ?? "Nama tidak diketahui"}
                </h1>
                <p className="text-gray-500 font-normal">
                  {data.nim ?? "NIM tidak diketahui"}
                </p>
                {data.dosen_name && (
                  <p className="text-sm text-gray-600 mt-1">
                    Dosen Pembimbing: {data.dosen_name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {userRole === "mahasiswa" && onAddLogbook && (
                  <Button
                    size="sm"
                    onClick={handleAddLogbook}
                    className="w-fit bg-primary text-white hover:bg-primary/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Logbook
                  </Button>
                )}
                
                {data.link_folder ? (
                  userRole === "mahasiswa" ? (
                    <Button
                      size="sm"
                      onClick={onEditLinkFolder}
                      className="w-fit border-[0.5px] bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Folder KP
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-fit border-[0.5px] bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
                      asChild
                    >
                      <a
                        href={data.link_folder}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Folder KP
                      </a>
                    </Button>
                  )
                ) : (
                  userRole === "mahasiswa" && onEditLinkFolder && (
                    <Button
                      size="sm"
                      onClick={onEditLinkFolder}
                      className="w-fit bg-primary text-white hover:bg-primary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Folder KP
                    </Button>
                  )
                )}
              </div>
            </div>

            <Badge
              variant={isCompleted ? "success" : "secondary"}
              className="h-fit"
            >
              {isCompleted ? "Selesai" : "Sedang Berjalan"}
            </Badge>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="size-4" />
                  <span>
                    Total Bimbingan: <strong>{data.totalLogbooks || data.jml_bimbingan || 0}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookText className="size-4" />
                  <span className="text-sm">
                    Bab Terakhir: <strong>{data.bab_terakhir || 0}</strong>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-800">
                  <span>Progress Kerja Praktek</span>
                  <span>
                    {progressValue.toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={progressValue}
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}