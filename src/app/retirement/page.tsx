"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { runRetirementProjection } from './actions';
import type { RetirementIncomeProjectionOutput } from '@/ai/flows/retirement-income-projection';
import { Loader, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  currentSavings: z.coerce.number().min(0),
  annualContribution: z.coerce.number().min(0),
  retirementAge: z.coerce.number().min(18).max(100),
  annualExpenses: z.coerce.number().min(0),
  inflationRate: z.coerce.number().min(0).max(20),
  investmentReturnRate: z.coerce.number().min(0).max(30),
});

export default function RetirementCalculator() {
  const [result, setResult] = useState<RetirementIncomeProjectionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentSavings: 100000,
      annualContribution: 10000,
      retirementAge: 65,
      annualExpenses: 60000,
      inflationRate: 3.0,
      investmentReturnRate: 7.0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const input = {
      ...values,
      inflationRate: values.inflationRate / 100,
      investmentReturnRate: values.investmentReturnRate / 100,
    };

    try {
      const res = await runRetirementProjection(input);
      setResult(res);
    } catch (e) {
      setError('An error occurred while running the projection. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            AI Retirement Calculator
          </CardTitle>
          <CardDescription>
            Project your retirement income and get AI-powered feedback.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentSavings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Savings ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annualContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Contribution ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="retirementAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retirement Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annualExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Est. Annual Expenses ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inflationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inflation Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentReturnRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Return Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Analyze My Retirement
              </Button>
            </CardFooter>
          </form>
        </Form>
        {error && <p className="p-4 text-destructive">{error}</p>}
        {result && (
          <div className="p-6 pt-0 space-y-4">
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>AI Analysis</CardTitle>
                    <Badge variant={result.isFeasible ? 'default' : 'destructive'} className={result.isFeasible ? 'bg-accent text-accent-foreground' : ''}>
                        {result.isFeasible ? <CheckCircle className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                        {result.isFeasible ? 'Feasible Plan' : 'Needs Adjustment'}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{result.summary}</p>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Suggestions for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{result.suggestions}</p>
                </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
