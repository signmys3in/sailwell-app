"use client";

import { useContext, useMemo } from "react";
import { AppContext } from "@/contexts/app-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import PageHeader from "@/components/page-header";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function LowStockReportPage() {
  const { drugStock } = useContext(AppContext);

  const lowStockDrugs = useMemo(() =>
    drugStock
      .filter((drug) => (drug.stock / drug.maxStock) < 0.5)
      .sort((a, b) => (a.stock / a.maxStock) - (b.stock / b.maxStock)),
    [drugStock]
  );
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Low Stock Report", 14, 15);
    
    const tableColumn = ["Drug Name", "Current / Max Stock", "Stock Level"];
    const tableRows: (string | number)[][] = [];

    lowStockDrugs.forEach(drug => {
      const stockLevel = Math.round((drug.stock / drug.maxStock) * 100);
      const drugData = [
        drug.name,
        `${drug.stock} / ${drug.maxStock}`,
        `${stockLevel}%`,
      ];
      tableRows.push(drugData);
    });

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("low-stock-report.pdf");
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <PageHeader
                title="Low Stock Report"
                description="List of medications with stock below 50% capacity."
            />
            <Button onClick={handleExportPDF} variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export to PDF
            </Button>
        </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableCaption>Medications that need to be replenished.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Drug Name</TableHead>
              <TableHead>Current / Max Stock</TableHead>
              <TableHead className="text-right">Stock Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockDrugs.length > 0 ? (
              lowStockDrugs.map((drug) => (
                <TableRow key={drug.id}>
                  <TableCell className="font-medium">
                     <div className="flex items-center gap-2">
                        {drug.isNarcotic && <ShieldCheck className="h-4 w-4 text-destructive" />}
                        {drug.name}
                    </div>
                  </TableCell>
                  <TableCell>{drug.stock} / {drug.maxStock}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-4">
                        <Progress value={(drug.stock / drug.maxStock) * 100} className="w-40 h-2" />
                        <span>{Math.round((drug.stock / drug.maxStock) * 100)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  All drug stocks are at 50% or above capacity.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
