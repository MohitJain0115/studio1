'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { multiplyPolynomialsBox } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Sigma, Lightbulb, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const formSchema = z.object({
  poly1: z.string().min(1, 'Please enter the first polynomial.'),
  poly2: z.string().min(1, 'Please enter the second polynomial.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function BoxMethodCalculator() {
  const [result, setResult] = useState<ReturnType<typeof multiplyPolynomialsBox> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { poly1: '', poly2: '' },
  });

  const onSubmit = (data: FormValues) => {
    try {
        const res = multiplyPolynomialsBox(data.poly1, data.poly2);
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
          <CardTitle>Box Method Multiplication Calculator</CardTitle>
          <CardDescription>Multiply two polynomials using the visual Box (or Area) Method.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">(</span>
                <FormField control={form.control} name="poly1" render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Polynomial</FormLabel>
                    <FormControl><Input placeholder="e.g., x + 2" {...field} /></FormControl>
                  </FormItem>
                )} />
                <span className="text-2xl font-bold">) (</span>
                <FormField control={form.control} name="poly2" render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Second Polynomial</FormLabel>
                    <FormControl><Input placeholder="e.g., x^2 - 3x + 5" {...field} /></FormControl>
                  </FormItem>
                )} />
                <span className="text-2xl font-bold">)</span>
              </div>
              <FormMessage>{form.formState.errors.poly1?.message || form.formState.errors.poly2?.message || form.formState.errors.root?.serverError?.message}</FormMessage>
              <Button type="submit">Multiply</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && result.box && (
        <Card>
          <CardHeader>
            <CardTitle>Box Method Visualization</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead><X className="h-5 w-5" /></TableHead>
                        {result.box.colHeaders.map((header, index) => (
                            <TableHead key={index} className="text-center font-bold text-lg">{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {result.box.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableHead className="text-center font-bold text-lg">{result.box.rowHeaders[rowIndex]}</TableHead>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} className={`text-center ${cell.isDiagonal ? 'bg-primary/20' : ''}`}>{cell.value}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
             <div className="mt-6">
                <h3 className="font-semibold text-lg">Steps:</h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-2 text-sm text-muted-foreground">
                    {result.steps.map((step, index) => <p key={index} className="font-mono">{step}</p>)}
                </div>
             </div>
             <div className="mt-6 text-center">
                 <p className="text-sm text-muted-foreground">Final Answer:</p>
                 <p className="text-3xl font-bold text-primary">{result.finalAnswer}</p>
             </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Input Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">Enter polynomials using standard algebraic notation. See the `Adding and Subtracting Polynomials Calculator` for a detailed format guide.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The Box Method (also known as the Area Model) is a visual strategy for multiplying polynomials. It breaks the complex process down into a series of simpler monomial multiplications.</p>
          <ol className="list-decimal list-inside mt-2 space-y-2 text-muted-foreground">
            <li>Create a grid or box. The terms of the first polynomial become the headers for the columns, and the terms of the second polynomial become the headers for the rows.</li>
            <li>Fill in each cell of the box by multiplying the corresponding row and column header terms.</li>
            <li>Combine all the like terms from within the cells. Often, these like terms align along the diagonals of the box.</li>
            <li>Write the combined terms in standard form (from highest to lowest degree) to get the final answer.</li>
          </ol>
          <p className="mt-2">This method ensures that every term in the first polynomial is multiplied by every term in the second polynomial, just like the distributive property or FOIL method, but in a more organized way.</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />In-Depth Guide to the Box Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">Why Use the Box Method?</h2>
            <p>When multiplying polynomials, the goal is to apply the distributive property correctly, ensuring every term in the first polynomial multiplies every term in the second. For simple cases like `(x+2)(x+3)`, many people learn the **FOIL** method (First, Outer, Inner, Last). However, FOIL only works for multiplying two binomials. What happens when you have `(x+2)(x^2 - 3x + 5)`? FOIL breaks down.</p>
            <p>The Box Method is a systematic and scalable approach that works for polynomials of any size. It provides a visual organization that prevents common errors, such as missing a term or making a sign error. It turns a complex algebra problem into a simple multiplication table.</p>

            <h3 className="text-lg font-semibold text-foreground">Step-by-Step Example: (x + 2) * (x² - 3x + 5)</h3>
            <p>Let's use the calculator's example to see the method in action.</p>
            <ol className="list-decimal list-inside space-y-4">
                <li>
                    <strong>Draw the Box:</strong> The first polynomial, `x + 2`, has two terms, so we need two columns. The second polynomial, `x^2 - 3x + 5`, has three terms, so we need three rows. We draw a 2x3 box.
                </li>
                <li>
                    <strong>Label the Box:</strong> Write the terms of the first polynomial (`x` and `+2`) above the columns. Write the terms of the second polynomial (`x^2`, `-3x`, `+5`) next to the rows.
                </li>
                <li>
                    <strong>Multiply to Fill the Cells:</strong> Go through each cell and multiply its corresponding row and column headers.
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Top-left: `x * x^2 = x^3`</li>
                        <li>Top-right: `2 * x^2 = 2x^2`</li>
                        <li>Middle-left: `x * -3x = -3x^2`</li>
                        <li>Middle-right: `2 * -3x = -6x`</li>
                        <li>Bottom-left: `x * 5 = 5x`</li>
                        <li>Bottom-right: `2 * 5 = 10`</li>
                    </ul>
                    The calculator visualizes this grid for you.
                </li>
                <li>
                    <strong>Combine Like Terms:</strong> This is the most satisfying step. The like terms often line up on the diagonals.
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>**x³ term:** There's only one: `x^3`.</li>
                        <li>**x² terms:** `2x^2` and `-3x^2`. Combined, they make `-x^2`.</li>
                        <li>**x terms:** `-6x` and `5x`. Combined, they make `-x`.</li>
                        <li>**Constant term:** There's only one: `10`.</li>
                    </ul>
                     The calculator highlights these diagonal groups to make them easy to spot.
                </li>
                <li>
                    <strong>Write the Final Answer:</strong> Combine the results from the previous step in standard form (highest degree first).
                    <div className="p-4 bg-muted/50 rounded-lg mt-2 text-center font-mono text-primary font-bold">x³ - x² - x + 10</div>
                </li>
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
              <AccordionTrigger>Is this different from the FOIL method?</AccordionTrigger>
              <AccordionContent>
                <p>The Box Method achieves the same result as FOIL but is more organized. For `(a+b)(c+d)`, FOIL is `ac + ad + bc + bd`. The Box Method would create a 2x2 grid giving the same four products. The advantage of the Box Method is that it works for polynomials of any size, whereas FOIL only works for binomials (2-term polynomials).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I multiply more than two polynomials at once?</AccordionTrigger>
              <AccordionContent>
                <p>Not directly with this method. To multiply three polynomials (A * B * C), you would first use the box method to find the product of (A * B), and then use the box method again to multiply that result by C.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What happens if a polynomial is missing a term?</AccordionTrigger>
              <AccordionContent>
                <p>That's perfectly fine. If you are multiplying `(x^2 + 1)` by `(x - 3)`, you simply use `x^2` and `+1` as your headers. You can think of the missing term (the 'x' term) as having a coefficient of zero, but you don't need to write it in the box.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Does it matter which polynomial goes on top and which goes on the side?</AccordionTrigger>
              <AccordionContent>
                <p>No, it does not. Because multiplication is commutative, `A * B` is the same as `B * A`. You will get the same cells and the same final answer, though the box itself will be rotated. For convenience, it's often easier to put the polynomial with more terms on the side to create a taller, narrower box.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>Can the Box Method be used for division?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, but in reverse! The Box Method is an excellent way to perform polynomial division. You place the divisor on the side, the dividend on the diagonal, and then work backwards to figure out what the top headers (the quotient) must have been. It's often seen as a more intuitive alternative to polynomial long division.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
    </div>
  );
}

    