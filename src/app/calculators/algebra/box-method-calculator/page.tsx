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
    defaultValues: { poly1: 'x + 2', poly2: 'x^2 - 3x + 5' },
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
            <p className="text-muted-foreground">Enter polynomials using standard algebraic notation. Refer to the `Adding and Subtracting Polynomials Calculator` for a detailed format guide. The variable must be `x`.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The Box Method (also known as the Area Model) is a visual and systematic strategy for multiplying polynomials. It is a direct application of the distributive property, but its grid-based format helps prevent common errors.</p>
          <ol className="list-decimal list-inside mt-2 space-y-2 text-muted-foreground">
            <li><strong>Grid Creation:</strong> A grid is created where the terms of the first polynomial label the columns and the terms of the second polynomial label the rows.</li>
            <li><strong>Cell Multiplication:</strong> Each cell in the grid is filled by multiplying its corresponding row and column header terms. This involves multiplying the coefficients and adding the exponents of the variables.</li>
            <li><strong>Combine Like Terms:</strong> All the resulting terms from the grid cells are collected. Like terms (those with the same variable and exponent) are then combined by adding their coefficients. These like terms often align neatly along the diagonals of the box.</li>
            <li><strong>Final Polynomial:</strong> The combined terms are written in standard form (from highest to lowest degree) to produce the final, simplified polynomial product.</li>
          </ol>
          <p className="mt-2">This method ensures that every term in the first polynomial is multiplied by every term in the second, which is essential for a correct expansion.</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />In-Depth Guide to the Box Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">Why Use the Box Method Over FOIL?</h2>
            <p>Many students learn the **FOIL** method (First, Outer, Inner, Last) for multiplying two binomials, like `(x+2)(x+3)`. FOIL is a great mnemonic, but its major limitation is that it *only* works for multiplying a binomial by another binomial. When faced with multiplying a binomial by a trinomial, or two trinomials, FOIL breaks down completely.</p>
            <p>The Box Method, however, is a universally scalable approach that works for polynomials of any size. It provides a visual organization that makes it easy to track terms and prevent common errors, such as missing a product or making a sign error. It effectively turns a complex algebra problem into a simple multiplication table, making it a more robust and reliable method for polynomial multiplication.</p>

            <h3 className="text-lg font-semibold text-foreground">Step-by-Step Example: (x + 2) * (x² - 3x + 5)</h3>
            <p>Let's use the calculator's default example to see the method in action in detail.</p>
            <ol className="list-decimal list-inside space-y-4">
                <li>
                    <strong>Draw and Label the Box:</strong> The first polynomial, `x + 2`, has two terms, so we need two columns. The second polynomial, `x^2 - 3x + 5`, has three terms, so we need three rows. We draw a 2x3 grid and label the headers.
                </li>
                <li>
                    <strong>Multiply to Fill the Cells:</strong> We systematically multiply the term for each row by the term for each column to fill in the grid.
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Row 1, Col 1: `x^2 * x = x^3`</li>
                        <li>Row 1, Col 2: `x^2 * 2 = 2x^2`</li>
                        <li>Row 2, Col 1: `-3x * x = -3x^2`</li>
                        <li>Row 2, Col 2: `-3x * 2 = -6x`</li>
                        <li>Row 3, Col 1: `5 * x = 5x`</li>
                        <li>Row 3, Col 2: `5 * 2 = 10`</li>
                    </ul>
                    The calculator visualizes this exact grid for you.
                </li>
                <li>
                    <strong>Collect and Combine Like Terms:</strong> Now, we write out all the terms from the box and group them by their exponent. Notice how the like terms are highlighted along the diagonals in the calculator's table.
                    <div className="p-2 bg-muted/50 rounded-lg mt-2 font-mono text-sm">
                    x³ + (2x² - 3x²) + (-6x + 5x) + 10
                    </div>
                    Combine the coefficients of these like terms:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>**x³ term:** There's only one: `x^3`.</li>
                        <li>**x² terms:** `2x^2 - 3x^2` becomes `-1x^2` or `-x^2`.</li>
                        <li>**x terms:** `-6x + 5x` becomes `-1x` or `-x`.</li>
                        <li>**Constant term:** There's only one: `10`.</li>
                    </ul>
                </li>
                <li>
                    <strong>Write the Final Answer:</strong> Assemble the combined terms in standard form (highest degree first) to get the final product.
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
              <AccordionTrigger>Is the Box Method the same as using the distributive property?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, fundamentally it is the same. The Box Method is a visual representation of applying the distributive property multiple times. It ensures that every term in the first polynomial is distributed to (multiplied by) every term in the second polynomial. Its main advantage is organization.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I multiply more than two polynomials at once with this method?</AccordionTrigger>
              <AccordionContent>
                <p>Not in a single step. To multiply three polynomials, say A * B * C, you would perform the process twice. First, use the box method to find the product of (A * B). Then, use the box method again to multiply that resulting polynomial by C.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What happens if a polynomial is missing a term, like `x^2 + 1`?</AccordionTrigger>
              <AccordionContent>
                <p>That's perfectly fine and very common. If you are multiplying `x^2 + 1` by `x - 3`, you simply use `x^2` and `+1` as your row or column headers. You can think of the missing term (the 'x' term) as having a coefficient of zero, but you don't need to write a "0x" column or row in the box.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Does it matter which polynomial goes on top and which goes on the side?</AccordionTrigger>
              <AccordionContent>
                <p>No, it does not matter at all. Because multiplication is commutative (`A * B` is the same as `B * A`), you will get the same individual products in the cells and the same final answer. The only difference will be the orientation of the box (e.g., a 2x3 grid vs. a 3x2 grid).</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>Can the Box Method be used for division?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, and it's an excellent way to conceptualize polynomial division. When used for division, you work in reverse. You place the divisor on the side of the box and the first term of the dividend in the top-left cell. Then, you deduce what the first term of the quotient (the top header) must be. You continue filling in the box and finding the remaining terms of the quotient. It's often seen as a more intuitive alternative to polynomial long division.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-6">
              <AccordionTrigger>Do the like terms always line up on the diagonals?</AccordionTrigger>
              <AccordionContent>
                <p>If both polynomials are written in standard form before you label the box, the like terms will almost always align neatly along the diagonals. This provides a great visual check to make sure you are combining the correct terms. If the terms are not in standard form, the like terms will still be in the box but might be scattered in different cells.</p>
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
          <p className="text-muted-foreground">The Box Method Calculator provides a visual and methodical approach to polynomial multiplication, serving as a powerful alternative to the limited FOIL method. By organizing the multiplication of each term into a grid, it minimizes errors and clearly illustrates how the distributive property works. The calculator not only provides the final answer but also visualizes the grid and the process of combining like terms, making it an effective learning tool for students mastering polynomial operations.</p>
        </CardContent>
      </Card>
      
    </div>
  );
}
