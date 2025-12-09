'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Shield, Info, Activity } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const formSchema = z.object({
  monthlyIncome: z.number().positive('Monthly income is required.'),
  existingDebts: z.number().nonnegative('Existing debts cannot be negative.'),
  desiredCoverage: z.number().positive('Desired coverage amount is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  affordabilityIndex: number;
  recommendedMaxPremium: number;
  coverageToIncomeRatio: number;
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const formatNumberUS = (value: number, options: Intl.NumberFormatOptions = {}) =>
  value.toLocaleString('en-US', { ...options, style: 'currency', currency: 'USD' });

const COLORS = {
  Excellent: '#10b981',
  Good: '#3b82f6',
  Fair: '#f97316',
  Poor: '#ef4444',
};

export default function InsurancePremiumCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: undefined,
      existingDebts: undefined,
      desiredCoverage: undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    const { monthlyIncome, existingDebts, desiredCoverage } = values;
    
    // Recommended premium is 5-10% of disposable income
    const disposableIncome = monthlyIncome - existingDebts;
    const recommendedMaxPremium = disposableIncome * 0.10;

    // Affordability Index (simplified): 100 = can afford rec. max premium
    const affordabilityIndex = Math.max(0, Math.min(100, (recommendedMaxPremium / (desiredCoverage / 240)) * 100)); // Assuming 20-year term

    const coverageToIncomeRatio = desiredCoverage / (monthlyIncome * 12);

    let health: CalculationResult['health'] = 'Poor';
    if (affordabilityIndex > 85) health = 'Excellent';
    else if (affordabilityIndex > 65) health = 'Good';
    else if (affordabilityIndex > 40) health = 'Fair';

    setResult({ 
      affordabilityIndex,
      recommendedMaxPremium,
      coverageToIncomeRatio,
      health
    });
  };

  const chartData = result 
    ? [
        { name: 'Affordability', value: result.affordabilityIndex },
        { name: 'Remaining', value: 100 - result.affordabilityIndex },
      ] 
    : [];
      
  const recommendationItems = result
    ? [
        result.health === 'Excellent' ? 'Your income strongly supports the desired coverage. You have flexibility to choose comprehensive plans.' : 'Review your budget or coverage amount to find a more suitable plan.',
        result.coverageToIncomeRatio < 10 ? 'Your coverage seems low compared to your income. Consider increasing it to protect your dependents adequately.' : 'Your coverage-to-income ratio is robust, offering solid protection.',
        `Based on your income and debts, a monthly premium up to ${formatNumberUS(result.recommendedMaxPremium, {maximumFractionDigits: 0})} is considered affordable.`,
        'Explore term insurance for high coverage at a low cost, and consider a separate investment plan.'
      ]
    : [];

  const actionPlanItems = result
    ? [
        {
          label: 'Get Quotes',
          detail: 'Request quotes from multiple insurers for a term plan of at least $' + formatNumberUS(result.recommendedMaxPremium * 240 * 2, {maximumFractionDigits: 0}) + ' to compare rates.'
        },
        {
          label: 'Health Check-up',
          detail: 'A medical check-up can sometimes lower premiums if you are in good health.'
        },
        {
          label: 'Review Debts',
          detail: 'Reducing existing monthly debt payments can free up more room in your budget for insurance premiums.'
        },
        {
          label: 'Consult an Advisor',
          detail: 'A financial advisor can help tailor an insurance strategy to your specific needs and long-term goals.'
        }
      ]
    : [];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Insurance Premium Affordability
          </CardTitle>
          <CardDescription>
            Determine how much insurance coverage you can comfortably afford.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  control={form.control} 
                  name="monthlyIncome" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Net Monthly Income
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 5000" 
                          {...field} 
                          value={field.value ?? ''} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <FormField 
                  control={form.control} 
                  name="existingDebts" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Monthly Debt Payments (EMI, etc.)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 1000" 
                          {...field} 
                          value={field.value ?? ''} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <FormField 
                  control={form.control} 
                  name="desiredCoverage" 
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Desired Insurance Coverage Amount
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 1000000" 
                          {...field} 
                          value={field.value ?? ''} 
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Calculate Affordability
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Your Insurance Affordability Index</CardTitle>
                <CardDescription>
                    An assessment of your capacity to pay premiums for the desired coverage.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      <Cell fill={COLORS[result.health]} />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                    <Tooltip
                        contentStyle={{ display: 'none' }}
                        formatter={() => null}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold" style={{ color: COLORS[result.health] }}>
                        {result.affordabilityIndex.toFixed(0)}
                    </span>
                    <span className="text-lg font-medium" style={{ color: COLORS[result.health] }}>
                        {result.health}
                    </span>
                </div>
              </div>

              <div className="space-y-4">
                  <div>
                      <h4 className="font-semibold text-muted-foreground">Recommended Max Premium</h4>
                      <p className="text-2xl font-bold text-primary">{formatNumberUS(result.recommendedMaxPremium, {maximumFractionDigits: 0})} / month</p>
                      <p className="text-sm">This is about 10% of your disposable income, a healthy upper limit.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold text-muted-foreground">Coverage-to-Income Ratio</h4>
                      <p className="text-2xl font-bold text-primary">{result.coverageToIncomeRatio.toFixed(1)}x</p>
                      <p className="text-sm">A ratio of 10-15x your annual income is often recommended.</p>
                  </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
                  {recommendationItems.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Action plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {actionPlanItems.map((step) => (
                    <li key={step.label}>
                      <span className="font-semibold text-foreground">{step.label}:</span> {step.detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
