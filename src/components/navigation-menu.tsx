'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Ruler, Scale, Square, Thermometer, Beaker, Timer, Gauge, Database, Network, Flame, Zap, Hammer, RotateCw, Cuboid, Waves, Radio, Sun, FlaskConical, Triangle, ChefHat, Construction, Fuel, Bolt, Package } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  {
    href: '/converters/angle-converter',
    label: 'Angle',
    icon: Triangle,
  },
  {
    href: '/converters/area-converter',
    label: 'Area',
    icon: Square,
  },
  {
    href: '/converters/chemical-concentration-converter',
    label: 'Concentration',
    icon: FlaskConical,
  },
  {
    href: '/converters/construction-converter',
    label: 'Construction',
    icon: Construction,
  },
  {
    href: '/converters/cooking-converter',
    label: 'Cooking',
    icon: ChefHat,
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
    href: '/converters/density-converter',
    label: 'Density',
    icon: Cuboid,
  },
  {
    href: '/converters/electrical-converter',
    label: 'Electrical',
    icon: Bolt,
  },
  {
    href: '/converters/energy-converter',
    label: 'Energy',
    icon: Flame,
  },
  {
    href: '/converters/flow-rate-converter',
    label: 'Flow Rate',
    icon: Waves,
  },
  {
    href: '/converters/force-converter',
    label: 'Force',
    icon: Hammer,
  },
  {
    href: '/converters/frequency-converter',
    label: 'Frequency',
    icon: Radio,
  },
  {
    href: '/converters/fuel-economy-converter',
    label: 'Fuel Economy',
    icon: Fuel,
  },
  {
    href: '/converters/length-and-distance-converter',
    label: 'Length & Distance',
    icon: Ruler,
  },
  {
    href: '/converters/luminance-and-light-converter',
    label: 'Luminance',
    icon: Sun,
  },
  {
    href: '/converters/material-converter',
    label: 'Material',
    icon: Package,
  },
  {
    href: '/converters/power-converter',
    label: 'Power',
    icon: Zap,
  },
  {
    href: '/converters/pressure-converter',
    label: 'Pressure',
    icon: Gauge,
  },
  {
    href: '/converters/speed-converter',
    label: 'Speed',
    icon: Gauge,
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
    href: '/converters/torque-converter',
    label: 'Torque',
    icon: RotateCw,
  },
  {
    href: '/converters/volume-converter',
    label: 'Volume',
    icon: Beaker,
  },
  {
    href: '/converters/weight-and-mass-converter',
    label: 'Weight & Mass',
    icon: Scale,
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
