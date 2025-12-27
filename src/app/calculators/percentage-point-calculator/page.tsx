'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculatePercentagePoint } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { HelpCircle, Percent, Minus, Sigma, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


const formSchema = z.object({
  percentage1: z.coerce.number(),
  percentage2: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators: { name: string; href: string }[] = [
    { name: 'Average Percentage', href: '/calculators/average-percentage-calculator' },
    { name: 'Comparative Difference', href: '/calculators/comparative-difference-calculator' },
    { name: 'Compounding Increase', href: '/calculators/compounding-increase-calculator' },
    { name: 'Doubling Time', href: '/calculators/doubling-time-calculator' },
    { name: 'Fraction to Percent', href: '/calculators/fraction-to-percent-calculator' },
    { name: 'Fuel Cost', href: '/calculators/fuel-cost-calculator' },
    { name: 'Historic Change', href: '/calculators/historic-change-calculator' },
    { name: 'Investment Growth', href: '/calculators/investment-growth-calculator' },
    { name: 'Percentage of a Percentage', href: '/calculators/percentage-of-a-percentage-calculator' },
    { name: 'Value Percentage', href: '/calculators/value-percentage-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));

export default function PercentagePointCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculatePercentagePoint> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { percentage1: undefined, percentage2: undefined },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculatePercentagePoint(data.percentage1, data.percentage2);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Percentage Point Calculator</CardTitle>
          <CardDescription>Calculate the simple arithmetic difference between two percentage values.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FormField
                  control={form.control}
                  name="percentage1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 20" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="percentage2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Calculate Difference</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Calculation Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-6 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Difference</p>
              <p className="text-4xl font-bold text-primary">{result.difference} percentage points</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Understanding the Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Initial and Final Percentage</h3>
            <p className="text-muted-foreground">Enter the two percentage values you want to compare. The calculator will find the simple arithmetic difference between them, measured in "percentage points."</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The percentage point difference is the most straightforward way to compare two percentages: it is their simple arithmetic difference, found through subtraction.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Difference = Final Percentage - Initial Percentage</p>
          </div>
          <p className="mt-2 text-muted-foreground">This gives the absolute change between the two rates.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Calculators</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedCalculators.map((calc) => (
                <Link href={calc.href} key={calc.name} className="block hover:no-underline">
                <Card className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors h-full text-center">
                    <span className="font-semibold">{calc.name}</span>
                </Card>
                </Link>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>A Guide to Percentage Points vs. Percent Change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">The Crucial Distinction for Accurate Reporting</h2>
            <p>The difference between a **"percentage point"** change and a **"percent change"** is one of the most common and significant sources of confusion in statistics, finance, and news reporting. Understanding this distinction is essential for interpreting data correctly and communicating with clarity and authority.</p>
            
            <Alert>
              <Percent className="h-4 w-4" />
              <AlertTitle>Core Example: An Interest Rate Increase</AlertTitle>
              <AlertDescription>
                A central bank raises its key interest rate from **10%** to **12%**.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground">Percentage Point Change (Absolute Change)</h3>
                  <p>This is the simple subtraction of the two percentages. It describes the absolute, linear change in the numerical value of the rate itself.</p>
                  <p className="font-semibold mt-2 text-primary">`12% - 10% = 2` percentage points.</p>
                  <p>This calculator computes the percentage point change.</p>
                </div>

                <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground">Percentage Change (Relative Change)</h3>
                    <p>This measures the relative change between the two values. It tells you how much the initial rate has changed in proportion to what it was.</p>
                    <p className="font-semibold mt-2 text-primary">`((12 - 10) / 10) * 100 = 20%`.</p>
                    <p>You would use the <Link href="/calculators/historic-change-calculator" className="text-primary underline">Historic Change Calculator</Link> for this.</p>
                </div>
            </div>

            <p className="font-bold text-foreground text-center text-base pt-2">Both statements are correct but describe different things: "The rate increased by **2 percentage points**," which was a **20 percent increase** from its original level.</p>
            
            <h3 className="text-lg font-semibold text-foreground">Why the Distinction Matters</h3>
            <p>Using the wrong term can be highly misleading. News headlines often use the larger number (the percent change) because it sounds more dramatic ("Inflation Surges 20%!"), but analysts and professionals almost always use percentage points to describe changes in rates because it is clearer and less ambiguous.</p>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm mt-4">
                <caption className="caption-bottom text-xs text-muted-foreground mt-2">Table: Comparing Percentage Points and Percent Change</caption>
                <thead className="text-left font-semibold text-foreground">
                  <tr>
                    <th className="p-2 border-b">Scenario</th>
                    <th className="p-2 border-b">Change in Percentage Points</th>
                    <th className="p-2 border-b">Percent Change</th>
                    <th className="p-2 border-b">Correct Terminology</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Unemployment rate moves from 5% to 6%</td>
                    <td className="p-2 font-bold">1 percentage point</td>
                    <td className="p-2 font-bold">20%</td>
                    <td className="p-2">"The unemployment rate increased by 1 percentage point."</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">A political candidate's approval rises from 40% to 45%</td>
                    <td className="p-2 font-bold">5 percentage points</td>
                    <td className="p-2 font-bold">12.5%</td>
                    <td className="p-2">"The candidate's approval rose by 5 percentage points."</td>
                  </tr>
                  <tr>
                    <td className="p-2">A company's profit margin decreases from 15% to 12%</td>
                    <td className="p-2 font-bold">-3 percentage points</td>
                    <td className="p-2 font-bold">-20%</td>
                    <td className="p-2">"The profit margin fell by 3 percentage points."</td>
                  </tr>
                </tbody>
              </table>
            </div>

        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>When should I use "percentage points"?</AccordionTrigger>
              <AccordionContent>
                <p>Always use percentage points when describing the change in a value that is already a percentage. It is the standard and clearest method for reporting on interest rates, unemployment rates, political poll results, profit margins, and any other statistical rate or proportion.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can the result be negative?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. If the final percentage is smaller than the initial percentage, the percentage point difference will be negative, correctly indicating a decrease. For example, a change from 25% to 22% is a difference of -3 percentage points.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is "basis points" the same as percentage points?</AccordionTrigger>
              <AccordionContent>
                <p>They are directly related. A "basis point" (often abbreviated as "bp" or "bip") is one-hundredth of a percentage point. Therefore, `1 percentage point = 100 basis points`. The term is used heavily in finance to describe changes in interest rates with extreme precision, avoiding the ambiguity of "percent." An increase from 5.00% to 5.25% is an increase of 25 basis points.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Why is it wrong to say "the rate increased by 2 percent" in the example above?</AccordionTrigger>
              <AccordionContent>
                <p>Saying it increased by "2 percent" is ambiguous. It could be interpreted as a 2% relative increase (i.e., `10% * 1.02 = 10.2%`) or an absolute increase of 2 percentage points. Using "percentage points" removes this ambiguity entirely, which is critical for clear communication in finance and science.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>Can I just subtract the numbers?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. That is exactly what this calculator does. The term "percentage points" is the correct unit to use when describing the result of that subtraction.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Does the order of the numbers matter?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, it does. The calculator computes `Final - Initial`. Reversing the numbers will give you the same magnitude but with the opposite sign. A change from 10% to 12% is +2 percentage points, while a change from 12% to 10% is -2 percentage points.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Percentage Point Calculator provides the simple arithmetic difference between two percentage values. It is a fundamental tool for clearly and accurately reporting changes in rates and proportions. Using the term "percentage points" is the professional standard that helps avoid the common and significant confusion between absolute change (percentage points) and relative change (percent change).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
