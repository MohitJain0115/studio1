'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { solveAbsoluteValueEquation } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { HelpCircle, Sigma, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  a: z.coerce.number().refine(n => n !== 0, { message: 'Coefficient "a" cannot be zero.' }),
  b: z.coerce.number(),
  c: z.coerce.number().min(0, 'Value "c" must be non-negative.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AbsoluteValueEquationCalculator() {
  const [result, setResult] = useState<ReturnType<typeof solveAbsoluteValueEquation> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { a: 1, b: 0, c: undefined },
  });

  const onSubmit = (data: FormValues) => {
    const res = solveAbsoluteValueEquation(data.a, data.b, data.c);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Absolute Value Equation Calculator</CardTitle>
          <CardDescription>Solve absolute value equations of the form |ax + b| = c.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">|</span>
                <FormField control={form.control} name="a" render={({ field }) => (
                  <FormItem>
                    <FormLabel>a</FormLabel>
                    <FormControl><Input type="number" {...field} className="w-20" /></FormControl>
                  </FormItem>
                )} />
                <span className="text-2xl font-bold">x +</span>
                <FormField control={form.control} name="b" render={({ field }) => (
                  <FormItem>
                    <FormLabel>b</FormLabel>
                    <FormControl><Input type="number" {...field} className="w-20" /></FormControl>
                  </FormItem>
                )} />
                <span className="text-2xl font-bold">| =</span>
                <FormField control={form.control} name="c" render={({ field }) => (
                  <FormItem>
                    <FormLabel>c</FormLabel>
                    <FormControl><Input type="number" {...field} className="w-20" /></FormControl>
                  </FormItem>
                )} />
              </div>
               <FormMessage>{form.formState.errors.a?.message || form.formState.errors.c?.message}</FormMessage>
              <Button type="submit">Solve for x</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Solution</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-6 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">The solutions for x are:</p>
              <p className="text-4xl font-bold text-primary">{result.solutions.join(' and ')}</p>
            </div>
             <p className="text-muted-foreground mt-4">{result.explanation}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Understanding the Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Equation Form: |ax + b| = c</h3>
            <p className="text-muted-foreground">This calculator solves equations where an absolute value expression is equal to a constant.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
              <li><b>a</b>: The coefficient of x inside the absolute value. It cannot be zero.</li>
              <li><b>b</b>: The constant term inside the absolute value.</li>
              <li><b>c</b>: The constant on the other side of the equation. It must be zero or positive, because the result of an absolute value cannot be negative.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The core principle of solving an absolute value equation is to recognize that the expression inside the absolute value bars can be either positive or negative. The absolute value of a number represents its distance from zero on the number line, which is always a non-negative value.</p>
          <p className="mt-2">An equation of the form `|X| = c`, where `c ≥ 0`, splits into two separate linear equations:</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">1. X = c</p>
            <p className="font-mono text-sm md:text-base font-bold text-primary">2. X = -c</p>
          </div>
          <p className="mt-2">For the equation `|ax + b| = c`, we substitute `X` with `ax + b` to get our two cases:</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base"><b>Case 1:</b> ax + b = c  =&gt;  ax = c - b  =&gt;  x = (c - b) / a</p>
            <p className="font-mono text-sm md:text-base"><b>Case 2:</b> ax + b = -c =&gt;  ax = -c - b =&gt;  x = (-c - b) / a</p>
          </div>
          <p className="mt-2 text-muted-foreground">The calculator solves for `x` in both of these equations to find the two possible solutions.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />In-Depth Guide to Absolute Value Equations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">What is Absolute Value?</h2>
            <p>Before solving the equations, it's crucial to understand what "absolute value" means. The absolute value of a number is its distance from zero on a number line. Because distance is always positive (or zero), the absolute value of any number is always non-negative.</p>
            <p>We denote the absolute value of a number `x` with vertical bars: `|x|`.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>If `x` is positive or zero (e.g., 5), its absolute value is itself: `|5| = 5`.</li>
                <li>If `x` is negative (e.g., -5), its absolute value is its positive counterpart: `|-5| = 5`.</li>
            </ul>
            <p>This simple concept is the key to why absolute value equations typically have two solutions. If we have the equation `|x| = 3`, we are asking: "Which numbers are 3 units away from zero?" The answer is both 3 and -3. This is the fundamental idea that allows us to split the equation into two cases.</p>

            <h3 className="text-lg font-semibold text-foreground">Step-by-Step Solving Process</h3>
            <p>Let's walk through a concrete example: **|2x - 1| = 7**.</p>
            <ol className="list-decimal list-inside space-y-4">
                <li>
                    <strong>Isolate the Absolute Value Expression:</strong> In this case, the absolute value term `|2x - 1|` is already by itself on one side of the equation. If it wasn't (e.g., `3|2x - 1| + 4 = 25`), our first job would be to use standard algebra to isolate it:
                    <div className="p-2 bg-muted/50 rounded-lg space-y-1 mt-2">
                        <p className="font-mono text-sm">3|2x - 1| = 21</p>
                        <p className="font-mono text-sm">|2x - 1| = 7</p>
                    </div>
                </li>
                <li>
                    <strong>Check the Constant:</strong> The value on the other side of the equation is 7. Since 7 is a non-negative number, we can proceed. If it were negative (e.g., `|2x - 1| = -7`), there would be **no solution**, because an absolute value can never produce a negative result.
                </li>
                <li>
                    <strong>Split into Two Equations:</strong> This is the most important step. We create two separate linear equations, one where the inside expression equals the positive value, and one where it equals the negative value.
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><b>Case 1 (Positive):</b> `2x - 1 = 7`</li>
                        <li><b>Case 2 (Negative):</b> `2x - 1 = -7`</li>
                    </ul>
                </li>
                <li>
                    <strong>Solve Each Equation for x:</strong>
                    <div className="w-full overflow-x-auto mt-2">
                      <table className="w-full min-w-[500px] text-sm">
                        <thead className="text-left font-semibold text-foreground">
                          <tr>
                            <th className="p-2 border-b">Case 1: `2x - 1 = 7`</th>
                            <th className="p-2 border-b">Case 2: `2x - 1 = -7`</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2 font-mono align-top">2x = 7 + 1<br/>2x = 8<br/>x = 4</td>
                            <td className="p-2 font-mono align-top">2x = -7 + 1<br/>2x = -6<br/>x = -3</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                </li>
                <li>
                    <strong>State the Solution:</strong> The solutions are x = 4 and x = -3. You can verify these by plugging them back into the original equation:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>`|2(4) - 1| = |8 - 1| = |7| = 7`. Correct.</li>
                        <li>`|2(-3) - 1| = |-6 - 1| = |-7| = 7`. Correct.</li>
                    </ul>
                </li>
            </ol>
            
            <h3 className="text-lg font-semibold text-foreground">Special Cases</h3>
            <div className="space-y-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Case 1: Equation equals zero</AlertTitle>
                  <AlertDescription>
                    If you have an equation like `|4x + 8| = 0`, there is only one case to solve, because +0 and -0 are the same.
                    <br/><span className="font-mono">4x + 8 = 0  =&gt;  4x = -8  =&gt;  x = -2</span>.
                    There is only one solution.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Case 2: Equation equals a negative number</AlertTitle>
                  <AlertDescription>
                    If you have an equation like `|x - 5| = -3`, you should immediately recognize that there is **no solution**. The absolute value expression `|x - 5|` must always produce a result that is zero or positive. It can never equal -3.
                  </AlertDescription>
                </Alert>
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
              <AccordionTrigger>Why are there usually two solutions?</AccordionTrigger>
              <AccordionContent>
                <p>Because absolute value represents distance from zero, there are two numbers that have the same positive distance. For example, both 5 and -5 are 5 units away from 0. So, `|x| = 5` has two solutions. This "two-ness" carries over when the expression inside the absolute value is more complex.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can there ever be only one solution?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. This occurs when the absolute value expression is equal to zero. For example, `|2x - 6| = 0`. Since 0 is its own negative, the two cases (`2x - 6 = 0` and `2x - 6 = -0`) are identical, leading to a single solution (x = 3).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can there be no solution?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. If, after isolating the absolute value expression, it is equal to a negative number (e.g., `|x + 1| = -4`), there is no solution. The absolute value of any number cannot be negative, so it's a logical impossibility.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What if there is an x term outside the absolute value bars?</AccordionTrigger>
              <AccordionContent>
                <p>This calculator is not designed for equations like `|x + 2| = 3x - 4`. These are more complex because the value `c` (in this case `3x - 4`) can be positive or negative depending on `x`. When solving these, you must still split into two cases, but you have to check your final solutions to make sure they don't produce a negative result on the side of the equation without the absolute value bars. This is called checking for "extraneous solutions."</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>How do I solve an equation with two absolute values, like `|x + 1| = |2x - 3|`?</AccordionTrigger>
              <AccordionContent>
                <p>For an equation `|A| = |B|`, you still split it into two cases. The logic is that either the contents are identical or they are opposites. So you solve: (1) `A = B` and (2) `A = -B`. For the example, you would solve `x + 1 = 2x - 3` and `x + 1 = -(2x - 3)`.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}
