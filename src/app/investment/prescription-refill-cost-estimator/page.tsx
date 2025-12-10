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
import { Landmark, Info, Shield, TrendingUp, PlusCircle, Trash2, Pill } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Link from 'next/link';

const refillSchema = z.object({
  name: z.string().min(1, "Name is required."),
  cost: z.number().positive("Cost must be positive."),
  frequency: z.enum(['monthly', '90-day', 'annually']),
  insuranceCopay: z.number().min(0).optional(),
});

const formSchema = z.object({
  prescriptions: z.array(refillSchema).min(1, 'Please add at least one prescription.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  totalAnnualCost: number;
  totalAnnualCopay: number;
  yourTotalAnnualCost: number;
  chartData: { name: string; 'Out-of-Pocket': number; 'Insurance Pays': number; }[];
}

const formatNumberUS = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const REFILLS_PER_YEAR = {
  monthly: 12,
  '90-day': 4,
  annually: 1,
};

export default function PrescriptionRefillCostEstimator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prescriptions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prescriptions",
  });
  
  useState(() => {
    form.reset({
      prescriptions: [{ name: '', cost: undefined, frequency: 'monthly', insuranceCopay: undefined }],
    });
  }, []);

  const onSubmit = (values: FormValues) => {
    let totalAnnualCost = 0;
    let totalAnnualCopay = 0;
    const chartData: CalculationResult['chartData'] = [];

    values.prescriptions.forEach(rx => {
      const refillsPerYear = REFILLS_PER_YEAR[rx.frequency];
      const annualCost = rx.cost * refillsPerYear;
      const annualCopay = (rx.insuranceCopay ?? rx.cost) * refillsPerYear;
      
      totalAnnualCost += annualCost;
      totalAnnualCopay += annualCopay;

      chartData.push({
        name: rx.name,
        'Out-of-Pocket': annualCopay,
        'Insurance Pays': Math.max(0, annualCost - annualCopay),
      });
    });

    setResult({
      totalAnnualCost,
      totalAnnualCopay,
      yourTotalAnnualCost: totalAnnualCopay,
      chartData,
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Prescription Refill Cost Estimator
          </CardTitle>
          <CardDescription>
            Estimate your annual out-of-pocket costs for recurring prescription medications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Your Prescriptions</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-4 rounded-lg relative">
                      <h4 className="absolute -top-2.5 left-2 bg-background px-1 text-xs text-muted-foreground">Prescription {index + 1}</h4>
                       <FormField
                        control={form.control}
                        name={`prescriptions.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medication Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Lisinopril" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`prescriptions.${index}.cost`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost per Refill</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 25" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`prescriptions.${index}.frequency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refill Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="90-day">Every 90 Days</SelectItem>
                                <SelectItem value="annually">Annually</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`prescriptions.${index}.insuranceCopay`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Copay (Optional)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 10" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
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
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ name: '', cost: undefined, frequency: 'monthly', insuranceCopay: undefined })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Prescription
                </Button>
              </div>

              <Button type="submit">Estimate Annual Cost</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Estimated Annual Prescription Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground">Your Estimated Annual Out-of-Pocket Cost</p>
                <p className="text-5xl font-bold text-primary">{formatNumberUS(result.yourTotalAnnualCost)}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Total Retail Cost</h4>
                  <p className="text-2xl font-bold">{formatNumberUS(result.totalAnnualCost)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Insurance Pays</h4>
                  <p className="text-2xl font-bold text-green-600">{formatNumberUS(result.totalAnnualCost - result.yourTotalAnnualCost)}</p>
                </div>
              </div>
              <div className="mt-8 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.chartData} layout="vertical">
                    <XAxis type="number" tickFormatter={(value) => formatNumberUS(value)} />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip formatter={(value: number) => formatNumberUS(value)} cursor={{ fill: 'hsla(var(--muted))' }} />
                    <Legend />
                    <Bar dataKey="Out-of-Pocket" stackId="a" fill="hsl(var(--primary))" />
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
              Understanding Prescription Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Prescription drug costs can be a significant and recurring part of any household's budget. Prices are determined by the drug's manufacturer, but what you actually pay is determined by your health insurance plan's formulary, your deductible, and your copay/coinsurance structure.</p>
            <p>This calculator helps you estimate your annual spending by adding up the costs of your regular medications. By entering your copay, you can see a more accurate picture of your out-of-pocket expenses versus what your insurance covers.</p>
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
                  <h4 className="font-semibold text-foreground mb-2">Annual Cost Per Prescription</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">Annual Cost = Cost per Refill * Refills per Year</p>
                  <p className="mt-2">The calculator first determines the number of refills needed per year based on your selected frequency (12 for monthly, 4 for 90-day, 1 for annually). It then multiplies this by the cost per refill to find the total annual cost for each medication.</p>
              </div>
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Your Out-of-Pocket Cost</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">Your Annual Cost = (Your Copay) * Refills per Year</p>
                  <p className="mt-2">If you provide a copay, it's used to calculate your total out-of-pocket cost for the year. If no copay is entered, the calculator assumes you are paying the full retail cost for the medication.</p>
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Guide to Managing Your Prescription Costs</h1>
          <p className="text-lg italic">Prescription medications are a vital part of health management for millions, but navigating the costs can be a challenge. This guide offers strategies to help you save money at the pharmacy counter.</p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Drug Prices Are So Complicated</h2>
          <p>The price you pay for a prescription is rarely the "list price." It's the result of a complex negotiation between drug manufacturers, pharmacy benefit managers (PBMs), and your insurance company. The key terms to understand are:</p>
          <ul className="list-disc ml-6 space-y-2">
              <li><strong className="font-semibold">Formulary:</strong> This is the list of prescription drugs covered by your health insurance plan. Drugs are often grouped into "tiers." Drugs in lower tiers (like generics) have lower copays than drugs in higher tiers (like specialty drugs).</li>
              <li><strong className="font-semibold">Deductible:</strong> For many plans, you must pay 100% of your drug costs until you meet your annual deductible. After that, your copays or coinsurance kick in.</li>
              <li><strong className="font-semibold">Copay vs. Coinsurance:</strong> A copay is a fixed dollar amount (e.g., $10) you pay for a prescription. Coinsurance is a percentage of the drug's cost (e.g., 25%) you are responsible for.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Actionable Strategies for Saving Money</h2>
          <p>Even within a complex system, you have the power to lower your costs. Use this calculator to get a baseline, then try these proven strategies:</p>
          <ul className="list-disc ml-6 space-y-2">
              <li><strong className="font-semibold text-foreground">Always Ask for Generic:</strong> When your doctor prescribes a new medication, ask if a generic version is available. Generics are chemically identical to their brand-name counterparts but are often 80-85% cheaper.</li>
              <li><strong className="font-semibold text-foreground">Use a 90-Day Mail-Order Pharmacy:</strong> Many insurance plans offer a significant discount if you get a 90-day supply of your maintenance medications through their preferred mail-order pharmacy. You might get three months of medication for the price of two retail copays.</li>
              <li><strong className="font-semibold text-foreground">Use Prescription Discount Cards:</strong> Services like GoodRx or SingleCare can often provide a coupon price that is even cheaper than your insurance copay, especially for generic drugs. It's always worth checking before you pay. You cannot combine these with insurance, but you can use them instead of it.</li>
              <li><strong className="font-semibold text-foreground">Look for Manufacturer Coupons and Patient Assistance Programs (PAPs):</strong> For expensive, brand-name drugs, the manufacturer may offer a copay card that drastically reduces your out-of-pocket cost. For those with lower incomes, Patient Assistance Programs (PAPs) can sometimes provide the medication for free.</li>
              <li><strong className="font-semibold text-foreground">Talk to Your Doctor or Pharmacist:</strong> Your healthcare providers are your best allies. Ask your doctor about cheaper alternatives (therapeutic substitution). Ask your pharmacist if there are any available discounts or if paying cash with a coupon would be cheaper than using your insurance.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Conclusion: Be a Proactive Consumer</h2>
          <p>Managing prescription costs requires being an engaged and proactive consumer. You can't control the list price of a drug, but you can control how you purchase it. By understanding your insurance plan, exploring discount options, and communicating with your healthcare team, you can ensure you get the medications you need without overpaying.</p>
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
              <h4 className="font-semibold mb-2">Can I use a discount card (like GoodRx) and my insurance at the same time?</h4>
              <p className="text-muted-foreground">No. You have to choose one or the other for a given transaction. However, what you pay using a discount card typically does not count toward your insurance deductible.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Is it cheaper to get a 90-day supply?</h4>
              <p className="text-muted-foreground">Often, yes. Many insurance plans are structured to incentivize 90-day refills for maintenance medications, often offering a "3-for-2" deal (e.g., three months for two copays). Check your plan's benefits or call their member services line to find out.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What's the difference between a generic and brand-name drug?</h4>
              <p className="text-muted-foreground">A generic drug is required by the FDA to have the same active ingredient, strength, dosage form, and route of administration as the brand-name drug. They are typically much cheaper because the manufacturers did not have to bear the costs of initial research and development.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What if my insurance denies coverage for a drug?</h4>
              <p className="text-muted-foreground">This is called a "prior authorization" requirement. Your doctor's office may need to submit paperwork to your insurer explaining why you need that specific medication. If it's still denied, you can go through your insurer's appeals process.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Where can I find Patient Assistance Programs (PAPs)?</h4>
              <p className="text-muted-foreground">A good place to start is the drug manufacturer's website. You can also use the Medicine Assistance Tool (MAT.org), a search engine for many of the assistance programs available from pharmaceutical companies.</p>
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
            <p>This calculator helps you aggregate the individual costs of your recurring prescriptions into a clear annual estimate. By allowing you to input the retail cost and your specific insurance copay, it provides a powerful visual breakdown of your out-of-pocket expenses versus what your insurance covers. This empowers you to budget effectively and identify which medications have the largest financial impact, so you can explore cost-saving strategies where they matter most.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
