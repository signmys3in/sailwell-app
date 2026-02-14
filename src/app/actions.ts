"use server";

import { aiPoweredDrugRecommendation } from "@/ai/flows/ai-powered-drug-recommendation";
import type { AIPoweredDrugRecommendationInput, AIPoweredDrugRecommendationOutput } from "@/ai/flows/ai-powered-drug-recommendation";
import { isDrugNarcotic } from "@/ai/flows/is-narcotic-check";
import type { IsDrugNarcoticOutput } from "@/ai/flows/is-narcotic-check";
import { adaHealthSymptomAssessment } from "@/ai/flows/ada-health-integration";
import type { AdaSymptomAssessmentInput, AdaSymptomAssessmentOutput } from "@/ai/flows/ada-health-integration";


type DrugSuggestionResponse = Partial<AIPoweredDrugRecommendationOutput> & { error?: string };
type NarcoticStatusResponse = Partial<IsDrugNarcoticOutput> & { error?: string };
type AdaAssessmentResponse = Partial<AdaSymptomAssessmentOutput> & { error?: string };


export async function getDrugSuggestions(input: AIPoweredDrugRecommendationInput): Promise<DrugSuggestionResponse> {
  try {
    const result = await aiPoweredDrugRecommendation(input);
    return result;
  } catch (e: any) {
    // In production, we don't want to expose detailed error messages to the client.
    return { error: e.message || "An unexpected error occurred while getting suggestions." };
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

export async function getAdaAssessment(input: AdaSymptomAssessmentInput): Promise<AdaAssessmentResponse> {
    try {
      const result = await adaHealthSymptomAssessment(input);
      return result;
    } catch (e: any)      {
      return { error: "An unexpected error occurred while getting the Ada Health assessment." };
    }
}
