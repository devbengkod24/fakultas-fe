/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BrowserQRCodeReader } from "@zxing/browser"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

type QrScannerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScanSuccess: (scannedCode: string) => void
}

export const QrScannerDialog = ({ open, onOpenChange, onScanSuccess }: QrScannerDialogProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const controlsRef = useRef<any>(null)
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null)
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
  const mountedRef = useRef(true)

  // Enhanced function to stop camera with complete cleanup
  const stopCamera = async () => {
    
    try {
      // Stop ZXing controls
      if (controlsRef.current) {
        try {
          await controlsRef.current.stop()
        } catch (err) {
          console.warn("Warning stopping ZXing controls:", err)
        }
        controlsRef.current = null
      }

      // Reset code reader
      if (codeReaderRef.current) {
        codeReaderRef.current = null
      }

      // Stop all media stream tracks
      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach(track => {
            if (track.readyState === 'live') {
              track.stop()
            }
          })
        } catch (err) {
          console.warn("Warning stopping media tracks:", err)
        }
        streamRef.current = null
      }

      // Clear video element completely
      if (videoRef.current) {
        const video = videoRef.current
        
        try {
          // Pause and clear
          video.pause()
          video.srcObject = null
          video.src = ""
          
          // Force load empty state
          video.load()
        } catch (err) {
          console.warn("Warning clearing video element:", err)
          // Don't show toast for video cleanup errors as they're usually harmless
        }
      }
    } catch (err) {
      toast.error("Gagal menghentikan kamera: " + err)
    }
  }

  // Get available video devices
  useEffect(() => {
    const getVideoDevices = async () => {
      if (!mountedRef.current) return
      
      try {
        // Request permissions first
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop()) // Stop immediately
        
        if (!mountedRef.current) return
        
        // Now enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        
        if (!mountedRef.current) return
        
        setVideoDevices(videoDevices)
        
        // Auto-select back camera if available, otherwise first device
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        )
        const defaultDevice = backCamera || videoDevices[0]
        
        if (defaultDevice && mountedRef.current) {
          setSelectedDeviceId(defaultDevice.deviceId)
        } else if (mountedRef.current) {
          setSelectedDeviceId('default')
        }
      } catch (err) {
        console.error("Gagal mendapatkan daftar kamera:", err)
        if (mountedRef.current) {
          setSelectedDeviceId('default')
        }
      }
    }

    if (open) {
      getVideoDevices()
    } else {
      setVideoDevices([])
      setSelectedDeviceId("")
    }
  }, [open])

  useEffect(() => {
    if (!open || !selectedDeviceId || !mountedRef.current) {
      stopCamera()
      return
    }

    const startScanning = async () => {
      if (!mountedRef.current) return
      
      try {
        if (!videoRef.current) return

        // Create new code reader instance
        const codeReader = new BrowserQRCodeReader()
        codeReaderRef.current = codeReader

        // Use undefined for default device if selectedDeviceId is 'default'
        const deviceId = selectedDeviceId === 'default' ? undefined : selectedDeviceId

        const result = await codeReader.decodeFromVideoDevice(
          deviceId, 
          videoRef.current, 
          (result) => {
            if (result && mountedRef.current) {
              onScanSuccess(result.getText())
              onOpenChange(false)
            }
          }
        )

        if (mountedRef.current) {
          controlsRef.current = result
          
          // Store the stream reference for cleanup
          if (videoRef.current && videoRef.current.srcObject) {
            streamRef.current = videoRef.current.srcObject as MediaStream
          }
        }
      } catch (err) {
        console.error("Gagal mengakses kamera:", err)
        if (mountedRef.current) {
          onOpenChange(false)
        }
      }
    }

    const timeoutId = setTimeout(startScanning, 300)

    return () => {
      clearTimeout(timeoutId)
      stopCamera()
    }
  }, [open, selectedDeviceId, onOpenChange, onScanSuccess])

  // Component mount/unmount tracking
  useEffect(() => {
    mountedRef.current = true
    
    return () => {
      mountedRef.current = false
      stopCamera()
    }
  }, [])

  // Handle dialog close with forced cleanup
  const handleOpenChange = async (newOpen: boolean) => {
    if (!newOpen) {
      // Force immediate stop
      await stopCamera()
      
      // Small delay to ensure cleanup
      setTimeout(() => {
        if (mountedRef.current) {
          onOpenChange(false)
        }
      }, 150)
    } else {
      onOpenChange(newOpen)
    }
  }

  // Switch camera with proper cleanup
  const switchCamera = async () => {
    if (videoDevices.length > 1) {
      // Stop current camera first
      await stopCamera()
      
      const currentIndex = videoDevices.findIndex(device => device.deviceId === selectedDeviceId)
      const nextIndex = (currentIndex + 1) % videoDevices.length
      
      // Delay before starting new camera
      setTimeout(() => {
        if (mountedRef.current) {
          setSelectedDeviceId(videoDevices[nextIndex].deviceId)
        }
      }, 200)
    }
  }

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && open) {
        stopCamera()
      }
    }

    const handleBeforeUnload = () => {
      stopCamera()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-[400px] mx-auto p-0 gap-0 rounded-lg sm:rounded-lg overflow-hidden">
        {/* Mobile-optimized header */}
        <DialogHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <DialogTitle className="text-lg sm:text-xl font-semibold text-left">
                Scan QR Code Presensi
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-2 text-left">
                Arahkan kamera ke QR Code untuk melakukan presensi
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scanner area */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="relative">
            {/* Video container with mobile-optimized sizing */}
            <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />
              
              {/* Camera switch button */}
              {videoDevices.length > 1 && (
                <button
                  onClick={switchCamera}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  title="Ganti Kamera"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              )}
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-blue-500 rounded-tl-md"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-blue-500 rounded-tr-md"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-blue-500 rounded-bl-md"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-blue-500 rounded-br-md"></div>
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-500 opacity-70 animate-pulse"></div>
              </div>
            </div>
            
            {/* Mobile-optimized instructions */}
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Pastikan QR code terlihat jelas dalam bingkai
              </p>
              {videoDevices.length > 1 && (
                <p className="text-xs text-blue-600">
                  Tap tombol kamera untuk mengganti kamera
                </p>
              )}
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="mt-6 flex gap-3 sm:hidden">
            <button
              onClick={() => handleOpenChange(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}