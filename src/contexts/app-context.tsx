"use client";

import { createContext, useState, ReactNode } from "react";
import type { DrugStock, DispenseLog } from "@/lib/types";

// Hardcoded initial stock for demonstration
const INITIAL_DRUG_STOCK: DrugStock[] = [
    { id: 'RENNIE 680 MG', name: 'RENNIE 680 MG', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'THERAFLU 650 MG', name: 'THERAFLU 650 MG', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'METPAMID 10mg', name: 'METPAMID 10mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'BUSCOPAN 10mg', name: 'BUSCOPAN 10mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'ASPIRIN 500mg', name: 'ASPIRIN 500mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'MINOSET 500mg', name: 'MINOSET 500mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'MAJEZIK 100mg', name: 'MAJEZIK 100mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'DISINOL 10 ml', name: 'DISINOL 10 ml', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'VISINE', name: 'VISINE', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'ISORDIL 5 mg', name: 'ISORDIL 5 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'LOPERAMID 2 mg', name: 'LOPERAMID 2 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'NIMELID 100 mg', name: 'NIMELID 100 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'ZOFER 4 mg', name: 'ZOFER 4 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'PAROL PLUS 250 mg', name: 'PAROL PLUS 250 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'ALLERSET 10mg', name: 'ALLERSET 10mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'VALIDOL 50mg', name: 'VALIDOL 50mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'SENNALAX 20mg', name: 'SENNALAX 20mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'DIKLORON 100mg', name: 'DIKLORON 100mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'ADVIL 200mg', name: 'ADVIL 200mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'TETRADOX 100mg', name: 'TETRADOX 100mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'TROSYD 20mg', name: 'TROSYD 20mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'DESAL 40 mg', name: 'DESAL 40 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'A-FERIN 650mg', name: 'A-FERIN 650mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'BRUFEN 600mg', name: 'BRUFEN 600mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'CIPRASID 500mg', name: 'CIPRASID 500mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'BELOC 50 mg', name: 'BELOC 50 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'ASIVIRAL 200 mg', name: 'ASIVIRAL 200 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'VERMAZOL 100 mg', name: 'VERMAZOL 100 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'FLAGYL 500 mg', name: 'FLAGYL 500 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'PREDNOL 4 mg', name: 'PREDNOL 4 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'AZITRO', name: 'AZITRO', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'FUCIDIN KREM 20gr', name: 'FUCIDIN KREM 20gr', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'GE-ORAL 20.50 g L', name: 'GE-ORAL 20.50 g L', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'OMEPRAZOL 20 mg', name: 'OMEPRAZOL 20 mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'TYLOLHOT 500mg', name: 'TYLOLHOT 500mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'DRAMAMINE 50mg', name: 'DRAMAMINE 50mg', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'NADIXA 30gr', name: 'NADIXA 30gr', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'VOLTAREN EMULGEL 50gr', name: 'VOLTAREN EMULGEL 50gr', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'BENGAY 50gr', name: 'BENGAY 50gr', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'OKSIZINC POMAT 100gr', name: 'OKSIZINC POMAT 100gr', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'SILVERDIN 40gr', name: 'SILVERDIN 40gr', stock: 30, maxStock: 30, isNarcotic: false, expiryDate: new Date('2027-10-01') },
    { id: 'Morphine 15mg', name: 'Morphine 15mg', stock: 30, maxStock: 30, isNarcotic: true, expiryDate: new Date('2027-10-01') },
    { id: 'Codeine 30mg', name: 'Codeine 30mg', stock: 30, maxStock: 30, isNarcotic: true, expiryDate: new Date('2027-10-01') },
    { id: 'Oxycodone 10mg', name: 'Oxycodone 10mg', stock: 30, maxStock: 30, isNarcotic: true, expiryDate: new Date('2027-10-01') },
    { id: 'Fentanyl 50mcg', name: 'Fentanyl 50mcg', stock: 30, maxStock: 30, isNarcotic: true, expiryDate: new Date('2027-10-01') },
];


interface AppContextType {
  drugStock: DrugStock[];
  dispenseLog: DispenseLog[];
  dispenseDrug: (drugId: string, quantity: number, patientName: string, diagnosis: string, diseases: string[]) => void;
  refillStock: (drugId: string, quantity: number) => void;
  addDrugsToStock: (drugs: { name: string, isNarcotic: boolean }[]) => void;
  addNewDrug: (drug: { name: string, quantity: number, isNarcotic: boolean, expiryDate: Date }) => void;
  updateExpiryDate: (drugId: string, newDate: Date) => void;
}

export const AppContext = createContext<AppContextType>({
  drugStock: [],
  dispenseLog: [],
  dispenseDrug: () => {},
  refillStock: () => {},
  addDrugsToStock: () => {},
  addNewDrug: () => {},
  updateExpiryDate: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [drugStock, setDrugStock] = useState<DrugStock[]>(INITIAL_DRUG_STOCK);
  const [dispenseLog, setDispenseLog] = useState<DispenseLog[]>([]);

  const addDrugsToStock = (drugs: { name: string, isNarcotic: boolean }[]) => {
    setDrugStock((prevStock) => {
      const newDrugs: DrugStock[] = [];
      const lowercasedStockNames = prevStock.map(d => d.name.toLowerCase());

      drugs.forEach(drug => {
        if (!lowercasedStockNames.includes(drug.name.toLowerCase())) {
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            newDrugs.push({
                id: drug.name,
                name: drug.name,
                stock: 20,
                maxStock: 20,
                isNarcotic: drug.isNarcotic,
                expiryDate,
            });
        }
      });

      if (newDrugs.length > 0) {
        return [...prevStock, ...newDrugs];
      }
      return prevStock;
    });
  };

  const addNewDrug = (drug: { name: string, quantity: number, isNarcotic: boolean, expiryDate: Date }) => {
    setDrugStock((prevStock) => {
        const newDrug: DrugStock = {
            id: drug.name,
            name: drug.name,
            stock: drug.quantity,
            maxStock: Math.max(50, drug.quantity * 2), // Reasonable default max
            isNarcotic: drug.isNarcotic,
            expiryDate: drug.expiryDate,
        };
        // Avoid adding if it already exists (case-insensitive)
        if (prevStock.some(d => d.name.toLowerCase() === newDrug.name.toLowerCase())) {
            return prevStock;
        }
        return [...prevStock, newDrug];
    });
  };

  const dispenseDrug = (drugId: string, quantity: number, patientName: string, diagnosis: string, diseases: string[]) => {
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
            diagnosis: diagnosis,
            diseases: diseases || []
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
  
  const updateExpiryDate = (drugId: string, newDate: Date) => {
    setDrugStock((prevStock) =>
      prevStock.map((drug) =>
        drug.id === drugId ? { ...drug, expiryDate: newDate } : drug
      )
    );
  };

  return (
    <AppContext.Provider value={{ drugStock, dispenseLog, dispenseDrug, refillStock, addDrugsToStock, addNewDrug, updateExpiryDate }}>
      {children}
    </AppContext.Provider>
  );
};
