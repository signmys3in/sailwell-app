"use client";

import { useContext, useMemo, useState } from "react";
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
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FileDown } from "lucide-react";
import type { DispenseLog } from "@/lib/types";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import "jspdf-autotable";

type SortableKeys = 'crewName' | 'timestamp';

export default function ReportsPage() {
  const { dispenseLog } = useContext(AppContext);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' }>({ key: 'timestamp', direction: 'desc' });
  const [filterTerm, setFilterTerm] = useState("");

  const filteredAndSortedLog = useMemo(() => {
    let sortableLog = [...dispenseLog];

    if (filterTerm) {
      sortableLog = sortableLog.filter(log =>
        log.crewName.toLowerCase().includes(filterTerm.toLowerCase()) ||
        log.medicalId.includes(filterTerm)
      );
    }
    
    if (sortConfig.key) {
      sortableLog.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        let comparison = 0;
        if (aValue > bValue) {
          comparison = 1;
        } else if (aValue < bValue) {
          comparison = -1;
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }
    return sortableLog;
  }, [dispenseLog, sortConfig, filterTerm]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Dispensing and Diagnoses Report", 14, 15);
    
    const tableColumn = ["Crew Name", "Medical ID", "Drug Name", "Quantity", "Diagnosis", "Timestamp"];
    const tableRows: (string | number)[][] = [];

    filteredAndSortedLog.forEach(log => {
      const logData = [
        log.crewName,
        log.medicalId,
        log.drugName,
        log.quantity,
        log.diagnosis,
        format(log.timestamp, "yyyy-MM-dd HH:mm:ss"),
      ];
      tableRows.push(logData);
    });

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("dispensing-diagnoses-report.pdf");
  };

  return (
    <div>
      <PageHeader
        title="Dispensing and Diagnoses"
        description="Review, filter, and sort dispensing activities and diagnoses."
      />
       <div className="flex justify-between items-center mb-4">
            <Input
                placeholder="Filter by crew name or medical ID..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="max-w-sm"
            />
            <Button onClick={handleExportPDF} variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export to PDF
            </Button>
       </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableCaption>A log of all drug dispensing activities. Click a column header to sort.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('crewName')}>
                  Crew Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Medical ID</TableHead>
              <TableHead>Drug Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => requestSort('timestamp')}>
                    Timestamp
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedLog.length > 0 ? (
              filteredAndSortedLog.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.crewName}</TableCell>
                  <TableCell className="font-mono text-xs">{log.medicalId}</TableCell>
                  <TableCell className="font-medium">{log.drugName}</TableCell>
                  <TableCell>{log.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{log.diagnosis}</TableCell>
                  <TableCell className="text-right">
                    {format(log.timestamp, "PPP p")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No dispensing activities found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
