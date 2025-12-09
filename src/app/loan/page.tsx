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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculateLoanAmortization } from '@/lib/calculators';
import { Landmark } from 'lucide-react';

type AmortizationEntry = {
  month: number;
  principal: number;
  interest: number;
  balance: number;
};

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('50000');
  const [interestRate, setInterestRate] = useState('7.5');
  const [loanTerm, setLoanTerm] = useState('5');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<AmortizationEntry[]>([]);

  const handleCalculate = () => {
    const { monthlyPayment, amortizationSchedule } = calculateLoanAmortization({
      loanAmount: parseFloat(loanAmount),
      interestRate: parseFloat(interestRate),
      loanTerm: parseInt(loanTerm),
    });
    setMonthlyPayment(monthlyPayment);
    setSchedule(amortizationSchedule);
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
            <Landmark className="w-6 h-6 text-primary" />
            Loan Calculator
          </CardTitle>
          <CardDescription>
            Calculate loan payments and see the amortization schedule.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount ($)</Label>
              <Input
                id="loan-amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="e.g., 50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 7.5"
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
            <div className="w-full space-y-4">
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

              <Card>
                <CardHeader>
                  <CardTitle>Amortization Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72 w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedule.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell>{formatCurrency(row.principal)}</TableCell>
                            <TableCell>{formatCurrency(row.interest)}</TableCell>
                            <TableCell>{formatCurrency(row.balance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
