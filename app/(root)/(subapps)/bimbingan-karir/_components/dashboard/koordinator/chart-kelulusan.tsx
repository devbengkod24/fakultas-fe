"use client"

import { CartesianGrid, Bar, BarChart, XAxis } from "recharts"
import { useState, useMemo, useEffect } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartData } from "@/types/bimbingan-karir/koordinator/dashboard/koordinator/dashboard"
import { KategoriService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { useProfile } from "@/context/profileUseContext"

interface ChartKelulusanLspProps {
  data?: ChartData
}

// Dynamic color generator
const generateColors = (keys: string[]) => {
  const colors = ["#2463EB", "#60A8FA", "#3B85F6", "#1D4ED8", "#93C5FD", "#BFDBFE", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]
  const config: ChartConfig = {}

  keys.forEach((key, index) => {
    config[key] = {
      label: key,
      color: colors[index % colors.length],
    }
  })

  return config
}

export function ChartKelulusan({ data }: ChartKelulusanLspProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const { activeProdiId } = useProfile();

  const { data: kategoriData } = useSWR(
    activeProdiId ? ["kategori-active-dropdown", activeProdiId] : null,
    () => KategoriService.getActive(activeProdiId).then((res) => res.data || []),
    { revalidateOnFocus: false }
  );

  const categoryOptions: { value: string; label: string }[] = useMemo(() => {
    if (!kategoriData || kategoriData.length === 0) {
      return [
        { value: "seminar", label: "Seminar" },
        { value: "toefl", label: "TOEFL" },
        { value: "lsp", label: "LSP" },
        { value: "workshop", label: "Workshop" },
        { value: "softskill", label: "Softskill" },
      ];
    }
    return kategoriData.map((kat: { kode: string; nama: string }) => ({
      value: kat.kode,
      label: kat.nama,
    }));
  }, [kategoriData]);

  // Set default selected category once options are loaded
  useEffect(() => {
    if (!selectedCategory && categoryOptions.length > 0) {
      setSelectedCategory(categoryOptions[0].value);
    }
  }, [categoryOptions, selectedCategory]);

  // Transform data based on selected category
  const { chartData, chartConfig } = useMemo(() => {
    // Fallback jika data belum tersedia
    if (!data || !selectedCategory) {
      return {
        chartData: [],
        chartConfig: {}
      }
    }

    const periods = Object.keys(data)
    const transformedData = periods.map(period => {
      const categoryData = data[period][selectedCategory] || {}
      return {
        periode: period,
        ...categoryData
      }
    })

    // Get all possible keys for the selected category
    const allKeys = new Set<string>()
    periods.forEach(period => {
      const categoryData = data[period][selectedCategory] || {}
      Object.keys(categoryData).forEach(key => allKeys.add(key))
    })

    const config = generateColors(Array.from(allKeys))

    return {
      chartData: transformedData,
      chartConfig: config
    }
  }, [selectedCategory, data])

  // Get category keys for rendering bars
  const categoryKeys = Object.keys(chartConfig)

  return (
    <Card className="shadow-none h-full">
      <CardHeader className="flex flex-col">
        <div className="flex items-start flex-col gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <CardTitle>Jumlah Kelulusan</CardTitle>
            </div>
            <CardDescription className="text-xs mt-1">
              Jumlah mahasiswa berdasarkan kategori yang dipilih
            </CardDescription>
          </div>
          
          {/* Dropdown Selection - positioned on the right */}
          <div className="w-32">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 16,
              right: 16,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="periode"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              height={48}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            
            {/* Render bars dynamically based on category keys */}
            {categoryKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartConfig[key]?.color || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                radius={4}
              />
            ))}
            
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
