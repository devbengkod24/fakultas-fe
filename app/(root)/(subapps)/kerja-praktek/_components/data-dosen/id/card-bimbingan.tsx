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
  "Status KP": string;
  "Nomor Telepon": string;
}

interface StudentsTableProps {
  students: Student[];
  emptyMessage?: string;
}

export function DaftarDosenCardBimbingan({ students, emptyMessage = "Belum ada mahasiswa bimbingan" }: StudentsTableProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Mahasiswa Bimbingan</CardTitle>
        <CardDescription>
          Daftar mahasiswa bimbingan yang sedang berjalan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Status KP</TableHead>
                    <TableHead>Nomor Telepon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={`${student.NIM}-${index}`}>
                      <TableCell>{student.No || index + 1}</TableCell>
                      <TableCell>{student.NIM || "-"}</TableCell>
                      <TableCell>{student.Nama || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student["Status KP"] === "KONVERSI"
                              ? "success"
                              : student["Status KP"] === "REGULER"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {student["Status KP"] ? student["Status KP"].charAt(0).toUpperCase() + student["Status KP"].slice(1).toLowerCase() : "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>{student["Nomor Telepon"] || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}