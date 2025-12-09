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
} from 'lucide-react';

const menuItems = [
  { href: '/insurance', label: 'Insurance Affordability', icon: Shield },
  { href: '/out-of-pocket-health-cost-calculator', label: 'Out-of-Pocket Health Cost', icon: HeartPulse },
  { href: '/medical-bill-estimator', label: 'Medical Bill Estimator', icon: Stethoscope },
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
