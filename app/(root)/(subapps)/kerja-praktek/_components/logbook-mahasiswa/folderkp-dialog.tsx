"use client"

import { useState } from "react"
import { ExternalLink, Loader2, FolderOpen, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { LogbookService } from "@/api/kerja-praktek"
import { handleToastResponse } from "@/lib/toast-response"

interface EditLinkFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kpId: number
  currentLink?: string
  onSuccess: () => void
}

export function EditLinkFolderDialog({
  open,
  onOpenChange,
  kpId,
  currentLink = "",
  onSuccess
}: EditLinkFolderDialogProps) {
  const [linkFolder, setLinkFolder] = useState(currentLink)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLinkFolder(currentLink)
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = async () => {
    if (!linkFolder.trim()) {
      toast.error("Link folder tidak boleh kosong")
      return
    }

    try {
      new URL(linkFolder)
    } catch {
      toast.error("Format URL tidak valid")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("Memperbarui link folder...")

    try {
      const response = await LogbookService.updateLinkFolder(kpId, linkFolder)
      
      toast.dismiss(loadingToast)
      
      if (response.success) {
        handleToastResponse(response)
        onSuccess()
        onOpenChange(false)
      } else {
        handleToastResponse(response)
      }
    } catch (error) {
      console.error("Error updating link folder:", error)
      toast.dismiss(loadingToast)
      toast.error("Terjadi kesalahan saat memperbarui link folder")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setLinkFolder(currentLink)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            Edit Link Folder KP
          </DialogTitle>
          <DialogDescription>
            Perbarui link folder Google Drive yang berisi dokumen kerja praktek Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <Label htmlFor="link-folder" className="text-sm font-medium">
              Link Folder Google Drive <span className="text-red-500">*</span>
            </Label>
            <Input
              id="link-folder"
              type="url"
              placeholder="https://drive.google.com/drive/folders/..."
              value={linkFolder}
              onChange={(e) => setLinkFolder(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
            <p className="text-xs text-gray-500">
              Pastikan folder dapat diakses oleh dosen pembimbing (sharing permission: Anyone with the link)
            </p>
          </div>

          {currentLink && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Link saat ini:</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-600 break-all flex-1">{currentLink}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs flex-shrink-0"
                  asChild
                >
                  <a
                    href={currentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !linkFolder.trim()}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Simpan
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}