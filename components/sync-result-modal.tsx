"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export type SyncResultData = {
  total_fetched: number;
  total_synced: number;
  errors: number;
} | null;

type SyncResultModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  success: boolean;
  message: string;
  data: SyncResultData;
  context?: string;
};

export function SyncResultModal({
  open,
  onOpenChange,
  success,
  message,
  data,
  context,
}: SyncResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {success ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {success ? "Sinkronisasi Berhasil" : "Sinkronisasi Selesai dengan Error"}
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        {data && (
          <div className="space-y-3">
            {context && (
              <div className="text-sm text-muted-foreground">
                {context}
              </div>
            )}
            <div className="rounded-lg border p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {data.total_fetched}
                  </div>
                  <div className="text-xs text-muted-foreground">Diambil</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {data.total_synced}
                  </div>
                  <div className="text-xs text-muted-foreground">Berhasil</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${data.errors > 0 ? "text-red-600" : "text-gray-400"}`}>
                    {data.errors}
                  </div>
                  <div className="text-xs text-muted-foreground">Gagal</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
