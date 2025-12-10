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
import { Landmark, TrendingUp, Hospital, Info, Shield, HeartPulse, Bone, Brain, Stethoscope } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Link from 'next/link';

// Mock data for average daily cost by specialty
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
      specialty: 'cardiology',
      lengthOfStay: undefined,
      insuranceCoverage: undefined,
      deductible: undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    const { specialty, lengthOfStay, insuranceCoverage, deductible } = values;

    const dailyCost = COST_PER_DAY[specialty];
    const totalBaseCost = dailyCost * lengthOfStay;

    const costAfterDeductible = Math.max(0, totalBaseCost - deductible);
    const insurancePayment = costAfterDeductible * (insuranceCoverage / 100);
    
    // Your cost is the deductible plus your share of the remaining cost
    const yourCoinsurance = costAfterDeductible * (1 - (insuranceCoverage / 100));
    const yourTotalCost = deductible + yourCoinsurance;

    // Insurance payment is the total cost minus what you pay
    const insurancePays = totalBaseCost - yourTotalCost;

    setResult({
      totalBaseCost,
      insurancePays,
      yourTotalCost,
      chartData: [
        { name: 'Total Cost Breakdown', 'Your Cost': yourTotalCost, 'Insurance Pays': insurancePays },
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
            Estimate your out-of-pocket costs for a hospital stay based on specialty and insurance.
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="insuranceCoverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Co-insurance (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 80" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>
                This chart illustrates the split between what you pay and what your insurance covers.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.chartData} layout="vertical" stackOffset="expand">
                  <XAxis type="number" hide tickFormatter={(value) => `${value * 100}%`} />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip formatter={(value, name, props) => `${(props.payload.percentage * 100).toFixed(0)}%`}/>
                  <Bar dataKey="Your Cost" fill="hsl(var(--primary))" stackId="a" />
                  <Bar dataKey="Insurance Pays" fill="hsl(var(--chart-2))" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
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
            <p>The cost of a hospital stay is one of the most complex and opaque areas of healthcare finance. The final bill is influenced by numerous factors, including the hospital's location, the specific services rendered, medications administered, and negotiated rates between the hospital and your insurance provider.</p>
            <p>This calculator provides a high-level estimate based on national averages for daily costs within a specialty. It's a starting point to help you understand the potential financial impact, but it cannot predict the exact cost. Always contact your insurance provider and the hospital for a more accurate estimate before a planned procedure.</p>
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
      </div>
    </div>
  );
}
