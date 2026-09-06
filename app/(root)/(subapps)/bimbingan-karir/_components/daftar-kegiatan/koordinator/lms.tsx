"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SyncLmsService } from "@/api/bimbingan-karir";
import { toast } from "sonner";

interface SyncLmsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SyncLmsDialog({ open, onOpenChange }: SyncLmsDialogProps) {
  const [selectedKelas, setSelectedKelas] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [inputMode, setInputMode] = useState<"dropdown" | "manual">("dropdown");
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    const kelasValue = inputMode === "manual" ? manualInput : selectedKelas;

    if (!kelasValue) {
      toast.error("Pilih atau masukkan kelas terlebih dahulu");
      return;
    }

    setIsLoading(true);
    try {
      const response = await SyncLmsService.syncLms({
        kelas: kelasValue,
      });

      // Custom handling untuk response sync LMS
      if (response.meta.success) {
        toast.success(response.meta.message);

        onOpenChange(false);
        setSelectedKelas("");
        setManualInput("");
      } else {
        toast.error(response.meta.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat sync data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sync Data dari LMS</DialogTitle>
          <DialogDescription>
            Pilih kelas yang ingin di-sync dari LMS
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="kelas">Kelas</Label>

            {/* Toggle Input Mode */}
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                size="sm"
                variant={inputMode === "dropdown" ? "default" : "outline"}
                onClick={() => setInputMode("dropdown")}
              >
                Pilih dari Daftar
              </Button>
              <Button
                type="button"
                size="sm"
                variant={inputMode === "manual" ? "default" : "outline"}
                onClick={() => setInputMode("manual")}
              >
                Input Manual
              </Button>
            </div>

            {inputMode === "dropdown" ? (
              <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                <SelectTrigger id="kelas">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D2A Pagi">D2A Pagi</SelectItem>
                  <SelectItem value="D2A Siang">D2A Siang</SelectItem>
                  <SelectItem value="D2B Pagi">D2B Pagi</SelectItem>
                  <SelectItem value="D2B Siang">D2B Siang</SelectItem>
                  <SelectItem value="D2C Pagi">D2C Pagi</SelectItem>
                  <SelectItem value="D2C Siang">D2C Siang</SelectItem>
                  <SelectItem value="D2D Pagi">D2D Pagi</SelectItem>
                  <SelectItem value="D2D Siang">D2D Siang</SelectItem>
                  <SelectItem value="D2E Pagi">D2E Pagi</SelectItem>
                  <SelectItem value="D2E Siang">D2E Siang</SelectItem>
                  <SelectItem value="D2G Pagi">D2G Pagi</SelectItem>
                  <SelectItem value="D2G Siang">D2G Siang</SelectItem>
                  <SelectItem value="D2H Pagi">D2H Pagi</SelectItem>
                  <SelectItem value="D2H Siang">D2H Siang</SelectItem>
                  <SelectItem value="D2I Pagi">D2I Pagi</SelectItem>
                  <SelectItem value="D2I Siang">D2I Siang</SelectItem>
                  <SelectItem value="D2J Pagi">D2J Pagi</SelectItem>
                  <SelectItem value="D2J Siang">D2J Siang</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="kelas-manual"
                placeholder="Masukkan nama kelas (contoh: D2A Pagi)"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button onClick={handleSync} disabled={isLoading}>
            {isLoading ? "Syncing..." : "Sync"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}