"use server";

import { aiPoweredDrugRecommendation } from "@/ai/flows/ai-powered-drug-recommendation";
import type { AIPoweredDrugRecommendationInput } from "@/ai/flows/ai-powered-drug-recommendation";
import { isDrugNarcotic } from "@/ai/flows/is-narcotic-check";

export async function getDrugSuggestions(input: AIPoweredDrugRecommendationInput) {
  try {
    const result = await aiPoweredDrugRecommendation(input);
    return { suggestions: result.drugSuggestions, diagnosis: result.diagnosis, severity: result.severity, shortDiagnosis: result.shortDiagnosis };
  } catch (e: any) {
    // In production, we don't want to expose detailed error messages to the client.
    return { error: "An unexpected error occurred while getting suggestions." };
  }
}

export async function checkNarcoticStatus(drugName: string) {
  try {
    const result = await isDrugNarcotic({ drugName });
    return { isNarcotic: result.isNarcotic };
  } catch (e: any) {
    // In production, we don't want to expose detailed error messages to the client.
    return { error: "An unexpected error occurred while checking narcotic status.", isNarcotic: false };
  }
}
