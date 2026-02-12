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
  temperature: z.string().optional().describe("Patient's body temperature."),
  bloodPressure: z.string().optional().describe("Patient's blood pressure."),
  heartRate: z.string().optional().describe("Patient's heart rate."),
});
export type AIPoweredDrugRecommendationInput = z.infer<
  typeof AIPoweredDrugRecommendationInputSchema
>;

const DrugSuggestionSchema = z.object({
  drugName: z.string().describe('The name of the suggested drug.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the drug suggestion, considering symptoms and chronic diseases.'
    ),
  dosage: z
    .string()
    .optional()
    .describe('The suggested dosage for the drug, if applicable.'),
  isNarcotic: z
    .boolean()
    .describe('Whether or not the drug is a narcotic substance.'),
});

const AIPoweredDrugRecommendationOutputSchema = z.object({
  diagnosis: z
    .string()
    .describe(
      'A concise medical diagnosis based on the provided symptoms and vitals.'
    ),
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
  prompt: `You are an AI medical assistant specialized in suggesting appropriate medications based on patient symptoms, vital signs, and chronic diseases. You are also a pharmacology expert.

First, provide a concise medical diagnosis based on the patient's information.
Then, based on the following information, suggest suitable drugs. For each suggestion, provide a brief reasoning why it is appropriate, a suggested dosage if applicable, and determine if the drug is a narcotic.

Patient Symptoms: {{{symptoms}}}

{{#if temperature}}
Patient's Temperature: {{{temperature}}}
{{/if}}
{{#if bloodPressure}}
Patient's Blood Pressure: {{{bloodPressure}}}
{{/if}}
{{#if heartRate}}
Patient's Heart Rate: {{{heartRate}}}
{{/if}}

Patient's Chronic Diseases:
{{#if chronicDiseases}}
{{#each chronicDiseases}}- {{{this}}}
{{/each}}
{{else}}
None
{{/if}}

Provide the diagnosis and suggestions in a JSON format, as specified in the output schema. For each drug, set the \`isNarcotic\` field to true if it is a controlled substance and false otherwise.`,
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
