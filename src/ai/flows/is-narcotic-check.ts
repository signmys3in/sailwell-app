'use server';
/**
 * @fileOverview A Genkit flow for checking if a drug is a narcotic.
 *
 * - isDrugNarcotic - A function that handles the narcotic check process.
 * - IsDrugNarcoticInput - The input type for the isDrugNarcotic function.
 * - IsDrugNarcoticOutput - The return type for the isDrugNarcotic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IsDrugNarcoticInputSchema = z.object({
  drugName: z.string().describe('The name of the drug to check.'),
});
export type IsDrugNarcoticInput = z.infer<typeof IsDrugNarcoticInputSchema>;

const IsDrugNarcoticOutputSchema = z.object({
  isNarcotic: z
    .boolean()
    .describe('Whether or not the drug is a narcotic substance.'),
});
export type IsDrugNarcoticOutput = z.infer<typeof IsDrugNarcoticOutputSchema>;

export async function isDrugNarcotic(
  input: IsDrugNarcoticInput
): Promise<IsDrugNarcoticOutput> {
  return isDrugNarcoticFlow(input);
}

const prompt = ai.definePrompt({
  name: 'isDrugNarcoticPrompt',
  input: {schema: IsDrugNarcoticInputSchema},
  output: {schema: IsDrugNarcoticOutputSchema},
  prompt: `You are a pharmacology expert. Based on the drug name provided, determine if it is a controlled narcotic substance.
Drug Name: {{{drugName}}}

Respond with only a JSON object indicating if it is a narcotic. For example: {"isNarcotic": true}`,
});

const isDrugNarcoticFlow = ai.defineFlow(
  {
    name: 'isDrugNarcoticFlow',
    inputSchema: IsDrugNarcoticInputSchema,
    outputSchema: IsDrugNarcoticOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
