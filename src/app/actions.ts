"use server";

import { aiPoweredDrugRecommendation } from "@/ai/flows/ai-powered-drug-recommendation";
import type { AIPoweredDrugRecommendationInput, AIPoweredDrugRecommendationOutput } from "@/ai/flows/ai-powered-drug-recommendation";
import { isDrugNarcotic } from "@/ai/flows/is-narcotic-check";
import type { IsDrugNarcoticOutput } from "@/ai/flows/is-narcotic-check";
// import { adaHealthSymptomAssessment } from "@/ai/flows/ada-health-integration";
// import type { AdaSymptomAssessmentInput, AdaSymptomAssessmentOutput } from "@/ai/flows/ada-health-integration";


type DrugSuggestionResponse = Partial<AIPoweredDrugRecommendationOutput> & { error?: string };
type NarcoticStatusResponse = Partial<IsDrugNarcoticOutput> & { error?: string };
// type AdaAssessmentResponse = Partial<AdaSymptomAssessmentOutput> & { error?: string };


export async function getDrugSuggestions(input: AIPoweredDrugRecommendationInput): Promise<DrugSuggestionResponse> {
  try {
    const result = await aiPoweredDrugRecommendation(input);
    return result;
  } catch (e: any) {
    // Check for a specific API key error to provide a better message.
    if (typeof e.message === 'string' && e.message.includes('API key expired')) {
      return { error: "The AI service API key has expired. Please go to your Firebase project settings and update the GEMINI_API_KEY secret with a new value from Google AI Studio." };
    }
    // In production, we don't want to expose detailed error messages to the client.
    return { error: e.message || "An unexpected error occurred while getting suggestions." };
  }
}

export async function checkNarcoticStatus(drugName: string): Promise<NarcoticStatusResponse> {
  try {
    const result = await isDrugNarcotic({ drugName });
    return result;
  } catch (e: any) {
    // Check for a specific API key error to provide a better message.
     if (typeof e.message === 'string' && e.message.includes('API key expired')) {
      return { error: "The AI service API key has expired. Please update the GEMINI_API_KEY secret in your Firebase project settings.", isNarcotic: false };
    }
    // In production, we don't want to expose detailed error messages to the client.
    return { error: "An unexpected error occurred while checking narcotic status.", isNarcotic: false };
  }
}

/*
export async function getAdaAssessment(input: AdaSymptomAssessmentInput): Promise<AdaAssessmentResponse> {
    try {
      const result = await adaHealthSymptomAssessment(input);
      return result;
    } catch (e: any)      {
      return { error: "An unexpected error occurred while getting the Ada Health assessment." };
    }
}
*/
