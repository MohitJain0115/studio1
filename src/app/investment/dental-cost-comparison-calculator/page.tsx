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
import { Landmark, Smile, Info, Shield, PlusCircle, Trash2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Link from 'next/link';

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
      const costs = PROCEDURE_COSTS[procedure as keyof typeof PROCEDURE_COSTS];
      for (const provider in costs) {
        totalCostsByProvider[provider] += costs[provider as keyof typeof costs] * quantity;
      }
    });

    const insuranceMultiplier = 1 - ((values.insuranceCoverage || 0) / 100);

    const yourCosts = {
      name: 'Your Estimated Cost',
      'Private Practice': totalCostsByProvider['Private Practice'] * insuranceMultiplier,
      'Dental School': totalCostsByProvider['Dental School'] * insuranceMultiplier,
      'Community Clinic': totalCostsByProvider['Community Clinic'] * insuranceMultiplier,
    };

    setResult({
      chartData: [yourCosts],
    });
  };
  
    // Reset fields to blank
  const resetForm = () => {
    form.reset({
      procedures: [{ procedure: 'cleaning', quantity: 1 }],
      insuranceCoverage: undefined,
    });
    setResult(null);
  };
  
  // Set default to blank
  useState(() => {
    resetForm();
  }, []);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            Dental Cost Comparison Calculator
          </CardTitle>
          <CardDescription>
            Compare estimated costs of dental procedures across different provider types.
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
                                <SelectItem value="filling">Filling</SelectItem>
                                <SelectItem value="crown">Crown</SelectItem>
                                <SelectItem value="root-canal">Root Canal</SelectItem>
                                <SelectItem value="extraction">Extraction</SelectItem>
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
                <li><strong className="text-foreground">Private Practice:</strong> A dental office owned by dentists. They typically offer the most personalized care and amenities but often have the highest costs.</li>
                <li><strong className="text-foreground">Dental School:</strong> Clinics at universities where dental students provide treatment under the close supervision of experienced, licensed dentists. Costs are significantly lower, but appointments may take longer.</li>
                <li><strong className="text-foreground">Community Clinic:</strong> Non-profit or government-funded clinics that aim to provide affordable care. They are a good middle-ground option for cost-effective care from licensed dentists.</li>
            </ul>
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
                  <h4 className="font-semibold text-foreground mb-2">Out-of-Pocket Cost</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">Your Cost = (Procedure Cost * Quantity) * (1 - Insurance Coverage %)</p>
                  <p className="mt-2">For each provider type, the total cost of all procedures is calculated first. Then, your insurance coverage is applied to determine your final out-of-pocket expense.</p>
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
              <li><Link href="/investment/hospital-stay-cost-by-specialty-calculator" className="hover:underline">Hospital Stay Cost Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>

         <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Saving Your Smile: A Guide to Affordable Dental Care</h1>
          <p className="text-lg italic">Dental health is crucial for overall well-being, but costs can be a major barrier. Learn how to find quality care that fits your budget.</p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Costs Vary So Much</h2>
          <p>Unlike medical care, where prices are heavily influenced by insurance negotiations, dental costs can be more transparent but also more varied. The primary factors driving the price differences shown in this calculator are overhead and mission.</p>
          <ul className="list-disc ml-6 space-y-2">
              <li><strong className="font-semibold">Private Practices</strong> are for-profit businesses with high overhead costs, including staff salaries, rent in prime locations, marketing, and advanced technology. This results in higher prices but often provides more convenience and a higher-end patient experience.</li>
              <li><strong className="font-semibold">Dental Schools</strong> are educational institutions. Their primary mission is to train the next generation of dentists. They operate with educational subsidies and supervised student labor, allowing them to charge significantly less (often 50% or more) than private practices.</li>
              <li><strong className="font-semibold">Community Clinics</strong> are typically non-profits or federally qualified health centers (FQHCs). Their mission is public health, and they receive government funding and grants to provide affordable care to underserved populations. They often use a sliding scale fee structure based on income.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Making the Right Choice for You</h2>
          <p>There is no single "best" option; the right choice depends on your priorities:</p>
          <ul className="list-disc ml-6 space-y-2">
              <li><strong className="font-semibold">Choose a Private Practice if:</strong> You value a long-term relationship with a specific dentist, need appointments that fit a tight schedule, and have good dental insurance.</li>
              <li><strong className="font-semibold">Choose a Dental School if:</strong> Your primary concern is cost, you have flexibility in your schedule (appointments can be long), and you are comfortable with treatment being performed by students under strict supervision. It's an excellent option for major, expensive procedures like crowns or root canals.</li>
              <li><strong className="font-semibold">Choose a Community Clinic if:</strong> You have a limited income, are uninsured or underinsured, and are looking for quality, no-frills care from licensed professionals at a reduced cost.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Conclusion: Be a Proactive Patient</h2>
          <p>Don't let cost prevent you from getting necessary dental care. Use this calculator to understand your options. Always ask for a detailed treatment plan and cost estimate before agreeing to a procedure. By being an informed and proactive patient, you can maintain your dental health without breaking the bank.</p>
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
              <h4 className="font-semibold mb-2">Is the quality of care lower at a dental school or community clinic?</h4>
              <p className="text-muted-foreground">Not necessarily. At dental schools, all work is meticulously checked by experienced, licensed faculty. Community clinics are staffed by licensed dentists and hygienists. The primary difference is often in the amenities and appointment length, not the quality of the clinical work itself.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Do dental schools accept insurance?</h4>
              <p className="text-muted-foreground">Many do, but not all. It's essential to call and confirm beforehand. Even if they accept your insurance, you will be responsible for any co-pays or portions not covered, though the base cost will be much lower.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What's a "sliding scale fee"?</h4>
              <p className="text-muted-foreground">This is a payment model used by many community clinics where the fee for services is adjusted based on your income. You will typically need to provide proof of income (like a tax return or pay stubs) to qualify.</p>
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
            <p>This calculator highlights the significant cost variations for identical dental procedures across different provider settings. By comparing costs at private practices, dental schools, and community clinics, it empowers you to make informed decisions based on your budget and priorities, potentially saving you hundreds or thousands of dollars on dental care.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
