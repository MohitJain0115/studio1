'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Ruler, Scale, Square, Thermometer, Beaker, Timer, Gauge, Database, Network, Flame } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  {
    href: '/converters/length-and-distance-converter',
    label: 'Length & Distance',
    icon: Ruler,
  },
  {
    href: '/converters/weight-and-mass-converter',
    label: 'Weight & Mass',
    icon: Scale,
  },
  {
    href: '/converters/area-converter',
    label: 'Area',
    icon: Square,
  },
  {
    href: '/converters/volume-converter',
    label: 'Volume',
    icon: Beaker,
  },
  {
    href: '/converters/temperature-converter',
    label: 'Temperature',
    icon: Thermometer,
  },
  {
    href: '/converters/time-converter',
    label: 'Time',
    icon: Timer,
  },
  {
    href: '/converters/speed-converter',
    label: 'Speed',
    icon: Gauge,
  },
  {
    href: '/converters/data-storage-converter',
    label: 'Data Storage',
    icon: Database,
  },
  {
    href: '/converters/data-transfer-speed-converter',
    label: 'Data Transfer',
    icon: Network,
  },
  {
    href: '/converters/energy-converter',
    label: 'Energy',
    icon: Flame,
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

    