"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Shield,
  HeartPulse,
  Stethoscope,
  Gem,
  Zap,
} from 'lucide-react';

const menuItems = [
  { href: '/insurance', label: 'Insurance Affordability', icon: Shield },
  { href: '/out-of-pocket-health-cost-calculator', label: 'Out-of-Pocket Health Cost', icon: HeartPulse },
  { href: '/medical-bill-estimator', label: 'Medical Bill Estimator', icon: Stethoscope },
  { href: '/wealth-consistency-tracker', label: 'Wealth Consistency Tracker', icon: Gem },
  { href: '/habit-based-wealth-growth-estimator', label: 'Habit-based Wealth Growth', icon: Zap },
];

export default function NavigationMenu() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
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
