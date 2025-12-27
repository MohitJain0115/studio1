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
            <p className="text-muted-foreground">These are the two percentages you want to combine. The calculator finds X percent of Y percent, which is useful for nested proportions.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>To find a percentage of a percentage, you must first convert both percentages into their decimal equivalents by dividing each by 100. Then, you multiply these two decimals together. Finally, to express the result as a percentage again, you multiply it by 100.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Result % = (Percentage1 / 100) * (Percentage2 / 100) * 100</p>
          </div>
           <p className="mt-2 text-muted-foreground">This simplifies to `(Percentage1 * Percentage2) / 100`. For example, 50% of 20% is `(50 * 20) / 100 = 1000 / 100 = 10%`.</p>
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
            <CardTitle>A Guide to Understanding Nested Proportions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">What Does "Percent of a Percent" Really Mean?</h2>
            <p>This calculation can seem abstract, but it's a common and essential tool for dealing with data that involves a **subset of a subset**. Whenever you're analyzing a proportion of a group that is already a proportion of a larger whole, you are calculating a percentage of a percentage.</p>
            
            <h3 className="text-lg font-semibold text-foreground">The Common Mistake: Accidental Addition</h3>
            <p>A frequent error when faced with this problem is to add or subtract the percentages. For instance, if a product is "20% off, plus an additional 10% off for members," it is **not** 30% off. This is a "percentage of a percentage" problem in disguise. You're taking a percentage of the already discounted price.</p>
            
            <Alert>
              <Percent className="h-4 w-4" />
              <AlertTitle>Real-World Example: Survey Data</AlertTitle>
              <AlertDescription>
                A national survey finds that **40%** of the country's population owns a dog. A follow-up survey of only the dog owners finds that **20%** of them feed their dog a raw-food diet.
              </AlertDescription>
            </Alert>
            
            <p className="mt-4">If you want to know what percentage of the **entire country's population** feeds their dog a raw-food diet, you need to calculate 20% OF 40%.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Convert to decimals: 20% becomes 0.20, and 40% becomes 0.40.</li>
                <li>Multiply the decimals: `0.20 * 0.40 = 0.08`.</li>
                <li>Convert back to a percentage: `0.08 * 100 = 8%`.</li>
            </ul>
             <p>Therefore, **8%** of the total population owns a dog and feeds it a raw-food diet. You are finding a "part of a part."</p>

            <h3 className="text-lg font-semibold text-foreground">Another Application: Cascading Financial Effects</h3>
            <p>This concept is also vital in finance. Imagine a company's revenue is 25% of the total market, and their profit margin on that revenue is 15%. To find their profit as a percentage of the total market, you would calculate 15% of 25%.</p>
            <p>`(15 * 25) / 100 = 3.75%`. The company's profit represents 3.75% of the entire market's value.</p>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[400px] text-sm mt-4">
                <caption className="caption-bottom text-xs text-muted-foreground mt-2">Table: Examples of cascading percentages.</caption>
                <thead className="text-left font-semibold text-foreground">
                  <tr>
                    <th className="p-2 border-b">Scenario</th>
                    <th className="p-2 border-b">Calculation</th>
                    <th className="p-2 border-b">Final Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">50% of 50%</td>
                    <td className="p-2 font-mono">(50 * 50) / 100</td>
                    <td className="p-2 font-bold">25%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">10% of 75%</td>
                    <td className="p-2 font-mono">(10 * 75) / 100</td>
                    <td className="p-2 font-bold">7.5%</td>
                  </tr>
                  <tr>
                    <td className="p-2">80% of a 20% market share</td>
                    <td className="p-2 font-mono">(80 * 20) / 100</td>
                    <td className="p-2 font-bold">16% of the total market</td>
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
              <AccordionTrigger>Is "50% of 20%" the same as "20% of 50%"?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. Because multiplication is commutative (`A * B = B * A`), the order does not matter. Both calculations will result in 10%.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What if I need to find the percentage of a regular number, not another percentage?</AccordionTrigger>
              <AccordionContent>
                <p>For that, you should use our <Link href="/calculators/value-percentage-calculator" className="text-primary underline">Value Percentage Calculator</Link>. This tool is specifically for finding a percentage of another percentage.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How does this relate to "percentage points"?</AccordionTrigger>
              <AccordionContent>
                <p>They are very different concepts. This calculator multiplies proportions. A percentage point calculation, found in our <Link href="/calculators/percentage-point-calculator" className="text-primary underline">Percentage Point Calculator</Link>, finds the simple arithmetic difference between two percentages (e.g., the difference between 10% and 15% is 5 percentage points).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I calculate a percentage of a percentage of another percentage?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. You can chain the calculations. For example, to find 10% of 20% of 30%, you would first calculate 20% of 30% (`(20 * 30) / 100 = 6%`). Then you would calculate 10% of that result (`(10 * 6) / 100 = 0.6%`).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Why do you divide by 100 at the end of the simplified formula?</AccordionTrigger>
              <AccordionContent>
                <p>When you multiply `Percentage1 * Percentage2`, you are multiplying the numbers directly (e.g., 50 * 20 = 1000). Since both numbers were originally percentages, you've effectively multiplied by 100 twice. The final division by 100 corrects for one of those, leaving you with the final correct percentage value.</p>
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
            The Percentage of a Percentage Calculator is a specialized tool for determining a proportion of an existing proportion, often described as finding a "part of a part." It is essential for accurately interpreting nested data, such as in survey analysis or financial reports, and for avoiding common mathematical errors like incorrectly adding percentages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
