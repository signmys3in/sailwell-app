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
import { format } from "date-fns";

export default function ReportsPage() {
  const { dispenseLog } = useContext(AppContext);

  const sortedLog = useMemo(() => 
    [...dispenseLog].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [dispenseLog]
  );

  return (
    <div>
      <PageHeader
        title="Dispensing and Diagnoses"
        description="Review dispensing activities and diagnoses."
      />
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableCaption>A log of all drug dispensing activities.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Name</TableHead>
              <TableHead>Drug Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLog.length > 0 ? (
              sortedLog.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.patientName}</TableCell>
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
                <TableCell colSpan={5} className="h-24 text-center">
                  No dispensing activities recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
