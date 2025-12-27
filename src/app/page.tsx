'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Fuel,
} from 'lucide-react';
import Link from 'next/link';

const calculatorLinks = [
  {
    href: '/calculators/fuel-cost-calculator',
    label: 'Fuel Cost Calculator',
    icon: <Fuel className="w-8 h-8" />,
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
