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
import { calculateAutoLoan } from '@/lib/calculators';
import { Car } from 'lucide-react';

export default function AutoLoanCalculator() {
  const [carPrice, setCarPrice] = useState('35000');
  const [downPayment, setDownPayment] = useState('5000');
  const [tradeInValue, setTradeInValue] = useState('10000');
  const [interestRate, setInterestRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('5');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const handleCalculate = () => {
    const payment = calculateAutoLoan({
      carPrice: parseFloat(carPrice),
      downPayment: parseFloat(downPayment),
      tradeInValue: parseFloat(tradeInValue),
      interestRate: parseFloat(interestRate),
      loanTerm: parseInt(loanTerm),
    });
    setMonthlyPayment(payment);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Car className="w-6 h-6 text-primary" />
            Auto Loan Calculator
          </CardTitle>
          <CardDescription>
            Determine the affordability of your next vehicle purchase.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="car-price">Car Price ($)</Label>
              <Input
                id="car-price"
                type="number"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                placeholder="e.g., 35000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="down-payment">Down Payment ($)</Label>
              <Input
                id="down-payment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="e.g., 5000"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trade-in">Trade-in Value ($)</Label>
              <Input
                id="trade-in"
                type="number"
                value={tradeInValue}
                onChange={(e) => setTradeInValue(e.target.value)}
                placeholder="e.g., 10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 6.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-term">Loan Term (Years)</Label>
              <Input
                id="loan-term"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button onClick={handleCalculate} className="w-full md:w-auto">
            Calculate
          </Button>
          {monthlyPayment !== null && (
            <Card className="w-full bg-accent/20 border-accent">
              <CardHeader>
                <CardTitle className="text-lg">Your Estimated Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(monthlyPayment)}
                  <span className="text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
