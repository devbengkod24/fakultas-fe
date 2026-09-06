"use client";

import Link from "next/link";
import {
  Book,
  BookText,
  ExternalLink,
  FileText,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export interface LogbookStudentBase {
  mahasiswa: {
    id: number;
    name: string;
    nim: string;
    email: string;
    photo: string | null;
    no_telp: string;
    transkrip: string | null;
  };
  jml_bimbingan: number;
  bab_terakhir: number | null;
  folder_ta: string | null;
  status_tugas_akhir: string;
}

interface LogbookStudentCardViewProps {
  students: LogbookStudentBase[];
  getDetailHref: (studentId: number) => string;
  folderLabel?: string;
}

export function LogbookStudentCardView({
  students,
  getDetailHref,
  folderLabel = "Folder TA",
}: LogbookStudentCardViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {students.map((student) => {
        const babTerakhir = student.bab_terakhir || 0;
        const progress = Math.min(100, (babTerakhir / 5) * 100);
        const isTA2 =
          student.status_tugas_akhir === "2" || babTerakhir >= 3;

        return (
          <Card
            key={student.mahasiswa.id}
            className="overflow-hidden shadow-none"
          >
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="flex justify-between">
                <div>
                  <h3 className="truncate capitalize">
                    {student.mahasiswa.name.toLowerCase()}
                  </h3>
                  <p className="text-gray-500 font-normal text-sm mt-1">
                    {student.mahasiswa.nim}
                  </p>
                </div>
                <Badge
                  variant={isTA2 ? "secondary" : "primary"}
                  className="h-fit"
                >
                  {isTA2 ? "Tugas Akhir 2" : "Tugas Akhir 1"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage
                    src={student.mahasiswa.photo || ""}
                    alt={student.mahasiswa.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg">
                    {student.mahasiswa.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  {student.mahasiswa.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{student.mahasiswa.email}</span>
                    </div>
                  )}
                  {student.mahasiswa.no_telp && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{student.mahasiswa.no_telp}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Bab Terakhir: <strong>{babTerakhir}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Total Bimbingan: <strong>{student.jml_bimbingan}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex flex-row-reverse gap-2">
                  <div className="relative w-full">
                    <Button asChild className="w-full">
                      <Link href={getDetailHref(student.mahasiswa.id)}>
                        <BookText className="mr-1 size-4" />
                        Lihat Logbook
                      </Link>
                    </Button>
                  </div>

                  {student.folder_ta && (
                    <Button
                      variant="outline"
                      className="text-primary border-primary"
                      asChild
                    >
                      <a
                        href={student.folder_ta}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1 size-4" />
                        {folderLabel}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
