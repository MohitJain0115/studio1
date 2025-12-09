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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { calculateInvestment } from '@/lib/calculators';
import { LineChart as LineChartIcon } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from '@/components/ui/chart-components';

const chartConfig = {
  value: {
    label: 'Investment',
    color: 'hsl(var(--accent))',
  },
};

export default function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('5000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [interestRate, setInterestRate] = useState('8');
  const [years, setYears] = useState('15');
  const [compoundingFrequency, setCompoundingFrequency] = useState('12');
  const [result, setResult] = useState<{ futureValue: number; data: { year: number; value: number }[] } | null>(null);

  const handleCalculate = () => {
    const res = calculateInvestment({
      initialInvestment: parseFloat(initialInvestment),
      monthlyContribution: parseFloat(monthlyContribution),
      interestRate: parseFloat(interestRate),
      years: parseInt(years),
      compoundingFrequency: parseInt(compoundingFrequency),
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
            <LineChartIcon className="w-6 h-6 text-primary" />
            Investment Calculator
          </CardTitle>
          <CardDescription>
            Evaluate your investment growth and returns over time.
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
                placeholder="e.g., 5000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-contribution">Monthly Contribution ($)</Label>
              <Input
                id="monthly-contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="e.g., 500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Years</Label>
              <Input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="e.g., 15"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="compounding">Compounding Frequency</Label>
            <Select onValueChange={setCompoundingFrequency} defaultValue={compoundingFrequency}>
              <SelectTrigger id="compounding">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Annually</SelectItem>
                <SelectItem value="2">Semi-Annually</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="12">Monthly</SelectItem>
                <SelectItem value="365">Daily</SelectItem>
              </SelectContent>
            </Select>
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
                  <CardTitle className="text-lg">Future Value of Investment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(result.futureValue)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Growth Over Time</CardTitle>
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
