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
import { PlusCircle, ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { checkNarcoticStatus } from "@/app/actions";

export default function StockPage() {
  const { drugStock, refillStock, addNewDrug } = useContext(AppContext);
  const [refillAmounts, setRefillAmounts] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

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

  const handleAddNewDrug = async (drugName: string, quantity: number) => {
    if (drugStock.some(d => d.name.toLowerCase() === drugName.toLowerCase())) {
        toast({
            variant: "destructive",
            title: "Drug Exists",
            description: `${drugName} is already in your stock.`,
        });
        return false;
    }

    const { isNarcotic, error } = await checkNarcoticStatus(drugName);

    if (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error,
        });
        return false;
    }

    addNewDrug({
        name: drugName,
        quantity: quantity,
        isNarcotic: isNarcotic,
    });

    toast({
        title: "Drug Added",
        description: `${drugName} (${quantity} units) has been added to the stock.`,
        className: "bg-accent text-accent-foreground",
    });

    return true;
  };

  return (
    <div>
      <PageHeader
        title="Stock Management"
        description="View and manage drug inventory levels."
      />

      <div className="flex justify-end mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Drug
                </Button>
            </DialogTrigger>
            <AddDrugDialog onAddNewDrug={handleAddNewDrug} onOpenChange={setAddDialogOpen}/>
        </Dialog>
      </div>

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
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
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
                <TableCell>
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


function AddDrugDialog({ onAddNewDrug, onOpenChange }: { onAddNewDrug: (drugName: string, quantity: number) => Promise<boolean>, onOpenChange: (open: boolean) => void }) {
    const [drugName, setDrugName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!drugName || quantity <= 0) {
            setError("Please fill in all fields.");
            return;
        }

        setSubmitting(true);
        setError("");
        
        const success = await onAddNewDrug(drugName, quantity);
        
        setSubmitting(false);

        if (success) {
            resetForm();
            onOpenChange(false);
        }
    }

    const resetForm = () => {
        setDrugName("");
        setQuantity(1);
        setError("");
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetForm();
        }
        onOpenChange(isOpen);
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New Drug to Stock</DialogTitle>
                <DialogDescription>
                    Enter the drug details. The system will automatically check if it's a narcotic.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <div className="space-y-2">
                    <Label htmlFor="drug-name">Drug Name</Label>
                    <Input id="drug-name" value={drugName} onChange={e => setDrugName(e.target.value)} placeholder="e.g., Ibuprofen 200mg" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quantity">Initial Quantity</Label>
                    <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Adding..." : "Add Drug"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
