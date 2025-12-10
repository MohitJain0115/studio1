'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Info, Shield, TrendingUp, Scissors, DollarSign } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  exposureAmount: z.number().positive("Exposure must be positive."),
  collateralValue: z.number().positive("Collateral value must be positive."),
  collateralVolatility: z.number().min(0, "Volatility must be non-negative.").max(100, "Volatility cannot exceed 100."),
  holdingPeriod: z.number().positive("Holding period must be positive."),
  confidenceLevel: z.number().min(90).max(99.999, "Confidence level must be between 90 and 99.999."),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  haircut: number;
  collateralRequired: number;
  coveredExposure: number;
  remainingExposure: number;
}

const formatNumberUS = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const formatPercent = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value);

// Z-scores for common confidence levels (simplified)
const getZScore = (confidence: number) => {
    if (confidence >= 99.9) return 3.09;
    if (confidence >= 99.5) return 2.58;
    if (confidence >= 99) return 2.33;
    if (confidence >= 97.5) return 1.96;
    if (confidence >= 95) return 1.645;
    return 1.28; // for 90%
};


export default function CollateralHaircutImpactCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exposureAmount: undefined,
      collateralValue: undefined,
      collateralVolatility: undefined,
      holdingPeriod: undefined,
      confidenceLevel: undefined,
    },
  });

  const resetForm = () => {
    form.reset({
      exposureAmount: undefined,
      collateralValue: undefined,
      collateralVolatility: undefined,
      holdingPeriod: undefined,
      confidenceLevel: undefined,
    });
    setResult(null);
  };
  
  const onSubmit = (values: FormValues) => {
    const { exposureAmount, collateralValue, collateralVolatility, holdingPeriod, confidenceLevel } = values;

    const zScore = getZScore(confidenceLevel);
    const vol = collateralVolatility / 100;
    const time = holdingPeriod / 252; // Assuming 252 trading days in a year

    // VaR-based haircut formula
    const haircut = zScore * vol * Math.sqrt(time);

    const adjustedCollateralValue = collateralValue * (1 - haircut);
    const collateralRequired = exposureAmount / (1 - haircut);
    
    const coveredExposure = adjustedCollateralValue;
    const remainingExposure = Math.max(0, exposureAmount - coveredExposure);

    setResult({
      haircut,
      collateralRequired,
      coveredExposure,
      remainingExposure,
    });
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Collateral Haircut Impact Calculator
          </CardTitle>
          <CardDescription>
            Calculate the required collateral haircut and its impact on covering a given exposure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="exposureAmount" render={({ field }) => (<FormItem><FormLabel>Your Exposure ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1000000" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="collateralValue" render={({ field }) => (<FormItem><FormLabel>Posted Collateral Market Value ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1000000" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="collateralVolatility" render={({ field }) => (<FormItem><FormLabel>Collateral Volatility (% Ann.)</FormLabel><FormControl><Input type="number" placeholder="e.g., 15" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="holdingPeriod" render={({ field }) => (<FormItem><FormLabel>Liquidation Period (Days)</FormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="confidenceLevel" render={({ field }) => (<FormItem><FormLabel>Confidence Level (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 99" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="flex gap-4">
                <Button type="submit">Calculate Impact</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collateral Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground">Calculated Collateral Haircut</p>
                <p className="text-5xl font-bold text-primary">{formatPercent(result.haircut)}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                 <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Adjusted Collateral Value</h4>
                  <p className="text-2xl font-bold text-blue-600">{formatNumberUS(result.coveredExposure)}</p>
                  <p className="text-xs text-muted-foreground">The value of your collateral after the haircut is applied.</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Uncovered Exposure</h4>
                  <p className="text-2xl font-bold text-orange-600">{formatNumberUS(result.remainingExposure)}</p>
                   <p className="text-xs text-muted-foreground">The portion of your exposure not covered by the adjusted collateral.</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Collateral Required for Full Coverage</h4>
                  <p className="text-2xl font-bold">{formatNumberUS(result.collateralRequired)}</p>
                   <p className="text-xs text-muted-foreground">The amount of collateral needed to fully cover the exposure after the haircut.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interpretation of the Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Calculated Haircut of {formatPercent(result.haircut)}:</strong> This percentage represents the risk premium being applied to your collateral. A lender would discount the market value of your collateral by this amount to buffer against potential price drops during a liquidation period.</p>
                <p><strong className="text-foreground">Adjusted Collateral Value:</strong> After applying the haircut, your posted collateral of {formatNumberUS(form.getValues('collateralValue'))} is only recognized as having a value of <strong className="text-primary">{formatNumberUS(result.coveredExposure)}</strong> for the purpose of covering your exposure.</p>
                <p><strong className="text-foreground">Uncovered Exposure of {formatNumberUS(result.remainingExposure)}:</strong> This is your most critical risk number. It is the amount of your {formatNumberUS(form.getValues('exposureAmount'))} exposure that remains unsecured after the haircut-adjusted collateral is applied. If you were to default, this is the lender's potential loss.</p>
                <p><strong className="text-foreground">Collateral Required for Full Coverage:</strong> To fully secure your {formatNumberUS(form.getValues('exposureAmount'))} exposure, you would need to post collateral with a market value of <strong className="text-primary">{formatNumberUS(result.collateralRequired)}</strong>. This demonstrates the concept of over-collateralization required for riskier assets.</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding Collateral Haircuts</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>A collateral haircut is a risk management tool used in financial transactions. It's a percentage reduction applied to the market value of an asset being used as collateral. The haircut accounts for the possibility that the asset's value could decline during the time it might take to sell it in the event of a default.</p>
            <p>For example, if you post $1,000,000 of a volatile stock as collateral and a 20% haircut is applied, the lender will only recognize $800,000 of its value for the purpose of covering your exposure. This calculator helps quantify what that haircut should be based on risk factors like volatility and liquidation time.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Formula Explained</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                  <h4 className="font-semibold text-foreground mb-2">VaR-Based Haircut Formula</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">Haircut = Z * &#x3C3; * sqrt(T)</p>
                  <p className="mt-2">This calculator uses a standard Value at Risk (VaR) approach to determine the haircut. It estimates the potential loss in the collateral's value over a given time period to a certain level of statistical confidence.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong className="text-foreground">Z</strong>: The Z-score from a standard normal distribution that corresponds to the desired confidence level (e.g., 2.33 for 99%).</li>
                      <li><strong className="text-foreground">&#x3C3; (Sigma)</strong>: The annual volatility of the collateral asset. Higher volatility means a higher haircut.</li>
                      <li><strong className="text-foreground">T</strong>: The holding or liquidation period, in years. This is the time the lender estimates it would take to sell the collateral after a default. Longer periods mean more risk and a higher haircut.</li>
                  </ul>
              </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5" />Related Calculators</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-primary">
              <li><Link href="/investment/expected-exposure-calculator" className="hover:underline">Expected Exposure (EE) Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>

        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Risk Manager's Guide to Collateral Haircuts</h1>
            <p className="text-lg italic">Collateral is the bedrock of secured finance, but not all collateral is created equal. A haircut is the mechanism that levels the playing field, creating a buffer against market risk. This guide explores why haircuts are essential and how they are calculated.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Haircuts are Necessary: The Problem of Volatility</h2>
            <p>Imagine a bank lends $1 million to a hedge fund. The hedge fund posts $1 million worth of stock in Company X as collateral. The next day, Company X announces poor earnings, and its stock price plummets by 30%. If the hedge fund defaults on its loan at that moment, the bank's collateral is now only worth $700,000, leaving it with a $300,000 unsecured loss.</p>
            <p>A collateral haircut is designed to prevent this exact scenario. It acknowledges that the value of collateral is not static. The haircut is a protective buffer, calculated to absorb potential declines in the collateral's value during the period between the counterparty's default and the moment the collateral can be successfully liquidated (sold).</p>
            <p>The size of the haircut is a direct reflection of the perceived risk of the collateral asset:</p>
             <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold">Cash (in the same currency):</strong> Typically has a 0% haircut. Its value is stable.</li>
                <li><strong className="font-semibold">Government Bonds (e.g., U.S. Treasuries):</strong> Have very small haircuts (e.g., 0.5% - 2%) because they are highly liquid and have low volatility.</li>
                <li><strong className="font-semibold">Corporate Bonds:</strong> Haircuts vary based on credit rating and liquidity. High-quality bonds might have a 3-5% haircut, while high-yield bonds could have 15%+.</li>
                <li><strong className="font-semibold">Equities (Stocks):</strong> Haircuts are significant, often in the 15-30% range, because stock prices are volatile.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">The Science Behind the Haircut: A Value at Risk (VaR) Approach</h2>
            <p>Haircuts aren't just arbitrary numbers; they are typically derived from a statistical model called Value at Risk (VaR). This calculator uses a simplified VaR model to demonstrate the methodology. The goal is to answer a specific question: "With a certain level of confidence (e.g., 99%), what is the maximum amount of money we could lose on this collateral over the next 'N' days if we can't sell it?" The answer to that question is the haircut.</p>
            <p>The key inputs in the formula shown in this calculator all relate to this question:</p>
            <ol className="list-decimal ml-6 space-y-3">
                <li>
                    <strong className="font-semibold text-foreground">Collateral Volatility (&#x3C3;):</strong> This is the most important driver. How much does the asset's price tend to move? A stock that swings wildly day-to-day (high volatility) poses a much greater risk of a large price drop than a stable bond. Therefore, higher volatility always results in a larger haircut.
                </li>
                <li>
                    <strong className="font-semibold text-foreground">Liquidation Period / Holding Period (T):</strong> This is the time it would take to sell the collateral in an orderly fashion after a default occurs. For a highly liquid asset like a U.S. Treasury bond, this might be one day. For a large, concentrated block of a small-cap stock, it could take 10, 20, or more days to sell without crashing the price. The longer the liquidation period, the more time there is for the price to fall, leading to a larger haircut. The formula uses the square root of time because volatility scales with the square root of time.
                </li>
                <li>
                    <strong className="font-semibold text-foreground">Confidence Level (Z-score):</strong> This determines how conservative the haircut will be. A 99% confidence level means the haircut is designed to cover all but the worst 1% of potential price declines over the holding period. Regulators and risk managers often require high confidence levels (99% or 99.5%) to ensure the collateral provides a robust buffer against all but the most extreme market moves. A higher confidence level means a higher Z-score and a larger haircut.
                </li>
            </ol>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Practical Implications</h2>
            <p>The haircut calculation has direct consequences for both parties in a secured transaction:</p>
            <ul className="list-disc ml-6 space-y-2">
                <li><strong className="font-semibold">Over-collateralization:</strong> As the calculator shows, a haircut means the party posting collateral must provide assets with a market value <em className="italic">greater</em> than the exposure they are covering. This is known as over-collateralization. This is a direct cost to the borrower, as it ties up capital that could be used for other purposes.</li>
                <li><strong className="font-semibold">Collateral Eligibility:</strong> Lenders will create schedules of eligible collateral, with each asset type assigned a different haircut. A borrower might choose to post a lower-risk asset (like a government bond) to benefit from a smaller haircut and reduce their over-collateralization requirement, even if a higher-risk asset is more readily available to them.</li>
                <li><strong className="font-semibold">Margin Calls:</strong> If the value of the posted collateral falls, the lender may issue a "margin call," requiring the borrower to post additional collateral to bring the haircut-adjusted value back up to the required level.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Conclusion</h2>
            <p>The collateral haircut is a simple percentage with a sophisticated risk management model behind it. It is the primary tool that allows lenders and trading partners to accept a wide range of assets as security while protecting themselves from market volatility. By understanding the drivers of the haircut—volatility, time, and confidence—you can better appreciate how financial institutions quantify and mitigate risk in the trillions of dollars of secured transactions that occur every day.</p>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Why is the holding period in years (T) divided by 252?</h4>
              <p className="text-muted-foreground">Financial models typically use the number of trading days in a year, which is approximately 252, rather than 365. This is because market volatility primarily occurs when markets are open. So, a 10-day holding period is converted to 10/252 years.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What's a typical confidence level used in practice?</h4>
              <p className="text-muted-foreground">For internal risk management, firms might use 95% or 97.5%. For regulatory calculations, such as under Basel rules, confidence levels are often much higher, such as 99% or 99.9%, to ensure banks are protected against more extreme market events.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Does this formula account for "wrong-way risk"?</h4>
              <p className="text-muted-foreground">No. This is a standard haircut model that assumes the value of the collateral is independent of the counterparty's creditworthiness. "Wrong-way risk" occurs when the collateral's value is likely to fall at the same time the counterparty is likely to default (e.g., accepting a company's own stock as collateral). This requires more advanced modeling.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What if the collateral and exposure are in different currencies?</h4>
              <p className="text-muted-foreground">That introduces foreign exchange (FX) risk. To account for this, an additional haircut adder based on the volatility of the FX rate would be included in the formula, making the total haircut larger.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator quantifies the risk-mitigation practice of applying a collateral haircut. By inputting an asset's volatility and a required liquidation period, it uses a Value at Risk (VaR) model to determine the necessary percentage discount (the haircut). The tool then shows the practical impact of this haircut, calculating the adjusted value of the posted collateral, the remaining uncovered exposure, and the total amount of collateral that would be required to fully secure the transaction. This provides a clear, data-driven look into how lenders protect themselves against market risk.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
