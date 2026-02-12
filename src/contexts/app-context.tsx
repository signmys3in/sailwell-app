"use client";

import { createContext, useState, ReactNode } from "react";
import type { DrugStock, DispenseLog } from "@/lib/types";

// Hardcoded initial stock for demonstration
const INITIAL_DRUG_STOCK: DrugStock[] = [
    { id: 'RENNIE 680 MG', name: 'RENNIE 680 MG', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'THERAFLU 650 MG', name: 'THERAFLU 650 MG', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'METPAMID 10mg', name: 'METPAMID 10mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'BUSCOPAN 10mg', name: 'BUSCOPAN 10mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'ASPIRIN 500mg', name: 'ASPIRIN 500mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'MINOSET 500mg', name: 'MINOSET 500mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'MAJEZIK 100mg', name: 'MAJEZIK 100mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'DISINOL 10 ml', name: 'DISINOL 10 ml', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'VISINE', name: 'VISINE', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'ISORDIL 5 mg', name: 'ISORDIL 5 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'LOPERAMID 2 mg', name: 'LOPERAMID 2 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'NIMELID 100 mg', name: 'NIMELID 100 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'ZOFER 4 mg', name: 'ZOFER 4 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'PAROL PLUS 250 mg', name: 'PAROL PLUS 250 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'ALLERSET 10mg', name: 'ALLERSET 10mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'VALIDOL 50mg', name: 'VALIDOL 50mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'SENNALAX 20mg', name: 'SENNALAX 20mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'DIKLORON 100mg', name: 'DIKLORON 100mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'ADVIL 200mg', name: 'ADVIL 200mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'TETRADOX 100mg', name: 'TETRADOX 100mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'TROSYD 20mg', name: 'TROSYD 20mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'DESAL 40 mg', name: 'DESAL 40 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'A-FERIN 650mg', name: 'A-FERIN 650mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'BRUFEN 600mg', name: 'BRUFEN 600mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'CIPRASID 500mg', name: 'CIPRASID 500mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'BELOC 50 mg', name: 'BELOC 50 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'ASIVIRAL 200 mg', name: 'ASIVIRAL 200 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'VERMAZOL 100 mg', name: 'VERMAZOL 100 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'FLAGYL 500 mg', name: 'FLAGYL 500 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'PREDNOL 4 mg', name: 'PREDNOL 4 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'AZITRO', name: 'AZITRO', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'FUCIDIN KREM 20gr', name: 'FUCIDIN KREM 20gr', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'GE-ORAL 20.50 g L', name: 'GE-ORAL 20.50 g L', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'OMEPRAZOL 20 mg', name: 'OMEPRAZOL 20 mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'TYLOLHOT 500mg', name: 'TYLOLHOT 500mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'DRAMAMINE 50mg', name: 'DRAMAMINE 50mg', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'NADIXA 30gr', name: 'NADIXA 30gr', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'VOLTAREN EMULGEL 50gr', name: 'VOLTAREN EMULGEL 50gr', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'BENGAY 50gr', name: 'BENGAY 50gr', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'OKSIZINC POMAT 100gr', name: 'OKSIZINC POMAT 100gr', stock: 30, maxStock: 30, isNarcotic: false },
    { id: 'SILVERDIN 40gr', name: 'SILVERDIN 40gr', stock: 30, maxStock: 30, isNarcotic: false },
];


interface AppContextType {
  drugStock: DrugStock[];
  dispenseLog: DispenseLog[];
  dispenseDrug: (drugId: string, quantity: number, patientName: string, diagnosis: string, diseases: string[]) => void;
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

  return (
    <AppContext.Provider value={{ drugStock, dispenseLog, dispenseDrug, refillStock, addDrugsToStock }}>
      {children}
    </AppContext.Provider>
  );
};
