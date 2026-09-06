"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LSPStatistik, TOEFLStatistik, WorkshopStatistik } from "@/types/bimbingan-karir/koordinator/analisis-kegiatan/analisis-kegiatan"
import { MinatMhsService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { Minat } from "@/types/bimbingan-karir/koordinator/daftar-mahasiswa/daftar-mahasiswa"

type StatistikProps = {
  kategori: "lsp" | "workshop" | "toefl"
  statistik: LSPStatistik | TOEFLStatistik | WorkshopStatistik
}

const fetcherMinat = () => {
  return MinatMhsService.getMinat().then((res) => res)
}

// Array warna untuk minat
const colorPalette = [
  "#2463EB", "#60A8FA", "#3B85F6", "#1E40AF", "#93C5FD",
  "#DBEAFE", "#1E3A8A", "#3B82F6", "#60A5FA", "#2563EB"
]

export function Statistics({ kategori, statistik }: StatistikProps) {

  const { data, isLoading: isLoadingMinat } = useSWR(
    ["minat-mahasiswa-statistik"],
    () => fetcherMinat(),
    { revalidateOnFocus: false }
  )
  
  const minatList: Minat[] = data?.data || []
  

  const getChartData = () => {
    switch (kategori) {
      case "lsp": {
        const data = statistik as LSPStatistik
        return [
          {
            periode: "Periode 1",
            kompeten: data.periode_1.kompeten,
            tidak_kompeten: data.periode_1.tidak_kompeten,
            tidak_hadir: data.periode_1.tidak_hadir,
          },
          {
            periode: "Periode 2",
            kompeten: data.periode_2.kompeten,
            tidak_kompeten: data.periode_2.tidak_kompeten,
            tidak_hadir: data.periode_2.tidak_hadir,
          },
        ]
      }
      case "toefl": {
        const data = statistik as TOEFLStatistik
        return [
          {
            periode: "Periode 1",
            "<400": data.periode_1.distribusi["<400"],
            "400-450": data.periode_1.distribusi["400-450"],
            ">450": data.periode_1.distribusi[">450"],
          },
          {
            periode: "Periode 2",
            "<400": data.periode_2.distribusi["<400"],
            "400-450": data.periode_2.distribusi["400-450"],
            ">450": data.periode_2.distribusi[">450"],
          },
        ]
      }
      case "workshop": {
        const data = statistik as WorkshopStatistik
        const periode1Data: Record<string, string | number> = { periode: "Periode 1" }
        const periode2Data: Record<string, string | number> = { periode: "Periode 2" }
        
        // Dinamis berdasarkan minatList
        minatList.forEach((minat) => {
          const key = minat.nama_minat.toLowerCase().replace(/\s+/g, '_')
          periode1Data[key] = (data.periode_1 as Record<string, number>)[key] || 0
          periode2Data[key] = (data.periode_2 as Record<string, number>)[key] || 0
        })
        
        return [periode1Data, periode2Data]
      }
    }
  }

  const getChartConfig = () => {
    switch (kategori) {
      case "lsp":
        return {
          kompeten: {
            label: "Kompeten",
            color: "#2463EB",
          },
          tidak_kompeten: {
            label: "Tidak Kompeten",
            color: "#60A8FA",
          },
          tidak_hadir: {
            label: "Tidak Hadir",
            color: "#3B85F6",
          },
        }
      case "toefl":
        return {
          "<400": {
            label: "< 400",
            color: "#2463EB",
          },
          "400-450": {
            label: "400 - 450",
            color: "#60A8FA",
          },
          ">450": {
            label: "> 450",
            color: "#3B85F6",
          },
        }
      case "workshop": {
        const config: Record<string, { label: string; color: string }> = {}
        minatList.forEach((minat, index) => {
          const key = minat.nama_minat.toLowerCase().replace(/\s+/g, '_')
          config[key] = {
            label: minat.nama_minat,
            color: colorPalette[index % colorPalette.length]
          }
        })
        return config
      }
    }
  }

  const chartData = getChartData()
  const chartConfig = getChartConfig()

  const getTitle = () => {
    switch (kategori) {
      case "lsp":
        return "Statistik Sertifikasi LSP"
      case "toefl":
        return "Statistik TOEFL"
      case "workshop":
        return "Statistik Workshop"
    }
  }

  if (isLoadingMinat && kategori === "workshop") {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>Memuat data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>Perbandingan dua periode</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="periode"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartConfig[key as keyof typeof chartConfig]?.color}
                name={chartConfig[key as keyof typeof chartConfig]?.label}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
