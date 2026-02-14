"use server";

import { aiPoweredDrugRecommendation } from "@/ai/flows/ai-powered-drug-recommendation";
import type { AIPoweredDrugRecommendationInput, AIPoweredDrugRecommendationOutput } from "@/ai/flows/ai-powered-drug-recommendation";
import { isDrugNarcotic } from "@/ai/flows/is-narcotic-check";
import type { IsDrugNarcoticOutput } from "@/ai/flows/is-narcotic-check";

type DrugSuggestionResponse = Partial<AIPoweredDrugRecommendationOutput> & { error?: string };
type NarcoticStatusResponse = Partial<IsDrugNarcoticOutput> & { error?: string };

export async function getDrugSuggestions(input: AIPoweredDrugRecommendationInput): Promise<DrugSuggestionResponse> {
  try {
    const result = await aiPoweredDrugRecommendation(input);
    return result;
  } catch (e: any) {
    // In production, we don't want to expose detailed error messages to the client.
    return { error: "An unexpected error occurred while getting suggestions." };
  }
}

export async function checkNarcoticStatus(drugName: string): Promise<NarcoticStatusResponse> {
  try {
    const result = await isDrugNarcotic({ drugName });
    return result;
  } catch (e: any) {
    // In production, we don't want to expose detailed error messages to the client.
    return { error: "An unexpected error occurred while checking narcotic status.", isNarcotic: false };
  }
}
