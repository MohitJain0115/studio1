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
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Zod schema for form validation
const formSchema = z.object({
  currentState: z.string().min(1, 'State is required.'),
  careType: z.enum(['home-health-aide', 'assisted-living', 'nursing-home-private', 'nursing-home-semi-private']),
  careDuration: z.number().positive('Duration of care is required.'),
  currentAge: z.number().positive('Current age is required.'),
  careStartAge: z.number().positive('Age to start care is required.'),
  inflationRate: z.number().min(0, 'Inflation rate cannot be negative.'),
});

type LTCCostEstimatorFormValues = z.infer<typeof formSchema>;

// Data from Genworth Cost of Care Survey (approximated for this example)
const ltcCosts2023 = {
  "Alabama": { "home-health-aide": 48048, "assisted-living": 42000, "nursing-home-semi-private": 84120, "nursing-home-private": 91250 },
  "Alaska": { "home-health-aide": 72072, "assisted-living": 82200, "nursing-home-semi-private": 414570, "nursing-home-private": 432890 },
  "Arizona": { "home-health-aide": 68640, "assisted-living": 54000, "nursing-home-semi-private": 85775, "nursing-home-private": 105850 },
  "California": { "home-health-aide": 75504, "assisted-living": 69000, "nursing-home-semi-private": 121545, "nursing-home-private": 146000 },
  "New York": { "home-health-aide": 68640, "assisted-living": 71940, "nursing-home-semi-private": 161878, "nursing-home-private": 169725 },
  "Texas": { "home-health-aide": 57200, "assisted-living": 51000, "nursing-home-semi-private": 69350, "nursing-home-private": 91250 },
  "Florida": { "home-health-aide": 59488, "assisted-living": 51600, "nursing-home-semi-private": 108405, "nursing-home-private": 122275 },
};

const states = Object.keys(ltcCosts2023);

type LTCResult = {
  projectedAnnualCost: number;
  totalProjectedCost: number;
  chartData: { year: number, cost: number }[];
};

export default function LTCCostEstimator() {
  const [result, setResult] = useState<LTCResult | null>(null);

  const form = useForm<LTCCostEstimatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inflationRate: 3.5,
    },
  });

  const onSubmit = (values: LTCCostEstimatorFormValues) => {
    const { currentState, careType, careDuration, currentAge, careStartAge, inflationRate } = values;

    const baseCost = (ltcCosts2023 as any)[currentState][careType];
    const yearsToProjection = careStartAge - currentAge;
    const inflationRateDecimal = inflationRate / 100;

    const projectedAnnualCost = baseCost * Math.pow(1 + inflationRateDecimal, yearsToProjection);
    const totalProjectedCost = projectedAnnualCost * careDuration;

    const chartData = [];
    for (let i = 0; i <= yearsToProjection + careDuration; i++) {
        const year = new Date().getFullYear() + i;
        let cost = 0;
        if (i < yearsToProjection) {
            cost = baseCost * Math.pow(1 + inflationRateDecimal, i);
        } else {
            cost = baseCost * Math.pow(1 + inflationRateDecimal, yearsToProjection);
        }
        chartData.push({ year, cost });
    }

    setResult({
      projectedAnnualCost,
      totalProjectedCost,
      chartData,
    });
  };
  
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Long-Term Care Cost Estimator</h1>
        <p className="text-muted-foreground">Plan for the future by projecting the potential costs of long-term care.</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Estimate Your Future Costs</CardTitle>
          <CardDescription>Provide your details to project the financial impact of long-term care.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="currentState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State of Residence</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="careType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Care</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select care type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="home-health-aide">Home Health Aide</SelectItem>
                          <SelectItem value="assisted-living">Assisted Living Facility</SelectItem>
                          <SelectItem value="nursing-home-semi-private">Nursing Home (Semi-Private)</SelectItem>
                          <SelectItem value="nursing-home-private">Nursing Home (Private)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Current Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 50" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="careStartAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Age to Start Care</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 80" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="careDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Duration of Care (Years)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 3" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inflationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assumed Annual Inflation Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 3.5" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value ?? ''}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Estimate Costs</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your Projected Long-Term Care Costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="p-6 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Projected Annual Cost at Start of Care</p>
                <p className="text-3xl font-bold">${result.projectedAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="p-6 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Total Projected Cost for Duration of Care</p>
                <p className="text-3xl font-bold">${result.totalProjectedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <div className="h-[400px] w-full mt-6">
              <h3 className="text-center text-lg font-semibold mb-4">Cost Growth Over Time</h3>
              <ResponsiveContainer>
                <LineChart data={result.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(tick) => `$${(tick / 1000)}k`}/>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}/>
                  <Legend />
                  <Line type="monotone" dataKey="cost" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
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
              <p>The Long-Term Care Cost Estimator is a critical financial planning tool designed to bring a tangible perspective to a future, and often abstract, expense. By projecting the cost of various types of care—from in-home assistance to a private room in a nursing facility—this calculator transforms a vague concern into a concrete financial goal. It accounts for crucial variables like your current age, the age you anticipate needing care, and the expected rate of inflation, providing a personalized estimate of both the annual and total cost for the specified duration. The visual chart powerfully illustrates how costs are expected to escalate over time, underscoring the importance of early planning. This tool empowers you to have informed conversations with financial advisors and family members, and to make strategic decisions about long-term care insurance, savings, and investments, ensuring you are better prepared for future healthcare needs.</p>
          </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="guide">
            <AccordionTrigger className="text-xl font-semibold">In-Depth Guide to Long-Term Care Planning</AccordionTrigger>
            <AccordionContent className="prose prose-lg max-w-none dark:prose-invert">
                <h2>The Essential Guide to Planning for Long-Term Care (LTC)</h2>
                <p>Long-term care is a topic many of us would rather avoid. It forces us to confront the realities of aging, potential loss of independence, and significant financial costs. However, ignoring it is not a strategy. The reality is that approximately 70% of people turning 65 will need some form of long-term care in their lifetime. Proactive planning is not just a financial exercise; it's a gift to your future self and your family, ensuring you have control, dignity, and security when you are most vulnerable.</p>
                
                <h3>What is Long-Term Care?</h3>
                <p>Long-term care encompasses a wide range of services and support for individuals who, due to aging, chronic illness, or disability, cannot perform basic activities of daily living (ADLs). These ADLs include:</p>
                <ul>
                    <li>Bathing</li>
                    <li>Dressing</li>
                    <li>Eating</li>
                    <li>Toileting</li>
                    <li>Continence</li>
                    <li>Transferring (e.g., moving from a bed to a chair)</li>
                </ul>
                <p>LTC also includes assistance with instrumental activities of daily living (IADLs), such as managing finances, preparing meals, housekeeping, and transportation. The need for care can arise suddenly, following a stroke or heart attack, or develop gradually over time due to conditions like dementia or arthritis.</p>

                <h3>Understanding the Staggering Costs</h3>
                <p>The single biggest shock for most families is the cost of long-term care. It is crucial to understand that standard health insurance, including Medicare, does not cover most long-term care services. Medicare provides limited, short-term coverage for skilled nursing care after a qualifying hospital stay, but it does not cover "custodial care," which includes help with ADLs and makes up the bulk of long-term care needs.</p>
                <p>Costs vary dramatically by location and type of care:</p>
                <ul>
                    <li><strong>Home Health Aide:</strong> Bringing a professional into your home to assist with ADLs. This allows individuals to "age in place" but can become very expensive if many hours of care are needed.</li>
                    <li><strong>Assisted Living Facility:</strong> A residential option for those who need some help with daily activities but do not require intensive medical care. It offers a combination of housing, meals, and supportive services.</li>
                    <li><strong>Nursing Home:</strong> For individuals who require a high level of medical supervision and 24/7 care. This is the most expensive form of LTC. A semi-private room is shared with another resident, while a private room offers more personal space at a premium cost.</li>
                </ul>
                <p>The national median costs can be daunting. For example, a private room in a nursing home can exceed $100,000 per year. When you use a cost estimator and factor in inflation over 20 or 30 years, that figure can easily triple or quadruple, reaching sums that could deplete a lifetime of savings in just a few years.</p>
                
                <h3>How to Pay for Long-Term Care: The Four Primary Options</h3>
                <p>Since Medicare won't cover it, how do people pay for LTC? There are four main avenues, each with significant pros and cons.</p>
                <ol>
                    <li>
                        <strong>Self-Funding (Out-of-Pocket):</strong> This involves using your personal savings, investments, and other assets to pay for care. While it offers the most flexibility, it is only a viable option for the very wealthy. For the average person, the high cost of care can lead to rapid asset depletion, jeopardizing the financial security of a surviving spouse and leaving no legacy for heirs.
                    </li>
                    <li>
                        <strong>Long-Term Care Insurance (LTCI):</strong> This is a specific type of insurance designed to cover LTC costs. You pay regular premiums, and in return, the policy provides a daily or monthly benefit to pay for care if you need it.
                        <ul>
                            <li><strong>Pros:</strong> Protects your assets, provides a dedicated pool of funds for care, and gives you more choices for where and how you receive care.</li>
                            <li><strong>Cons:</strong> Premiums can be very expensive and may increase over time. You must medically qualify, so it's best to apply when you are younger and healthier (typically in your 50s or early 60s).</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Hybrid Life/Annuity Policies with LTC Riders:</strong> These are life insurance policies or annuities that include a rider (an add-on) to pay for long-term care. If you need LTC, the policy can advance a portion of the death benefit or annuity value. If you never need care, the policy pays out a death benefit to your beneficiaries.
                         <ul>
                            <li><strong>Pros:</strong> Solves two problems at once (life insurance and LTC). Premiums are often guaranteed not to increase. You get value from the policy whether you need care or not.</li>
                            <li><strong>Cons:</strong> Generally more expensive upfront than traditional LTCI. The LTC benefit may be less robust than a standalone policy.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Medicaid:</strong> This is a joint federal and state program that pays for healthcare for people with low income and limited assets. Medicaid is the largest single payer of long-term care in the U.S. However, to qualify, you must "spend down" nearly all of your assets to meet strict poverty-level thresholds. This means your home (in some cases), savings, and investments must be exhausted before Medicaid will step in. This is often the last resort and severely limits your choice of care facilities.</li>
                </ol>

                <h3>Start the Conversation and Create Your Plan</h3>
                <p>Planning for long-term care is not just about money; it's about making crucial life decisions. Start by having open and honest conversations with your spouse, children, and other family members. Discuss your wishes for where you would want to receive care and who would be involved in decision-making. Consult with a qualified financial advisor who specializes in elder care planning. They can help you analyze your financial situation, evaluate insurance options, and integrate LTC planning into your overall retirement strategy. Using a tool like this cost estimator is the first step in turning a daunting unknown into a manageable plan, ensuring peace of mind for the years ahead.</p>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq">
            <AccordionTrigger className="text-xl font-semibold">Frequently Asked Questions (FAQ)</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Doesn't Medicare cover long-term care?</h4>
                        <p>No. This is one of the most common and dangerous misconceptions. Medicare only covers short-term (up to 100 days) skilled nursing care following a qualifying hospital stay of at least three days. It does not cover custodial care (help with daily living activities), which constitutes the majority of long-term care needs.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">When is the best time to buy long-term care insurance?</h4>
                        <p>The optimal time to apply for LTCI is typically in your mid-50s to early 60s. At this age, you are more likely to be in good health and qualify for coverage, and premiums will be more affordable than if you wait until you are older. Premiums increase significantly with age and the development of health conditions.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">What is an "elimination period" in an LTCI policy?</h4>
                        <p>The elimination period, or waiting period, is the number of days you must pay for care out-of-pocket before the insurance policy begins to pay benefits. It's like a deductible in terms of time. Common elimination periods are 30, 60, or 90 days. A longer elimination period will result in a lower premium.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">What is an "inflation rider" or "inflation protection"?</h4>
                        <p>This is a crucial feature of an LTCI policy that increases your benefit amount over time to keep pace with the rising cost of care. Without it, a policy purchased today may provide an inadequate benefit in 20 or 30 years. While it adds to the premium cost, it's generally considered essential.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Can my family get paid to take care of me?</h4>
                        <p>Some LTCI policies and certain state Medicaid programs may have provisions that allow for family members to be paid as caregivers, but there are often strict rules and requirements. This should not be assumed. It's important to clarify this when purchasing a policy or exploring Medicaid options.</p>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
