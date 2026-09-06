"use client"

import { useState } from "react"
import { FileText, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FeedbackRatingService } from "@/api/bimbingan-karir"
import { toast } from "sonner"
import useSWR from "swr"
import { handleToastResponse } from "@/lib/toast-response"
import EmptyState from "@/components/empty-state"

interface SummaryDialogProps {
  kegiatanId: number
  kegiatanName: string
}

const fetcherSummary = (id: number) => {
  return FeedbackRatingService.getFeedbackSummary(id).then((res) => res)
}

export function SummaryDialog({ kegiatanId, kegiatanName }: SummaryDialogProps) {
  const [open, setOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const { data, error, isLoading, mutate } = useSWR(
    open ? `summary-${kegiatanId}` : null,
    () => fetcherSummary(kegiatanId),
    { revalidateOnFocus: false }
  )

  // Ambil kesimpulan_feedback dari response
  const summaryText = data?.data?.kesimpulan_feedback || null
  const hasSummary = summaryText !== null && summaryText !== ""

  const handleGenerateSummary = async () => {
    setIsGenerating(true)
    try {
      const response = await FeedbackRatingService.createFeedbackSummary(kegiatanId)

      handleToastResponse(response);
      mutate()
    } catch (error) {
      toast.error("Terjadi kesalahan saat generate summary")
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Button
        variant="default"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Summary Feedback
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Summary Feedback Rating</DialogTitle>
            <DialogDescription>
              Ringkasan feedback untuk kegiatan: {kegiatanName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Memuat summary...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Gagal memuat summary. Silakan coba lagi.
                </AlertDescription>
              </Alert>
            ) : hasSummary ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {summaryText}
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="default"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Regenerate Summary
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div >
                <EmptyState
                  icon={FileText}
                  title="Belum Ada Summary"
                  subtitle="Generate summary untuk melihat ringkasan feedback dari kegiatan ini"
                  className="h-52"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="gap-2"
                    variant="default"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}