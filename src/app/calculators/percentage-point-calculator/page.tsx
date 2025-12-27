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
    { name: 'Decimal to Percent Converter', href: '/calculators/decimal-to-percent-converter' },
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
          <CardDescription>Calculate the simple difference between two percentage values.</CardDescription>
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
            <p className="text-muted-foreground">Enter the two percentage values you want to compare. The calculator will find the simple arithmetic difference between them.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The percentage point difference is the most straightforward way to compare two percentages: simple subtraction.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Difference = Percentage 2 - Percentage 1</p>
          </div>
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
            <CardTitle>Percentage Points vs. Percent Change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">A Crucial Distinction in Reporting</h2>
            <p>The difference between "percentage points" and "percent change" is one of the most common sources of confusion in statistics and news reporting. Understanding this distinction is key to interpreting data correctly.</p>
            
            <Alert>
              <Percent className="h-4 w-4" />
              <AlertTitle>Example Scenario</AlertTitle>
              <AlertDescription>
                An interest rate increases from **10%** to **12%**.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-foreground">Percentage Point Change</h3>
              <p>This is the simple subtraction of the two percentages. It describes the absolute change in the numerical value of the percentage.</p>
              <p className="font-semibold mt-2">`12% - 10% = 2` percentage points.</p>
              <p>This calculator computes the percentage point change.</p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-foreground">Percentage Change</h3>
              <p>This measures the relative change between the two percentages. It tells you how much one percentage has changed in relation to the other. You would use the <Link href="/calculators/historic-change-calculator" className="text-primary underline">Historic Change Calculator</Link> for this.</p>
              <p className="font-semibold mt-2">`((12 - 10) / 10) * 100 = 20%`.</p>
              <p>So, the interest rate increased by **2 percentage points**, which represents a **20 percent increase**.</p>
            </div>

            <p className="font-bold text-foreground">Both statements are correct, but they describe different things. News headlines often use the larger number (the percent change) because it sounds more dramatic, but the percentage point change is often the clearer and more direct comparison.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>When should I use percentage points?</AccordionTrigger>
              <AccordionContent>
                <p>Use percentage points when you are describing a change in a rate or a proportion. It is the standard in reporting on interest rates, unemployment rates, poll results, and profit margins.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can the result be negative?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. If the second percentage is smaller than the first, the percentage point difference will be negative, indicating a decrease.</p>
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
            The Percentage Point Calculator provides the simple arithmetic difference between two percentage values. It is a crucial tool for clearly and accurately reporting changes in rates and proportions, helping to avoid the common confusion between absolute change (percentage points) and relative change (percent change).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
