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
                </