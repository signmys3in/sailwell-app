"use server";

import { aiPoweredDrugRecommendation } from "@/ai/flows/ai-powered-drug-recommendation";
import type { AIPoweredDrugRecommendationInput } from "@/ai/flows/ai-powered-drug-recommendation";
import { isDrugNarcotic } from "@/ai/flows/is-narcotic-check";

export async function getDrugSuggestions(input: AIPoweredDrugRecommendationInput) {
  try {
    const result = await aiPoweredDrugRecommendation(input);
    return { suggestions: result.drugSuggestions, diagnosis: result.diagnosis, severity: result.severity };
  } catch (e: any) {
    console.error(e);
    return { error: "Failed to get suggestions from AI. " + e.message };
  }
}

export async function checkNarcoticStatus(drugName: string) {
  try {
    const result = await isDrugNarcotic({ drugName });
    return { isNarcotic: result.isNarcotic };
  } catch (e: any) {
    console.error(e);
    return { error: "Failed to check narcotic status from AI. " + e.message, isNarcotic: false };
  }
}
