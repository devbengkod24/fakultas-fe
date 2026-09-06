"use client";

import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardDosen } from '@/types/kerja-praktek/dashboard';

const chartConfig = {
  students: {
    label: "Jml mhs",
  },
  bab1: {
    label: "Bab 1",
    color: "#2463EB",
  },
  bab2: {
    label: "Bab 2",
    color: "#60A8FA",
  },
  bab3: {
    label: "Bab 3",
    color: "#3B85F6",
  },
  bab4: {
    label: "Bab 4",
    color: "#90C6FE",
  },
  bab5: {
    label: "Bab 5",
    color: "#BDDCFE",
  },
} satisfies ChartConfig;

const DashboardDosenChartLogbook = ({ data }: { data: DashboardDosen }) => {
  const chartData = React.useMemo(() => {
    if (!data?.logbook_progress) {
      return [
        { bab: "Bab 1", students: 0, fill: "#2463EB" },
        { bab: "Bab 2", students: 0, fill: "#60A8FA" },
        { bab: "Bab 3", students: 0, fill: "#3B85F6" },
        { bab: "Bab 4", students: 0, fill: "#90C6FE" },
        { bab: "Bab 5", students: 0, fill: "#BDDCFE" },
      ];
    }

    const { logbook_progress } = data;
    
    return [
      { bab: "Bab 1", students: logbook_progress.bab_1 || 0, fill: "#2463EB" },
      { bab: "Bab 2", students: logbook_progress.bab_2 || 0, fill: "#60A8FA" },
      { bab: "Bab 3", students: logbook_progress.bab_3 || 0, fill: "#3B85F6" },
      { bab: "Bab 4", students: logbook_progress.bab_4 || 0, fill: "#90C6FE" },
      { bab: "Bab 5", students: logbook_progress.bab_5 || 0, fill: "#BDDCFE" },
    ];
  }, [data]);

  return (
    <Card className='rounded-md'>
      <CardHeader>
        <CardTitle>Logbook Mahasiswa</CardTitle>
        <CardDescription>
          Jumlah mahasiswa yang mengisi logbook per bab
        </CardDescription>
      </CardHeader>
      <CardContent className='p-4'>
        <ChartContainer config={chartConfig} className='h-64 w-full'> 
          <BarChart 
            accessibilityLayer 
            data={chartData}
            margin={{
              top: 30,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bab"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="students" radius={8}>
              <LabelList
                dataKey="students"
                position="top"
                className="fill-foreground"
                fontSize={12}
                offset={8}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardDosenChartLogbook;