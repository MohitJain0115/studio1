'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, ShieldPlus, Bed, Zap, Hospital, Smile, Pill, WholeWord, Scale, Users, PieChart, Clock, Briefcase, Target } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  {
    href: '/investment/habit-based-wealth-growth-estimator',
    label: 'Habit-based Wealth Growth',
    icon: Zap,
  },
  {
    href: '/investment/hsa-tax-benefit-calculator',
    label: 'HSA Tax Benefit',
    icon: ShieldPlus,
  },
  {
    href: '/investment/long-term-care-cost-estimator',
    label: 'Long-Term Care Cost',
    icon: Bed,
  },
  {
    href: '/investment/hospital-stay-cost-by-specialty-calculator',
    label: 'Hospital Stay Cost',
    icon: Hospital,
  },
  {
    href: '/investment/dental-cost-comparison-calculator',
    label: 'Dental Cost Comparison',
    icon: Smile,
  },
  {
    href: '/investment/prescription-refill-cost-estimator',
    label: 'Prescription Refill Cost',
    icon: Pill,
  },
  {
    href: '/investment/health-plan-coverage-gap-estimator',
    label: 'Health Plan Coverage Gap',
    icon: WholeWord,
  },
  {
    href: '/investment/copay-vs-deductible-breakeven-calculator',
    label: 'Copay vs. Deductible',
    icon: Scale,
  },
  {
    href: '/investment/health-insurance-subsidy-eligibility-calculator',
    label: 'ACA Subsidy Eligibility',
    icon: Users,
  },
  {
    href: '/investment/spending-pattern-analyzer',
    label: 'Spending Pattern Analyzer',
    icon: PieChart,
  },
  {
    href: '/investment/delayed-gratification-roi-calculator',
    label: 'Delayed Gratification ROI',
    icon: Clock,
  },
  {
    href: '/investment/career-roi-calculator',
    label: 'Career ROI',
    icon: Briefcase,
  },
  {
    href: '/investment/savings-rate-vs-goal-timeline-visualizer',
    label: 'Savings Rate vs. Goal',
    icon: Target,
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
      {isClient && menuItems.map((item) => (
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
