"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Home,
  Landmark,
  PiggyBank,
  TrendingUp,
  Car,
  LineChart,
} from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Mortgage', icon: Home },
  { href: '/loan', label: 'Loan', icon: Landmark },
  { href: '/savings', label: 'Savings', icon: PiggyBank },
  { href: '/retirement', label: 'Retirement', icon: TrendingUp },
  { href: '/auto-loan', label: 'Auto Loan', icon: Car },
  { href: '/investment', label: 'Investment', icon: LineChart },
];

export default function NavigationMenu() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
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
