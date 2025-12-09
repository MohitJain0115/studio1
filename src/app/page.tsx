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
import { calculateMortgage } from '@/lib/calculators';
import { Calculator, Home, Landmark, PiggyBank, TrendingUp, Car, LineChart, Target, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';

function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState('300000');
  const [interestRate, setInterestRate] = useState('5.0');
  const [loanTerm, setLoanTerm] = useState('30');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const handleCalculate = () => {
    const payment = calculateMortgage({
      loanAmount: parseFloat(loanAmount),
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
    <>
      <CardHeader>
        <DialogTitle className="text-2xl font-headline flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Mortgage Calculator
        </DialogTitle>
        <CardDescription>
          Estimate your monthly mortgage payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loan-amount">Loan Amount ($)</Label>
            <Input
              id="loan-amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g., 300000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest-rate">Interest Rate (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g., 5.0"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="loan-term">Loan Term (Years)</Label>
          <Input
            id="loan-term"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="e.g., 30"
          />
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
    </>
  );
}

export default function CalculatorsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-6 h-6 text-primary" />
                Mortgage Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Estimate your monthly mortgage payments for a new home.
              </CardDescription>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <MortgageCalculator />
        </DialogContent>
      </Dialog>
      <Link href="/loan">
        <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Landmark className="w-6 h-6 text-primary" />
                Loan Calculator
            </CardTitle>
            </CardHeader>
            <CardContent>
            <CardDescription>
                Calculate loan payments and see the amortization schedule.
            </CardDescription>
            </CardContent>
        </Card>
      </Link>
      <Link href="/savings">
        <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-6 h-6 text-primary" />
                Savings Calculator
            </CardTitle>
            </CardHeader>
            <CardContent>
            <CardDescription>
                Estimate your future savings based on your investment plan.
            </CardDescription>
            </CardContent>
        </Card>
      </Link>
      <Link href="/retirement">
        <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                AI Retirement Calculator
            </CardTitle>
            </CardHeader>
            <CardContent>
            <CardDescription>
                Project your retirement income and get AI-powered feedback.
            </CardDescription>
            </CardContent>
        </Card>
      </Link>
      <Link href="/auto-loan">
        <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Car className="w-6 h-6 text-primary" />
                Auto Loan Calculator
            </CardTitle>
            </CardHeader>
            <CardContent>
            <CardDescription>
                Determine the affordability of your next vehicle purchase.
            </CardDescription>
            </CardContent>
        </Card>
      </Link>
      <Link href="/investment">
        <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LineChart className="w-6 h-6 text-primary" />
                Investment Calculator
            </CardTitle>
            </CardHeader>
            <CardContent>
            <CardDescription>
                Evaluate your investment growth and returns over time.
            </CardDescription>
            </CardContent>
        </Card>
      </Link>
      <Link href="/sip-dca">
        <Card className="cursor-pointer hover:border-primary transition-colors h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              SIP/DCA Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Model investment growth with Systematic Investment Plans.
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
      <Link href="/insurance">
        <Card className="cursor-pointer hover:border-primary transition-colors h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Insurance Affordability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Assess your capacity for insurance premium payments.
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
