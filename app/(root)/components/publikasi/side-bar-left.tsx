"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mapping label UI → nilai yang diterima API (dari BE config DEPARTMENTS)
const PRODI_OPTIONS = [
  { label: "TI S1",       value: "Teknik Informatika S1" },
  { label: "SI S1",       value: "Sistem Informasi S1" },
  { label: "Ilkom S1",    value: "Ilmu Komunikasi S1" },
  { label: "DKV S1",      value: "Desain Komunikasi Visual S1" },
  { label: "PJJ TI S1",   value: "PJJ Informatika S1" },
  { label: "TI S2",       value: "Teknik Informatika S2" },
  { label: "IK S3",       value: "Ilmu Komputer S3" },
  { label: "FTV D4",      value: "Film dan Televisi D4" },
  { label: "ANIMASI D4",  value: "Animasi D4" },
  { label: "TI D3",       value: "Teknik Informatika D3" },
];

interface SideBarLeftSectionProps {
  activeTab: string;
}

const SideBarLeftSection = ({ activeTab }: SideBarLeftSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [source, setSource] = useState("");
  const [prodi, setProdi] = useState("");
  const [fund_source, setSumberPendanaan] = useState("");
  const [sortBy, setSortBy] = useState("terbaru");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  // Sync dengan URL params
  useEffect(() => {
    const urlSource = searchParams.get("source") || "";
    const urlProdi = searchParams.get("prodi") || "";
    const urlSumberPendanaan = searchParams.get("fund_source") || "";
    const urlMinYear = searchParams.get("min_year") || "";
    const urlMaxYear = searchParams.get("max_year") || "";

    let urlSortBy = "terbaru";
    if (activeTab === "artikel") {
      urlSortBy =
        searchParams.get("sort_by_citation") === "true" ? "sitasi" : "terbaru";
    } else {
      urlSortBy =
        searchParams.get("termahal") === "true" ? "termahal" : "terbaru";
    }

    const hasFilterParams =
      urlSource ||
      urlProdi ||
      urlSumberPendanaan ||
      urlMinYear ||
      urlMaxYear ||
      searchParams.get("sort_by_citation") ||
      searchParams.get("termahal");

    if (hasFilterParams) {
      setSource(urlSource);
      setProdi(urlProdi);
      setSumberPendanaan(urlSumberPendanaan);
      setSortBy(urlSortBy);
      setMinYear(urlMinYear);
      setMaxYear(urlMaxYear);
    } else {
      setSource("");
      setProdi("");
      setSumberPendanaan("");
      setSortBy("terbaru");
      setMinYear("");
      setMaxYear("");
    }
  }, [activeTab, searchParams]);

  // Apply filter
  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    // Filter prodi (berlaku untuk artikel & penelitian)
    if (prodi) {
      params.set("prodi", prodi);
    } else {
      params.delete("prodi");
    }

    if (activeTab === "artikel") {
      if (source) {
        params.set("source", source.toUpperCase());
      } else {
        params.delete("source");
      }

      if (sortBy === "sitasi") {
        params.set("sort_by_citation", "true");
      } else {
        params.delete("sort_by_citation");
      }
    } else {
      if (fund_source) {
        params.set("fund_source", fund_source);
      } else {
        params.delete("fund_source");
      }

      if (sortBy === "termahal") {
        params.set("termahal", "true");
      } else {
        params.set("termahal", "false");
      }
    }

    if (minYear) {
      params.set("min_year", minYear);
    } else {
      params.delete("min_year");
    }

    if (maxYear) {
      params.set("max_year", maxYear);
    } else {
      params.delete("max_year");
    }

    router.push(`?${params.toString()}`);
  };

  // Clear filter
  const handleClearFilters = () => {
    setSource("");
    setProdi("");
    setSumberPendanaan("");
    setSortBy("terbaru");
    setMinYear("");
    setMaxYear("");

    const params = new URLSearchParams();
    const search = searchParams.get("search");
    const searchType = searchParams.get("searchType");

    if (search) params.set("search", search);
    if (searchType) params.set("searchType", searchType);
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  // Komponen radio prodi (dipakai di kedua tab)
  const ProdiFilter = () => (
    <div>
      <h3 className="font-medium mb-3">Prodi</h3>
      <RadioGroup
        value={prodi}
        onValueChange={setProdi}
        className="space-y-2"
      >
        {PRODI_OPTIONS.map((item) => (
          <div key={item.value} className="flex items-center space-x-2">
            <RadioGroupItem value={item.value} id={`prodi-${item.value}`} />
            <Label htmlFor={`prodi-${item.value}`}>{item.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <>
      <Card className="p-5">
        <div className="space-y-6">
          {activeTab === "artikel" ? (
            <>
              <div>
                <h3 className="font-medium mb-3">Artikel</h3>
                <RadioGroup
                  value={source}
                  onValueChange={setSource}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SCOPUS" id="SCOPUS" />
                    <Label htmlFor="SCOPUS">SCOPUS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="GARUDA" id="GARUDA" />
                    <Label htmlFor="GARUDA">GARUDA</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="GOOGLE_SCHOLAR" id="GOOGLE_SCHOLAR" />
                    <Label htmlFor="GOOGLE_SCHOLAR">GOOGLE_SCHOLAR</Label>
                  </div>
                </RadioGroup>
              </div>

              <ProdiFilter />

              <div>
                <h3 className="font-medium mb-3">Tahun</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Select value={minYear} onValueChange={setMinYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {["2020","2021","2022","2023","2024","2025","2026"].map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={maxYear} onValueChange={setMaxYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Maks" />
                    </SelectTrigger>
                    <SelectContent>
                      {["2020","2021","2022","2023","2024","2025","2026"].map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-medium mb-3">Sumber Pendanaan</h3>
                <RadioGroup
                  value={fund_source}
                  onValueChange={setSumberPendanaan}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="INTERNAL_SOURCE" id="INTERNAL_SOURCE" />
                    <Label htmlFor="INTERNAL_SOURCE">INTERNAL SOURCE</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BIMA_SOURCE" id="BIMA_SOURCE" />
                    <Label htmlFor="BIMA_SOURCE">BIMA SOURCE</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SIMLITABMAS_SOURCE" id="SIMLITABMAS_SOURCE" />
                    <Label htmlFor="SIMLITABMAS_SOURCE">SIMLITABMAS SOURCE</Label>
                  </div>
                </RadioGroup>
              </div>

              <ProdiFilter />

              <div>
                <h3 className="font-medium mb-3">Tahun</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Select value={minYear} onValueChange={setMinYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {["2020","2021","2022","2023","2024","2025","2026"].map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={maxYear} onValueChange={setMaxYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Maks" />
                    </SelectTrigger>
                    <SelectContent>
                      {["2020","2021","2022","2023","2024","2025","2026"].map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-primary-600 hover:bg-primary-500"
              onClick={handleApplyFilter}
            >
              Apply
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default SideBarLeftSection;