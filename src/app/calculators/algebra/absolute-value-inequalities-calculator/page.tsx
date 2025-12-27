'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { solveAbsoluteValueInequality } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Sigma, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  a: z.coerce.number().refine(n => n !== 0, { message: 'Coefficient "a" cannot be zero.' }),
  b: z.coerce.number(),
  inequality: z.enum(['<', '<=', '>', '>=']),
  c: z.coerce.number(),
}).refine(data => {
    if (data.c < 0 && (data.inequality === '<' || data.inequality === '<=')) {
        return false;
    }
    return true;
}, {
    message: "An absolute value cannot be less than a negative number. This inequality has no solution.",
    path: ['c'],
});


type FormValues = z.infer<typeof formSchema>;

export default function AbsoluteValueInequalityCalculator() {
  const [result, setResult] = useState<ReturnType<typeof solveAbsoluteValueInequality> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { a: 1, b: 0, inequality: '<', c: '' as any },
  });

  const onSubmit = (data: FormValues) => {
    const res = solveAbsoluteValueInequality(data.a, data.b, data.inequality, data.c);
    setResult(res);
  };
  
  const c = form.watch('c');

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Absolute Value Inequality Calculator</CardTitle>
          <CardDescription>Solve inequalities of the form |ax + b| &lt; c or |ax + b| &gt; c.</CardDescription>
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
                <span className="text-2xl font-bold">|</span>
                 <FormField control={form.control} name="inequality" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Inequality</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="w-20"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="<">&lt;</SelectItem>
                                <SelectItem value="<=">&le;</SelectItem>
                                <SelectItem value=">">&gt;</SelectItem>
                                <SelectItem value=">=">&ge;</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                 )} />
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
              <p className="text-sm text-muted-foreground">The solution set for x is:</p>
              <p className="text-4xl font-bold text-primary">{result.solution}</p>
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
            <h3 className="font-semibold text-lg">Inequality Form: |ax + b| [operator] c</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
              <li><b>a, b, c</b>: The coefficients and constant of your inequality.</li>
              <li><b>Inequality Operator</b>: Choose from &lt; (less than), &le; (less than or equal to), &gt; (greater than), or &ge; (greater than or equal to).</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Solving absolute value inequalities depends on the direction of the inequality sign and the sign of the constant `c`.</p>
          <h3 className="font-semibold text-lg mt-4">Case 1: Less Than (&lt; or &le;)</h3>
          <p>An inequality of the form `|X| &lt; c` (where c &gt; 0) means that X is "less than c units away from zero". This translates to a single compound inequality:</p>
          <div className="p-4 bg-muted/50 rounded-lg mt-2 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">-c &lt; X &lt; c</p>
          </div>
          <p className="mt-2">This is an "AND" statement, representing a bounded interval.</p>
          
          <h3 className="font-semibold text-lg mt-4">Case 2: Greater Than (&gt; or &ge;)</h3>
          <p>An inequality of the form `|X| &gt; c` (where c &gt; 0) means that X is "more than c units away from zero". This splits into two separate inequalities:</p>
          <div className="p-4 bg-muted/50 rounded-lg mt-2 text-center space-y-2">
            <p className="font-mono text-sm md:text-base font-bold text-primary">X &gt; c   OR   X &lt; -c</p>
          </div>
          <p className="mt-2">This is an "OR" statement, representing two unbounded intervals going in opposite directions.</p>
          <p className="mt-2 text-muted-foreground">The calculator applies these rules by substituting `X` with `ax + b` and solving the resulting linear inequality (or inequalities) for `x`.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />In-Depth Guide to Absolute Value Inequalities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">"And" vs. "Or": The Great Divide</h2>
            <p>The most important concept in solving absolute value inequalities is knowing whether you're dealing with an "AND" situation or an "OR" situation. This is determined entirely by the inequality symbol.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>"Less Th-AND" (`<`, `≤`)</strong>: Inequalities with a "less than" sign are treated as **AND** statements. They describe values that are 'close to' zero, trapped *between* two endpoints. The solution is a single, bounded interval. Think: "less th-AND".</li>
                <li><strong>"Great-OR" (`>`, `≥`)</strong>: Inequalities with a "greater than" sign are treated as **OR** statements. They describe values that are 'far from' zero, escaping *outward* from two endpoints. The solution is two separate, unbounded intervals. Think: "great-OR".</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground">Example 1: Solving a "Less Than" Inequality</h3>
            <p>Let's solve **|2x - 3| ≤ 5**.</p>
            <ol className="list-decimal list-inside space-y-4">
                <li><strong>Identify the Type:</strong> The `≤` sign tells us this is a "Less Th-AND" problem, which will become a single compound inequality.</li>
                <li><strong>Set up the Compound Inequality:</strong> We sandwich the expression `2x - 3` between -5 and 5.
                     <div className="p-2 bg-muted/50 rounded-lg mt-2 text-center">
                        <p className="font-mono text-sm md:text-base">-5 ≤ 2x - 3 ≤ 5</p>
                    </div>
                </li>
                <li><strong>Solve for x:</strong> Perform the same operation on all three parts of the inequality to isolate x in the middle.
                    <div className="p-2 bg-muted/50 rounded-lg mt-2">
                        <p className="font-mono text-sm">-5 + 3 ≤ 2x - 3 + 3 ≤ 5 + 3   (Add 3 to all parts)</p>
                        <p className="font-mono text-sm">-2 ≤ 2x ≤ 8</p>
                        <p className="font-mono text-sm">-2 / 2 ≤ 2x / 2 ≤ 8 / 2      (Divide all parts by 2)</p>
                        <p className="font-mono text-sm font-bold">-1 ≤ x ≤ 4</p>
                    </div>
                </li>
                <li><strong>State the Solution:</strong> The solution is all numbers between -1 and 4, inclusive. In interval notation, this is `[-1, 4]`.</li>
            </ol>

            <h3 className="text-lg font-semibold text-foreground">Example 2: Solving a "Greater Than" Inequality</h3>
            <p>Now let's solve **|x + 4| &gt; 2**.</p>
            <ol className="list-decimal list-inside space-y-4">
                 <li><strong>Identify the Type:</strong> The `&gt;` sign tells us this is a "Great-OR" problem, which will split into two separate inequalities.</li>
                 <li><strong>Set up the Two Inequalities:</strong>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><b>Case 1:</b> `x + 4 &gt; 2`</li>
                        <li><b>Case 2:</b> `x + 4 &lt; -2`</li>
                    </ul>
                </li>
                <li><strong>Solve Each Inequality:</strong>
                     <div className="w-full overflow-x-auto mt-2">
                      <table className="w-full text-sm">
                        <thead className="text-left font-semibold text-foreground"><tr><th className="p-2 border-b">Case 1</th><th className="p-2 border-b">Case 2</th></tr></thead>
                        <tbody><tr><td className="p-2 font-mono align-top">x + 4 &gt; 2<br/>x &gt; -2</td><td className="p-2 font-mono align-top">x + 4 &lt; -2<br/>x &lt; -6</td></tr></tbody>
                      </table>
                    </div>
                </li>
                <li><strong>State the Solution:</strong> The solution is `x &lt; -6` OR `x &gt; -2`. This represents two distinct sets of numbers. In interval notation, this is `(-∞, -6) U (-2, ∞)`.</li>
            </ol>
            
            <h3 className="text-lg font-semibold text-foreground">Special Cases with the Constant `c`</h3>
             <div className="space-y-4">
                <Alert variant="destructive">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Less than a Negative</AlertTitle>
                  <AlertDescription>
                    `|X| &lt; -3` has **no solution**. An absolute value is always non-negative, so it can never be less than a negative number.
                  </AlertDescription>
                </Alert>
                 <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Greater than a Negative</AlertTitle>
                  <AlertDescription>
                   `|X| &gt; -3` is true for **all real numbers**. An absolute value is always non-negative (i.e., `≥ 0`), which is always greater than any negative number.
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
              <AccordionTrigger>What happens if I have to divide by a negative `a`?</AccordionTrigger>
              <AccordionContent>
                <p>When you multiply or divide all parts of an inequality by a negative number, you **must flip the direction of the inequality sign(s)**. For example, if you have `-2x &lt; 6`, dividing by -2 gives `x &gt; -3`. The calculator handles this automatically.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What's the difference between `&lt;` and `≤` in the solution?</AccordionTrigger>
              <AccordionContent>
                <p>A strict inequality (`&lt;` or `&gt;`) results in an "open" interval, meaning the endpoints are not included. This is shown with parentheses in interval notation, e.g., `(-2, 5)`. A non-strict inequality (`≤` or `≥`) results in a "closed" interval, meaning the endpoints are included. This is shown with square brackets, e.g., `[-2, 5]`.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>How are the solutions written?</AccordionTrigger>
              <AccordionContent>
                 <p>The calculator provides solutions in two common formats: standard inequality notation (e.g., `x &gt; 5`) and interval notation (e.g., `(5, ∞)`). The symbol `U` is used in interval notation to represent the "union" of two separate sets, which is how we write "OR" solutions.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Why does `|x| &lt; -5` have no solution?</AccordionTrigger>
              <AccordionContent>
                <p>The expression `|x|` represents a distance, which can only be positive or zero. It is logically impossible for a positive value or zero to be less than a negative value like -5. Therefore, no value of x can satisfy this statement.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>Why is `|x| &gt; -5` true for all real numbers?</AccordionTrigger>
              <AccordionContent>
                <p>Since `|x|` is always non-negative (0 or positive), it will always be greater than any negative number. No matter what real number you plug in for x, its absolute value will be greater than -5, making the statement universally true.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}
