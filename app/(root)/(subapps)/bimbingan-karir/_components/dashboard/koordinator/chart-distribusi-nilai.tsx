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
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import EmptyState from "@/components/empty-state"
import { Award } from "lucide-react"

// Array warna untuk minat
const colorPalette = [
  "#2463EB", "#60A8FA", "#3B85F6", "#1E40AF", "#93C5FD",
  "#DBEAFE", "#1E3A8A", "#3B82F6", "#60A5FA", "#2563EB"
]

interface ChartHasilUjiLspProps {
  data?: Array<Record<string, string | number>>
}

export function ChartHasilUji({ data }: ChartHasilUjiLspProps) {
  // Generate chartConfig dan minat keys secara dinamis
  const { chartConfig, minatKeys } = (() => {
    if (!data || data.length === 0) {
      return { chartConfig: {}, minatKeys: [] }
    }

    // Ambil keys dari data pertama, exclude 'range'
    const firstItem = data[0]
    const keys = Object.keys(firstItem).filter(key => key !== 'range')
    
    // Generate config
    const config: ChartConfig = {}
    keys.forEach((key, index) => {
      // Convert key ke label yang lebih readable
      const label = key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      config[key] = {
        label: label,
        color: colorPalette[index % colorPalette.length],
      }
    })

    return { chartConfig: config, minatKeys: keys }
  })()

  // Check apakah ada data minat (bukan hanya range)
  const hasData = data && data.length > 0 && minatKeys.length > 0
  const shouldRotate = minatKeys.length > 3

  return (
    <Card className="shadow-none h-full flex flex-col">
      <CardHeader className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <CardTitle>Distribusi Nilai per Minat</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Distribusi nilai mahasiswa berdasarkan minat bidang
        </CardDescription>
        <div className="h-8"></div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="range"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                height={shouldRotate ? 60 : 48}
                angle={shouldRotate ? -45 : 0}
                textAnchor={shouldRotate ? "end" : "middle"}
                tick={{ fontSize: shouldRotate ? 10 : 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              {minatKeys.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={chartConfig[key]?.color}
                  radius={4}
                />
              ))}
              <ChartLegend 
                content={<ChartLegendContent />}
                wrapperStyle={{
                  fontSize: shouldRotate ? '11px' : '12px',
                  paddingTop: shouldRotate ? '12px' : '8px'
                }}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center text-sm">
            <EmptyState 
              icon={Award}
              title="Tidak ada Distribusi Nilai" 
              subtitle="Belum ada data distribusi nilai mahasiswa berdasarkan minat yang tersedia."
              className="h-56" 
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
