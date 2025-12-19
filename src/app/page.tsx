"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

const calculators = [
  {
    href: '/converters/length-and-distance-converter',
    title: 'Length & Distance Converter',
    description: 'Quickly convert between various units of length and distance.',
  },
  {
    href: '/converters/weight-and-mass-converter',
    title: 'Weight & Mass Converter',
    description: 'Seamlessly convert between various units of weight and mass.',
  },
  {
    href: '/converters/area-converter',
    title: 'Area Converter',
    description: 'Easily convert between different units of area.',
  },
  {
    href: '/converters/volume-converter',
    title: 'Volume Converter',
    description: 'Easily convert between different metric and imperial units of volume.',
  },
  {
    href: '/converters/temperature-converter',
    title: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, and Kelvin.',
  },
];

export default function CalculatorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">FinanceFriend</h1>
      <p className="text-muted-foreground">
        Your suite of financial calculators. Get started by selecting a calculator below.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.sort((a, b) => a.title.localeCompare(b.title)).map((calculator) => (
          <Link href={calculator.href} key={calculator.href} className="block hover:no-underline">
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{calculator.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{calculator.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
