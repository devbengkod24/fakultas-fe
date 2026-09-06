import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, PhoneIcon, Building2, Users } from "lucide-react"
import { Penyelia } from "@/types/kerja-praktek/mahasiswa"
import EmptyState from "@/components/empty-state"

interface PenyeliaCardProps {
  penyelia?: Penyelia | null
}

const PenyeliaCard = ({ penyelia }: PenyeliaCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Penyelia</CardTitle>
      </CardHeader>
      <CardContent className="mt-3">
        {penyelia ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={""} alt={penyelia.nama} />
                <AvatarFallback className="text-2xl">
                  {(penyelia.nama ?? "")
                    .split(" ")
                    .map((nama: string) => nama[0])
                    .join("")
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-xl font-semibold capitalize">
                    {penyelia.nama?.toLowerCase() ?? "Nama tidak diketahui"}
                  </h1>
                  <p className="text-gray-500 font-normal">
                    {penyelia.posisi ?? "Posisi tidak diketahui"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="size-4" />
                    <span>
                      Alamat: <strong>{penyelia.alamat ?? "-"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="size-4" />
                    <span className="text-sm">
                      Telepon: <strong>{penyelia.telepon ?? "-"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4" />
                    <span className="text-sm">
                      Perusahaan: <strong>{penyelia.perusahaan ?? "-"}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Belum Ada Penyelia Perusahaan"
            subtitle="Mahasiswa ini belum memiliki penyelia perusahaan yang ditugaskan untuk membimbing di tempat kerja praktek."
            className="h-[200px]"
          />
        )}
      </CardContent>
    </Card>
  )
}

export default PenyeliaCard