"use client";

import { useContext, useMemo, useState } from "react";
import { AppContext } from "@/contexts/app-context";
import PageHeader from "@/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function CrewListPage() {
  const { crewMembers } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCrewMembers = useMemo(() => {
    if (!searchTerm) {
      return crewMembers;
    }
    return crewMembers.filter(
      (crewMember) =>
        crewMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crewMember.medicalId.includes(searchTerm)
    );
  }, [crewMembers, searchTerm]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Crew List Report", 14, 15);
    
    const tableColumn = ["Crew Name", "Medical ID"];
    const tableRows: (string | number)[][] = [];

    filteredCrewMembers.forEach(crew => {
      const crewData = [
        crew.name,
        crew.medicalId,
      ];
      tableRows.push(crewData);
    });

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("crew-list-report.pdf");
  };

  return (
    <div>
      <PageHeader
        title="Crew List"
        description="A searchable list of all registered crew members."
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Crew Members</CardTitle>
            <Button onClick={handleExportPDF} variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export to PDF
            </Button>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search by name or medical ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crew Name</TableHead>
                  <TableHead>Medical ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCrewMembers.length > 0 ? (
                  filteredCrewMembers.map((crewMember) => (
                    <TableRow key={crewMember.medicalId}>
                      <TableCell className="font-medium">{crewMember.name}</TableCell>
                      <TableCell className="font-mono text-xs">{crewMember.medicalId}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No crew members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
