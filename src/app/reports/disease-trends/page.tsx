"use client";

import { useContext, useMemo, useRef } from "react";
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
import { PieChart, Pie, Cell } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function DiseaseTrendsPage() {
  const { dispenseLog } = useContext(AppContext);
  const chartRef = useRef<HTMLDivElement | null>(null);

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

  const reportingPeriod = useMemo(() => {
    if (dispenseLog.length === 0) {
      return "No data available";
    }
    const timestamps = dispenseLog.map(log => log.timestamp);
    const minDate = new Date(Math.min(...timestamps.map(t => t.getTime())));
    const maxDate = new Date(Math.max(...timestamps.map(t => t.getTime())));
    if (minDate.getTime() === maxDate.getTime()) {
      return format(minDate, "PPP");
    }
    return `From ${format(minDate, "PPP")} to ${format(maxDate, "PPP")}`;
  }, [dispenseLog]);


  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: "Cases",
      },
    };
    chartData.forEach((item, index) => {
        config[item.name] = { 
          label: item.name,
          color: COLORS[index % COLORS.length] 
        };
    });
    return config;
  }, [chartData]);
  
  const handleExportPDF = () => {
    const chartElement = chartRef.current;
    if (!chartElement) return;
    const svg = chartElement.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    // Use btoa(unescape(encodeURIComponent(svgData))) to handle special characters
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    
    img.onload = () => {
        const canvas = document.createElement("canvas");
        const svgSize = svg.getBoundingClientRect();
        // Add padding to avoid clipping
        canvas.width = svgSize.width + 40;
        canvas.height = svgSize.height + 40;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Fill background with white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20); // Draw with padding

        const imgData = canvas.toDataURL("image/png");

        const doc = new jsPDF();
        doc.text("Disease Trends Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Reporting Period: ${reportingPeriod}`, 14, 22);
        doc.setFontSize(12);

        const imgProps= doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * (pdfWidth - 28)) / imgProps.width;
        doc.addImage(imgData, 'PNG', 14, 30, pdfWidth - 28, pdfHeight);

        const tableColumn = ["Diagnosis", "Number of Cases"];
        const tableRows: (string | number)[][] = chartData.map(item => [item.name, item.count]);

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: pdfHeight + 40,
        });
        
        doc.save("disease-trends-report.pdf");
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <PageHeader
            title="Disease Trends"
            description="A visual representation of diagnosed diseases."
        />
        <Button onClick={handleExportPDF} variant="outline" disabled={chartData.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export to PDF
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Diagnosed Diseases Frequency</CardTitle>
          <CardDescription>
            This pie chart shows the distribution of diagnosed diseases for the period: {reportingPeriod}.
          </CardDescription>
        </CardHeader>
        <CardContent ref={chartRef} className="flex justify-center">
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
                >
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
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
