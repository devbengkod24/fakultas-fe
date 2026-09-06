"use client"

import { useState, useEffect } from "react"
import { Code, BookOpen, Award } from "lucide-react"
import { CustomTabs } from "@/components/custom-tabs"
import { ActivitySelector } from "./activity-selector"
import { ComparisonMetrics } from "./comparison-metrics"
import { GeneralInfo } from "./general-info"
// import { Statistics } from "./statistik"
import { AnalisisKegiatanService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { Statistics } from "./statistik"
import { useProfile } from "@/context/profileUseContext"

const fetcher = (activeProdiId: number | null, kategori: string, periode_1: number, periode_2: number) => {
  return AnalisisKegiatanService.getAllAnalisisKegiatan(activeProdiId, kategori, periode_1, periode_2).then((res) => res)};

export default function ComparasionPage() {
  const { activeProdiId } = useProfile();
  const [activeTab, setActiveTab] = useState("workshop")
  const [firstActivity, setFirstActivity] = useState<number>(0)
  const [secondActivity, setSecondActivity] = useState<number>(0)

  const { data, mutate } = useSWR(
    ["analisis-kegiatan", activeProdiId, activeTab, firstActivity, secondActivity],
    () => fetcher(activeProdiId, activeTab, firstActivity, secondActivity),
    {revalidateOnFocus: false, dedupingInterval: 0}
  );

  useEffect(() => {
    if (mutate) {
      mutate();
    }
  }, [activeProdiId, mutate]);

  const periodes = data?.data?.periode || [];
  const cardData = data?.data?.card;
  const informasiUmum = data?.data?.informasi_umum;
  const statistika = data?.data?.statistik;

  const tabs = [
    {
      status: "workshop",
      label: "Workshop",
      icon: Code,
    },
    {
      status: "toefl",
      label: "TOEFL",
      icon: BookOpen,
    },
    {
      status: "lsp",
      label: "Sertifikasi LSP",
      icon: Award,
    },
  ]

  const handleTabChange = (status: string) => {
    setActiveTab(status);
  }

  return (
    <div>
      <CustomTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex flex-col gap-4">
        <ActivitySelector
          firstActivity={firstActivity}
          secondActivity={secondActivity}
          onFirstActivityChange={setFirstActivity}
          onSecondActivityChange={setSecondActivity}
          periods={periodes}
          activeTab={activeTab}
        />
        
        <ComparisonMetrics
          cardData={cardData}
        />

        {informasiUmum && statistika && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GeneralInfo informasiUmum={informasiUmum} />
            <Statistics
              kategori={activeTab as "lsp" | "workshop" | "toefl"}
              statistik={statistika}
            />
          </div>
        )}
      </div>

    </div>
  )
}
