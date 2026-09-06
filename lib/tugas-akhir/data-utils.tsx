import {
  data,
  logbookEntries,
  LogbookEntry,
  LogbookMahasiswa,
} from "@/data/tugas-akhir/logbook";

export function getStudentById(id: number): LogbookMahasiswa | undefined {
  return data.find((data) => data.mahasiswa.id === id);
}

export function getLogbookEntries(studentId: number): LogbookEntry[] {
  return logbookEntries.filter((entry) => entry.id_mhs === studentId);
}
