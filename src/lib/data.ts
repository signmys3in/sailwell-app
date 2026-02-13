export const CHRONIC_DISEASES = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Heart Disease",
  "Kidney Disease",
  "Arthritis",
  "Depression",
  "Migraine"
];

export const ALLERGY_TYPES = [
  "Pollen",
  "Dust Mites",
  "Mold",
  "Animal Dander",
  "Insect Stings",
  "Latex",
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Soy",
  "Wheat",
  "Fish",
  "Shellfish",
  "Penicillin",
  "Aspirin",
  "Sulfa Drugs",
  "Codeine",
  "Ibuprofen"
];

export const COUNTRY_DRUG_NAMES: Record<string, Record<string, string>> = {
  "USA": { 
    "Paracetamol": "Tylenol",
    "Ibuprofen": "Advil",
    "Aspirin": "Bayer",
    "Amoxicillin": "Amoxil",
    "Metformin": "Glucophage"
  },
  "UK": { 
    "Paracetamol": "Panadol",
    "Ibuprofen": "Nurofen",
    "Aspirin": "Disprin",
    "Amoxicillin": "Amoxil"
  },
  "Germany": { 
    "Paracetamol": "ben-u-ron",
    "Ibuprofen": "Dolgit",
    "Aspirin": "Aspirin Complex"
  },
  "India": {
    "Paracetamol": "Crocin",
    "Ibuprofen": "Brufen",
    "Aspirin": "Ecosprin"
  }
};
