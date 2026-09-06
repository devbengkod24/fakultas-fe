export interface Student {
  user_id: number
  nim: string
  name: string
  isPresent: boolean // computed dari presensi === "hadir"
  presensi: "hadir" | "izin" | "tidak hadir" // dari API
}