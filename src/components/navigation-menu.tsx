'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Percent, TrendingUp, ArrowRightLeft, ChevronsRight, Calculator, Fuel, Divide, Clock, Minus, Target, Thermometer, AreaChart } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/calculators/average-percentage-calculator', label: 'Average Percentage', icon: Calculator },
  { href: '/calculators/comparative-difference-calculator', label: 'Comparative Difference', icon: ArrowRightLeft },
  { href: '/calculators/compounding-increase-calculator', label: 'Compounding Increase', icon: TrendingUp },
  { href: '/calculators/doubling-time-calculator', label: 'Doubling Time', icon: Clock },
  { href: '/calculators/fraction-to-percent-calculator', label: 'Fraction to Percent', icon: Divide },
  { href: '/calculators/fuel-cost-calculator', label: 'Fuel Cost', icon: Fuel },
  { href: '/calculators/historic-change-calculator', label: 'Historic Change', icon: TrendingUp },
  { href: '/calculators/investment-growth-calculator', label: 'Investment Growth', icon: ChevronsRight },
  { href: '/calculators/percentage-of-a-percentage-calculator', label: 'Percent of Percent', icon: Percent },
  { href: '/calculators/percentage-point-calculator', label: 'Percentage Point', icon: Minus },
  { href: '/calculators/value-percentage-calculator', label: 'Value Percentage', icon: Percent },
  { href: '/calculators/percent-error-calculator', label: 'Percent Error', icon: Thermometer },
  { href: '/calculators/percent-to-goal-calculator', label: 'Percent to Goal', icon: Target },
  { href: '/calculators/relative-change-calculator', label: 'Relative Change', icon: TrendingUp },
  { href: '/calculators/slope-percentage-calculator', label: 'Slope Percentage', icon: AreaChart },
  { href: '/calculators/time-percentage-calculator', label: 'Time Percentage', icon: Clock },
].sort((a,b) => a.href === '/' ? -1 : b.href === '/' ? 1 : a.label.localeCompare(b.label));

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
            isActive={pathname.startsWith(item.href) && (item.href === '/' ? pathname === '/' : true)}
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
