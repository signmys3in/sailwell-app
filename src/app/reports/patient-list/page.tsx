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

  return (
    <div>
      <PageHeader
        title="Crew List"
        description="A searchable list of all registered crew members."
      />
      <Card>
        <CardHeader>
          <CardTitle>All Crew Members</CardTitle>
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
