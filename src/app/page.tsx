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
  FunctionSquare,
  Sigma,
  Box,
} from 'lucide-react';
import Link from 'next/link';

const financialCalculators = [
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

const algebraCalculators = [
  {
    href: '/calculators/algebra/absolute-value-equation-calculator',
    label: 'Absolute Value Equation Calculator',
    icon: <Sigma className="w-8 h-8" />,
  },
  {
    href: '/calculators/algebra/absolute-value-inequalities-calculator',
    label: 'Absolute Value Inequalities Calculator',
    icon: <Sigma className="w-8 h-8" />,
  },
  {
    href: '/calculators/algebra/adding-and-subtracting-polynomials-calculator',
    label: 'Adding & Subtracting Polynomials',
    icon: <Sigma className="w-8 h-8" />,
  },
  {
    href: '/calculators/algebra/bessel-function-calculator',
    label: 'Bessel Function Calculator',
    icon: <FunctionSquare className="w-8 h-8" />,
  },
  {
    href: '/calculators/algebra/binomial-coefficient-calculator',
    label: 'Binomial Coefficient Calculator',
    icon: <Sigma className="w-8 h-8" />,
  },
  {
    href: '/calculators/algebra/box-method-calculator',
    label: 'Box Method Calculator',
    icon: <Box className="w-8 h-8" />,
  },
].sort((a, b) => a.label.localeCompare(b.label));

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to FinanceFriend
        </h1>
        <p className="text-muted-foreground mt-2">
          Your new suite of essential financial and algebraic calculators.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Financial Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {financialCalculators.map((item) => (
            <Link href={item.href} key={item.href}>
              <Card className="hover:bg-accent hover:border-accent-foreground/50 transition-colors h-full flex flex-col items-center justify-center p-6">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-center mb-4 text-primary">
                    {item.icon}
                  </div>
                  <CardTitle className="text-center text-lg">{item.label}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Algebra Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {algebraCalculators.map((item) => (
            <Link href={item.href} key={item.href}>
              <Card className="hover:bg-accent hover:border-accent-foreground/50 transition-colors h-full flex flex-col items-center justify-center p-6">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-center mb-4 text-primary">
                    {item.icon}
                  </div>
                  <CardTitle className="text-center text-lg">{item.label}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
