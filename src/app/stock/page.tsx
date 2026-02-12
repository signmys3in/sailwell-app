"use client";

import { useContext, useState } from "react";
import { AppContext } from "@/contexts/app-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/page-header";
import { PlusCircle, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StockPage() {
  const { drugStock, refillStock } = useContext(AppContext);
  const [refillAmounts, setRefillAmounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleRefillChange = (drugId: string, amount: string) => {
    setRefillAmounts((prev) => ({ ...prev, [drugId]: Number(amount) }));
  };

  const handleRefillSubmit = (drugId: string) => {
    const amount = refillAmounts[drugId] || 0;
    if (amount > 0) {
      refillStock(drugId, amount);
      toast({
        title: "Stock Refilled",
        description: `Added ${amount} units to ${drugId}.`,
        className: "bg-accent text-accent-foreground",
      });
      // Clear input after refill
      setRefillAmounts((prev) => ({ ...prev, [drugId]: 0 }));
    }
  };

  return (
    <div>
      <PageHeader
        title="Stock Management"
        description="View and manage drug inventory levels."
      />
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Drug Name</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Max Stock</TableHead>
              <TableHead className="w-[25%] text-right">Refill</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugStock.map((drug) => (
              <TableRow key={drug.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {drug.name}
                    {drug.isNarcotic && <ShieldCheck className="h-4 w-4 text-destructive" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Progress value={(drug.stock / drug.maxStock) * 100} className="w-32 h-2"/>
                    <span>{drug.stock}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{drug.maxStock}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Input
                      type="number"
                      min="0"
                      max={drug.maxStock - drug.stock}
                      value={refillAmounts[drug.id] || ""}
                      onChange={(e) => handleRefillChange(drug.id, e.target.value)}
                      className="w-24"
                      placeholder="Qty"
                    />
                    <Button size="sm" onClick={() => handleRefillSubmit(drug.id)}>
                      <PlusCircle className="h-4 w-4 mr-2"/>
                      Refill
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
