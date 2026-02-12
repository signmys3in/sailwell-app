"use client";

import { useContext } from "react";
import { AppContext } from "@/contexts/app-context";
import PageHeader from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

export default function DiseaseTrendsPage() {
  const { dispenseLog } = useContext(AppContext);

  const diagnosisCounts = dispenseLog.reduce((acc, log) => {
    if (log.diagnosis && log.diagnosis !== 'AI-assisted diagnosis' && log.diagnosis !== 'No diagnosis provided.') {
      acc[log.diagnosis] = (acc[log.diagnosis] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(diagnosisCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const chartConfig: ChartConfig = {
    count: {
      label: "Diagnoses",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div>
      <PageHeader
        title="Disease Trends"
        description="A visual representation of diagnosed diseases."
      />
      <Card>
        <CardHeader>
          <CardTitle>Diagnosed Diseases Frequency</CardTitle>
          <CardDescription>
            This chart shows the number of times each disease has been diagnosed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ bottom: 70 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-12">
              <p>No diagnosis data available to display.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
