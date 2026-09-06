"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import useSWR from "swr";

const ALUMNI_STATS_URL = "https://api-alumni.dieseltrack.site/api/v1/public/dashboard-stats";

interface CardMasaTungguProps {
  title?: string;
  description?: string;
  colors?: string[];
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

const defaultColors = ["#2463eb", "#60a8fb", "#3a87f7"];

const defaultMasaTungguItems = [
  { label: "kurang dari 6 bulan", count: 1 },
  { label: "6 bulan - 12 bulan", count: 0 },
  { label: "lebih dari 12 bulan", count: 0 },
];

export default function CardMasaTunggu({
  title = "Masa Tunggu Alumni",
  description = "Distribusi masa tunggu berdasarkan periode waktu",
  colors = defaultColors,
}: CardMasaTungguProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: responseData, isLoading } = useSWR(
    ALUMNI_STATS_URL,
    (url: string) => fetch(url).then((res) => res.json()),
    { revalidateOnFocus: false, refreshInterval: 300000 }
  );

  const items =
    responseData?.success && responseData?.data?.masa_tunggu?.items
      ? responseData.data.masa_tunggu.items
      : defaultMasaTungguItems;

  const chartData: ChartDataItem[] = items.map(
    (item: { label: string; count: number }, index: number) => ({
      name: item.label,
      value: item.count,
      fill: colors[index % colors.length],
    })
  );

  const total = responseData?.data?.masa_tunggu?.total ?? chartData.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: PieSectorDataItem) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={(cy ?? 0) - 20}
          dy={8}
          textAnchor="middle"
          fill="currentColor"
          className="text-xs font-semibold fill-foreground"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={(cy ?? 0) + 8}
          textAnchor="middle"
          fill="currentColor"
          className="text-lg font-bold fill-foreground"
        >
          {value} Alumni
        </text>
        <text
          x={cx}
          y={(cy ?? 0) + 26}
          textAnchor="middle"
          fill="currentColor"
          className="text-xs fill-muted-foreground"
        >
          {`(${((percent ?? 0) * 100).toFixed(1)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={(outerRadius ?? 0) + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <Card className="w-full shadow-none flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[260px] items-center justify-center text-xs text-muted-foreground">
            Memuat data masa tunggu...
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="h-[260px] w-full">
              <ChartContainer className="h-full w-full" config={{}}>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
              </ChartContainer>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 w-full">
              {chartData.map((entry, index) => (
                <div
                  key={`legend-${index}`}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-muted/40 transition-colors"
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs border-t pt-3 mt-2">
        <div className="leading-none text-muted-foreground">
          Total Alumni Terlacak sebanyak{" "}
          <span className="font-semibold text-foreground">{total}</span>.
        </div>
      </CardFooter>
    </Card>
  );
}
