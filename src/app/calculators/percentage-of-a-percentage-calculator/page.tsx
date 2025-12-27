'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculatePercentageOfPercentage } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { HelpCircle, Percent, Sigma } from 'lucide-react';

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
    { name: 'Percentage Point', href: '/calculators/percentage-point-calculator' },
    { name: 'Value Percentage', href: '/calculators/value-percentage-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));

export default function PercentageOfPercentageCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculatePercentageOfPercentage> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { percentage1: undefined, percentage2: undefined },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculatePercentageOfPercentage(data.percentage1, data.percentage2);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Percentage of a Percentage Calculator</CardTitle>
          <CardDescription>Calculate what one percentage of another percentage equals.</CardDescription>
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
                      <FormLabel>What is [X]%</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 50" {...field} value={field.value ?? ''} />
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
                      <FormLabel>of [Y]%?</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 20" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Calculate</Button>
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
              <p className="text-sm text-muted-foreground">{form.getValues('percentage1')}% of {form.getValues('percentage2')}% is</p>
              <p className="text-4xl font-bold text-primary">{result.result}%</p>
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
            <h3 className="font-semibold text-lg">Percentage X and Percentage Y</h3>
            <p className="text-muted-foreground">These are the two percentages you want to combine. The calculator finds X percent of Y percent.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>To find a percentage of a percentage, you must first convert both percentages into decimals by dividing them by 100. Then, you multiply these two decimals together. Finally, to express the result as a percentage, you multiply it by 100.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Result % = (Percentage1 / 100) * (Percentage2 / 100) * 100</p>
          </div>
           <p className="mt-2 text-muted-foreground">For example, 50% of 20% is `(0.50 * 0.20) * 100 = 10%`.</p>
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
            <CardTitle>Nested Proportions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">Understanding "Percent of Percent"</h2>
            <p>This calculation can seem abstract, but it's used when dealing with proportions of a group that is already a proportion of a larger whole.</p>
            
            <h3 className="text-lg font-semibold text-foreground">A Common Example</h3>
            <p>Imagine a survey with the following results:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>**40%** of the entire population owns a smartphone.</li>
                <li>Of the smartphone owners, **20%** use it for business.</li>
            </ul>
            <p>If you want to know what percentage of the **entire population** uses a smartphone for business, you need to calculate 20% of 40%.
            <br/>Using the formula: `(0.20 * 0.40) * 100 = 8%`.
            <br/>So, 8% of the total population uses a smartphone for business.
            </p>

            <h3 className="text-lg font-semibold text-foreground">Mistaking This for Addition</h3>
            <p>A common error is to add or subtract the percentages. In the example above, it's not 40% + 20% or 40% - 20%. You are finding a "part of a part," which implies multiplication of the decimal equivalents.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is "50% of 20%" the same as "20% of 50%"?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. Because multiplication is commutative (`A * B = B * A`), the order does not matter. Both calculations will result in 10%.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What if I need to find the percentage of a regular number?</AccordionTrigger>
              <AccordionContent>
                <p>For that, you should use our "Value Percentage Calculator." This tool is specifically for finding a percentage of another percentage.</p>
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
            The Percentage of a Percentage Calculator is a specialized tool for determining a proportion of an existing proportion. It's essential for survey analysis, statistical reporting, and any scenario where you need to find a "part of a part" and express it as a percentage of the whole.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
