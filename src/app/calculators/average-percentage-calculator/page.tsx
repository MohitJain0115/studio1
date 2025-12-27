'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateAveragePercentage } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { HelpCircle, Percent, Sigma, BarChart, FileJson } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from 'recharts';

const formSchema = z.object({
  percentages: z.string().min(1, 'Please enter at least one percentage value.')
    .refine(s => s.split(',').every(v => !isNaN(parseFloat(v))), 'All values must be valid numbers.'),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators: { name: string; href: string }[] = [
    { name: 'Comparative Difference', href: '/calculators/comparative-difference-calculator' },
    { name: 'Compounding Increase', href: '/calculators/compounding-increase-calculator' },
    { name: 'Decimal to Percent Converter', href: '/calculators/decimal-to-percent-converter' },
    { name: 'Doubling Time', href: '/calculators/doubling-time-calculator' },
    { name: 'Fraction to Percent', href: '/calculators/fraction-to-percent-calculator' },
    { name: 'Fuel Cost', href: '/calculators/fuel-cost-calculator' },
    { name: 'Historic Change', href: '/calculators/historic-change-calculator' },
    { name: 'Investment Growth', href: '/calculators/investment-growth-calculator' },
    { name: 'Percentage of a Percentage', href: '/calculators/percentage-of-a-percentage-calculator' },
    { name: 'Percentage Point', href: '/calculators/percentage-point-calculator' },
    { name: 'Value Percentage', href: '/calculators/value-percentage-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
  average: {
    label: "Average",
    color: "hsl(var(--accent))",
  }
} satisfies ChartConfig;

export default function AveragePercentageCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateAveragePercentage> | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { percentages: '' },
  });

  const onSubmit = (data: FormValues) => {
    const numbers = data.percentages.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (numbers.length > 0) {
      const res = calculateAveragePercentage(numbers);
      setResult(res);
      const newChartData = numbers.map((val, index) => ({ name: `Value ${index + 1}`, value: val, average: parseFloat(res.average) }));
      setChartData(newChartData);
    } else {
      setResult(null);
      setChartData([]);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Average Percentage Calculator</CardTitle>
          <CardDescription>Calculate the simple arithmetic average of a series of percentages.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="percentages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentages (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10, 25, 15.5, 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Calculate Average</Button>
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
              <p className="text-sm text-muted-foreground">Average Percentage</p>
              <p className="text-4xl font-bold text-primary">{result.average}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      {chartData.length > 0 && result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" />Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <RechartsBarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis unit="%" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
             <p className="text-center text-sm text-muted-foreground mt-2">The chart shows your input values compared to the calculated average of {result.average}%.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Understanding the Input</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg">Percentages</h3>
          <p className="text-muted-foreground">Enter a list of numbers representing the percentages you want to average. Separate each number with a comma. For example: `10, 20, 30`.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculator finds the arithmetic mean. This is the most common type of average. It's calculated by summing all the percentage values and then dividing by the count of those values.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Average = (Sum of Percentages) / (Count of Percentages)</p>
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
            <CardTitle>The Nuance of Averaging Percentages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">When a Simple Average is (and Isn't) Enough</h2>
            <p>This calculator computes a simple, unweighted arithmetic mean. This is perfect for many situations, but it's crucial to understand when this method is appropriate and when it might be misleading.</p>
            
            <h3 className="text-lg font-semibold text-foreground">When to Use a Simple Average</h3>
            <p>Use a simple average when all the percentages you are averaging correspond to groups of the same size. In this case, each percentage carries equal weight.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Example:</strong> You have three classrooms, each with 30 students. The test pass rates were 80%, 90%, and 85%. Since each class has the same number of students, the average pass rate for all students is simply `(80 + 90 + 85) / 3 = 85%`.</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground">When a Simple Average is Misleading (The Simpson's Paradox)</h3>
            <p>You should NOT use a simple average when the percentages relate to groups of different sizes. This is a common statistical trap. In this scenario, you need a weighted average to get an accurate picture.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Example:</strong> You have two classrooms. Class A has 10 students and a pass rate of 50% (5 students passed). Class B has 90 students and a pass rate of 90% (81 students passed).
                <br/>A simple average would misleadingly suggest an average pass rate of `(50 + 90) / 2 = 70%`.
                <br/>The correct method is a weighted average: Find the total number of students who passed (5 + 81 = 86) and divide by the total number of students (10 + 90 = 100). The true average pass rate is `86 / 100 = 86%`.
                </li>
            </ul>
            <p>The simple average gave too much importance to the small class's low score, while the weighted average correctly reflects that the vast majority of students were in the high-performing class.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is this calculator finding the mean, median, or mode?</AccordionTrigger>
              <AccordionContent>
                <p>It calculates the **mean**. The mean is the sum of all values divided by the number of values. The median is the middle value in a sorted list, and the mode is the value that appears most often. This tool only calculates the mean.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What if I enter negative percentages?</AccordionTrigger>
              <AccordionContent>
                <p>The calculator will work correctly. A negative percentage simply represents a decrease or a negative value. It will be included in the sum just like any other number. For example, the average of 10, -5, and 20 is `(10 - 5 + 20) / 3 = 8.33%`.</p>
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
            The Average Percentage Calculator provides a quick way to find the arithmetic mean of a series of percentage values. It's a fundamental tool for finding a central tendency in data, but it's most accurate when all the percentages are drawn from groups of equal size.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
