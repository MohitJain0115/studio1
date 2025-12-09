'use server';

/**
 * @fileOverview A retirement income projection AI agent.
 *
 * - retirementIncomeProjection - A function that handles the retirement income projection process.
 * - RetirementIncomeProjectionInput - The input type for the retirementIncomeProjection function.
 * - RetirementIncomeProjectionOutput - The return type for the retirementIncomeProjection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetirementIncomeProjectionInputSchema = z.object({
  currentSavings: z.number().describe('Your current retirement savings.'),
  annualContribution: z.number().describe('Your planned annual contributions to retirement savings.'),
  retirementAge: z.number().describe('Your planned retirement age.'),
  annualExpenses: z.number().describe('Your estimated annual retirement expenses.'),
  inflationRate: z.number().describe('The estimated annual inflation rate (as a decimal, e.g., 0.03 for 3%).'),
  investmentReturnRate: z
    .number()
    .describe('The estimated annual investment return rate (as a decimal, e.g., 0.07 for 7%).'),
});
export type RetirementIncomeProjectionInput = z.infer<
  typeof RetirementIncomeProjectionInputSchema
>;

const RetirementIncomeProjectionOutputSchema = z.object({
  isFeasible: z
    .boolean()
    .describe(
      'Whether the retirement plan is feasible based on the inputs.'
    ),
  summary: z.string().describe('A summary of the retirement plan feasibility.'),
  suggestions: z.string().describe('Suggestions for improving retirement prospects.'),
});
export type RetirementIncomeProjectionOutput = z.infer<
  typeof RetirementIncomeProjectionOutputSchema
>;

export async function retirementIncomeProjection(
  input: RetirementIncomeProjectionInput
): Promise<RetirementIncomeProjectionOutput> {
  return retirementIncomeProjectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'retirementIncomeProjectionPrompt',
  input: {schema: RetirementIncomeProjectionInputSchema},
  output: {schema: RetirementIncomeProjectionOutputSchema},
  prompt: `You are a retirement planning expert.

You will analyze the user's retirement plan based on their current savings, planned contributions, retirement age, estimated expenses, inflation rate, and investment return rate.

You will determine if the plan is feasible and provide a summary of your findings. You will also offer suggestions for improving their retirement prospects if the plan is not feasible.

Here is the retirement plan information:

Current Savings: {{{currentSavings}}}
Annual Contribution: {{{annualContribution}}}
Retirement Age: {{{retirementAge}}}
Annual Expenses: {{{annualExpenses}}}
Inflation Rate: {{{inflationRate}}}
Investment Return Rate: {{{investmentReturnRate}}}

Consider all the information provided and any additional assumptions that would be realistic such as life expectancy being until 90 years old.

Based on this information, is the retirement plan feasible? Provide a summary of your findings and suggest steps to improve retirement prospects if needed. Be sure to set the isFeasible field to true or false accordingly.`,
});

const retirementIncomeProjectionFlow = ai.defineFlow(
  {
    name: 'retirementIncomeProjectionFlow',
    inputSchema: RetirementIncomeProjectionInputSchema,
    outputSchema: RetirementIncomeProjectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
