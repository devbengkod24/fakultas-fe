"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Award, FileQuestion } from 'lucide-react'
import { SertifikatService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import Image from "next/image"
import { handleToastResponse } from "@/lib/toast-response"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CertificateButtonProps {
  kegiatan_id: number
  totalHadir: number
}

interface TemplateSertifikat {
  id: number;
  nama_template: string;
  file_path: string;
}

const fetcherSertifikat = () =>
  SertifikatService.getAllSertifikat().then((res) => res);

export function CertificateButton({ kegiatan_id, totalHadir }: CertificateButtonProps) {
  const [open, setOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const { data, error, isLoading: isLoadingTemplates } = useSWR("sertifikat", fetcherSertifikat)
  const dataSertifikat: TemplateSertifikat[] | undefined = data?.data;

  const handleSendCertificates = async () => {
    if (totalHadir === 0) {
      toast.error("Tidak ada mahasiswa yang hadir untuk dikirimkan sertifikat");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Pilih template sertifikat terlebih dahulu");
      return;
    }

    setIsLoading(true);

    let res;
    try {
      const rilis = "rilis";
      const templateId = selectedTemplate;
      const acaraIdStr = kegiatan_id.toString();

      res = await SertifikatService.createSertifikat(rilis, acaraIdStr, templateId);

      handleToastResponse(res)
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (error) return <div>Gagal memuat data</div>;

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" disabled={totalHadir === 0}>
            <Award size={16} />x
            Terbitkan Sertifikat
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Pilih Template Sertifikat</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pilih template sertifikat untuk mahasiswa yang hadir ({totalHadir} mahasiswa)
            </p>

            {isLoadingTemplates ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">Memuat template...</p>
              </div>
            ) : dataSertifikat && dataSertifikat.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <RadioGroup
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {dataSertifikat.map((template) => (
                    <div
                      key={template.id}
                      className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${selectedTemplate === template.id.toString()
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                        }`}
                      onClick={() => setSelectedTemplate(template.id.toString())}
                    >
                      {/* Preview Image */}
                      <div className="aspect-[4/3] bg-gray-100 rounded-md mb-3 overflow-hidden">
                        {isValidUrl(template.file_path) ? (
                          <Image
                            src={template.file_path}
                            alt={`Template ${template.nama_template}`}
                            className="w-full h-full object-cover"
                            width={200}
                            height={150}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <FileQuestion size={32} />
                            <span className="text-xs mt-1">No Preview</span>
                          </div>
                        )}
                      </div>

                      {/* Radio Button & Label */}
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={template.id.toString()}
                          id={`template-${template.id}`}
                          className="flex-shrink-0"
                        />
                        <Label
                          htmlFor={`template-${template.id}`}
                          className="text-sm font-medium leading-tight cursor-pointer line-clamp-2"
                        >
                          {template.nama_template}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileQuestion size={48} className="text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada template sertifikat</p>
                <p className="text-xs text-muted-foreground mt-1">Silakan tambahkan template terlebih dahulu</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Batal
            </Button>
            <Button
              onClick={handleSendCertificates}
              disabled={isLoading || totalHadir === 0 || !selectedTemplate}
            >
              {isLoading ? "Mengirim..." : "Kirim Sertifikat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
