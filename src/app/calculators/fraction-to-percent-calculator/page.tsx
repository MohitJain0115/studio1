'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateFractionToPercent } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { HelpCircle, Percent, Divide, Sigma } from 'lucide-react';

const formSchema = z.object({
  numerator: z.coerce.number(),
  denominator: z.coerce.number().refine(n => n !== 0, 'Denominator cannot be zero.'),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators: { name: string; href: string }[] = [
    { name: 'Average Percentage', href: '/calculators/average-percentage-calculator' },
    { name: 'Comparative Difference', href: '/calculators/comparative-difference-calculator' },
    { name: 'Compounding Increase', href: '/calculators/compounding-increase-calculator' },
    { name: 'Decimal to Percent Converter', href: '/calculators/decimal-to-percent-converter' },
    { name: 'Doubling Time', href: '/calculators/doubling-time-calculator' },
    { name: 'Fuel Cost', href: '/calculators/fuel-cost-calculator' },
    { name: 'Historic Change', href: '/calculators/historic-change-calculator' },
    { name: 'Investment Growth', href: '/calculators/investment-growth-calculator' },
    { name: 'Percentage of a Percentage', href: '/calculators/percentage-of-a-percentage-calculator' },
    { name: 'Percentage Point', href: '/calculators/percentage-point-calculator' },
    { name: 'Value Percentage', href: '/calculators/value-percentage-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));

export default function FractionToPercentCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateFractionToPercent> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { numerator: undefined, denominator: undefined },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateFractionToPercent(data.numerator, data.denominator);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Fraction to Percent Calculator</CardTitle>
          <CardDescription>Convert any fraction into its percentage equivalent.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FormField
                  control={form.control}
                  name="numerator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numerator (Top Number)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 3" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="denominator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Denominator (Bottom Number)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 4" {...field} value={field.value ?? ''} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Convert to Percent</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-6 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">{form.getValues('numerator')} / {form.getValues('denominator')} is equal to</p>
              <p className="text-4xl font-bold text-primary">{result.percentage}%</p>
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
            <h3 className="font-semibold text-lg">Numerator</h3>
            <p className="text-muted-foreground">The top number in a fraction. It represents how many parts you have.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Denominator</h3>
            <p className="text-muted-foreground">The bottom number in a fraction. It represents the total number of parts the whole is divided into. It cannot be zero.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>To convert a fraction to a percentage, you first divide the numerator by the denominator to get a decimal value. Then, you multiply that decimal value by 100 to get the percentage.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Percentage = (Numerator / Denominator) × 100</p>
          </div>
           <p className="mt-2 text-muted-foreground">For example, for the fraction 3/4, you would calculate `(3 / 4) * 100 = 75%`.</p>
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
            <CardTitle>Making Sense of Parts of a Whole</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">From Fractions to Everyday Language</h2>
            <p>Fractions are a precise way to describe a part of a whole, but they aren't always the most intuitive format for communication. Percentages, which standardize the "whole" to be 100, are often easier to compare and understand at a glance. This calculator helps bridge that gap.</p>
            
            <h3 className="text-lg font-semibold text-foreground">Real-World Examples</h3>
            <p>We perform this conversion mentally all the time:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Test Scores:</strong> If you got 45 questions correct out of 50, your score is the fraction 45/50. Converting this gives you `(45 / 50) * 100 = 90%`.</li>
                <li><strong>Surveys:</strong> If 3 out of 4 dentists recommend a toothpaste, that's 3/4, which is 75%.</li>
                <li><strong>Recipes:</strong> If a recipe calls for 1/2 a cup of flour, you know that's 50% of a cup.</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground">Why the Denominator Can't Be Zero</h3>
            <p>In mathematics, division by zero is undefined. The denominator of a fraction represents how many pieces a whole is divided into. You cannot divide a whole into zero pieces—it's a logical impossibility. That's why our calculator enforces this fundamental rule.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What if my numerator is larger than my denominator?</AccordionTrigger>
              <AccordionContent>
                <p>This is called an improper fraction, and it's perfectly fine. It simply means you have more than one whole. The resulting percentage will be greater than 100%. For example, the fraction 5/4 converts to `(5 / 4) * 100 = 125%`.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I convert a percentage back to a fraction?</AccordionTrigger>
              <AccordionContent>
                <p>To convert a percentage to a fraction, you write the percentage as the numerator over a denominator of 100. Then, simplify the fraction if possible. For example, 40% is 40/100, which simplifies to 2/5.</p>
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
            The Fraction to Percent Calculator is a straightforward tool for converting any fractional value into a more intuitive percentage. By dividing the numerator by the denominator and multiplying by 100, it helps translate precise mathematical parts into a format that is easier to understand and compare in everyday situations like interpreting test scores or survey results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
