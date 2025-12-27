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
            <h2 className="text-xl font-bold text-foreground">How to Truly Understand Sale Prices</h2>
            <p>We've all seen the bright red signs: "50% OFF!", "Clearance!", "Final Sale!". But what do these discounts actually mean for your wallet? This calculator is your first step to becoming a more informed consumer. By understanding the math behind the marketing, you can make smarter purchasing decisions and know exactly how much you're saving.</p>
            
            <h3 className="text-lg font-semibold text-foreground">"Percentage Off" vs. "Amount Saved"</h3>
            <p>Retailers use both percentage and dollar-amount discounts, and it's useful to understand both. Our calculator provides both metrics for a complete picture.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Discount Percentage:</strong> This is a relative measure. A "25% off" sign is a great way to compare deals across items with different price points. A 25% discount on a $1,000 laptop is much larger in absolute terms than a 50% discount on a $20 t-shirt. The percentage helps you gauge the quality of the deal itself.</li>
                <li><strong>Amount Saved:</strong> This is the absolute, real-dollar value of the discount. It's the tangible money that stays in your bank account. Seeing that you saved "$250" on the laptop feels more concrete than just "25%".</li>
            </ul>
            <p>A smart shopper uses both. The percentage tells you the strength of the promotion, while the amount saved tells you the direct impact on your budget.</p>

            <h3 className="text-lg font-semibold text-foreground">Common Discount Tactics to Watch For</h3>
            <p>Being aware of common retail strategies can help you see past the hype and focus on the real value.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Inflated Original Prices:</strong> Sometimes, the "original price" is artificially high to make a discount appear larger than it is. Is the item *ever* sold at that full price? Use our Historic Change Calculator to track prices over time if you're suspicious.</li>
                <li><strong>"Up To" Discounts:</strong> A sign saying "Up to 70% off" often means only a few specific, less desirable items are at the maximum discount, while most are discounted much less.</li>
                <li><strong>Tiered Discounts:</strong> "Buy one, get one 50% off" (BOGO) is a common one. This isn't a flat 50% discount. It's a 25% discount on the total price of two items. For example, two $100 items would cost you $150, not $100.</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-foreground">Using This Calculator for Budgeting</h3>
            <p>Before you even go shopping, you can use this calculator in reverse. If you have a budget of $150 for a new coat and you find one you love for $200, you can quickly determine you need to find it on sale for at least 25% off (`((200-150)/200)*100`) to fit your budget. This turns you from a passive shopper into a strategic one.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What if an item is "30% off" but I don't know the sale price?</AccordionTrigger>
              <AccordionContent>
                <p>You can use our Value Percentage Calculator for that! If you know the original price and the discount percentage, you can find the final price. First, calculate the discount amount (e.g., 30% of $100 is $30), then subtract that from the original price ($100 - $30 = $70).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Does this calculator handle sales tax?</AccordionTrigger>
              <AccordionContent>
                <p>No, this calculator focuses purely on the pre-tax discount. Sales tax is calculated on the final sale price, not the original price. To find the final cost, you would first use this calculator to find the sale price, and then apply your local sales tax percentage to that amount.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>How can I calculate a double discount (e.g., 20% off, then an extra 10% off)?</AccordionTrigger>
              <AccordionContent>
                <p>Discounts are applied sequentially. A "20% + 10%" discount is NOT a 30% discount. First, take 20% off the original price. Then, take 10% off the *new, discounted* price. For a $100 item: $100 -> $80 (20% off) -> $72 (10% off $80). The total discount is 28%, not 30%.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
