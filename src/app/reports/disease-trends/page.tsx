"use client";

import { useContext, useMemo } from "react";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

export default function DiseaseTrendsPage() {
  const { dispenseLog } = useContext(AppContext);

  const chartData = useMemo(() => {
    const diagnosisCounts = dispenseLog.reduce((acc, log) => {
      if (log.diagnosis && log.diagnosis !== 'AI-assisted diagnosis' && log.diagnosis !== 'No diagnosis provided.') {
        const mainDiagnosis = log.shortDiagnosis || log.diagnosis.split("(")[0].trim();
        acc[mainDiagnosis] = (acc[mainDiagnosis] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(diagnosisCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [dispenseLog]);


  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: "Cases",
      },
    };
    chartData.forEach((item) => {
        config[item.name] = { label: item.name };
    });
    return config;
  }, [chartData]);


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
            This pie chart shows the distribution of diagnosed diseases.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full max-w-sm">
              <PieChart accessibilityLayer>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                  }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + (radius + 15) * Math.cos(-midAngle * Math.PI / 180);
                    const y = cy + (radius + 15) * Math.sin(-midAngle * Math.PI / 180);
                    
                    if (percent < 0.05) return null;

                    return (
                      <text
                        x={x}
                        y={y}
                        className="fill-foreground text-xs"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                />
                 <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: 20 }}
                />
              </PieChart>
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
