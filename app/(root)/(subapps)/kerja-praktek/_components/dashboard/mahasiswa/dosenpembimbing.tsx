"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Copy, ExternalLink, AlertCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface DashboardData {
  dosen?: {
    nama: string
    link_wa: string
  }
}

interface SupervisorInfoProps {
  data?: DashboardData
}

const DashboardMahasiswaDosenPembimbing = ({ data }: SupervisorInfoProps) => {
  const [copied, setCopied] = useState(false)

  const dosenData = data?.dosen
  const hasDosenPembimbing = dosenData?.nama && dosenData.nama !== "N/A"
  const name = hasDosenPembimbing ? dosenData.nama : "Belum ada dosen pembimbing"
  const whatsappGroup = dosenData?.link_wa !== "N/A" ? dosenData?.link_wa : null

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Berhasil disalin!", {
        description: "Link WhatsApp telah disalin ke clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.log(err)
      toast.error("Gagal menyalin", {
        description: "Silakan salin link secara manual",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
  }

  return (
    <Card className="shadow-none border-0">
      <CardContent className="space-y-4 pl-1">
        {/* Supervisor Profile */}
        <div className="bg-white rounded-md px-6 py-4 border">
          <div className="text-md font-medium mb-4">
            Dosen Pembimbing
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/placeholder.svg" alt={name} />
                <AvatarFallback className="bg-blue-600 text-white text-lg font-bold">
                  {/* 👈 UPDATED: Use hasDosenPembimbing check */}
                  {hasDosenPembimbing ? getInitials(dosenData.nama) : "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {/* 👈 UPDATED: Use name variable that already handles "N/A" */}
                {name}
              </h3>
              {/* 👈 UPDATED: Show message when no dosen pembimbing (including "N/A") */}
              {!hasDosenPembimbing && (
                <p className="text-sm text-secondary-600 mt-1">
                  Silakan ajukan dosen pembimbing terlebih dahulu
                </p>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp Group */}
        <div className="bg-white rounded-md p-6 border">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600`}>
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Grup WhatsApp Bimbingan</h4>
              <p className="text-xs text-gray-500">
                Komunikasi dan diskusi dengan dosen pembimbing
              </p>
            </div>
          </div>

          {whatsappGroup ? (
            <>
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <p className="text-sm text-gray-700 font-mono break-all">{whatsappGroup}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(whatsappGroup)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-200 hover:bg-green-50 hover:border-green-300"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Tersalin!" : "Salin Link"}
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <a
                    href={whatsappGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buka Grup
                  </a>
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-secondary-50 rounded-md p-4 text-center">
              <AlertCircle className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-secondary-800 mb-1">Link WhatsApp Belum Tersedia</p>
              <p className="text-xs text-secondary-600">
                {/* 👈 UPDATED: Conditional message based on dosen pembimbing availability */}
                {hasDosenPembimbing 
                  ? "Hubungi dosen pembimbing untuk mendapatkan link grup WhatsApp"
                  : "Ajukan dosen pembimbing terlebih dahulu untuk mendapatkan akses grup WhatsApp"
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardMahasiswaDosenPembimbing
