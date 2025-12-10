'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, TrendingUp, Smile, Info, Shield, PlusCircle, Trash2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import Link from 'next/link';

// Mock data for average procedure costs
const PROCEDURE_COSTS = {
  'cleaning': { 'Private Practice': 120, 'Dental School': 60, 'Community Clinic': 80 },
  'filling': { 'Private Practice': 250, 'Dental School': 125, 'Community Clinic': 175 },
  'crown': { 'Private Practice': 1200, 'Dental School': 600, 'Community Clinic': 800 },
  'root-canal': { 'Private Practice': 1500, 'Dental School': 750, 'Community Clinic': 1000 },
  'extraction': { 'Private Practice': 300, 'Dental School': 150, 'Community Clinic': 200 },
};

const procedureSchema = z.object({
  procedure: z.enum(Object.keys(PROCEDURE_COSTS) as [string, ...string[]]),
  quantity: z.number().min(1, "Quantity must be at least 1."),
});

const formSchema = z.object({
  procedures: z.array(procedureSchema).min(1, 'Please add at least one procedure.'),
  insuranceCoverage: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  totalCosts: { name: string; 'Private Practice': number; 'Dental School': number; 'Community Clinic': number; }[];
  chartData: { name: string; 'Private Practice': number; 'Dental School': number; 'Community Clinic': number; }[];
}

const formatNumberUS = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function DentalCostComparisonCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      procedures: [{ procedure: 'cleaning', quantity: 1 }],
      insuranceCoverage: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "procedures",
  });

  const onSubmit = (values: FormValues) => {
    const totalCostsByProvider: { [key: string]: number } = {
      'Private Practice': 0,
      'Dental School': 0,
      'Community Clinic': 0,
    };

    values.procedures.forEach(({ procedure, quantity }) => {
      const costs = PROCEDURE_COSTS[procedure];
      for (const provider in costs) {
        totalCostsByProvider[provider] += costs[provider as keyof typeof costs] * quantity;
      }
    });

    const insuranceMultiplier = 1 - (values.insuranceCoverage / 100);

    const yourCosts = {
      name: 'Your Estimated Cost',
      'Private Practice': totalCostsByProvider['Private Practice'] * insuranceMultiplier,
      'Dental School': totalCostsByProvider['Dental School'] * insuranceMultiplier,
      'Community Clinic': totalCostsByProvider['Community Clinic'] * insuranceMultiplier,
    };

    setResult({
      totalCosts: [yourCosts],
      chartData: [yourCosts],
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            Dental Cost Comparison Calculator
          </CardTitle>
          <CardDescription>
            Compare the estimated costs of dental procedures across different types of providers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Dental Procedures</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border p-4 rounded-lg relative">
                      <h4 className="absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground">Procedure {index + 1}</h4>
                      <FormField
                        control={form.control}
                        name={`procedures.${index}.procedure`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Procedure</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select procedure" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cleaning">Cleaning</SelectItem>
                                <SelectItem value="filling">Filling (1-2 surfaces)</SelectItem>
                                <SelectItem value="crown">Crown (Porcelain/Ceramic)</SelectItem>
                                <SelectItem value="root-canal">Root Canal (Molar)</SelectItem>
                                <SelectItem value="extraction">Extraction (Simple)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`procedures.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="1" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ procedure: 'cleaning', quantity: 1 })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Procedure
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Insurance</h3>
                <FormField
                  control={form.control}
                  name="insuranceCoverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Insurance Coverage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 50" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full md:w-auto">
                Compare Costs
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Estimated Dental Costs</CardTitle>
              <CardDescription>
                This comparison shows your estimated out-of-pocket costs at different provider types.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatNumberUS(value)} />
                  <Tooltip formatter={(value: number) => formatNumberUS(value)} />
                  <Legend />
                  <Bar dataKey="Private Practice" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="Dental School" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="Community Clinic" fill="hsl(var(--chart-3))" />
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
              Understanding Dental Provider Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Dental care costs can vary dramatically depending on where you receive treatment. This calculator helps illustrate those differences.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Private Practice:</strong> A dental office owned and operated by a dentist or group of dentists. They typically offer the most personalized care and amenities but often have the highest costs.</li>
                <li><strong className="text-foreground">Dental School:</strong> Clinics at universities where dental students provide treatment under the close supervision of experienced, licensed dentists. Costs are significantly lower, but appointments may take longer.</li>
                <li><strong className="text-foreground">Community or Public Health Clinic:</strong> Non-profit or government-funded clinics that aim to provide affordable care to the local community. They are a good middle-ground option for cost-effective care from licensed dentists.</li>
            </ul>
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
              <li><Link href="/investment/hospital-stay-cost-by-specialty-calculator" className="hover:underline">Hospital Stay Cost Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
