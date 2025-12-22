'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Clock, Map as MapIcon, Plane, Globe, ClipboardList, CalendarDays, Hourglass, Bed, ShieldCheck, Coffee, Wallet, Fuel, Bolt, Car, Hotel, Users, Route } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  {
    href: '/calculators/car-vs-flight-calculator',
    label: 'Car vs. Flight Comparison',
    icon: Car,
  },
  {
    href: '/calculators/cost-per-mile-calculator',
    label: 'Cost Per Mile',
    icon: Route,
  },
  {
    href: '/calculators/distance-between-cities-calculator',
    label: 'Distance Between Cities',
    icon: MapIcon,
  },
   {
    href: '/calculators/driving-time-with-breaks-calculator',
    label: 'Driving Time with Breaks',
    icon: Coffee,
  },
  {
    href: '/calculators/ev-charging-cost-calculator',
    label: 'EV Charging Cost',
    icon: Bolt,
  },
  {
    href: '/calculators/flight-duration-calculator',
    label: 'Flight Duration',
    icon: Plane,
  },
  {
    href: '/calculators/fuel-cost-calculator',
    label: 'Fuel Cost',
    icon: Fuel,
  },
  {
    href: '/calculators/group-expense-splitter',
    label: 'Group Expense Splitter',
    icon: Users,
  },
  {
    href: '/calculators/hotel-cost-calculator',
    label: 'Hotel Cost',
    icon: Hotel,
  },
  {
    href: '/calculators/itinerary-time-planner',
    label: 'Itinerary Time Planner',
    icon: ClipboardList,
  },
  {
    href: '/calculators/jet-lag-calculator',
    label: 'Jet Lag Calculator',
    icon: Bed,
  },
  {
    href: '/calculators/layover-time-calculator',
    label: 'Layover Time Calculator',
    icon: Hourglass,
  },
  {
    href: '/calculators/time-zone-difference-calculator',
    label: 'Time Zone Difference',
    icon: Globe,
  },
  {
    href: '/calculators/travel-buffer-time-calculator',
    label: 'Travel Buffer Time',
    icon: ShieldCheck,
  },
  {
    href: '/calculators/travel-days-calculator',
    label: 'Travel Days Calculator',
    icon: CalendarDays,
  },
  {
    href: '/calculators/travel-time-calculator',
    label: 'Travel Time',
    icon: Clock,
  },
  {
    href: '/calculators/trip-budget-calculator',
    label: 'Trip Budget',
    icon: Wallet,
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
