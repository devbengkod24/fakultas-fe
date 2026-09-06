/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, FileText, Mail } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface FormPreviewProps {
  data: any;
  selectedDosen: any;
}

export default function FormPreview({ data, selectedDosen }: FormPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Dosen Pembimbing */}
      <div>
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <User className="h-4 w-4" />
          Dosen Pembimbing
        </h3>
        <Card className="shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="border">
                  {getInitials(selectedDosen?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {selectedDosen?.gelar_depan &&
                    `${selectedDosen.gelar_depan} `}
                  {selectedDosen?.name}
                  {selectedDosen?.gelar_belakang &&
                    `, ${selectedDosen.gelar_belakang}`}
                </p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {selectedDosen?.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Tugas Akhir */}
      <div className="space-y-2">
        <h3 className="font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Detail Tugas Akhir
        </h3>

        <div className="grid gap-2.5 w-full overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Jalur
              </label>
              <div className="text-sm">{data.track}</div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                Bidang Kajian
              </label>
              <div className="text-sm">{data.field_of_study}</div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Judul
            </label>
            <p className="text-sm break-all">{data.title}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              Topik
            </label>
            <p className="text-sm break-all">{data.topic}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Deskripsi
            </label>
            <p className="text-sm text-justify leading-relaxed break-words">
              {data.description}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              Minat/Keahlian
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.interest?.map((interest: string, index: number) => (
                <Badge key={index} variant="primary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
