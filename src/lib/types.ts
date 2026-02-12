export type PatientInfo = {
  name: string;
  dob: string;
  alcoholUsage: "none" | "moderate" | "heavy";
  isSmoker: boolean;
  chronicDiseases: string[];
};

export type Vitals = {
  temperature?: string;
  bloodPressure?: string;
  heartRate?: string;
};

export type DrugSuggestion = {
  drugName: string;
  reasoning: string;
  dosage?: string;
};

export type DrugStock = {
  id: string; // drugName can be the id
  name: string;
  stock: number;
  maxStock: number;
  isNarcotic: boolean;
};

export type DispenseLog = {
    id: string;
    drugName: string;
    quantity: number;
    timestamp: Date;
    diagnosis: string;
}
