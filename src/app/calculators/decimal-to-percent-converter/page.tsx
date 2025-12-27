'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateDecimalToPercent } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { HelpCircle, Percent, ArrowRightLeft, Sigma } from 'lucide-react';

const formSchema = z.object({
  decimal: z.coerce.number(),
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
    { name: 'Percentage Point', href: '/calculators/percentage-point-calculator' },
    { name: 'Value Percentage', href: '/calculators/value-percentage-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));

export default function DecimalToPercentConverter() {
  const [result, setResult] = useState<ReturnType<typeof calculateDecimalToPercent> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { decimal: undefined },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateDecimalToPercent(data.decimal);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Decimal to Percent Converter</CardTitle>
          <CardDescription>Convert any decimal number into its percentage equivalent.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="decimal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decimal Number</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 0.75" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <p className="text-sm text-muted-foreground">{form.getValues('decimal')} is equal to</p>
              <p className="text-4xl font-bold text-primary">{result.percentage}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Understanding the Input</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg">Decimal Number</h3>
          <p className="text-muted-foreground">Enter the number you wish to convert. This can be a whole number, a positive decimal, or a negative decimal.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Converting a decimal to a percentage is a fundamental arithmetic operation. "Percent" means "per hundred," so the conversion involves multiplying the decimal value by 100.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Percentage = Decimal × 100</p>
          </div>
          <p className="mt-2 text-muted-foreground">For example, to convert 0.75 to a percentage, you calculate `0.75 * 100 = 75%`.</p>
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
            <CardTitle>The Bridge Between Decimals and Percentages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">Why This Simple Conversion Matters</h2>
            <p>Decimals and percentages are two different ways of representing the same fractional part of a whole. While mathematicians and programmers often work with decimals for calculations, percentages are more commonly used in everyday communication because they are more intuitive for most people. This calculator acts as a simple bridge between these two forms.</p>
            
            <h3 className="text-lg font-semibold text-foreground">The "Move the Decimal" Trick</h3>
            <p>The core of the conversion is multiplying by 100. A simple trick to do this mentally is to move the decimal point two places to the right.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>`0.45` becomes `45.%` -> **45%**</li>
                <li>`0.05` becomes `05.%` -> **5%**</li>
                <li>`1.25` becomes `125.%` -> **125%**</li>
                <li>`0.3` becomes `30.%` -> **30%** (add a zero if needed)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground">Where This Conversion is Used</h3>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Statistics:</strong> When a statistical model outputs a probability of 0.22, it's often communicated as a 22% chance.</li>
                <li><strong>Finance:</strong> An interest rate might be stored as 0.04 in a database but is always displayed to the user as 4%.</li>
                <li><strong>Programming:</strong> Calculations are performed using decimal representations (e.g., `price * 0.2`), but results are shown to users with a percent sign.</li>
            </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I convert a percentage back to a decimal?</AccordionTrigger>
              <AccordionContent>
                <p>You do the reverse operation: divide the percentage by 100. For example, 50% becomes `50 / 100 = 0.5`. The mental trick is to move the decimal point two places to the left.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What about whole numbers?</AccordionTrigger>
              <AccordionContent>
                <p>The rule still applies. The whole number 2 is equivalent to the decimal 2.0. Multiplying by 100 gives you 200%. This makes sense, as 2 represents two full "wholes."</p>
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
            The Decimal to Percent Converter is a fundamental utility for translating raw decimal values into the more intuitive percentage format. By simply multiplying the input by 100, this tool facilitates a crucial step in presenting data clearly and effectively in financial, statistical, and everyday contexts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
