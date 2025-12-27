
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateSaleDiscount } from '@/lib/calculators';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { HelpCircle, Percent, Tag, ShoppingCart, Info, TrendingDown } from 'lucide-react';

const formSchema = z.object({
  originalPrice: z.coerce.number().positive('Original price must be positive.'),
  salePrice: z.coerce.number().nonnegative('Sale price must be a non-negative number.'),
}).refine(data => data.salePrice <= data.originalPrice, {
  message: "Sale price cannot be greater than the original price.",
  path: ["salePrice"],
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators: { name: string; href: string }[] = [
  { name: 'Value Percentage', href: '/calculators/value-percentage-calculator' },
  { name: 'Historic Change', href: '/calculators/historic-change-calculator' },
  { name: 'Investment Growth', href: '/calculators/investment-growth-calculator' },
  { name: 'Comparative Difference', href: '/calculators/comparative-difference-calculator' },
  { name: 'Compounding Increase', href: '/calculators/compounding-increase-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));

export default function SaleDiscountCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateSaleDiscount> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalPrice: undefined,
      salePrice: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateSaleDiscount(data.originalPrice, data.salePrice);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Sale Discount Calculator</CardTitle>
          <CardDescription>
            Calculate the discount percentage and the amount you save on a sale item.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">Original Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 120" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">Sale Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 90" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Calculate Discount</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your Savings</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
             <div className="p-6 bg-destructive/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Discount Percentage</p>
                <p className="text-4xl font-bold text-destructive">{result.discountPercentage}%</p>
            </div>
             <div className="p-6 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Amount Saved</p>
                <p className="text-4xl font-bold text-primary">${result.amountSaved}</p>
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
            <h3 className="font-semibold text-lg">Original Price ($)</h3>
            <p className="text-muted-foreground">The full, non-discounted price of the item. This is the price before any sale or promotion is applied.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Sale Price ($)</h3>
            <p className="text-muted-foreground">The price you actually pay after the discount is applied. This should be less than or equal to the original price.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingDown className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculator first finds the total monetary savings and then determines what percentage that saving represents of the original price. This is a specific application of a percentage decrease calculation.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold">Amount Saved = Original Price - Sale Price</p>
            <p className="font-mono text-sm md:text-base font-bold text-primary">Discount % = (Amount Saved / Original Price) * 100</p>
          </div>
           <p className="mt-2 text-muted-foreground">This tells you how much "off" the original price the item is.</p>
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
            <CardTitle>The Savvy Shopper's Guide to Discounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">Decoding Sale Tags and Maximizing Savings</h2>
            <p>From "25% Off" to "Clearance," retailers use a variety of terms to signal a price reduction. At its heart, a discount is a percentage decrease from an item's original price. This calculator helps you quickly determine the exact percentage of the discount and, more importantly, the real dollars you're saving. Understanding this simple calculation is the first step to becoming a more informed and savvy shopper.</p>
            
            <h3 className="text-lg font-semibold text-foreground">The Psychology of a Sale</h3>
            <p>Why is a "50% Off" sign so much more compelling than a sign that just says "Now $50"? Retailers understand the psychology of perceived value. A percentage discount makes the savings feel more significant and creates a sense of urgency. It frames the value proposition not just around the final price, but around the money you *don't* have to spend. By calculating the percentage yourself, you can look past the marketing and focus on whether the final price represents good value for you.</p>

            <h3 className="text-lg font-semibold text-foreground">"Amount Saved" vs. "Discount Percentage"</h3>
            <p>Both numbers on this calculator are useful, but they tell different stories:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Discount Percentage:</strong> This is a relative measure. It's great for comparing deals across different items. A 40% discount is always a better "deal" than a 20% discount, regardless of the price.</li>
                <li><strong>Amount Saved:</strong> This is an absolute measure. It's the tangible cash that stays in your wallet. Saving $100 on a $1000 TV (a 10% discount) might feel better and have a bigger impact on your budget than saving $10 on a $20 t-shirt (a 50% discount).</li>
            </ul>
            <p>A smart shopper uses both metrics. Use the percentage to identify the best relative deals and the amount saved to evaluate the actual impact on your finances.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How is this different from the Historic Change Calculator?</AccordionTrigger>
              <AccordionContent>
                <p>Functionally, the math is identical to calculating a percentage decrease. However, this calculator is specifically framed for a retail context. It provides both the percentage and the absolute amount saved, which is the most relevant information for a shopper. The language and examples are all tailored to buying goods on sale.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What if I only know the original price and the discount percentage?</AccordionTrigger>
              <AccordionContent>
                <p>You can use our 'Value Percentage Calculator' for that. First, calculate the value of the discount (e.g., 25% of $80 is $20). Then, subtract that amount from the original price ($80 - $20 = $60) to find your final sale price.</p>
              </EOLifeline_fix_for_bots>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>How can I calculate a double discount (e.g., 20% off, then an extra 10% off)?</AccordionTrigger>
              <AccordionContent>
                <p>Discounts are applied sequentially. A "20% + 10%" discount is NOT a 30% discount. First, take 20% off the original price. Then, take 10% off the *new, discounted* price. For a $100 item: $100 -> $80 (20% off) -> $72 (10% off $80). The total discount is 28%, not 30%.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Does "Final Price" mean after taxes?</AccordionTrigger>
              <AccordionContent>
                <p>No. This calculator determines the sale price *before* sales tax is applied. Taxes are typically calculated on the final discounted price, not the original price.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
