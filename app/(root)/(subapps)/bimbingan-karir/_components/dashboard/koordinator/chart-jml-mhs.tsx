"use client"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { GraduationCap } from "lucide-react"
import EmptyState from "@/components/empty-state"

// Array warna untuk minat
const colorPalette = [
  "#2563eb", "#3b82f6", "#60a5fa", "#1e40af", "#93c5fd",
  "#dbeafe", "#1e3a8a", "#6366f1", "#818cf8", "#a5b4fc"
]

interface ChartJmlMhsDashProps {
  data: Record<string, number> | null
}

export function ChartJmlMhs({ data }: ChartJmlMhsDashProps) {
  // Generate chartConfig dinamis berdasarkan data
  const chartConfig: ChartConfig = data
    ? Object.keys(data).reduce((config, key, index) => {
        const sanitizedKey = key.toLowerCase().replace(/\s+/g, '_')
        config[sanitizedKey] = {
          label: key,
          color: colorPalette[index % colorPalette.length],
        }
        return config
      }, {} as ChartConfig)
    : {}

  // Transform data menjadi array untuk chart
  const transformedData = data
    ? Object.entries(data).map(([minat, total], index) => ({
        minat: minat.toLowerCase().replace(/\s+/g, '_'),
        minatLabel: minat,
        total: total,
        fill: colorPalette[index % colorPalette.length],
      }))
    : []

  const hasData = data && Object.keys(data).length > 0

  return (
    <Card className="shadow-none h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2 justify-between">
          Jumlah Peminatan Mahasiswa
          <GraduationCap className="size-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={transformedData}
              layout="vertical"
              margin={{
                left: 16,
              }}
              barSize={28}
            >
              <YAxis
                dataKey="minat"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                }
              />
              <XAxis dataKey="total" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="total" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center">
            <EmptyState 
              icon={GraduationCap}
              title="Tidak ada Minat Mahasiswa" 
              subtitle="Belum ada minat mahasiswa yang terdaftar."
              className="h-80" 
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}