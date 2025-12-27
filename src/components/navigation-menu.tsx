'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Percent, TrendingUp, TrendingDown, ArrowRightLeft, ChevronsRight, Calculator, Fuel } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  {
    href: '/calculators/value-percentage-calculator',
    label: 'Value Percentage',
    icon: Percent,
  },
  {
    href: '/calculators/historic-change-calculator',
    label: 'Historic Change',
    icon: TrendingUp,
  },
  {
    href: '/calculators/sale-discount-calculator',
    label: 'Sale Discount',
    icon: TrendingDown,
  },
  {
    href: '/calculators/comparative-difference-calculator',
    label: 'Comparative Difference',
    icon: ArrowRightLeft,
  },
  {
    href: '/calculators/investment-growth-calculator',
    label: 'Investment Growth',
    icon: ChevronsRight,
  },
  {
    href: '/calculators/compounding-increase-calculator',
    label: 'Compounding Increase',
    icon: Calculator,
  },
   {
    href: '/calculators/fuel-cost-calculator',
    label: 'Fuel Cost',
    icon: Fuel,
  },
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
