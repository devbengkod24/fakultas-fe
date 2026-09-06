import { Dashboard } from "@/types/kerja-praktek/dashboard"
import { CalendarIcon, Waves } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const DashboardKoordinatorPeriode = ({ data }: { data: Dashboard | any }) => {
  const periode = data?.periode || null
  const gelombangRaw = data?.gelombang || null

  // support comma separated gelombang values or single string
  const gelombangs = gelombangRaw
    ? String(gelombangRaw).split(",").map((g: string) => g.trim())
    : []

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Periode Aktif</p>
              <p className="text-lg font-semibold">{periode || "Tidak ada periode aktif"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {gelombangs.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {gelombangs.map((g: string, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-md border px-3 py-2 bg-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50">
                <Waves className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Gelombang Aktif</p>
                <p className="text-xs text-muted-foreground">{g}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-none">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50">
                <Waves className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Gelombang Aktif</p>
                <p className="text-xs text-muted-foreground">Belum ada gelombang aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DashboardKoordinatorPeriode
