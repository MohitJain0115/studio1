'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Fuel } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
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
