"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateSavings } from '@/lib/calculators';
import { PiggyBank } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from '@/components/ui/chart-components';

const chartConfig = {
  value: {
    label: 'Savings',
    color: 'hsl(var(--accent))',
  },
};

export default function SavingsCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('200');
  const [interestRate, setInterestRate] = useState('5');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<{ futureValue: number; data: { year: number; value: number }[] } | null>(null);

  const handleCalculate = () => {
    const res = calculateSavings({
      initialInvestment: parseFloat(initialInvestment),
      monthlyContribution: parseFloat(monthlyContribution),
      interestRate: parseFloat(interestRate),
      years: parseInt(years),
    });
    setResult(res);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <PiggyBank className="w-6 h-6 text-primary" />
            Savings Calculator
          </CardTitle>
          <CardDescription>
            Estimate your future savings based on your investment plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial-investment">Initial Investment ($)</Label>
              <Input
                id="initial-investment"
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                placeholder="e.g., 1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-contribution">Monthly Contribution ($)</Label>
              <Input
                id="monthly-contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="e.g., 200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Years</Label>
              <Input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="e.g., 10"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button onClick={handleCalculate} className="w-full md:w-auto">
            Calculate
          </Button>
          {result && (
            <div className="w-full space-y-4">
              <Card className="w-full bg-accent/20 border-accent">
                <CardHeader>
                  <CardTitle className="text-lg">Future Value of Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(result.futureValue)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Savings Growth Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="w-full h-[300px]">
                        <ResponsiveContainer>
                        <LineChart data={result.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                        </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
