'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Clock,
  Map as MapIcon,
  Plane,
  Globe,
  ClipboardList,
  CalendarDays,
  Hourglass,
  Bed,
  ShieldCheck,
  Coffee,
  Wallet,
  Fuel,
  Bolt,
  Car,
  Hotel,
  Users,
  Route,
  Map,
} from 'lucide-react';
import Link from 'next/link';

const calculatorLinks = [
  {
    href: '/calculators/car-vs-flight-calculator',
    label: 'Car vs. Flight Cost Comparison',
    icon: <Car className="w-8 h-8" />,
  },
  {
    href: '/calculators/cost-per-mile-calculator',
    label: 'Cost Per Mile Calculator',
    icon: <Route className="w-8 h-8" />,
  },
  {
    href: '/calculators/distance-between-cities-calculator',
    label: 'Distance Between Cities Calculator',
    icon: <MapIcon className="w-8 h-8" />,
  },
  {
    href: '/calculators/driving-time-with-breaks-calculator',
    label: 'Driving Time with Breaks Calculator',
    icon: <Coffee className="w-8 h-8" />,
  },
  {
    href: '/calculators/ev-charging-cost-calculator',
    label: 'EV Charging Cost Calculator',
    icon: <Bolt className="w-8 h-8" />,
  },
  {
    href: '/calculators/flight-duration-calculator',
    label: 'Flight Duration Calculator',
    icon: <Plane className="w-8 h-8" />,
  },
  {
    href: '/calculators/fuel-cost-calculator',
    label: 'Fuel Cost Calculator',
    icon: <Fuel className="w-8 h-8" />,
  },
  {
    href: '/calculators/group-expense-splitter',
    label: 'Group Expense Splitter',
    icon: <Users className="w-8 h-8" />,
  },
  {
    href: '/calculators/hotel-cost-calculator',
    label: 'Hotel Cost Calculator',
    icon: <Hotel className="w-8 h-8" />,
  },
  {
    href: '/calculators/itinerary-time-planner',
    label: 'Itinerary Time Planner',
    icon: <ClipboardList className="w-8 h-8" />,
  },
  {
    href: '/calculators/jet-lag-calculator',
    label: 'Jet Lag Calculator',
    icon: <Bed className="w-8 h-8" />,
  },
  {
    href: '/calculators/layover-time-calculator',
    label: 'Layover Time Calculator',
    icon: <Hourglass className="w-8 h-8" />,
  },
  {
    href: '/calculators/multi-stop-route-planner',
    label: 'Multi-Stop Route Planner',
    icon: <Map className="w-8 h-8" />,
  },
  {
    href: '/calculators/rental-car-cost-calculator',
    label: 'Rental Car Cost Calculator',
    icon: <Car className="w-8 h-8" />,
  },
  {
    href: '/calculators/time-zone-difference-calculator',
    label: 'Time Zone Difference Calculator',
    icon: <Globe className="w-8 h-8" />,
  },
  {
    href: '/calculators/travel-buffer-time-calculator',
    label: 'Travel Buffer Time Calculator',
    icon: <ShieldCheck className="w-8 h-8" />,
  },
  {
    href: '/calculators/travel-days-calculator',
    label: 'Travel Days Calculator',
    icon: <CalendarDays className="w-8 h-8" />,
  },
  {
    href: '/calculators/travel-time-calculator',
    label: 'Travel Time Calculator',
    icon: <Clock className="w-8 h-8" />,
  },
  {
    href: '/calculators/trip-budget-calculator',
    label: 'Trip Budget Calculator',
    icon: <Wallet className="w-8 h-8" />,
  },
].sort((a, b) => a.label.localeCompare(b.label));

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Travel-Friend
        </h1>
        <p className="text-muted-foreground mt-2">
          Your new suite of essential travel calculators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {calculatorLinks.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="hover:bg-accent hover:border-accent-foreground/50 transition-colors h-full flex flex-col items-center justify-center p-6">
              <CardHeader className="p-0">
                <div className="flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <CardTitle className="text-center text-lg">{item.label}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

    