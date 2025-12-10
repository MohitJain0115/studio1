'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Info, Shield, TrendingUp, PlusCircle, Trash2, Pill, WholeWord } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

const drugSchema = z.object({
  name: z.string().min(1, "Drug name is required."),
  monthlyCost: z.number().positive("Cost must be positive."),
});

const formSchema = z.object({
  drugs: z.array(drugSchema).min(1, 'Please add at least one drug.'),
  initialCoverageLimit: z.number().positive('Limit must be positive.'),
  catastrophicCoverageLimit: z.number().positive('Limit must be positive.'),
  coverageGapDiscount: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  totalMonthlyCost: number;
  gapEntryMonth: number | null;
  catastrophicEntryMonth: number | null;
  annualOutOfPocket: number;
  chartData: { month: number; name: string; 'Your Monthly OOP': number; 'Total Drug Cost': number; phase: string; }[];
  initialCoverageLimit: number;
  catastrophicCoverageLimit: number;
}

const formatNumberUS = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function HealthPlanCoverageGapEstimator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugs: [],
      initialCoverageLimit: undefined,
      catastrophicCoverageLimit: undefined,
      coverageGapDiscount: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "drugs",
  });
  
  useState(() => {
    form.reset({
      drugs: [{ name: '', monthlyCost: undefined }],
      initialCoverageLimit: 4660, // 2023 Standard
      catastrophicCoverageLimit: 7400, // 2023 Standard
      coverageGapDiscount: 75,
    });
  }, []);

  const onSubmit = (values: FormValues) => {
    const { drugs, initialCoverageLimit, catastrophicCoverageLimit, coverageGapDiscount } = values;

    const totalMonthlyCost = drugs.reduce((acc, drug) => acc + drug.monthlyCost, 0);
    let cumulativeTotalCost = 0;
    let cumulativeOOP = 0;
    let gapEntryMonth: number | null = null;
    let catastrophicEntryMonth: number | null = null;
    const chartData = [];
    
    // Assuming 25% coinsurance in initial phase for simplicity
    const initialCoinsurance = 0.25; 
    const gapCoinsurance = 1 - (coverageGapDiscount / 100);

    for (let month = 1; month <= 12; month++) {
      let monthlyOOP = 0;
      let phase = 'Initial Coverage';
      
      const projectedTotalCost = cumulativeTotalCost + totalMonthlyCost;

      if (cumulativeTotalCost >= catastrophicCoverageLimit) {
        phase = 'Catastrophic Coverage';
        monthlyOOP = totalMonthlyCost * 0.05; // 5% coinsurance
        if (!catastrophicEntryMonth) catastrophicEntryMonth = month;
      } else if (cumulativeTotalCost >= initialCoverageLimit) {
        phase = 'Coverage Gap (Donut Hole)';
        monthlyOOP = totalMonthlyCost * gapCoinsurance;
        if (!gapEntryMonth) gapEntryMonth = month;
      } else {
        monthlyOOP = totalMonthlyCost * initialCoinsurance;
      }

      // Check if this month's spending crosses a threshold
      if (!gapEntryMonth && projectedTotalCost > initialCoverageLimit) {
        gapEntryMonth = month;
      }
      if (!catastrophicEntryMonth && projectedTotalCost > catastrophicCoverageLimit) {
        catastrophicEntryMonth = month;
      }
      
      cumulativeTotalCost += totalMonthlyCost;
      cumulativeOOP += monthlyOOP;

      chartData.push({ month, name: `M${month}`, 'Your Monthly OOP': monthlyOOP, 'Total Drug Cost': totalMonthlyCost, phase });
    }

    setResult({
      totalMonthlyCost,
      gapEntryMonth,
      catastrophicEntryMonth,
      annualOutOfPocket: cumulativeOOP,
      chartData,
      initialCoverageLimit,
      catastrophicCoverageLimit
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WholeWord className="h-5 w-5" />
            Health Plan Coverage Gap Estimator
          </CardTitle>
          <CardDescription>
            Project when you might enter the Medicare Part D coverage gap ("donut hole") based on your drug costs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Prescription Drugs</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end border p-4 rounded-lg relative">
                      <FormField
                        control={form.control}
                        name={`drugs.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Drug Name {index + 1}</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Ozempic" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`drugs.${index}.monthlyCost`}
                        render={({ field }) => (
                          <FormItem className="w-48">
                            <FormLabel>Total Monthly Cost</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 950" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ name: '', monthlyCost: undefined })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Drug
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Plan Limits (2023 Standard)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="initialCoverageLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Coverage Limit ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="catastrophicCoverageLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catastrophic Limit ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="coverageGapDiscount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand-Name Gap Discount (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
              </div>

              <Button type="submit">Estimate Coverage</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Coverage Gap Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                 <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Est. Annual Out-of-Pocket</h4>
                  <p className="text-2xl font-bold">{formatNumberUS(result.annualOutOfPocket)}</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Enter Coverage Gap In</h4>
                  <p className="text-2xl font-bold text-orange-600">{result.gapEntryMonth ? `Month ${result.gapEntryMonth}` : 'Never'}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Enter Catastrophic Coverage In</h4>
                  <p className="text-2xl font-bold text-purple-600">{result.catastrophicEntryMonth ? `Month ${result.catastrophicEntryMonth}` : 'Never'}</p>
                </div>
              </div>
              <div className="mt-8">
                 <Progress value={((result.annualOutOfPocket / result.catastrophicCoverageLimit)*100)} className="h-4" />
                 <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>$0</span>
                    <span>{formatNumberUS(result.catastrophicCoverageLimit)} (Catastrophic Limit)</span>
                 </div>
              </div>
              <div className="mt-8 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.chartData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatNumberUS(value)} />
                    <Tooltip 
                      formatter={(value: number) => formatNumberUS(value)}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background p-2 border rounded-lg shadow-lg">
                              <p className="font-bold">{label}</p>
                              <p className="text-sm text-blue-500">{`Your OOP: ${formatNumberUS(payload[0].value as number)}`}</p>
                              <p className="text-sm text-muted-foreground">{`Phase: ${payload[0].payload.phase}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Your Monthly OOP" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
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
              Understanding the Coverage Gap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>The Medicare Part D coverage gap, commonly known as the "donut hole," is a temporary limit on what most drug plans will cover for drugs. Not everyone will enter the coverage gap. It begins after you and your drug plan have spent a certain amount for covered drugs.</p>
             <p>This calculator helps you estimate if and when you might hit the donut hole based on your current medication costs, giving you a clearer picture of your potential out-of-pocket expenses throughout the year.</p>
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
                  <h4 className="font-semibold text-foreground mb-2">Phased Calculation</h4>
                  <p className="mt-2">This calculator works by simulating your drug spending month by month. It tracks the cumulative total retail cost of your drugs and applies the correct payment rules for each of the four Part D phases:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li><strong className="text-foreground">Deductible Phase:</strong> You pay 100% of costs until your deductible is met. (This calculator assumes it's met early for simplicity).</li>
                      <li><strong className="text-foreground">Initial Coverage Phase:</strong> You pay a co-pay or co-insurance (e.g., 25%) and the plan pays the rest, until the total drug cost reaches the Initial Coverage Limit.</li>
                      <li><strong className="text-foreground">Coverage Gap (Donut Hole):</strong> Once you hit the limit, you're in the gap. You'll pay a percentage (e.g., 25%) of the cost for both brand-name and generic drugs.</li>
                      <li><strong className="font-semibold text-foreground">Catastrophic Coverage:</strong> After your total out-of-pocket spending reaches a certain limit, you leave the gap and your costs are drastically reduced for the rest of the year (e.g., a small co-pay or 5% co-insurance).</li>
                  </ol>
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Navigating the Medicare Donut Hole</h1>
          <p className="text-lg italic">The Medicare Part D coverage gap can lead to unexpected and significant prescription costs. Understanding how it works is the key to managing your budget and making informed decisions about your health plan.</p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">What Exactly is the "Donut Hole"?</h2>
          <p>The "donut hole" isn't a physical place; it's a phase in your Medicare Part D prescription drug coverage. Think of your coverage as having four stages that you move through during the calendar year based on how much you and your plan spend on medications.</p>
          <p>This calculator focuses on the transition from the "Initial Coverage" phase to the "Coverage Gap" phase. The gap begins once the total retail cost of your prescriptions reaches a certain limit set by Medicare each year (the "Initial Coverage Limit").</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why It Matters: The Cost Shift</h2>
          <p>In the Initial Coverage phase, you typically pay a relatively small copay or a 25% coinsurance for your drugs. However, once you enter the donut hole, that changes. You become responsible for a larger portion of the cost—typically 25% of the full retail price for both brand-name and generic drugs. For someone taking expensive medications, this can mean a sudden jump in monthly costs from tens of dollars to hundreds or even thousands.</p>
          <p>This is why estimating your entry into the gap is so important. It allows you to budget for these higher costs and avoid a financial shock midway through the year. The good news is that the gap is not permanent. Once your total out-of-pocket spending for the year reaches another limit (the "Catastrophic Coverage Limit"), you exit the donut hole and your costs drop significantly for the rest of the year.</p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Strategies to Manage Donut Hole Costs</h2>
          <p>If you anticipate falling into the donut hole, there are several proactive steps you can take to mitigate the financial impact:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong className="font-semibold text-foreground">Talk to Your Doctor:</strong> Ask if there are less expensive generic or alternative brand-name drugs that would work just as well for you.</li>
            <li><strong className="font-semibold text-foreground">Look for Patient Assistance Programs (PAPs):</strong> Many pharmaceutical companies offer PAPs that can help eligible individuals get their medications for free or at a reduced cost.</li>
            <li><strong className="font-semibold text-foreground">Use Mail-Order Pharmacies:</strong> Some plans offer lower costs if you get a 90-day supply of your medications through their preferred mail-order pharmacy.</li>
            <li><strong className="font-semibold text-foreground">Compare Plans Annually:</strong> During Medicare's Open Enrollment period (Oct. 15 - Dec. 7), use the official Medicare Plan Finder tool to compare Part D plans. A different plan might offer better coverage for your specific set of drugs.</li>
            <li><strong className="font-semibold text-foreground">Apply for Extra Help:</strong> Extra Help is a federal program that helps people with limited income and resources pay for their Part D premiums, deductibles, and coinsurance.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Conclusion: Forewarned is Forearmed</h2>
          <p>The Medicare coverage gap can be a significant financial challenge, but it doesn't have to be a crisis. By using this estimator to understand your potential costs and timeline, you empower yourself to plan ahead. You can budget for higher-cost months, talk with your doctor about alternatives, and explore assistance programs long before you face a surprise at the pharmacy counter. Knowledge is your best tool for navigating the complexities of prescription drug coverage.</p>
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
              <h4 className="font-semibold mb-2">What costs count toward entering the donut hole?</h4>
              <p className="text-muted-foreground">The total retail cost of your prescription drugs counts toward entering the donut hole. This includes what you pay and what your plan pays. For example, if a drug's retail cost is $100 and you have a $25 copay, the full $100 counts toward the initial coverage limit.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What costs count toward getting out of the donut hole?</h4>
              <p className="text-muted-foreground">To get out of the donut hole, only your out-of-pocket spending counts. This includes what you pay for your prescriptions during the year, plus the manufacturer discount you get on brand-name drugs while in the gap.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Do the limits change every year?</h4>
              <p className="text-muted-foreground">Yes. Medicare adjusts the Initial Coverage Limit and the Catastrophic Coverage threshold annually. It's important to check the current year's figures during Open Enrollment.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Does this calculator use my plan's specific formulary?</h4>
              <p className="text-muted-foreground">No. This is a general estimator based on the total retail cost of drugs. Your plan's specific formulary (list of covered drugs) and tiering will affect your actual costs. This tool is best used for high-level planning.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What if I have a Medicare Advantage plan?</h4>
              <p className="text-muted-foreground">Most Medicare Advantage (Part C) plans include prescription drug coverage (MA-PDs). These plans must follow the same basic Part D rules, including the four coverage phases, so this estimator is still a useful tool for projecting your entry into the gap.</p>
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
            <p>This calculator provides a month-by-month projection to help you anticipate when you might enter the Medicare Part D coverage gap (the "donut hole"). By estimating your total annual out-of-pocket costs and pinpointing when your expenses may increase, this tool empowers you to budget more effectively and proactively discuss cost-saving strategies with your healthcare provider.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
