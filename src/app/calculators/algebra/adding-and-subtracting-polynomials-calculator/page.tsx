'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addSubtractPolynomials } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HelpCircle, Sigma, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  poly1: z.string().min(1, 'Please enter the first polynomial.'),
  poly2: z.string().min(1, 'Please enter the second polynomial.'),
  operation: z.enum(['add', 'subtract']),
});

type FormValues = z.infer<typeof formSchema>;

export default function PolynomialCalculator() {
  const [result, setResult] = useState<ReturnType<typeof addSubtractPolynomials> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { poly1: '3x^2 + 2x - 5', poly2: 'x^2 - 7x + 2', operation: 'add' },
  });

  const onSubmit = (data: FormValues) => {
    try {
        const res = addSubtractPolynomials(data.poly1, data.poly2, data.operation);
        setResult(res);
        form.clearErrors();
    } catch (error: any) {
        form.setError('root.serverError', { type: 'custom', message: error.message });
        setResult(null);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Adding and Subtracting Polynomials Calculator</CardTitle>
          <CardDescription>Perform addition and subtraction on two polynomials.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="poly1" render={({ field }) => (
                <FormItem>
                  <FormLabel>First Polynomial</FormLabel>
                  <FormControl><Input placeholder="e.g., 3x^2 + 2x - 5" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="operation" render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Operation</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="add" /></FormControl><FormLabel className="font-normal">Add (+)</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="subtract" /></FormControl><FormLabel className="font-normal">Subtract (-)</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="poly2" render={({ field }) => (
                <FormItem>
                  <FormLabel>Second Polynomial</FormLabel>
                  <FormControl><Input placeholder="e.g., x^2 - 7x + 2" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {form.formState.errors.root?.serverError && <FormMessage>{form.formState.errors.root.serverError.message}</FormMessage>}
              <Button type="submit">Calculate</Button>
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
              <p className="text-sm text-muted-foreground">The resulting polynomial is:</p>
              <p className="text-3xl font-bold text-primary">{result.result}</p>
            </div>
            {result.steps && (
                <div className="mt-4 text-left">
                    <h3 className="font-semibold text-lg">Steps:</h3>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-2 text-sm text-muted-foreground">
                        {result.steps.map((step, index) => <p key={index} className="font-mono">{step}</p>)}
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Input Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">Enter polynomials using standard algebraic notation:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Use `x` as the variable. Other variables are not supported.</li>
                <li>Use `^` to denote exponents (e.g., `x^2` for x-squared).</li>
                <li>Terms should be separated by `+` or `-`.</li>
                <li>Coefficients come before the variable (e.g., `3x`). A variable with no coefficient is assumed to have a coefficient of 1 (e.g., `x` is `1x`, `-x` is `-1x`).</li>
                <li>Constants are just numbers (e.g., `5`, `-10`).</li>
                <li>Spaces are optional. `3x^2+2x-1` is the same as `3x^2 + 2x - 1`.</li>
            </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Adding and subtracting polynomials involves one fundamental operation: combining **like terms**. Like terms are terms that have the same variable raised to the exact same power.</p>
          <h3 className="font-semibold text-lg mt-4">Addition</h3>
          <p>To add polynomials, you simply identify the like terms from each polynomial and add their coefficients. For example, to add `(3x^2 + 4x)` and `(2x^2 - x)`, you would add the coefficients of the `x^2` terms `(3+2)` and the `x` terms `(4-1)` separately to get `5x^2 + 3x`.</p>
          <h3 className="font-semibold text-lg mt-4">Subtraction</h3>
          <p>To subtract one polynomial from another, you first distribute the negative sign to every term in the second polynomial. This flips the sign of each term. After this, the process is identical to addition: combine the like terms. For example, `(3x^2) - (2x^2 - x)` becomes `3x^2 - 2x^2 + x`, which simplifies to `x^2 + x`.</p>
           <p className="mt-2 text-muted-foreground">The calculator automates this by parsing the input strings, creating a map of exponents and their coefficients for each polynomial, performing the chosen operation on the coefficients of like terms, and then formatting the resulting map back into a standard polynomial string.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />In-Depth Guide to Polynomial Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">What is a Polynomial?</h2>
            <p>A polynomial is an algebraic expression made up of variables and coefficients, involving only the operations of addition, subtraction, multiplication, and non-negative integer exponents. The term "polynomial" comes from "poly-" (meaning "many") and "-nomial" (meaning "term"), so it's literally an expression with "many terms."</p>
            <p>A single term in a polynomial, called a monomial, looks like `ax^k`, where:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>`a` is the **coefficient** (a constant number that multiplies the variable).</li>
                <li>`x` is the **variable**.</li>
                <li>`k` is the **exponent** or **degree** (a non-negative integer like 0, 1, 2, ...).</li>
            </ul>
            <p>Examples of polynomials include `5x^2 - 2x + 1` (a trinomial), `x^3 + 4` (a binomial), and `7x` (a monomial).</p>
            
            <h3 className="text-lg font-semibold text-foreground">The Key Concept: Like Terms</h3>
            <p>The entire foundation of adding and subtracting polynomials rests on the concept of **like terms**. You can only combine terms that are "alike." In algebra, this has a very specific meaning: terms must have the exact same variable(s) raised to the exact same power(s).</p>
             <div className="w-full overflow-x-auto mt-2">
              <table className="w-full text-sm">
                <thead className="text-left font-semibold text-foreground"><tr><th className="p-2 border-b">Like Terms (Can be combined)</th><th className="p-2 border-b">Unlike Terms (Cannot be combined)</th></tr></thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 border-r align-top">`3x^2` and `-7x^2`<br/>(Same variable `x`, same exponent `2`)</td>
                    <td className="p-2 align-top">`3x^2` and `3x`<br/>(Different exponents)</td>
                  </tr>
                   <tr className="border-b">
                    <td className="p-2 border-r align-top">`5` and `10`<br/>(Both are constants, technically `5x^0` and `10x^0`)</td>
                    <td className="p-2 align-top">`4x` and `4y`<br/>(Different variables)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r align-top">`-x` and `4x`<br/>(Same variable `x`, same exponent `1`)</td>
                    <td className="p-2 align-top">`x^2` and `y^2`<br/>(Different variables)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-foreground">Step-by-Step Example: Addition</h3>
            <p>Let's add `(4x^3 + 5x - 2)` and `(x^3 - 2x^2 + 3x + 7)`.</p>
            <ol className="list-decimal list-inside space-y-4">
                <li><strong>Remove Parentheses & Identify Like Terms:</strong> Since we are adding, the signs don't change. It's helpful to visually group or underline the like terms.
                    <div className="p-2 bg-muted/50 rounded-lg mt-2 font-mono text-sm">
                    (<span className="text-red-500">4x^3</span> + <span className="text-blue-500">5x</span> - <span className="text-green-500">2</span>) + (<span className="text-red-500">x^3</span> - 2x^2 + <span className="text-blue-500">3x</span> + <span className="text-green-500">7</span>)
                    </div>
                </li>
                <li><strong>Group the Like Terms:</strong> Rearrange the expression to put all like terms next to each other. This is often called the 'vertical method' when written on paper.
                    <div className="p-2 bg-muted/50 rounded-lg mt-2 font-mono text-sm">
                    (<span className="text-red-500">4x^3 + x^3</span>) + (-2x^2) + (<span className="text-blue-500">5x + 3x</span>) + (<span className="text-green-500">-2 + 7</span>)
                    </div>
                </li>
                <li><strong>Combine Coefficients:</strong> Add or subtract the coefficients of the grouped terms. The variable and exponent part stays the same.
                    <div className="p-2 bg-muted/50 rounded-lg mt-2 font-mono text-sm">
                    (<span className="text-red-500">5x^3</span>) - 2x^2 + (<span className="text-blue-500">8x</span>) + (<span className="text-green-500">5</span>)
                    </div>
                </li>
                <li><strong>Final Answer in Standard Form:</strong> Write the result with terms ordered from the highest degree to the lowest. The sum is `5x^3 - 2x^2 + 8x + 5`.</li>
            </ol>

            <h3 className="text-lg font-semibold text-foreground">Step-by-Step Example: Subtraction</h3>
            <p>Let's subtract `(x^2 - 7x + 1)` from `(3x^2 + 2x - 5)`.</p>
            <ol className="list-decimal list-inside space-y-4">
                <li><strong>Distribute the Negative:</strong> This is the most critical and error-prone step in subtraction. The minus sign in front of the second parenthesis applies to *every term* inside it, flipping each sign.
                     <div className="p-2 bg-muted/50 rounded-lg mt-2 font-mono text-sm">
                        (3x^2 + 2x - 5) - (x^2 - 7x + 1) <br/>
                        = 3x^2 + 2x - 5 <span className="text-red-500">- x^2 + 7x - 1</span>
                    </div>
                </li>
                <li><strong>Group Like Terms:</strong> Now that the subtraction is converted to addition, we proceed as before.
                     <div className="p-2 bg-muted/50 rounded-lg mt-2 font-mono text-sm">
                        (3x^2 - x^2) + (2x + 7x) + (-5 - 1)
                    </div>
                </li>
                <li><strong>Combine Coefficients:</strong>
                    <div className="p-2 bg-muted/50 rounded-lg mt-2 font-mono text-sm">
                       (3-1)x^2 + (2+7)x + (-5-1)<br/>
                       2x^2 + 9x - 6
                    </div>
                </li>
                 <li><strong>Final Answer:</strong> The result is `2x^2 + 9x - 6`.</li>
            </ol>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the 'degree' of a polynomial?</AccordionTrigger>
              <AccordionContent>
                <p>The degree of a single term is its exponent. The degree of the entire polynomial is the highest degree of any of its terms. For example, the degree of `5x^3 - 2x^2 + 8x + 5` is 3. This determines the overall behavior of the polynomial's graph.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Does the order of the terms matter when I enter them?</AccordionTrigger>
              <AccordionContent>
                <p>No, the calculator will parse the terms correctly regardless of their order. You can enter `5 + 2x - 3x^2` and it will be understood. However, the final result is always presented in "standard form," with the terms ordered from the highest degree to the lowest, which is the conventional way to write polynomials.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>What happens if a term cancels out completely?</AccordionTrigger>
              <AccordionContent>
                <p>If combining like terms results in a coefficient of zero (e.g., `5x - 5x = 0x`), that term is simply omitted from the final result because anything multiplied by zero is zero. For example, `(x^2 + 5x) + (-x^2 + 2x)` results in `7x`, as the `x^2` terms cancel out.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>How do I enter a term like `-x^2`?</AccordionTrigger>
              <AccordionContent>
                <p>You can enter it exactly like that: `-x^2`. The calculator understands that a missing numerical coefficient implies a coefficient of 1 or -1. So, `x^2` is treated as `1x^2`, and `-x^2` is treated as `-1x^2`.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>Can this calculator handle multiplication or division?</AccordionTrigger>
              <AccordionContent>
                <p>No, this tool is specifically designed for addition and subtraction. Polynomial multiplication (often done with the FOIL or Box method) and division (using long division or synthetic division) are different, more complex processes that require their own dedicated methods and calculators.</p>
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
          <p className="text-muted-foreground">This calculator simplifies the process of adding and subtracting polynomials by automating the crucial steps of identifying, grouping, and combining like terms. For subtraction, it correctly handles the distribution of the negative sign before combining terms. By showing the step-by-step process, it serves as an educational tool for understanding the core principles of polynomial arithmetic, ensuring that results are accurate and presented in conventional standard form.</p>
        </CardContent>
      </Card>

    </div>
  );
}
