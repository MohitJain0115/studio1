'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, ShieldPlus, Bed, Zap, Hospital, Smile, Pill, WholeWord, Scale, Users, PieChart, Clock, Briefcase, Target, TrendingUp, Activity, TestTube, Scissors, CalendarCheck, CalendarOff, UserCheck, Cake, RefreshCw, Moon, Split, FileClock, CalendarRange, Globe, CalendarDays, Hourglass, Timer, Phone } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  {
    href: '/investment/health-insurance-subsidy-eligibility-calculator',
    label: 'ACA Subsidy Eligibility',
    icon: Users,
  },
  {
    href: '/investment/career-roi-calculator',
    label: 'Career ROI',
    icon: Briefcase,
  },
  {
    href: '/investment/collateral-haircut-impact-calculator',
    label: 'Collateral Haircut',
    icon: Scissors,
  },
  {
    href: '/employment/compensatory-off-days-calculator',
    label: 'Compensatory Time',
    icon: Hourglass,
  },
  {
    href: '/employment/contract-duration-calculator',
    label: 'Contract Duration',
    icon: CalendarRange,
  },
  {
    href: '/investment/copay-vs-deductible-breakeven-calculator',
    label: 'Copay vs. Deductible',
    icon: Scale,
  },
  {
    href: '/investment/delayed-gratification-roi-calculator',
    label: 'Delayed Gratification ROI',
    icon: Clock,
  },
  {
    href: '/investment/dental-cost-comparison-calculator',
    label: 'Dental Cost Comparison',
    icon: Smile,
  },
  {
    href: '/employment/employment-anniversary-calculator',
    label: 'Employment Anniversary',
    icon: Cake,
  },
  {
    href: '/investment/exposure-at-default-simulation',
    label: 'EAD Simulation',
    icon: Activity,
  },
  {
    href: '/investment/expected-exposure-calculator',
    label: 'Expected Exposure',
    icon: TrendingUp,
  },
  {
    href: '/employment/freelance-billable-hours-calculator',
    label: 'Freelance Billable Hours',
    icon: FileClock,
  },
  {
    href: '/investment/habit-based-wealth-growth-estimator',
    label: 'Habit-based Wealth Growth',
    icon: Zap,
  },
  {
    href: '/investment/health-plan-coverage-gap-estimator',
    label: 'Health Plan Coverage Gap',
    icon: WholeWord,
  },
  {
    href: '/investment/hospital-stay-cost-by-specialty-calculator',
    label: 'Hospital Stay Cost',
icon: Hospital,
  },
  {
    href: '/investment/hsa-tax-benefit-calculator',
    label: 'HSA Tax Benefit',
    icon: ShieldPlus,
  },
  {
    href: '/employment/last-working-day-calculator',
    label: 'Last Working Day',
    icon: CalendarOff,
  },
  {
    href: '/investment/loss-given-default-backtest-calculator',
    label: 'LGD Backtest',
    icon: TestTube,
  },
  {
    href: '/investment/long-term-care-cost-estimator',
    label: 'Long-Term Care Cost',
    icon: Bed,
  },
  {
    href: '/employment/night-shift-duration-calculator',
    label: 'Night Shift Duration',
    icon: Moon,
  },
  {
    href: '/employment/notice-period-calculator',
    label: 'Notice Period',
    icon: CalendarCheck,
  },
  {
    href: '/employment/on-call-hours-calculator',
    label: 'On-Call Pay',
    icon: Phone,
  },
  {
    href: '/investment/prescription-refill-cost-estimator',
    label: 'Prescription Refill Cost',
    icon: Pill,
  },
  {
    href: '/employment/probation-period-calculator',
    label: 'Probation Period',
    icon: UserCheck,
  },
  {
    href: '/employment/pto-accrual-calculator',
    label: 'PTO Accrual',
    icon: CalendarDays,
  },
  {
    href: '/employment/remote-work-time-zone-overlap-calculator',
    label: 'Remote Time Zone Overlap',
    icon: Globe,
  },
  {
    href: '/investment/savings-rate-vs-goal-timeline-visualizer',
    label: 'Savings Rate vs. Goal',
    icon: Target,
  },
  {
    href: '/employment/shift-rotation-calculator',
    label: 'Shift Rotation',
    icon: RefreshCw,
  },
  {
    href: '/investment/spending-pattern-analyzer',
    label: 'Spending Pattern Analyzer',
    icon: PieChart,
  },
  {
    href: '/employment/split-shift-hours-calculator',
    label: 'Split Shift Hours',
    icon: Split,
  },
  {
    href: '/employment/timesheet-rounding-calculator',
    label: 'Timesheet Rounding',
    icon: Timer,
  },
  {
    href: '/employment/work-from-home-hours-calculator',
    label: 'Work From Home Hours',
    icon: Home,
  },
];

export default function NavigationMenu() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SidebarMenu>
      {isClient && menuItems.sort((a,b) => a.label.localeCompare(b.label)).map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
            className="justify-start"
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
