"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomTabs } from "@/components/custom-tabs";
import { Input } from "@/components/ui/input";
import { Settings, Trash2, Plus } from "lucide-react";
import { AturanNilaiService } from "@/api/bimbingan-karir";
import useSWR from "swr";
import { handleToastResponse } from "@/lib/toast-response";

interface RangeItem {
  min: number;
  max: number;
  nilai: number;
}

interface LSPMapping {
  TH: number;  // Tidak Hadir
  K: number;   // Kompeten
  BK: number;  // Belum/Tidak Kompeten
}

interface AturanNilaiItem {
  kategori: string;
  aturan_nilai: {
    mapping?: LSPMapping;
    ranges?: RangeItem[];
  };
}

interface AturanNilaiResponse {
  success: boolean;
  message: string;
  data: AturanNilaiItem[];
}

const fetcherAturanNilai = () => {
  return AturanNilaiService.getAturanNilai().then((res) => res);
};

export function AturanNilai() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lsp");

  const [kompeten, setKompeten] = useState("100");
  const [tidakHadir, setTidakHadir] = useState("0");
  const [tidakKompeten, setTidakKompeten] = useState("70");

  const { data, isLoading, mutate } = useSWR<AturanNilaiResponse>(
    isOpen ? ["aturan-nilai"] : null,
    () => fetcherAturanNilai(),
    { revalidateOnFocus: false }
  );

  const [ranges, setRanges] = useState<RangeItem[]>(
    [
      { min: 0, max: 0, nilai: 0 },
      { min: 1, max: 350, nilai: 60 },
    ]
  );

  const tabs = [
    { status: "lsp", label: "LSP" },
    { status: "toefl", label: "TOEFL" },
  ];

  // Load data dari API ketika data berubah
  useEffect(() => {
    if (data?.data) {
      // Cari data berdasarkan activeTab
      const currentData = data.data.find((item) => item.kategori === activeTab);
      
      if (currentData && currentData.aturan_nilai) {
        if (activeTab === "lsp" && currentData.aturan_nilai.mapping) {
          const mapping = currentData.aturan_nilai.mapping;
          setKompeten(String(mapping.K));
          setTidakHadir(String(mapping.TH));
          setTidakKompeten(String(mapping.BK));
        } else if (activeTab === "toefl" && currentData.aturan_nilai.ranges) {
          setRanges(currentData.aturan_nilai.ranges);
        }
      }
    }
  }, [data, activeTab]);

  const handleAddRange = () => {
    const newRange: RangeItem = {
      min: 0,
      max: 0,
      nilai: 0,
    };
    setRanges([...ranges, newRange]);
  };

  const handleDeleteRange = (index: number) => {
    setRanges(ranges.filter((_, i) => i !== index));
  };

  const handleRangeChange = (
    index: number,
    field: "min" | "max" | "nilai",
    value: string
  ) => {
    setRanges(
      ranges.map((range, i) =>
        i === index ? { ...range, [field]: Number(value) || 0 } : range
      )
    );
  };

  const handleSaveLSP = async () => {
    const payload = {
      kategori: "lsp",
      aturan_nilai: {
        mapping: {
          K: Number(kompeten),
          TH: Number(tidakHadir),
          BK: Number(tidakKompeten),
        },
      },
    };

    try {
      const res = await AturanNilaiService.updateAturanNilai(payload, "lsp");
      handleToastResponse(res);
      mutate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving LSP:", error);
    }
  };

  const handleSaveTOEFL = async () => {
    const payload = {
      kategori: "toefl",
      aturan_nilai: {
        ranges: ranges,
      },
    };

    try {
      const res = await AturanNilaiService.updateAturanNilai(payload, "toefl");
      handleToastResponse(res);
      mutate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving TOEFL:", error);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Pengaturan Ketentuan Nilai
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Pengaturan Ketentuan Nilai
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <CustomTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {isLoading ? (
              <div className="flex justify-center py-8">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === "lsp" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Atur nilai berdasarkan status kelulusan
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Kompeten</label>
                        <Input
                          type="number"
                          value={kompeten}
                          onChange={(e) => setKompeten(e.target.value)}
                          className="mt-1"
                          min={0}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Tidak Hadir
                        </label>
                        <Input
                          type="number"
                          value={tidakHadir}
                          onChange={(e) => setTidakHadir(e.target.value)}
                          className="mt-1"
                          min={0}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Belum/Tidak Kompeten
                        </label>
                        <Input
                          type="number"
                          value={tidakKompeten}
                          onChange={(e) => setTidakKompeten(e.target.value)}
                          className="mt-1"
                          min={0}
                        />
                      </div>
                    </div>

                    <Button onClick={handleSaveLSP} className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Simpan LSP
                    </Button>
                  </div>
                )}

                {activeTab === "toefl" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Atur konversi range skor TOEFL ke nilai
                    </p>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                      {/* Header */}
                      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-1">
                        <div className="text-xs font-medium text-muted-foreground">
                          Min
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">
                          Max
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">
                          Nilai
                        </div>
                        <div className="w-10"></div>
                      </div>

                      {/* Ranges */}
                      {ranges.map((range, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
                        >
                          <Input
                            type="number"
                            value={range.min}
                            onChange={(e) =>
                              handleRangeChange(index, "min", e.target.value)
                            }
                            placeholder="Min"
                          />
                          <Input
                            type="number"
                            value={range.max}
                            onChange={(e) =>
                              handleRangeChange(index, "max", e.target.value)
                            }
                            placeholder="Max"
                          />
                          <Input
                            type="number"
                            value={range.nilai}
                            onChange={(e) =>
                              handleRangeChange(index, "nilai", e.target.value)
                            }
                            placeholder="Nilai"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRange(index)}
                            className="text-destructive hover:text-destructive h-10 w-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={handleAddRange}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Range
                    </Button>

                    <Button onClick={handleSaveTOEFL} className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Simpan TOEFL
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}