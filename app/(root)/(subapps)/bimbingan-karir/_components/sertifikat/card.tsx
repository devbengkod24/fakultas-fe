"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"
import { FileQuestion } from "lucide-react"
import { TemplateSertifikat } from "@/types/bimbingan-karir/koordinator/sertifikat/sertifikat"

interface SertifikatCardProps {
  template: TemplateSertifikat
  onEdit: (template: TemplateSertifikat) => void
  onDelete: (id: number) => void
  onPreview: (template: TemplateSertifikat) => void
}

export default function SertifikatCard({ 
  template, 
  onEdit, 
  onDelete,
  onPreview 
}: SertifikatCardProps) {

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const getImageSrc = () => {
    if (typeof template.file_path === 'string') {
      return template.file_path
    }

    if (template.file_path instanceof File) {
      return URL.createObjectURL(template.file_path);
    }
    
    return null
  }

  const imageSrc = getImageSrc()
  const hasValidImage = imageSrc && isValidUrl(imageSrc)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Preview Section */}
        <div 
          className="relative h-48 bg-gray-100 flex items-center justify-center cursor-pointer group"
          onClick={() => onPreview(template)}
        >
          {hasValidImage ? (
            <>
              <Image
                src={imageSrc}
                alt={template.nama_template}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <FileQuestion size={48} />
              <span className="text-sm mt-2">No Preview</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-4">{template.nama_template}</h3>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(template)}
            >
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(template.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}