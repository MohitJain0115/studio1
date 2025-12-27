'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateDoublingTime } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { HelpCircle, Percent, TrendingUp, Sigma, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  growthRate: z.coerce.number().positive('Growth rate must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators: { name: string; href: string }[] = [
    { name: 'Average Percentage', href: '/calculators/average-percentage-calculator' },
    { name: 'Comparative Difference', href: '/calculators/comparative-difference-calculator' },
    { name: 'Compounding Increase', href: '/calculators/compounding-increase-calculator' },
    { name: 'Fraction to Percent', href: '/calculators/fraction-to-percent-calculator' },
    { name: 'Fuel Cost', href: '/calculators/fuel-cost-calculator' },
    { name: 'Historic Change', href: '/calculators/historic-change-calculator' },
    { name: 'Investment Growth', href: '/calculators/investment-growth-calculator' },
    { name: 'Percentage of a Percentage', href: '/calculators/percentage-of-a-percentage-calculator' },
    { name: 'Percentage Point', href: '/calculators/percentage-point-calculator' },
    { name: 'Value Percentage', href: '/calculators/value-percentage-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));

export default function DoublingTimeCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateDoublingTime> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { growthRate: undefined },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateDoublingTime(data.growthRate);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Doubling Time Calculator</CardTitle>
          <CardDescription>Estimate how long it will take for a quantity to double at a constant growth rate.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="growthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Growth Rate (%) per Period</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 7" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Calculate Doubling Time</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Calculation Result</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="p-6 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Exact Doubling Time</p>
              <p className="text-4xl font-bold text-primary">{result.exactTime} periods</p>
            </div>
            <div className="p-6 bg-accent/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Rule of 72 Estimate</p>
              <p className="text-4xl font-bold text-accent">{result.ruleOf72Time} periods</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Understanding the Input</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg">Growth Rate (%) per Period</h3>
          <p className="text-muted-foreground">This is the constant percentage increase that occurs in each time period. For example, a 7% annual return on an investment, or a 2% annual population growth.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This calculator provides two methods for estimating doubling time:</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-4 mt-4">
            <div>
              <h4 className="font-semibold text-primary">Exact Formula (using Logarithms)</h4>
              <p className="font-mono text-sm md:text-base">Time = ln(2) / ln(1 + (Rate / 100))</p>
              <p className="mt-1 text-sm text-muted-foreground">This formula provides the precise number of periods required for a quantity to double with compound growth.</p>
            </div>
            <hr />
            <div>
              <h4 className="font-semibold text-accent">Rule of 72 (Approximation)</h4>
              <p className="font-mono text-sm md:text-base">Time ≈ 72 / Rate</p>
              <p className="mt-1 text-sm text-muted-foreground">This is a famous mental math shortcut for quickly estimating doubling time. It is most accurate for growth rates between 6% and 10%.</p>
            </div>
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
            <CardTitle>The Magic of Exponential Growth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">Grasping the Power of Doubling</h2>
            <p>Doubling time is a concept that vividly illustrates the power of exponential growth. It answers a simple but profound question: how long until this thing gets twice as big? The answer is often surprisingly short, which is why understanding doubling time is crucial in finance, demography, and science.</p>
            
            <h3 className="text-lg font-semibold text-foreground">The Rule of 72: A Powerful Mental Tool</h3>
            <p>The "Rule of 72" is one of the most useful shortcuts in all of finance. It allows for a remarkably accurate, back-of-the-napkin calculation of how long an investment will take to double. By simply dividing 72 by the annual interest rate, you get a close estimate.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>An investment earning **8%** per year will double in approximately `72 / 8 = 9` years.</li>
                <li>If inflation is **3%** per year, the cost of goods will double in `72 / 3 = 24` years.</li>
            </ul>
            <p>As you can see from the calculator results, this rule is not perfect, but it's incredibly effective for quick decision-making and for understanding the long-term impact of a growth rate.</p>

            <h3 className="text-lg font-semibold text-foreground">Applications Beyond Finance</h3>
            <p>The concept of doubling time is not limited to money:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Population Growth:</strong> Demographers use it to project how long it will take for a country's population to double, which has massive implications for infrastructure and resources.</li>
                <li><strong>Technology (Moore's Law):</strong> The famous observation that the number of transistors on a microchip doubles approximately every two years is a classic example of doubling time in technology.</li>
                <li><strong>Epidemiology:</strong> During a pandemic, the doubling time of cases is a critical metric for public health officials to gauge the speed of transmission.</li>
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
              <AccordionTrigger>Why does the Rule of 72 work?</AccordionTrigger>
              <AccordionContent>
                <p>It's an approximation based on the properties of natural logarithms. The number 72 is a convenient choice because it has many small divisors (2, 3, 4, 6, 8, 9, 12), making mental division easy for a wide range of common interest rates. The exact number is closer to 69.3, but 72 provides better accuracy for the rates typically encountered in finance.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What does "period" mean?</AccordionTrigger>
              <AccordionContent>
                <p>A period is the unit of time over which the growth rate is applied. If you enter an annual growth rate (e.g., 8% per year), the doubling time will be in years. If you enter a monthly growth rate (e.g., 1% per month), the doubling time will be in months.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>Does the initial amount matter?</AccordionTrigger>
              <AccordionContent>
                <p>No. With a constant percentage growth rate, the time it takes for a quantity to double is independent of the starting amount. It takes just as long for $100 to grow to $200 as it does for $1 million to grow to $2 million at the same rate.</p>
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
            The Doubling Time Calculator is a powerful tool for understanding the impact of exponential growth. By providing both the precise mathematical answer and the quick "Rule of 72" estimate, it helps you grasp how quickly a steadily growing quantity can double, a key concept for financial planning, investment analysis, and understanding natural phenomena.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
