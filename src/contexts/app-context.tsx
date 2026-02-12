"use client";

import { createContext, useState, ReactNode } from "react";
import type { DrugStock, DispenseLog } from "@/lib/types";

// Hardcoded initial stock for demonstration
const INITIAL_DRUG_STOCK: DrugStock[] = [
    { id: 'Paracetamol', name: 'Paracetamol', stock: 20, maxStock: 20, isNarcotic: false },
    { id: 'Ibuprofen', name: 'Ibuprofen', stock: 20, maxStock: 20, isNarcotic: false },
    { id: 'Aspirin', name: 'Aspirin', stock: 20, maxStock: 20, isNarcotic: false },
    { id: 'Morphine', name: 'Morphine', stock: 20, maxStock: 20, isNarcotic: true },
    { id: 'Amoxicillin', name: 'Amoxicillin', stock: 20, maxStock: 20, isNarcotic: false },
    { id: 'Lisinopril', name: 'Lisinopril', stock: 20, maxStock: 20, isNarcotic: false },
    { id: 'Metformin', name: 'Metformin', stock: 20, maxStock: 20, isNarcotic: false },
    { id: 'Atorvastatin', name: 'Atorvastatin', stock: 20, maxStock: 20, isNarcotic: false },
    { id: 'Codeine', name: 'Codeine', stock: 20, maxStock: 20, isNarcotic: true },
    { id: 'Fentanyl', name: 'Fentanyl', stock: 20, maxStock: 20, isNarcotic: true },
];


interface AppContextType {
  drugStock: DrugStock[];
  dispenseLog: DispenseLog[];
  dispenseDrug: (drugId: string, quantity: number, patientName: string) => void;
  refillStock: (drugId: string, quantity: number) => void;
  addDrugsToStock: (drugNames: string[]) => void;
}

export const AppContext = createContext<AppContextType>({
  drugStock: [],
  dispenseLog: [],
  dispenseDrug: () => {},
  refillStock: () => {},
  addDrugsToStock: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [drugStock, setDrugStock] = useState<DrugStock[]>(INITIAL_DRUG_STOCK);
  const [dispenseLog, setDispenseLog] = useState<DispenseLog[]>([]);

  const addDrugsToStock = (drugNames: string[]) => {
    setDrugStock((prevStock) => {
      const newDrugs: DrugStock[] = [];
      const lowercasedStockNames = prevStock.map(d => d.name.toLowerCase());

      drugNames.forEach(drugName => {
        if (!lowercasedStockNames.includes(drugName.toLowerCase())) {
            const isNarcotic = ['morphine', 'codeine', 'fentanyl'].includes(drugName.toLowerCase());
            newDrugs.push({
                id: drugName,
                name: drugName,
                stock: 20,
                maxStock: 20,
                isNarcotic,
            });
        }
      });

      if (newDrugs.length > 0) {
        return [...prevStock, ...newDrugs];
      }
      return prevStock;
    });
  };

  const dispenseDrug = (drugId: string, quantity: number, patientName: string) => {
    setDrugStock((prevStock) =>
      prevStock.map((drug) =>
        drug.id === drugId ? { ...drug, stock: drug.stock - quantity } : drug
      )
    );
    setDispenseLog((prevLog) => [
        ...prevLog,
        {
            id: new Date().toISOString(),
            patientName: patientName,
            drugName: drugId,
            quantity: quantity,
            timestamp: new Date(),
            diagnosis: 'AI-assisted diagnosis' // Placeholder
        }
    ]);
  };

  const refillStock = (drugId: string, quantity: number) => {
    setDrugStock((prevStock) =>
      prevStock.map((drug) =>
        drug.id === drugId ? { ...drug, stock: Math.min(drug.maxStock, drug.stock + quantity) } : drug
      )
    );
  };

  return (
    <AppContext.Provider value={{ drugStock, dispenseLog, dispenseDrug, refillStock, addDrugsToStock }}>
      {children}
    </AppContext.Provider>
  );
};
