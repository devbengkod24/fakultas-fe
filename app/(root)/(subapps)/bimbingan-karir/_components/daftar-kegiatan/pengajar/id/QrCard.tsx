"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Maximize2 } from "lucide-react"
import { useState } from "react"

interface QrCardProps {
  qrCodeValue: string
  isOpen: boolean
}

export default function QrCard({ qrCodeValue, isOpen }: QrCardProps) {
  const [showFullscreen, setShowFullscreen] = useState(false)

  return (
    <>
      <Card className="shadow-none">
        <CardHeader className="pb-2 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>QR Code Presensi</CardTitle>
              <CardDescription>Scan QR code ini untuk presensi kehadiran</CardDescription>
            </div>
            {isOpen && qrCodeValue && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowFullscreen(true)}
                title="Perbesar QR Code"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="border-2 border-gray-200 p-2 rounded-md flex">
            {isOpen && qrCodeValue ? (
              <QRCodeCanvas value={qrCodeValue} size={190} />
            ) : (
              <p className="text-muted-foreground text-center">Presensi belum dibuka.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog untuk QR Code Fullscreen */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>QR Code Presensi</DialogTitle>
            <DialogDescription>
              Scan QR code ini untuk melakukan presensi kehadiran
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="border-4 border-gray-200 p-4 rounded-lg bg-white">
              <QRCodeCanvas value={qrCodeValue} size={350} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
