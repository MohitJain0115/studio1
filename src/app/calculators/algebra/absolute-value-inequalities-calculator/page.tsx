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
    defaultValues: { a: 1, b: 0, inequality: '<', c: 5 },
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
              <p className="text-4xl font-bold text-primary" dangerouslySetInnerHTML={{ __html: result.solution.replace(/</g, '&lt;').replace(/>/g, '&gt;') }} />
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
          <p className="mt-2">This is an "AND" statement, representing a single bounded interval where the solution is trapped between two endpoints.</p>
          
          <h3 className="font-semibold text-lg mt-4">Case 2: Greater Than (&gt; or &ge;)</h3>
          <p>An inequality of the form `|X| &gt; c` (where c &gt; 0) means that X is "more than c units away from zero". This splits into two separate inequalities:</p>
          <div className="p-4 bg-muted/50 rounded-lg mt-2 text-center space-y-2">
            <p className="font-mono text-sm md:text-base font-bold text-primary">X &gt; c   OR   X &lt; -c</p>
          </div>
          <p className="mt-2">This is an "OR" statement, representing two unbounded intervals going in opposite directions from the endpoints.</p>
          <p className="mt-2 text-muted-foreground">The calculator applies these rules by substituting `X` with `ax + b` and solving the resulting linear inequality (or inequalities) for `x`.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />In-Depth Guide to Absolute Value Inequalities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">"And" vs. "Or": The Great Divide</h2>
            <p>The single most important concept in solving absolute value inequalities is knowing whether you're dealing with an "AND" situation or an "OR" situation. This is determined entirely by the direction of the inequality symbol relative to the absolute value expression.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>"Less Th-AND" (`&lt;`, `&le;`)</strong>: Inequalities with a "less than" or "less than or equal to" sign are treated as **AND** statements. They describe a set of values that are 'close to' zero, trapped *between* two endpoints. The solution is a single, bounded interval. A helpful mnemonic is "less th-AND".</li>
                <li><strong>"Great-OR" (`&gt;`, `&ge;`)</strong>: Inequalities with a "greater than" or "greater than or equal to" sign are treated as **OR** statements. They describe values that are 'far from' zero, escaping *outward* from two endpoints. The solution is two separate, unbounded intervals. A helpful mnemonic is "great-OR".</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground">Example 1: Solving a "Less Than" Inequality</h3>
            <p>Let's solve **|2x - 3| &le; 5**. This problem asks for all numbers `x` such that the expression `2x-3` is 5 units or less from zero.</p>
            <ol className="list-decimal list-inside space-y-4">
                <li><strong>Identify the Type:</strong> The `&le;` sign indicates a "Less Th-AND" problem. This means we will create a single compound inequality.</li>
                <li><strong>Set up the Compound Inequality:</strong> We "sandwich" the expression `2x - 3` between the negative and positive values of the constant, 5.
                     <div className="p-2 bg-muted/50 rounded-lg mt-2 text-center">
                        <p className="font-mono text-sm md:text-base">-5 &le; 2x - 3 &le; 5</p>
                    </div>
                </li>
                <li><strong>Solve for x:</strong> Our goal is to isolate `x` in the middle. To do this, we perform the same operation on all three parts of the inequality.
                    <div className="p-2 bg-muted/50 rounded-lg mt-2">
                        <p className="font-mono text-sm">-5 + 3 &le; 2x - 3 + 3 &le; 5 + 3   (Add 3 to all three parts)</p>
                        <p className="font-mono text-sm">-2 &le; 2x &le; 8</p>
                        <p className="font-mono text-sm">-2 / 2 &le; 2x / 2 &le; 8 / 2      (Divide all three parts by 2)</p>
                        <p className="font-mono text-sm font-bold">-1 &le; x &le; 4</p>
                    </div>
                </li>
                <li><strong>State the Solution:</strong> The solution is all numbers between -1 and 4, inclusive. In interval notation, this is written as `[-1, 4]`.</li>
            </ol>

            <h3 className="text-lg font-semibold text-foreground">Example 2: Solving a "Greater Than" Inequality</h3>
            <p>Now let's solve **|x + 4| &gt; 2**. This problem asks for all numbers `x` such that the expression `x+4` is more than 2 units away from zero.</p>
            <ol className="list-decimal list-inside space-y-4">
                 <li><strong>Identify the Type:</strong> The `&gt;` sign indicates a "Great-OR" problem. This means we will split it into two separate inequalities.</li>
                 <li><strong>Set up the Two Inequalities:</strong>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><b>Case 1:</b> The expression is greater than the positive value: `x + 4 &gt; 2`</li>
                        <li><b>Case 2:</b> The expression is less than the negative value: `x + 4 &lt; -2`</li>
                    </ul>
                </li>
                <li><strong>Solve Each Inequality Independently:</strong>
                     <div className="w-full overflow-x-auto mt-2">
                      <table className="w-full text-sm">
                        <thead className="text-left font-semibold text-foreground"><tr><th className="p-2 border-b">Case 1</th><th className="p-2 border-b">Case 2</th></tr></thead>
                        <tbody><tr><td className="p-2 font-mono align-top">x + 4 &gt; 2<br/>x &gt; -2</td><td className="p-2 font-mono align-top">x + 4 &lt; -2<br/>x &lt; -6</td></tr></tbody>
                      </table>
                    </div>
                </li>
                <li><strong>State the Solution:</strong> The solution is the combination of both results: `x &lt; -6` OR `x &gt; -2`. This represents two distinct sets of numbers on the number line. In interval notation, this is written as `(-∞, -6) U (-2, ∞)`.</li>
            </ol>
            
            <h3 className="text-lg font-semibold text-foreground">Special Cases with the Constant `c`</h3>
             <div className="space-y-4">
                <Alert variant="destructive">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Less than a Negative</AlertTitle>
                  <AlertDescription>
                    An inequality like `|X| &lt; -3` has **no solution**. An absolute value is, by definition, a non-negative distance. It is logically impossible for a non-negative value to be less than a negative number.
                  </AlertDescription>
                </Alert>
                 <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Greater than a Negative</AlertTitle>
                  <AlertDescription>
                   An inequality like `|X| &gt; -3` is true for **all real numbers**. Since an absolute value is always `≥ 0`, it will always be greater than any negative number, regardless of what `X` is.
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
              <AccordionTrigger>What happens if I have to multiply or divide by a negative number to solve for `x`?</AccordionTrigger>
              <AccordionContent>
                <p>This is a critical rule in all inequalities. When you multiply or divide all parts of an inequality by a negative number, you **must flip the direction of the inequality sign(s)**. For example, if you have `-2x < 6`, dividing by -2 gives `x > -3`. The calculator handles this automatically based on the sign of `a`.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What's the difference between `&lt;` and `&le;` in the solution?</AccordionTrigger>
              <AccordionContent>
                <p>A strict inequality (`<` or `>`) results in an "open" interval, meaning the endpoints are not included in the solution set. This is shown with parentheses in interval notation, e.g., `(-2, 5)`. A non-strict inequality (`≤` or `≥`) results in a "closed" interval, meaning the endpoints are included. This is shown with square brackets, e.g., `[-2, 5]`.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>How are the solutions written?</AccordionTrigger>
              <AccordionContent>
                 <p>The calculator provides solutions in standard inequality notation (e.g., `x > 5 or x < -5`) and also provides the corresponding interval notation in the explanation text. The symbol `U` is used in interval notation to represent the "union" of two separate sets, which is how we write "OR" solutions.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Why does `|x| < -5` have no solution?</AccordionTrigger>
              <AccordionContent>
                <p>The expression `|x|` represents a distance, which can only be positive or zero. It is logically impossible for a positive value or zero to be less than a negative value like -5. Therefore, no value of `x` can ever satisfy this statement.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>Why is `|x| > -5` true for all real numbers?</AccordionTrigger>
              <AccordionContent>
                <p>Since `|x|` must always be non-negative (0 or positive), it will always be greater than any negative number. No matter what real number you plug in for `x`, its absolute value will be greater than -5, making the statement universally true.</p>
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
          <p className="text-muted-foreground">The Absolute Value Inequality Calculator solves inequalities by leveraging a core principle: "less than" inequalities become bounded "AND" statements, while "greater than" inequalities split into unbounded "OR" statements. By isolating the absolute value expression and applying the correct rule based on the inequality symbol, the calculator can determine the solution set for `x`. It also correctly handles special cases involving negative constants, providing a reliable and educational tool for mastering this key algebra concept.</p>
        </CardContent>
      </Card>

    </div>
  );
}
