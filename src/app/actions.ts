"use server";

import { aiPoweredDrugRecommendation } from "@/ai/flows/ai-powered-drug-recommendation";
import type { AIPoweredDrugRecommendationInput } from "@/ai/flows/ai-powered-drug-recommendation";

export async function getDrugSuggestions(input: AIPoweredDrugRecommendationInput) {
  try {
    const result = await aiPoweredDrugRecommendation(input);
    return { suggestions: result.drugSuggestions };
  } catch (e: any) {
    console.error(e);
    return { error: "Failed to get suggestions from AI. " + e.message };
  }
}
