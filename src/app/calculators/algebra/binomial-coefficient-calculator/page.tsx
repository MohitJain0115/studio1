'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateBinomialCoefficient } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Sigma, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  n: z.coerce.number().int().min(0, "n must be a non-negative integer."),
  k: z.coerce.number().int().min(0, "k must be a non-negative integer."),
}).refine(data => data.k <= data.n, {
  message: "k cannot be greater than n.",
  path: ['k'],
});

type FormValues = z.infer<typeof formSchema>;

export default function BinomialCoefficientCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateBinomialCoefficient> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { n: '' as any, k: '' as any },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateBinomialCoefficient(data.n, data.k);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Binomial Coefficient Calculator</CardTitle>
          <CardDescription>Calculate "n choose k", the number of ways to choose k items from a set of n.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center gap-4">
                 <p className="text-2xl font-bold">(</p>
                <FormField control={form.control} name="n" render={({ field }) => (
                  <FormItem>
                    <FormLabel>n (Total Items)</FormLabel>
                    <FormControl><Input type="number" {...field} className="w-24" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="k" render={({ field }) => (
                  <FormItem>
                    <FormLabel>k (Items to Choose)</FormLabel>
                    <FormControl><Input type="number" {...field} className="w-24" /></FormControl>
                  </FormItem>
                )} />
                 <p className="text-2xl font-bold">)</p>
              </div>
              <FormMessage>{form.formState.errors.n?.message || form.formState.errors.k?.message}</FormMessage>
              <Button type="submit">Calculate C(n, k)</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-6 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">"n choose k" is</p>
              <p className="text-4xl font-bold text-primary">{result.result.toLocaleString()}</p>
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
            <h3 className="font-semibold text-lg">n (Total Items)</h3>
            <p className="text-muted-foreground">The total number of distinct items in the set you are choosing from. This must be a non-negative integer.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">k (Items to Choose)</h3>
            <p className="text-muted-foreground">The number of items you are choosing from the set. `k` must be a non-negative integer and cannot be larger than `n`.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The binomial coefficient, denoted as C(n, k), "n choose k", or `(n k)`, calculates the number of combinations possible when selecting `k` items from a larger set of `n` items, where the order of selection does not matter.</p>
          <p className="mt-2">The formula is based on factorials:</p>
          <div className="p-4 bg-muted/50 rounded-lg mt-2 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">C(n, k) = n! / (k! * (n - k)!)</p>
          </div>
          <p className="mt-2 text-muted-foreground">Where `n!` (n factorial) is the product of all positive integers up to n (e.g., `5! = 5 * 4 * 3 * 2 * 1`). This calculator computes this value, using logarithms for large numbers to maintain precision and avoid overflow errors.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />In-Depth Guide to Binomial Coefficients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">Combinations vs. Permutations</h2>
            <p>The most important concept to grasp when using the binomial coefficient is the difference between a **combination** and a **permutation**.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>A **Combination** is a selection of items where the order **does not matter**. `C(n, k)` calculates combinations.</li>
                <li>A **Permutation** is a selection of items where the order **does matter**.</li>
            </ul>
            <p>Think about a lottery. If the winning numbers are 5, 12, and 23, it doesn't matter if your ticket says `5-12-23` or `23-5-12`. You still win. This is a combination. However, the passcode to a safe, `5-1-2`, is very different from `2-1-5`. This is a permutation.</p>
            <p>The binomial coefficient specifically answers the "combination" question: how many distinct groups can be formed?</p>

            <h3 className="text-lg font-semibold text-foreground">Real-World Examples</h3>
            <p>Let's see how "n choose k" applies in various scenarios:</p>
            <div className="w-full overflow-x-auto mt-2">
              <table className="w-full text-sm">
                <thead className="text-left font-semibold text-foreground"><tr><th className="p-2 border-b">Scenario</th><th className="p-2 border-b">n</th><th className="p-2 border-b">k</th><th className="p-2 border-b">Calculation `C(n, k)`</th><th className="p-2 border-b">Result</th></tr></thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Picking a 3-person committee from 10 people.</td><td className="p-2">10</td><td className="p-2">3</td><td className="p-2">10! / (3! * 7!)</td><td className="p-2">120 ways</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Choosing 2 pizza toppings from 8 options.</td><td className="p-2">8</td><td className="p-2">2</td><td className="p-2">8! / (2! * 6!)</td><td className="p-2">28 different pizzas</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Dealing a 5-card poker hand from a 52-card deck.</td><td className="p-2">52</td><td className="p-2">5</td><td className="p-2">52! / (5! * 47!)</td><td className="p-2">2,598,960 possible hands</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-foreground">Connection to the Binomial Theorem</h3>
            <p>The name "binomial coefficient" comes from its central role in the **Binomial Theorem**, which describes the algebraic expansion of powers of a binomial `(x + y)^n`.</p>
            <p>The theorem states:</p>
            <div className="p-4 bg-muted/50 rounded-lg mt-2 text-center font-mono text-sm md:text-base">(x + y)ⁿ = Σ [C(n, k) * x^(n-k) * y^k]</div>
            <p>This means that the coefficients of the terms in the expanded polynomial are precisely the binomial coefficients. For example, let's expand `(x+y)^3`:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>The coefficient for `x^3y^0` is C(3, 0) = 1.</li>
                <li>The coefficient for `x^2y^1` is C(3, 1) = 3.</li>
                <li>The coefficient for `x^1y^2` is C(3, 2) = 3.</li>
                <li>The coefficient for `x^0y^3` is C(3, 3) = 1.</li>
            </ul>
            <p>So, `(x+y)^3 = 1x^3 + 3x^2y + 3xy^2 + 1y^3`.</p>
            
            <h3 className="text-lg font-semibold text-foreground">Pascal's Triangle</h3>
            <p>The binomial coefficients also form the famous pattern known as Pascal's Triangle. Each number in the triangle is the sum of the two numbers directly above it. The `n`-th row of the triangle contains the values of `C(n, k)` for `k = 0, 1, 2, ..., n`.</p>
            <pre className="p-4 bg-muted/50 rounded-lg mt-2 text-center font-mono text-sm">
              Row 0:   1             (C(0,0))
              Row 1:  1 1            (C(1,0), C(1,1))
              Row 2: 1 2 1           (C(2,0), C(2,1), C(2,2))
              Row 3: 1 3 3 1          (C(3,0), C(3,1), C(3,2), C(3,3))
              Row 4: 1 4 6 4 1         (C(4,0)...C(4,4))
            </pre>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What does `0!` (zero factorial) equal?</AccordionTrigger>
              <AccordionContent>
                <p>By definition, `0!` is equal to 1. This might seem strange, but it's a necessary convention for many mathematical formulas, including the binomial coefficient, to work correctly. It represents the single way to arrange zero objects.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why is C(n, k) equal to C(n, n-k)?</AccordionTrigger>
              <AccordionContent>
                <p>This is a fundamental symmetry of combinations. Choosing `k` items to take from a set of `n` is the exact same process as choosing `n-k` items to leave behind. For example, the number of ways to choose a 3-person team from 10 people (C(10,3)) is the same as the number of ways to choose 7 people to *not* be on the team (C(10,7)). Both equal 120.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What is C(n, 0)?</AccordionTrigger>
              <AccordionContent>
                <p>C(n, 0) is always 1. There is only one way to choose zero items from a set: by choosing nothing.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>What is C(n, n)?</AccordionTrigger>
              <AccordionContent>
                <p>C(n, n) is always 1. There is only one way to choose all n items from a set: by taking everything.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>What is the difference between this and probability?</AccordionTrigger>
              <AccordionContent>
                <p>The binomial coefficient calculates the number of *ways* something can happen (a count of outcomes). Probability calculates the *likelihood* that one of those ways will occur, expressed as a ratio. For example, C(52, 5) tells you there are 2,598,960 possible poker hands. The probability of getting one specific hand (like a Royal Flush) is 4 / 2,598,960, as there are 4 suits.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}

    