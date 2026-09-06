"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const AMBIL_COLOR = "#2463EB";
const LULUS_COLOR = "#90C6FE";

export interface KrsAngkatanItem {
  angkatan: string;
  ambil_krs: number;
  lulus: number;
}

interface KrsBarChartViewProps {
  ta1: KrsAngkatanItem[];
  ta2: KrsAngkatanItem[];
  loading: boolean;
  error: boolean;
  title?: string;
  description?: string;
}

const chartConfig: ChartConfig = {
  ambil_krs: { label: "Ambil KRS", color: "#2463EB" },
  lulus: { label: "Lulus / Telah Sidang", color: "#90C6FE" },
};

function SingleChart({ data }: { data: KrsAngkatanItem[] }) {
  if (!data.length) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Belum ada data"
        subtitle="Tidak ada mahasiswa yang mengambil KRS untuk tipe ini"
        variant="small"
      />
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
      <BarChart data={data} margin={{ top: 24, right: 12, left: 12 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="angkatan"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar
          dataKey="ambil_krs"
          name="Ambil KRS"
          fill={AMBIL_COLOR}
          radius={[4, 4, 0, 0]}
        >
          <LabelList dataKey="ambil_krs" position="top" fontSize={11} />
        </Bar>
        <Bar
          dataKey="lulus"
          name="Lulus / Telah Sidang"
          fill={LULUS_COLOR}
          radius={[4, 4, 0, 0]}
        >
          <LabelList dataKey="lulus" position="top" fontSize={11} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

// Legend custom: kotak warna tetap warna bar, teks netral abu-abu
function ChartLegend() {
  return (
    <div className="flex items-center justify-center gap-5 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-[2px]"
          style={{ backgroundColor: AMBIL_COLOR }}
        />
        Ambil KRS
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-[2px]"
          style={{ backgroundColor: LULUS_COLOR }}
        />
        Lulus / Telah Sidang
      </span>
    </div>
  );
}

export function KrsBarChartView({
  ta1,
  ta2,
  loading,
  error,
  title = "Distribusi Mahasiswa KRS TA",
  description = "Jumlah mahasiswa yang mengambil KRS TA per angkatan (periode saat ini)",
}: KrsBarChartViewProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const slides = [
    { key: "ta1", label: "TA 1", data: ta1 },
    { key: "ta2", label: "TA 2", data: ta2 },
  ];

  if (error) {
    return (
      <Card className="shadow-none border-none mx-auto !p-0">
        <CardHeader className="pt-6">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={AlertCircle}
            title="Data tidak tersedia"
            subtitle="Gagal memuat data distribusi KRS"
            variant="small"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-none mx-auto !p-0">
      <CardHeader className="pt-6 flex-row items-start justify-between gap-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </div>
        {!loading && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary shrink-0">
            {slides[current]?.label}
          </span>
        )}
      </CardHeader>
      <CardContent className="p-0 pb-4">
        {loading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <Carousel setApi={setApi}>
              <CarouselContent>
                {slides.map((s) => (
                  <CarouselItem key={s.key}>
                    <SingleChart data={s.data} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <ChartLegend />

            {/* Kontrol carousel di dalam Card: panah + dot indicator */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-7 w-7 rounded-full"
                onClick={() => api?.scrollPrev()}
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => api?.scrollTo(i)}
                    aria-label={`Ke ${s.label}`}
                    className={`h-2 rounded-full transition-all ${
                      current === i
                        ? "w-5 bg-primary"
                        : "w-2 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-7 w-7 rounded-full"
                onClick={() => api?.scrollNext()}
                aria-label="Berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
