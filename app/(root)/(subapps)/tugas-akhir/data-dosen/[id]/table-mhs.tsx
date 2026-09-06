import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Student {
  No: number;
  NIM: string;
  Nama: string;
  "TA-1": string;
  "TA-2": string;
  "Bab Terakhir": number | string;
  "Jumlah Bimbingan": number | string;
  Status: string;
  "Sidang TA1 (Gel.)": string;
  "Sidang TA2 (Gel.)": string;
}

interface StudentsTableProps {
  students: Student[];
}

export function StudentsTable({ students }: StudentsTableProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Mahasiswa Bimbingan</CardTitle>
        <CardDescription>
          Daftar mahasiswa bimbingan yang sedang berjalan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>TA 1</TableHead>
                  <TableHead>TA 2</TableHead>
                  <TableHead>Bab Terakhir</TableHead>
                  <TableHead>Jumlah Bimbingan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sidang TA 1</TableHead>
                  <TableHead>Sidang TA 2</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.NIM}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.NIM}</TableCell>
                    <TableCell>{student.Nama}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student["TA-1"] === "LULUS"
                            ? "success"
                            : student["TA-2"] === "PROSES"
                            ? "primary"
                            : "outline"
                        }
                      >
                        {student["TA-1"]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student["TA-2"] === "LULUS"
                            ? "success"
                            : student["TA-2"] === "PROSES"
                            ? "primary"
                            : "outline"
                        }
                      >
                        {student["TA-2"]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {student["Bab Terakhir"] || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {student["Jumlah Bimbingan"] || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.Status === "ACC" ? "success" : "secondary"
                        }
                      >
                        {student.Status}
                      </Badge>
                    </TableCell>
                    <TableCell>{student["Sidang TA1 (Gel.)"]}</TableCell>
                    <TableCell>{student["Sidang TA2 (Gel.)"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
