export type PatientInfo = {
  medicalId: string;
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
  isNarcotic: boolean;
};

export type DrugStock = {
  id: string; // drugName can be the id
  name: string;
  stock: number;
  maxStock: number;
  isNarcotic: boolean;
  expiryDate: Date;
};

export type DispenseLog = {
    id: string;
    patientName: string;
    medicalId: string;
    drugName: string;
    quantity: number;
    timestamp: Date;
    diagnosis: string;
    diseases: string[];
    shortDiagnosis?: string;
}
