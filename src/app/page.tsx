'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Percent,
  TrendingUp,
  ArrowRightLeft,
  ChevronsRight,
  Calculator,
  Divide,
  Clock,
  Minus,
  Target,
  Thermometer,
  AreaChart,
} from 'lucide-react';
import Link from 'next/link';

const calculatorLinks = [
  {
    href: '/calculators/average-percentage-calculator',
    label: 'Average Percentage Calculator',
    icon: <Calculator className="w-8 h-8" />,
  },
  {
    href: '/calculators/comparative-difference-calculator',
    label: 'Comparative Difference Calculator',
    icon: <ArrowRightLeft className="w-8 h-8" />,
  },
  {
    href: '/calculators/compounding-increase-calculator',
    label: 'Compounding Increase Calculator',
    icon: <TrendingUp className="w-8 h-8" />,
  },
  {
    href: '/calculators/doubling-time-calculator',
    label: 'Doubling Time Calculator',
    icon: <Clock className="w-8 h-8" />,
  },
  {
    href: '/calculators/fraction-to-percent-calculator',
    label: 'Fraction to Percent Calculator',
    icon: <Divide className="w-8 h-8" />,
  },
  {
    href: '/calculators/fuel-cost-calculator',
    label: 'Fuel Cost Calculator',
    icon: <Calculator className="w-8 h-8" />,
  },
  {
    href: '/calculators/historic-change-calculator',
    label: 'Historic Change Calculator',
    icon: <TrendingUp className="w-8 h-8" />,
  },
  {
    href: '/calculators/investment-growth-calculator',
    label: 'Investment Growth Calculator',
    icon: <ChevronsRight className="w-8 h-8" />,
  },
  {
    href: '/calculators/percentage-of-a-percentage-calculator',
    label: 'Percentage of a Percentage Calculator',
    icon: <Percent className="w-8 h-8" />,
  },
  {
    href: '/calculators/percentage-point-calculator',
    label: 'Percentage Point Calculator',
    icon: <Minus className="w-8 h-8" />,
  },
  {
    href: '/calculators/value-percentage-calculator',
    label: 'Value Percentage Calculator',
    icon: <Percent className="w-8 h-8" />,
  },
  {
    href: '/calculators/percent-error-calculator',
    label: 'Percent Error Calculator',
    icon: <Thermometer className="w-8 h-8" />,
  },
  {
    href: '/calculators/percent-to-goal-calculator',
    label: 'Percent to Goal Calculator',
    icon: <Target className="w-8 h-8" />,
  },
  {
    href: '/calculators/relative-change-calculator',
    label: 'Relative Change Calculator',
    icon: <TrendingUp className="w-8 h-8" />,
  },
  {
    href: '/calculators/slope-percentage-calculator',
    label: 'Slope Percentage Calculator',
    icon: <AreaChart className="w-8 h-8" />,
  },
  {
    href: '/calculators/time-percentage-calculator',
    label: 'Time Percentage Calculator',
    icon: <Clock className="w-8 h-8" />,
  },
].sort((a, b) => a.label.localeCompare(b.label));

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to FinanceFriend
        </h1>
        <p className="text-muted-foreground mt-2">
          Your new suite of essential financial calculators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {calculatorLinks.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="hover:bg-accent hover:border-accent-foreground/50 transition-colors h-full flex flex-col items-center justify-center p-6">
              <CardHeader className="p-0">
                <div className="flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <CardTitle className="text-center text-lg">{item.label}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
