"use client";

import { useContext, useState, useMemo, useCallback } from "react";
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
import { ShieldCheck, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { DrugStock, PatientInfo } from "@/lib/types";

export default function NarcoticsPage() {
    const { drugStock } = useContext(AppContext);
    const [dispensingDrug, setDispensingDrug] = useState<DrugStock | null>(null);

    const narcoticDrugs = useMemo(() => drugStock.filter(drug => drug.isNarcotic), [drugStock]);

    return (
        <div>
            <PageHeader
                title="Narcotic Dispensing"
                description="Dispense narcotic drugs with master approval."
            />
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Drug Name</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {narcoticDrugs.map((drug) => (
                            <TableRow key={drug.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-destructive" />
                                        {drug.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Progress value={(drug.stock / drug.maxStock) * 100} className="w-40 h-2" />
                                        <span>{drug.stock} / {drug.maxStock}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={() => setDispensingDrug(drug)} disabled={drug.stock === 0}>
                                        <Pill className="h-4 w-4 mr-2" />
                                        Dispense
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {dispensingDrug && (
                <DispenseNarcoticDialog
                    drug={dispensingDrug}
                    open={!!dispensingDrug}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setDispensingDrug(null);
                        }
                    }}
                />
            )}
        </div>
    );
}

function DispenseNarcoticDialog({ drug, open, onOpenChange }: { drug: DrugStock, open: boolean, onOpenChange: (open: boolean) => void }) {
    const { dispenseDrug } = useContext(AppContext);
    const { toast } = useToast();
    const [password, setPassword] = useState("");
    const [patientName, setPatientName] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");

    const resetForm = useCallback(() => {
        setPassword("");
        setPatientName("");
        setDiagnosis("");
        setQuantity(1);
        setError("");
    }, []);

    const handleVerifyAndDispense = useCallback(() => {
        if (!patientName || !diagnosis || quantity <= 0) {
            setError("Please fill in all patient and quantity fields.");
            return;
        }

        if (password === "TAMER") { // Using the same hardcoded password
            if (drug.stock < quantity) {
                setError("Not enough stock to dispense the requested quantity.");
                return;
            }

            const patientForLog: PatientInfo = {
                name: patientName,
                medicalId: `N/A-${crypto.randomUUID()}`,
                dob: "",
                alcoholUsage: "none",
                isSmoker: false,
                chronicDiseases: [],
            };

            dispenseDrug(drug.id, quantity, patientForLog, diagnosis, null);
            toast({
                variant: "default",
                title: "Dispensed",
                description: `${quantity} x ${drug.name} dispensed to ${patientName} with approval.`,
                className: "bg-accent text-accent-foreground"
            });
            onOpenChange(false);
            resetForm();
        } else {
            setError("Invalid password. Approval denied.");
        }
    }, [patientName, diagnosis, quantity, password, drug, dispenseDrug, toast, onOpenChange, resetForm]);

    const handleOpenChange = useCallback((isOpen: boolean) => {
        if (!isOpen) {
            resetForm();
        }
        onOpenChange(isOpen);
    }, [onOpenChange, resetForm]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><ShieldCheck className="text-destructive" /> Narcotic Dispensing Approval</DialogTitle>
                    <DialogDescription>
                        Dispensing of "{drug.name}" requires master approval. Please enter patient details and password.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="patient-name">Patient Name</Label>
                        <Input id="patient-name" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="John Doe" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Input id="diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g., Severe post-operative pain" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input id="quantity" type="number" min="1" max={drug.stock} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Master Password</Label>
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleVerifyAndDispense}>Verify & Dispense</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
