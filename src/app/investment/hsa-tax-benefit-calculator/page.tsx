"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


// Zod schema for form validation
const formSchema = z.object({
  filingStatus: z.enum(['single', 'family']),
  annualIncome: z.number().positive('Annual income is required.'),
  contributionAmount: z.number().positive('Contribution amount is required.'),
  marginalTaxRate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100.'),
});

type HSACalculatorFormValues = z.infer<typeof formSchema>;

type HSAResult = {
  taxSavings: number;
  taxableIncomeReduction: number;
  effectiveContributionCost: number;
  futureValue: number;
  chartData: { name: string; value: number }[];
};

const federalTaxBrackets = {
  single: [
    { rate: 0.10, max: 11000 },
    { rate: 0.12, max: 44725 },
    { rate: 0.22, max: 95375 },
    { rate: 0.24, max: 182100 },
    { rate: 0.32, max: 231250 },
    { rate: 0.35, max: 578125 },
    { rate: 0.37, max: Infinity },
  ],
  family: [
    { rate: 0.10, max: 22000 },
    { rate: 0.12, max: 89450 },
    { rate: 0.22, max: 190750 },
    { rate: 0.24, max: 364200 },
    { rate: 0.32, max: 462500 },
    { rate: 0.35, max: 693750 },
    { rate: 0.37, max: Infinity },
  ],
};

function getMarginalTaxRate(income: number, filingStatus: 'single' | 'family'): number {
  const brackets = federalTaxBrackets[filingStatus];
  for (const bracket of brackets) {
    if (income <= bracket.max) {
      return bracket.rate * 100;
    }
  }
  return 37; // Should not be reached
}

export default function HSATaxBenefitCalculator() {
  const [result, setResult] = useState<HSAResult | null>(null);

  const form = useForm<HSACalculatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filingStatus: 'single',
    },
  });

  const onSubmit = (values: HSACalculatorFormValues) => {
    const { contributionAmount, marginalTaxRate } = values;
    const taxRateDecimal = marginalTaxRate / 100;

    const taxSavings = contributionAmount * taxRateDecimal;
    const taxableIncomeReduction = contributionAmount;
    const effectiveContributionCost = contributionAmount - taxSavings;

    // Simplified future value calculation assuming 5% growth over 10 years
    const futureValue = contributionAmount * Math.pow(1.05, 10);

    setResult({
      taxSavings,
      taxableIncomeReduction,
      effectiveContributionCost,
      futureValue,
      chartData: [
        { name: 'Tax Savings', value: taxSavings },
        { name: 'Effective Cost', value: effectiveContributionCost },
      ],
    });
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const income = Number(e.target.value);
    const filingStatus = form.getValues('filingStatus');
    if (income > 0) {
      const rate = getMarginalTaxRate(income, filingStatus);
      form.setValue('marginalTaxRate', rate, { shouldValidate: true });
    }
    form.handleChange(e);
  };
  
  const handleFilingStatusChange = (value: 'single' | 'family') => {
    form.setValue('filingStatus', value);
    const income = form.getValues('annualIncome');
    if (income > 0) {
      const rate = getMarginalTaxRate(income, value);
      form.setValue('marginalTaxRate', rate, { shouldValidate: true });
    }
  };


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Health Savings Account (HSA) Tax Benefit Calculator</h1>
        <p className="text-muted-foreground">Discover the powerful tax advantages of contributing to a Health Savings Account.</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Your HSA Tax Savings</CardTitle>
          <CardDescription>Enter your details to estimate the financial benefits.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="filingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filing Status</FormLabel>
                      <Select onValueChange={(value: 'single' | 'family') => handleFilingStatusChange(value)} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your filing status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="family">Married Filing Jointly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Gross Income</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 75000" {...field} onChange={(e) => { field.onChange(Number(e.target.value)); handleIncomeChange(e); }} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contributionAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual HSA Contribution</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 3000" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value ?? ''}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marginalTaxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Federal Marginal Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 22" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Calculate Benefits</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your Estimated HSA Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Immediate Tax Savings</p>
                <p className="text-2xl font-bold">${result.taxSavings.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Taxable Income Reduction</p>
                <p className="text-2xl font-bold">${result.taxableIncomeReduction.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Effective Contribution Cost</p>
                <p className="text-2xl font-bold">${result.effectiveContributionCost.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Potential 10-Year Value</p>
                <p className="text-2xl font-bold">${result.futureValue.toFixed(2)}</p>
              </div>
            </div>
            <div className="h-[300px] w-full mt-6">
              <ResponsiveContainer>
                <BarChart data={result.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8">
                    {result.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
          <CardHeader>
              <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
              <p>The Health Savings Account (HSA) Tax Benefit Calculator is an essential tool for anyone eligible for an HSA. It clearly quantifies the financial advantages of contributing to this unique account, which offers a triple tax benefit: tax-deductible contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses. By entering your income, filing status, and contribution amount, you can instantly see how much you can save on taxes this year. The calculator not only shows your immediate tax savings but also illustrates the reduction in your taxable income and the effective (after-tax) cost of your contribution. This helps in understanding the true power of an HSA as both a healthcare savings vehicle and a long-term investment tool, encouraging smarter financial planning and health management.</p>
          </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="guide">
            <AccordionTrigger className="text-xl font-semibold">In-Depth Guide to HSA Tax Benefits</AccordionTrigger>
            <AccordionContent className="prose prose-lg max-w-none dark:prose-invert">
                <h2>Maximizing Your Financial Health with a Health Savings Account (HSA)</h2>
                <p>A Health Savings Account (HSA) is one of the most powerful savings and investment tools available in the United States, yet it remains widely underutilized. It's often misunderstood as just another healthcare account, but its capabilities extend far beyond simply paying for medical bills. An HSA offers a unique triple-tax advantage that makes it a superior vehicle for long-term wealth accumulation, especially for retirement. This guide will delve deep into the mechanics of an HSA, the nuances of its tax benefits, and strategies to maximize its potential.</p>
                <h3>What is an HSA? The Basics You Need to Know</h3>
                <p>An HSA is a tax-advantaged savings account that can be used for healthcare expenses. To be eligible to open and contribute to an HSA, you must be enrolled in a High-Deductible Health Plan (HDHP). These plans have lower monthly premiums but higher deductibles, meaning you pay more out-of-pocket for medical services before your insurance starts to pay. The HSA is designed to help you save for these out-of-pocket costs.</p>
                <p>Key characteristics of an HSA include:</p>
                <ul>
                    <li><strong>Ownership:</strong> You own the account, not your employer. It is completely portable, meaning if you change jobs, your HSA and its funds go with you.</li>
                    <li><strong>Roll-over:</strong> Unlike a Flexible Spending Account (FSA), the funds in your HSA roll over year after year. There is no "use it or lose it" rule. This allows your balance to grow over time.</li>
                    <li><strong>Investment Options:</strong> Once your account balance reaches a certain threshold (typically $1,000 to $2,000), you can invest the funds in a selection of mutual funds, stocks, and other investment vehicles, similar to a 401(k) or IRA.</li>
                </ul>
                <h3>The Unbeatable Triple-Tax Advantage</h3>
                <p>The true power of an HSA lies in its triple-tax savings, a feature no other retirement or investment account can claim:</p>
                <ol>
                    <li>
                        <strong>Tax-Deductible Contributions:</strong> The money you contribute to your HSA is either pre-tax (if done through an employer's payroll deduction, avoiding FICA taxes as well) or tax-deductible (if you contribute with post-tax money). This immediately reduces your taxable income for the year, resulting in a lower tax bill. For example, if you are in the 22% federal tax bracket and contribute $3,000 to your HSA, you instantly save $660 on your federal taxes.
                    </li>
                    <li>
                        <strong>Tax-Free Growth:</strong> The funds in your HSA, including any investment earnings, grow completely tax-free. This is where the long-term power of an HSA shines. The compounding growth is not eroded by annual capital gains or dividend taxes, allowing your account to grow much faster than a standard brokerage account.
                    </li>
                    <li>
                        <strong>Tax-Free Withdrawals for Qualified Medical Expenses:</strong> You can withdraw funds from your HSA at any time to pay for a wide range of qualified medical expenses without paying any income tax. This includes doctor visits, prescriptions, dental care, vision care, and even certain over-the-counter items.
                    </li>
                </ol>
                <h3>HSA as a Retirement Super-Tool</h3>
                <p>While an HSA is designed for healthcare costs, it can function as a powerful supplemental retirement account. Once you turn 65, the rules for withdrawals become even more flexible. You can still withdraw funds tax-free for medical expenses, but you can also withdraw money for any other reason (e.g., travel, housing, hobbies) without penalty. These non-medical withdrawals will be subject to ordinary income tax, just like withdrawals from a traditional 401(k) or IRA. In essence, after age 65, an HSA behaves like a traditional IRA for non-medical expenses and remains a tax-free health savings vehicle for medical ones.</p>
                <p>This dual nature makes it an incredibly versatile retirement tool. Financial planners often advise clients to, if possible, pay for current medical expenses out-of-pocket and let their HSA funds grow. By keeping detailed records of your medical expenses over the years, you can reimburse yourself from your HSA tax-free at any point in the future, including during retirement. This creates a "super-withdrawal" strategy, giving you access to a large, tax-free lump sum when you might need it most.</p>
                <h3>Strategic Contribution and Investment</h3>
                <p>To truly leverage your HSA, you need a strategy. The first step is to contribute as much as you can, up to the annual limit set by the IRS. For 2024, the limits are $4,150 for self-only coverage and $8,300 for family coverage. If you are age 55 or older, you can make an additional "catch-up" contribution of $1,000 per year.</p>
                <p>Next, focus on investing your HSA funds as soon as you meet the minimum balance required by your HSA administrator. Don't let your money sit in a low-interest savings account. Choose a diversified portfolio of low-cost index funds or ETFs that align with your risk tolerance and time horizon. Since you may not need this money for decades, you can afford to take on a growth-oriented investment strategy.</p>
                <p>Think of your HSA as your last-in, last-out retirement account. Plan to use funds from your 401(k) or other taxable retirement accounts first, allowing your HSA to continue its tax-free compounding for as long as possible. The longer your money grows, the more significant the tax-free benefits become.</p>
                <h3>Conclusion: A Non-Negotiable for Financial Wellness</h3>
                <p>The Health Savings Account is more than just a way to pay for medical bills; it's a strategic asset for long-term financial planning. Its unique triple-tax advantage provides an unparalleled opportunity to reduce your current tax burden, grow your investments tax-free, and create a tax-free source of funds for healthcare in retirement. By understanding its mechanics and adopting a proactive strategy of consistent contributions and smart investing, you can transform your HSA from a simple savings account into a cornerstone of your financial independence and a powerful engine for wealth creation.</p>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq">
            <AccordionTrigger className="text-xl font-semibold">Frequently Asked Questions (FAQ)</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold">What is a High-Deductible Health Plan (HDHP)?</h4>
                        <p>An HDHP is a health insurance plan with a higher deductible than traditional insurance plans. The monthly premium is usually lower, but you have to pay more healthcare costs yourself before the insurance company starts to pay its share (your deductible). An HDHP is a requirement for opening an HSA.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">What are the annual contribution limits for an HSA?</h4>
                        <p>The IRS sets the contribution limits annually. For 2024, the limits are $4,150 for an individual with self-only HDHP coverage and $8,300 for an individual with family HDHP coverage. Individuals aged 55 and older can contribute an additional $1,000 as a catch-up contribution.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">What are "qualified medical expenses"?</h4>
                        <p>These are expenses incurred for the diagnosis, cure, mitigation, treatment, or prevention of disease. This includes payments for doctor's visits, prescription drugs, dental and vision care, chiropractic services, and many other health-related costs. The IRS Publication 502 provides a comprehensive list.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">What happens to my HSA if I no longer have an HDHP?</h4>
                        <p>If you switch to a non-HDHP health plan, you can no longer contribute to your HSA. However, the account is still yours. You can continue to use the existing funds tax-free for qualified medical expenses and let the balance grow through investments.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">What happens if I use HSA funds for non-qualified expenses?</h4>
                        <p>If you are under age 65, withdrawals for non-qualified expenses are subject to both ordinary income tax and a 20% penalty. After age 65, the 20% penalty is waived, but the withdrawal is still subject to ordinary income tax, similar to a traditional IRA or 401(k).</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Can I invest my HSA funds?</h4>
                        <p>Yes. Most HSA administrators allow you to invest your funds once your account reaches a certain minimum balance (e.g., $1,000). You can typically invest in a range of mutual funds, ETFs, and other securities. This is a key feature for long-term growth.</p>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
