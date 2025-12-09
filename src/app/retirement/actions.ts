"use server";

import {
  retirementIncomeProjection,
  type RetirementIncomeProjectionInput,
  type RetirementIncomeProjectionOutput,
} from "@/ai/flows/retirement-income-projection";

export async function runRetirementProjection(
  input: RetirementIncomeProjectionInput
): Promise<RetirementIncomeProjectionOutput> {
  return await retirementIncomeProjection(input);
}
