"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import useSWR from "swr";

const ALUMNI_STATS_URL = "https://api-alumni.dieseltrack.site/api/v1/public/dashboard-stats";

interface PerbandinganBidangPekerjaanProps {
  readonly title?: string;
  readonly description?: string;
  readonly footer?: string;
  readonly colorScheme?: {
    readonly primary: string;
    readonly secondary: string;
    readonly tertiary: string;
    readonly quaternary: string;
    readonly quinary: string;
  };
  readonly maxLabelLength?: number;
}

const defaultColors = {
  primary: "#2463EB",
  secondary: "#60A8FB",
  tertiary: "#3A87F7",
  quaternary: "#91C6FE",
  quinary: "#BDDCFE",
};

const defaultStatusItems = [
  { label: "Bekerja Full Time", count: 8 },
  { label: "Bekerja Part Time", count: 0 },
  { label: "Wirausaha", count: 1 },
  { label: "Tidak Bekerja / Cari Kerja", count: 4 },
];

const formatXAxis = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.substring(0, maxLength)}...`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-2.5 rounded-lg shadow-md text-xs">
        <p className="font-semibold text-popover-foreground">{label}</p>
        <p className="text-primary font-medium mt-0.5">{`Jumlah Alumni: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function PerbandinganBidangPekerjaan({
  title = "Status Pekerjaan Alumni",
  description = "Jumlah alumni berdasarkan status pekerjaan dari Tracer Study",
  footer = "Data didapatkan dari pengisian Portal Alumni",
  colorScheme = defaultColors,
  maxLabelLength = 12,
}: PerbandinganBidangPekerjaanProps) {
  const { data: responseData, isLoading } = useSWR(
    ALUMNI_STATS_URL,
    (url: string) => fetch(url).then((res) => res.json()),
    { revalidateOnFocus: false, refreshInterval: 300000 }
  );

  const items =
    responseData?.success && responseData?.data?.status_alumni?.items
      ? responseData.data.status_alumni.items
      : defaultStatusItems;

  const chartData = items.map(
    (item: { label: string; count: number }, index: number) => {
      const colors = [
        colorScheme.primary,
        colorScheme.secondary,
        colorScheme.tertiary,
        colorScheme.quaternary,
        colorScheme.quinary,
      ];
      const fill = colors[index % colors.length];

      return {
        bidang: item.label,
        jumlah: item.count,
        fill,
      };
    }
  );

  const chartConfig = {
    jumlah: {
      label: "Jumlah Alumni",
      color: "#2463EB",
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full flex flex-col justify-between shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="flex h-[260px] items-center justify-center text-xs text-muted-foreground">
            Memuat data status alumni...
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  right: 15,
                  left: 0,
                  bottom: 35,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="bidang"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-25}
                  textAnchor="end"
                  height={55}
                  interval={0}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => formatXAxis(value, maxLabelLength)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="jumlah"
                  radius={[6, 6, 0, 0]}
                  fill={colorScheme.primary}
                >
                  <LabelList
                    dataKey="jumlah"
                    position="top"
                    offset={8}
                    className="fill-foreground font-semibold"
                    fontSize={11}
                  />
                </Bar>
              </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs border-t pt-3 mt-2">
        <div className="leading-none text-muted-foreground">{footer}</div>
      </CardFooter>
    </Card>
  );
}
