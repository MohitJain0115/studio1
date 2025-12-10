'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, ShieldPlus, Bed, Zap } from 'lucide-react';
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
    label: 'HSA Tax Benefit Calculator',
    icon: ShieldPlus,
  },
  {
    href: '/investment/long-term-care-cost-estimator',
    label: 'Long-Term Care Cost Estimator',
    icon: Bed,
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
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={isClient ? pathname === item.href : false}
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
