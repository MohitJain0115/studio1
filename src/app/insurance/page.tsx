'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, TrendingUp, DollarSign, Calendar, Target, Info, Activity, Shield, PieChart as PieChartIcon } from 'lucide-react';
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
  monthlyIncome: number;
  desiredCoverage: number;
}

const formatNumberUS = (value: number, options: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', ...options }).format(value);

const COLORS = {
  Excellent: 'hsl(var(--chart-2))', // Green
  Good: 'hsl(var(--chart-1))',      // Blue
  Fair: 'hsl(var(--chart-4))',      // Orange
  Poor: 'hsl(var(--destructive))',  // Red
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
    const disposableIncome = Math.max(0, monthlyIncome - existingDebts);
    const recommendedMaxPremium = disposableIncome * 0.10;

    // Affordability Index (simplified): 100 = can afford rec. max premium
    // Assumes a 20-year term premium is roughly Desired Coverage / 240
    const estimatedPremium = desiredCoverage / 240;
    const affordabilityIndex = Math.max(0, Math.min(100, (recommendedMaxPremium / estimatedPremium) * 100));

    const coverageToIncomeRatio = desiredCoverage / (monthlyIncome * 12);

    let health: CalculationResult['health'] = 'Poor';
    if (affordabilityIndex > 85) health = 'Excellent';
    else if (affordabilityIndex > 65) health = 'Good';
    else if (affordabilityIndex > 40) health = 'Fair';

    setResult({ 
      affordabilityIndex,
      recommendedMaxPremium,
      coverageToIncomeRatio,
      health,
      monthlyIncome,
      desiredCoverage,
    });
  };

  const chartData = result 
    ? [
        { name: 'Affordability', value: result.affordabilityIndex },
        { name: 'Remaining', value: Math.max(0, 100 - result.affordabilityIndex) },
      ] 
    : [];
      
  const recommendationItems = result
    ? [
        result.health === 'Excellent' ? 'Your income strongly supports this coverage. You have flexibility to explore comprehensive plans and riders.' : 'Your budget may be strained. Consider reviewing your coverage amount or exploring ways to increase disposable income.',
        result.coverageToIncomeRatio < 10 ? 'Your coverage seems low for your income. It may not be enough to support dependents. Consider increasing it.' : 'Your coverage-to-income ratio is robust, offering solid protection for your dependents.',
        `A monthly premium up to ${formatNumberUS(result.recommendedMaxPremium, {maximumFractionDigits: 0})} is considered a healthy maximum for your budget.`,
        'Explore term life insurance for high coverage at a low cost, which is often the most efficient way to get protection.'
      ]
    : [];

  const actionPlanItems = result
    ? [
        {
          label: 'Get Quotes',
          detail: `Request quotes from multiple top-rated insurers for a term plan of at least ${formatNumberUS(result.desiredCoverage, {maximumFractionDigits: 0})} to compare rates.`
        },
        {
          label: 'Health Check-up',
          detail: 'A medical check-up can sometimes lower premiums if you are in good health. Don\'t delay your application.'
        },
        {
          label: 'Review Debts',
          detail: 'Reducing existing monthly debt payments is the fastest way to free up more room in your budget for insurance premiums.'
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
            Enter your financial details to assess how much insurance coverage you can comfortably afford.
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
                    An assessment of your capacity to pay premiums for the desired ${formatNumberUS(result.desiredCoverage, {maximumFractionDigits: 0})} coverage.
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
                      endAngle={450}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      <Cell fill={COLORS[result.health]} />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                    <Tooltip
                        contentStyle={{ display: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
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
                      <p className="text-sm">This is about 10% of your disposable income—a healthy upper limit for your budget.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold text-muted-foreground">Coverage-to-Income Ratio</h4>
                      <p className="text-2xl font-bold text-primary">{result.coverageToIncomeRatio.toFixed(1)}x</p>
                      <p className="text-sm">A common rule of thumb is 10-15x your annual income.</p>
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

      {/* Educational Content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Understanding the Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 border rounded-lg space-y-1">
              <h4 className="font-semibold">Net Monthly Income</h4>
              <p className="text-muted-foreground">Your take-home pay after taxes and deductions. This is the foundation of your budget.</p>
            </div>
            <div className="p-4 border rounded-lg space-y-1">
              <h4 className="font-semibold">Monthly Debt Payments</h4>
              <p className="text-muted-foreground">Total of all existing EMIs, credit card payments, and other loans. This determines your disposable income.</p>
            </div>
            <div className="p-4 border rounded-lg space-y-1 md:col-span-2">
              <h4 className="font-semibold">Desired Insurance Coverage</h4>
              <p className="text-muted-foreground">The total amount your beneficiaries would receive. A common guideline is 10-15 times your annual income, but it depends on your family's needs.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              How is Affordability Calculated?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>1. Disposable Income:</strong> First, we calculate your disposable income by subtracting your monthly debt payments from your net monthly income.
            </p>
            <p>
              <strong>2. Recommended Premium:</strong> Financial planners often suggest that life insurance premiums should not exceed 5-10% of your disposable income. We use 10% as a safe upper limit for the "Recommended Max Premium".
            </p>
             <p>
              <strong>3. Affordability Index:</strong> We estimate a potential monthly premium for your desired coverage (this is a rough estimate) and compare it to your Recommended Max Premium. The index shows how comfortably your recommended premium budget covers the estimated cost. An index of 100 means you can likely afford the premium with ease.
            </p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Related Calculators
            </CardTitle>
            <CardDescription>
              Explore other financial planning tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/loan" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold mb-1 text-primary">Loan Calculator</h4>
                <p className="text-sm text-muted-foreground">
                  Calculate loan payments and amortization schedules.
                </p>
              </a>
              <a href="/retirement" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold mb-1 text-primary">AI Retirement Calculator</h4>
                <p className="text-sm text-muted-foreground">
                  Project your retirement income and get AI-powered feedback.
                </p>
              </a>
              <a href="/sip-dca" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold mb-1 text-primary">SIP/DCA Calculator</h4>
                <p className="text-sm text-muted-foreground">
                  Model investment growth with systematic investments.
                </p>
              </a>
               <a href="/savings" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold mb-1 text-primary">Savings Calculator</h4>
                <p className="text-sm text-muted-foreground">
                  Estimate your future savings based on your investment plan.
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
