
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { FileDown, AlertTriangle, Pill } from "lucide-react";
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

const SEVERITY_DEFINITIONS = {
    red: {
      label: "Requires immediate medical attention",
      icon: AlertTriangle,
      cardClass: "bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200 border-red-200 dark:border-red-800",
      iconClass: "text-red-500 dark:text-red-400",
      pdfColors: {
        bg: [254, 242, 242],
        text: [127, 29, 29],
      }
    },
    orange: {
      label: "Needs close monitoring",
      icon: AlertTriangle,
      cardClass: "bg-orange-50 text-orange-900 dark:bg-orange-950/50 dark:text-orange-200 border-orange-200 dark:border-orange-800",
      iconClass: "text-orange-500 dark:text-orange-400",
       pdfColors: {
        bg: [255, 247, 237],
        text: [124, 45, 18],
      }
    },
    green: {
      label: "Needs medication",
      icon: Pill,
      cardClass: "bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-200 border-green-200 dark:border-green-800",
      iconClass: "text-green-500 dark:text-green-400",
      pdfColors: {
        bg: [240, 253, 244],
        text: [21, 128, 61],
      }
    },
};

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

  const severityCounts = useMemo(() => {
    const counts: Record<keyof typeof SEVERITY_DEFINITIONS, number> = { red: 0, orange: 0, green: 0 };
    dispenseLog.forEach(log => {
        if (log.severity && counts.hasOwnProperty(log.severity)) {
            counts[log.severity]++;
        }
    });
    return counts;
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

  const uniqueDiagnosisLog = useMemo(() => {
    const uniqueEntries = new Map<string, { diagnosis: string, crewName: string, medicalId: string }>();
    const detailedLog = dispenseLog.filter(log => log.diagnosis && log.diagnosis !== 'AI-assisted diagnosis' && log.diagnosis !== 'No diagnosis provided.');

    detailedLog.forEach(log => {
        const diagnosis = log.shortDiagnosis || log.diagnosis.split("(")[0].trim();
        const key = `${log.crewName}-${log.medicalId}-${diagnosis}`;
        if (!uniqueEntries.has(key)) {
            uniqueEntries.set(key, {
                diagnosis,
                crewName: log.crewName,
                medicalId: log.medicalId,
            });
        }
    });

    return Array.from(uniqueEntries.values()).sort((a,b) => a.crewName.localeCompare(b.crewName));
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

    const getRgbFromCssVar = (cssVar: string) => {
        const tempEl = document.createElement("div");
        tempEl.style.color = cssVar;
        document.body.appendChild(tempEl);
        const computedColor = getComputedStyle(tempEl).color;
        document.body.removeChild(tempEl);
        return computedColor;
    };


    const svgClone = svg.cloneNode(true) as SVGElement;
    
    const originalElements = svg.querySelectorAll('*');
    const clonedElements = svgClone.querySelectorAll('*');

    originalElements.forEach((originalEl, index) => {
        const clonedEl = clonedElements[index];
        if (!clonedEl) return;
        const style = getComputedStyle(originalEl);
        
        const fill = style.getPropertyValue('fill');
        const stroke = style.getPropertyValue('stroke');
        const textAnchor = style.getPropertyValue('text-anchor');
        const dominantBaseline = style.getPropertyValue('dominant-baseline');
        const className = originalEl.getAttribute('class');

        if (fill && fill !== 'none') {
            clonedEl.setAttribute('fill', fill);
        }
        if (stroke && stroke !== 'none') {
            clonedEl.setAttribute('stroke', stroke);
        }
        // These attributes are sometimes missed but important for text positioning
        if (textAnchor) clonedEl.setAttribute('text-anchor', textAnchor);
        if (dominantBaseline) clonedEl.setAttribute('dominant-baseline', dominantBaseline);
        if (className) clonedEl.setAttribute('class', className);
    });

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const img = new Image();
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    
    img.onload = () => {
        const canvas = document.createElement("canvas");
        const svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width + 40;
        canvas.height = svgSize.height + 40;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);

        const imgData = canvas.toDataURL("image/png");

        const doc = new jsPDF();
        doc.text("Disease Trends Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Reporting Period: ${reportingPeriod}`, 14, 22);
        
        let startY = 30;

        // Severity Section
        doc.setFontSize(12);
        doc.text("Severity Breakdown", 14, startY);
        startY += 8;

        const severityKeys = Object.keys(severityCounts) as Array<keyof typeof SEVERITY_DEFINITIONS>;
        const boxWidth = (doc.internal.pageSize.getWidth() - 28 - ((severityKeys.length - 1) * 4)) / severityKeys.length;
        const boxHeight = 25;

        severityKeys.forEach((key, index) => {
            const severity = SEVERITY_DEFINITIONS[key];
            const x = 14 + index * (boxWidth + 4);

            const [bgR, bgG, bgB] = severity.pdfColors.bg;
            doc.setFillColor(bgR, bgG, bgB);
            doc.rect(x, startY, boxWidth, boxHeight, 'F');
            
            const [textR, textG, textB] = severity.pdfColors.text;
            doc.setTextColor(textR, textG, textB);

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(severity.label, x + boxWidth / 2, startY + 7, { align: 'center', maxWidth: boxWidth - 6 });

            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(String(severityCounts[key]), x + boxWidth / 2, startY + 18, { align: 'center' });
        });
        startY += boxHeight + 15;
        doc.setTextColor(0,0,0); // Reset text color

        const tableColumn = ["Crew Name", "Medical ID", "Diagnosis"];
        
        const tableRows: (string | number)[][] = uniqueDiagnosisLog.map(entry => [
            entry.crewName,
            entry.medicalId,
            entry.diagnosis,
        ]);

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: startY,
        });

        const tableEndY = (doc as any).lastAutoTable.finalY;
        const imgProps= doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * (pdfWidth - 28)) / imgProps.width;
        
        const chartStartY = tableEndY + 10;
        doc.addImage(imgData, 'PNG', 14, chartStartY, pdfWidth - 28, pdfHeight);

        const legendStartY = chartStartY + pdfHeight + 10;
        doc.setFontSize(9);
        
        chartData.forEach((item, index) => {
            const colorCss = chartConfig[item.name]?.color || COLORS[index % COLORS.length];
            const resolvedColor = getRgbFromCssVar(colorCss);
            const match = /rgb\((\d+), (\d+), (\d+)\)/.exec(resolvedColor);

            if (match) {
                const [, r, g, b] = match.map(Number);
                doc.setFillColor(r, g, b);
            } else {
                doc.setFillColor(0, 0, 0); // Fallback to black
            }
            
            const yPos = legendStartY + (index * 6);
            doc.rect(14, yPos, 4, 4, 'F');
            doc.text(item.name, 20, yPos + 3.5);
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
        <Button onClick={handleExportPDF} variant="outline" disabled={dispenseLog.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export to PDF
        </Button>
      </div>

       <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Severity Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(severityCounts) as Array<keyof typeof SEVERITY_DEFINITIONS>).map((key) => {
                    const severity = SEVERITY_DEFINITIONS[key as keyof typeof SEVERITY_DEFINITIONS];
                    const Icon = severity.icon;
                    return (
                        <Card key={key} className={severity.cardClass}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">{severity.label}</CardTitle>
                                <Icon className={`h-5 w-5 ${severity.iconClass}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{severityCounts[key]}</div>
                                <p className="text-xs opacity-80">Total Cases</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
       </div>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Unique Diagnoses per Crew Member</CardTitle>
                <CardDescription>
                    A de-duplicated list showing each diagnosis recorded for each crew member.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Crew Name</TableHead>
                                <TableHead>Medical ID</TableHead>
                                <TableHead>Diagnosis</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uniqueDiagnosisLog.length > 0 ? (
                                uniqueDiagnosisLog.map((log, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{log.crewName}</TableCell>
                                        <TableCell className="font-mono text-xs">{log.medicalId}</TableCell>
                                        <TableCell>{log.diagnosis}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No diagnosis data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

      <Card className="mt-8">
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
                        fill="hsl(var(--foreground))"
                        className="text-xs"
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
