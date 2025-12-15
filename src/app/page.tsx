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
    href: '/employment/probation-period-calculator',
    title: 'Probation Period End Date Calculator',
    description: 'Calculate the end date of a probationary period.',
  },
  {
    href: '/employment/notice-period-calculator',
    title: 'Notice Period End Date Calculator',
    description: 'Determine the end date of a notice period after resignation.',
  },
  {
    href: '/employment/last-working-day-calculator',
    title: 'Last Working Day Calculator',
    description: 'Calculate the last working day, excluding weekends and holidays.',
  },
  {
    href: '/employment/employment-anniversary-calculator',
    title: 'Employment Anniversary Calculator',
    description: 'Track and calculate your work anniversaries.',
  },
  {
    href: '/employment/shift-rotation-calculator',
    title: 'Shift Rotation Calculator',
    description: 'Visualize your repeating shift work schedule.',
  },
  {
    href: '/investment/habit-based-wealth-growth-estimator',
    title: 'Habit-based Wealth Growth Estimator',
    description: 'See how much wealth you could build by redirecting spending from daily habits to investments.',
  },
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
    href: '/investment/hospital-stay-cost-by-specialty-calculator',
    title: 'Hospital Stay Cost by Specialty Calculator',
    description: 'Estimate the cost of a hospital stay based on medical specialty and insurance.',
  },
  {
    href: '/investment/dental-cost-comparison-calculator',
    title: 'Dental Cost Comparison Calculator',
    description: 'Compare estimated costs of common dental procedures.',
  },
  {
    href: '/investment/prescription-refill-cost-estimator',
    title: 'Prescription Refill Cost Estimator',
    description: 'Estimate your annual out-of-pocket costs for recurring prescription medications.',
  },
  {
    href: '/investment/health-plan-coverage-gap-estimator',
    title: 'Health Plan Coverage Gap Estimator',
    description: 'Project when you might enter the Medicare Part D coverage gap ("donut hole").',
  },
  {
    href: '/investment/copay-vs-deductible-breakeven-calculator',
    title: 'Copay vs. Deductible Break-even Calculator',
    description: 'Compare two health insurance plans to find the point where their total annual costs are equal.',
  },
  {
    href: '/investment/health-insurance-subsidy-eligibility-calculator',
    title: 'Health Insurance Subsidy Eligibility Calculator',
    description: 'Estimate your eligibility for premium tax credits (subsidies) under the Affordable Care Act (ACA).',
  },
  {
    href: '/investment/spending-pattern-analyzer',
    title: 'Spending Pattern Analyzer',
    description: 'Input your monthly expenses to understand where your money is going and identify potential savings.',
  },
  {
    href: '/investment/delayed-gratification-roi-calculator',
    title: 'Delayed Gratification ROI Calculator',
    description: 'See the potential future value of an immediate purchase if you invested the money instead.',
  },
  {
    href: '/investment/career-roi-calculator',
    title: 'Career ROI Calculator',
    description: 'Compare the lifetime earnings potential between two different career or education paths.',
  },
  {
    href: '/investment/savings-rate-vs-goal-timeline-visualizer',
    title: 'Savings Rate vs. Goal Timeline Visualizer',
    description: 'See how different savings rates affect how quickly you can reach your financial goals.',
  },
  {
    href: '/investment/expected-exposure-calculator',
    title: 'Expected Exposure (EE) Calculator',
    description: 'Simulate and visualize the Expected Exposure profile of a financial contract using Monte Carlo methods.',
  },
  {
    href: '/investment/exposure-at-default-simulation',
    title: 'Exposure at Default (EAD) Simulation',
    description: 'Simulate the distribution of potential exposures at a specific future default time.',
  },
  {
    href: '/investment/loss-given-default-backtest-calculator',
    title: 'Loss Given Default (LGD) Backtest Calculator',
    description: 'Assess the accuracy of an LGD model by comparing its predictions to actual outcomes.',
  },
  {
    href: '/investment/collateral-haircut-impact-calculator',
    title: 'Collateral Haircut Impact Calculator',
    description: 'Calculate the required collateral haircut and its impact on covering a given exposure.',
  },
  {
    href: '/employment/night-shift-duration-calculator',
    title: 'Night Shift Duration Calculator',
    description: 'Calculate the duration of a work shift that crosses midnight.',
  },
  {
    href: '/employment/split-shift-hours-calculator',
    title: 'Split Shift Hours Calculator',
    description: 'Calculate the total hours for a split shift, including the duration of the break.',
  },
  {
    href: '/employment/freelance-billable-hours-calculator',
    title: 'Freelance Billable Hours Calculator',
    description: 'Sum up your billable hours and calculate your total invoice amount.',
  },
  {
    href: '/employment/contract-duration-calculator',
    title: 'Contract Duration Calculator',
    description: 'Calculate the precise duration between a contract\'s start and end dates.',
  },
  {
    href: '/employment/remote-work-time-zone-overlap-calculator',
    title: 'Remote Work Time Zone Overlap Calculator',
    description: 'Find the overlapping work hours for a distributed team.',
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
        {calculators.sort((a, b) => a.title.localeCompare(b.title)).map((calculator) => (
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
