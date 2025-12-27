'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculatePercentError } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { HelpCircle, Thermometer, Sigma } from 'lucide-react';

const formSchema = z.object({
  observedValue: z.coerce.number(),
  trueValue: z.coerce.number().refine(n => n !== 0, 'True value cannot be zero.'),
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
    { name: 'Percent to Goal', href: '/calculators/percent-to-goal-calculator' },
    { name: 'Relative Change', href: '/calculators/relative-change-calculator' },
    { name: 'Slope Percentage', href: '/calculators/slope-percentage-calculator' },
    { name: 'Time Percentage', href: '/calculators/time-percentage-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));

export default function PercentErrorCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculatePercentError> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { observedValue: undefined, trueValue: undefined },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculatePercentError(data.observedValue, data.trueValue);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Percent Error Calculator</CardTitle>
          <CardDescription>Calculate the percentage error between an observed value and a true value.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="observedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observed Value</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 9.8" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trueValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>True Value</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Calculate Percent Error</Button>
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
              <p className="text-sm text-muted-foreground">Percent Error</p>
              <p className="text-4xl font-bold text-primary">{result.error}%</p>
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
            <h3 className="font-semibold text-lg">Observed Value</h3>
            <p className="text-muted-foreground">This is the value that was measured or obtained through experimentation. It is also known as the experimental value.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">True Value</h3>
            <p className="text-muted-foreground">This is the theoretical, accepted, or actual value of the quantity being measured. It serves as the benchmark against which the observed value is compared.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Percent error is a measure of how inaccurate a measurement is, relative to the correct value. It is calculated by finding the absolute difference between the observed and true values, dividing by the true value, and multiplying by 100.</p>
          <div className="p-4 bg-muted/50 rounded-lg mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Percent Error = (|Observed Value - True Value| / True Value) × 100</p>
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
          <CardTitle>In-Depth Guide to Percent Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">Understanding Precision vs. Accuracy</h2>
          <p>In scientific and technical fields, it's crucial to understand the difference between precision and accuracy. Percent error is a direct measure of **accuracy**.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>**Accuracy** refers to how close a measured value is to the true or accepted value. A low percent error indicates high accuracy.</li>
            <li>**Precision** refers to how close multiple measurements of the same quantity are to each other. You can be very precise but inaccurate if your measuring instrument is calibrated incorrectly.</li>
          </ul>
          <p>For example, if you measure the length of a 10.0 cm rod three times and get 9.5 cm, 9.5 cm, and 9.5 cm, your measurements are precise but not accurate. The percent error for each would be `(|9.5 - 10.0| / 10.0) * 100 = 5%`.</p>

          <h2 className="text-xl font-bold text-foreground">Interpreting Percent Error</h2>
          <p>The percent error value tells you the magnitude of the error as a percentage of the true value. A smaller percent error is always better, as it signifies that your experimental result is closer to the true value. What constitutes an "acceptable" percent error depends heavily on the context:</p>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left font-semibold text-foreground">
                <tr>
                  <th className="p-2 border-b">Field</th>
                  <th className="p-2 border-b">Typical Acceptable Error</th>
                  <th className="p-2 border-b">Reasoning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 align-top">High School Chemistry</td>
                  <td className="p-2 align-top">5-10%</td>
                  <td className="p-2 align-top">Accounts for less precise equipment and basic experimental techniques.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 align-top">University Physics</td>
                  <td className="p-2 align-top">1-5%</td>
                  <td className="p-2 align-top">More sophisticated equipment and methods allow for greater accuracy.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 align-top">Pharmaceutical Manufacturing</td>
                  <td className="p-2 align-top">< 0.1%</td>
                  <td className="p-2 align-top">Extremely high accuracy is required for safety and efficacy of medications.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 align-top">Economic Forecasting</td>
                  <td className="p-2 align-top">> 10%</td>
                  <td className="p-2 align-top">Highly complex systems with many variables make high accuracy very difficult to achieve.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-foreground">Sources of Error</h2>
          <p>Understanding where errors come from is key to improving experimental results. Errors are typically classified into two types:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Systematic Errors:</strong> These are consistent, repeatable errors that are usually caused by a problem with the measuring instrument or the experimental design. For example, a scale that is not zeroed correctly will consistently give readings that are too high or too low. Systematic errors affect the accuracy of a measurement.</li>
            <li><strong>Random Errors:</strong> These are unpredictable fluctuations in the measurements. They can be caused by limitations of the instrument, environmental factors, or slight variations in how the experimenter reads the measurement. Taking multiple measurements and averaging them can help reduce the effect of random errors. Random errors affect the precision of a measurement.</li>
          </ol>
          <p>Percent error primarily quantifies the impact of systematic errors, as it measures the deviation from a known true value.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Can percent error be negative?</AccordionTrigger>
              <AccordionContent>
                <p>No. By using the absolute value of the difference in the numerator, percent error is always expressed as a positive value. It measures the magnitude of the error, not its direction.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What's the difference between percent error and percent change?</AccordionTrigger>
              <AccordionContent>
                <p>Percent error compares an experimental value to a known, true value. Percent change (or percent difference) compares two experimental values to each other, often to see how a quantity has changed over time. The key difference is the reference point: percent error uses the 'true' value as its reference, while percent change uses the 'old' or 'initial' value.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What if I don't know the true value?</AccordionTrigger>
              <AccordionContent>
                <p>If there is no known true or accepted value, you cannot calculate the percent error. In such cases, you might analyze the precision of your data by calculating the standard deviation of multiple measurements, or you might compare your results to another experimental value using a percent difference calculation.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Why is the true value in the denominator?</AccordionTrigger>
              <AccordionContent>
                <p>The true value is used as the denominator because it is the benchmark against which we are measuring our accuracy. The error is expressed as a fraction of this correct value to standardize the comparison. Dividing by the observed value would be illogical, as the observed value is the one we suspect of being inaccurate.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What does a large percent error mean?</AccordionTrigger>
              <AccordionContent>
                <p>A large percent error indicates low accuracy. It suggests that your measured value is far from the true value. This could be due to significant systematic errors in your experimental setup, a faulty instrument, or incorrect procedure. It's a signal that the results of the experiment may not be reliable and that the method should be reviewed.</p>
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
            The Percent Error Calculator is a fundamental tool in scientific and engineering fields for quantifying the accuracy of a measurement. By comparing an observed (experimental) value to a true (accepted) value, it provides a clear, standardized measure of how much the measurement deviates from the correct result. This is crucial for validating experimental methods, assessing the quality of data, and understanding the sources of error in any measurement process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
