"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

const calculators = [
  {
    href: '/investment/hsa-tax-benefit-calculator',
    title: 'Health Savings Account (HSA) Tax Benefit Calculator',
    description: 'Estimate the tax advantages of contributing to an HSA.',
  },
  {
    href: '/investment/long-term-care-cost-estimator',
    title: 'Long-Term Care Cost Estimator',
    description: 'Project the potential costs of long-term care in the future.',
  },
  {
    href: '/investment/habit-based-wealth-growth-estimator',
    title: 'Habit-based Wealth Growth Estimator',
    description: 'See how much wealth you could build by redirecting spending from daily habits to investments.',
  },
];

export default function CalculatorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">FinanceFriend</h1>
      <p className="text-muted-foreground">
        Your suite of financial calculators. Get started by selecting a calculator below.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calculator) => (
          <Link href={calculator.href} key={calculator.href} className="block hover:no-underline">
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{calculator.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{calculator.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
