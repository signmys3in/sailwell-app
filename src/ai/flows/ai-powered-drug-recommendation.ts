'use server';
/**
 * @fileOverview A Genkit flow for providing AI-powered drug suggestions based on patient symptoms and chronic diseases.
 *
 * - aiPoweredDrugRecommendation - A function that handles the drug suggestion process.
 * - AIPoweredDrugRecommendationInput - The input type for the aiPoweredDrugRecommendation function.
 * - AIPoweredDrugRecommendationOutput - The return type for the aiPoweredDrugRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredDrugRecommendationInputSchema = z.object({
  symptoms: z
    .string()
    .describe("A detailed description of the patient's symptoms."),
  chronicDiseases: z
    .array(z.string())
    .describe('A list of chronic diseases the patient has.'),
});
export type AIPoweredDrugRecommendationInput = z.infer<
  typeof AIPoweredDrugRecommendationInputSchema
>;

const DrugSuggestionSchema = z.object({
  drugName: z.string().describe('The name of the suggested drug.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the drug suggestion, considering symptoms and chronic diseases.'),
  dosage: z
    .string()
    .optional()
    .describe('The suggested dosage for the drug, if applicable.'),
});

const AIPoweredDrugRecommendationOutputSchema = z.object({
  drugSuggestions: z
    .array(DrugSuggestionSchema)
    .describe('An array of AI-powered drug suggestions.'),
});
export type AIPoweredDrugRecommendationOutput = z.infer<
  typeof AIPoweredDrugRecommendationOutputSchema
>;

export async function aiPoweredDrugRecommendation(
  input: AIPoweredDrugRecommendationInput
): Promise<AIPoweredDrugRecommendationOutput> {
  return aiPoweredDrugRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredDrugRecommendationPrompt',
  input: {schema: AIPoweredDrugRecommendationInputSchema},
  output: {schema: AIPoweredDrugRecommendationOutputSchema},
  prompt: `You are an AI medical assistant specialized in suggesting appropriate medications based on patient symptoms and chronic diseases.

Based on the following information, suggest suitable drugs. For each suggestion, provide a brief reasoning why it is appropriate and a suggested dosage if applicable.

Patient Symptoms: {{{symptoms}}}

Patient's Chronic Diseases:
{{#if chronicDiseases}}
{{#each chronicDiseases}}- {{{this}}}
{{/each}}
{{else}}
None
{{/if}}

Provide the suggestions in a JSON array format, as specified in the output schema.`,
});

const aiPoweredDrugRecommendationFlow = ai.defineFlow(
  {
    name: 'aiPoweredDrugRecommendationFlow',
    inputSchema: AIPoweredDrugRecommendationInputSchema,
    outputSchema: AIPoweredDrugRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
