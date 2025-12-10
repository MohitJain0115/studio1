'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Hospital, Info, Shield, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Link from 'next/link';

const COST_PER_DAY = {
  cardiology: 3500,
  orthopedics: 3000,
  neurology: 4000,
  oncology: 4500,
  'general-surgery': 2800,
};

const formSchema = z.object({
  specialty: z.enum(Object.keys(COST_PER_DAY) as [string, ...string[]]),
  lengthOfStay: z.number().positive('Length of stay must be positive.'),
  insuranceCoverage: z.number().min(0, 'Coverage cannot be negative.').max(100, 'Coverage cannot exceed 100.'),
  deductible: z.number().min(0, 'Deductible cannot be negative.'),
  maxOutOfPocket: z.number().positive('Max out-of-pocket must be positive.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  totalBaseCost: number;
  insurancePays: number;
  yourTotalCost: number;
  chartData: { name: string; 'Your Cost': number; 'Insurance Pays': number; }[];
}

const formatNumberUS = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function HospitalStayCostCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialty: undefined,
      lengthOfStay: undefined,
      insuranceCoverage: undefined,
      deductible: undefined,
      maxOutOfPocket: undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    const { specialty, lengthOfStay, insuranceCoverage, deductible, maxOutOfPocket } = values;

    const dailyCost = COST_PER_DAY[specialty];
    const totalBaseCost = dailyCost * lengthOfStay;

    const remainingDeductible = deductible;
    const costAfterDeductible = Math.max(0, totalBaseCost - remainingDeductible);
    
    const yourCoinsurance = costAfterDeductible * (1 - (insuranceCoverage / 100));
    let yourTotalCost = remainingDeductible + yourCoinsurance;
    
    yourTotalCost = Math.min(yourTotalCost, maxOutOfPocket, totalBaseCost);

    const insurancePays = totalBaseCost - yourTotalCost;

    setResult({
      totalBaseCost,
      insurancePays,
      yourTotalCost,
      chartData: [
        { name: 'Cost Breakdown', 'Your Cost': yourTotalCost, 'Insurance Pays': insurancePays },
      ],
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hospital className="h-5 w-5" />
            Hospital Stay Cost by Specialty Calculator
          </CardTitle>
          <CardDescription>
            Estimate your potential out-of-pocket costs for a hospital stay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Specialty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a specialty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="oncology">Oncology</SelectItem>
                          <SelectItem value="general-surgery">General Surgery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lengthOfStay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length of Stay (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="deductible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remaining Deductible ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1500" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceCoverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Coverage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 80" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxOutOfPocket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Out-of-Pocket ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 8000" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full md:w-auto">
                Estimate Cost
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Estimated Hospital Stay Costs</CardTitle>
              <CardDescription>
                This is an estimate based on the information provided. Actual costs may vary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground">Your Estimated Out-of-Pocket Cost</p>
                <p className="text-5xl font-bold text-primary">{formatNumberUS(result.yourTotalCost)}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Total Estimated Bill</h4>
                  <p className="text-2xl font-bold">
                    {formatNumberUS(result.totalBaseCost)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Insurance Estimated Payment</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumberUS(result.insurancePays)}
                  </p>
                </div>
              </div>
              <div className="mt-8 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.chartData} layout="vertical">
                      <XAxis type="number" tickFormatter={(value) => formatNumberUS(value)} />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip formatter={(value: number) => formatNumberUS(value)} cursor={{fill: 'hsla(var(--muted))'}} />
                      <Bar dataKey="Your Cost" stackId="a" fill="hsl(var(--primary))" />
                      <Bar dataKey="Insurance Pays" stackId="a" fill="hsl(var(--chart-2))" />
                    </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Understanding Hospital Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>The cost of a hospital stay is one of the most complex areas of healthcare finance. The final bill is influenced by numerous factors, including the hospital's location, negotiated rates with your insurer, and the specific services and medications you receive.</p>
            <p>This calculator provides a high-level estimate based on national averages for daily costs and your insurance structure. It's a starting point to help you understand the potential financial impact, but it cannot predict the exact cost.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Formula Explained
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Total Base Cost</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">Total Base Cost = Avg. Daily Cost * Length of Stay</p>
                  <p className="mt-2">This is the initial estimated bill from the hospital before any insurance is applied.</p>
              </div>
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Your Out-of-Pocket Cost</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">Your Cost = Deductible + ((Total Base Cost - Deductible) * (1 - Co-insurance))</p>
                  <p className="mt-2">Your cost is what you pay of the deductible first. After that, you pay a percentage (your co-insurance) of the remaining bill. Your total payment is capped at your plan's max out-of-pocket limit.</p>
              </div>
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
            <ul className="list-disc pl-5 text-sm text-primary">
              <li><Link href="/investment/hsa-tax-benefit-calculator" className="hover:underline">HSA Tax Benefit Calculator</Link></li>
              <li><Link href="/investment/long-term-care-cost-estimator" className="hover:underline">Long-Term Care Cost Estimator</Link></li>
            </ul>
          </CardContent>
        </Card>
        
        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Decoding Your Hospital Bill: A Guide to Medical Costs</h1>
          <p className="text-lg italic">Navigating healthcare costs can be confusing. This guide breaks down the key terms and factors that determine what you'll owe after a hospital stay.</p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Key Health Insurance Terms</h2>
          <p>Understanding your insurance plan is the first step to managing medical expenses. Here are the most important terms this calculator uses:</p>
          <ol className="list-decimal ml-6 space-y-4">
              <li>
                  <strong className="font-semibold text-foreground">Deductible:</strong> This is the amount you must pay out-of-pocket for covered healthcare services before your insurance plan starts to pay. For example, if your deductible is $1,500, you pay the first $1,500 of covered services yourself.
              </li>
              <li>
                  <strong className="font-semibold text-foreground">Co-insurance:</strong> This is your share of the costs of a covered health care service, calculated as a percentage (e.g., 20%) of the allowed amount for the service. You pay co-insurance *after* you've met your deductible. For example, if the hospital bill is $10,000 and you've met your deductible, your 20% co-insurance share would be $2,000.
              </li>
               <li>
                  <strong className="font-semibold text-foreground">Max Out-of-Pocket:</strong> This is the absolute most you will have to pay for covered services in a plan year. After you spend this amount on deductibles, copayments, and co-insurance, your health plan pays 100% of the costs of covered benefits.
              </li>
          </ol>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">How It All Works Together</h2>
          <p>Imagine a $20,000 hospital bill. Your plan has a $3,000 deductible, 20% co-insurance, and a $8,000 max out-of-pocket.</p>
          <ul className="list-disc ml-6 space-y-2">
              <li><strong className="font-semibold">Step 1: Meet the Deductible.</strong> You pay the first $3,000 of the bill. The remaining bill is now $17,000.</li>
              <li><strong className="font-semibold">Step 2: Pay Co-insurance.</strong> You are responsible for 20% of the remaining $17,000, which is $3,400. Your insurance will cover the other 80% ($13,600).</li>
              <li><strong className="font-semibold">Step 3: Calculate Your Total.</strong> Your total out-of-pocket cost is your deductible + your co-insurance: $3,000 + $3,400 = $6,400.</li>
              <li><strong className="font-semibold">Step 4: Check Against Max Out-of-Pocket.</strong> Since $6,400 is less than your $8,000 max, you owe $6,400. If your calculated total was more than $8,000, you would only have to pay $8,000.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Conclusion: Plan Ahead</h2>
          <p>While you can't predict a medical emergency, understanding your insurance and potential costs can help you prepare. This calculator provides a valuable baseline to inform your financial planning, whether that's building an emergency fund or choosing the right health plan during open enrollment.</p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Why are the costs in the calculator so high?</h4>
              <p className="text-muted-foreground">The costs are based on hospital "chargemaster" rates, which are often inflated. Insurers negotiate these rates down. The calculator uses average daily costs as a baseline before applying your specific insurance details.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Does this include doctor's fees?</h4>
              <p className="text-muted-foreground">Typically, no. The hospital bill and the bills from physicians who treated you (like surgeons or anesthesiologists) are often separate. This calculator estimates the hospital facility charges.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What if I go to an out-of-network hospital?</h4>
              <p className="text-muted-foreground">Out-of-network care is significantly more expensive. Your insurer may cover a smaller portion, or none at all. You may also be subject to "balance billing," where the provider bills you for the difference between their charge and what the insurer paid. This calculator assumes in-network care.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator helps demystify the cost of a hospital stay by applying your specific health insurance terms (deductible, co-insurance, max out-of-pocket) to an estimated total bill. By providing a baseline out-of-pocket expense, it empowers you to better prepare for medical costs and understand the financial protection your health plan offers.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
