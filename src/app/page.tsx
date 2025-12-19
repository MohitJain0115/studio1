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
    href: '/converters/angle-converter',
    title: 'Angle Converter',
    description: 'Convert between degrees, radians, and other angle units.',
  },
  {
    href: '/converters/area-converter',
    title: 'Area Converter',
    description: 'Easily convert between different units of area.',
  },
  {
    href: '/converters/chemical-concentration-converter',
    title: 'Chemical Concentration Converter',
    description: 'Convert between molar, millimolar, and other concentration units.',
  },
  {
    href: '/converters/construction-converter',
    title: 'Construction Units Converter',
    description: 'Convert common units for length, area, and volume in construction.',
  },
  {
    href: '/converters/cooking-converter',
    title: 'Cooking Converter',
    description: 'Convert between teaspoons, tablespoons, cups, and other kitchen units.',
  },
  {
    href: '/converters/data-storage-converter',
    title: 'Data Storage Converter',
    description: 'Convert between bits, bytes, kilobytes, and larger units of digital information.',
  },
  {
    href: '/converters/data-transfer-speed-converter',
    title: 'Data Transfer Speed Converter',
    description: 'Convert between various units of data transfer speed, like Mbps and MB/s.',
  },
  {
    href: '/converters/density-converter',
    title: 'Density Converter',
    description: 'Convert between different units of density like kg/m³ and lb/ft³.',
  },
  {
    href: '/converters/electrical-converter',
    title: 'Electrical Converter (Ohm\'s Law)',
    description: 'Calculate voltage, current, resistance, and power.',
  },
  {
    href: '/converters/energy-converter',
    title: 'Energy Converter',
    description: 'Convert between Joules, Calories, kWh, and other units of energy.',
  },
  {
    href: '/converters/flow-rate-converter',
    title: 'Flow Rate Converter',
    description: 'Convert between different units of fluid flow rate like L/s and GPM.',
  },
  {
    href: '/converters/force-converter',
    title: 'Force Converter',
    description: 'Convert between newtons, dyne, and other units of force.',
  },
  {
    href: '/converters/frequency-converter',
    title: 'Frequency Converter',
    description: 'Convert between hertz, kilohertz, RPM, and other frequency units.',
  },
  {
    href: '/converters/fuel-economy-converter',
    title: 'Fuel Economy Converter',
    description: 'Convert between MPG, L/100km, and other fuel efficiency units.',
  },
  {
    href: '/converters/length-and-distance-converter',
    title: 'Length & Distance Converter',
    description: 'Quickly convert between various units of length and distance.',
  },
  {
    href: '/converters/luminance-and-light-converter',
    title: 'Luminance & Light Converter',
    description: 'Convert between candela/m², nits, lamberts, and other light units.',
  },
  {
    href: '/converters/material-converter',
    title: 'Material-Based Weight ↔ Volume Converter',
    description: 'Convert between weight and volume for common materials like water, steel, and sand.',
  },
  {
    href: '/converters/power-converter',
    title: 'Power Converter',
    description: 'Convert between watts, horsepower, and other units of power.',
  },
  {
    href: '/converters/pressure-converter',
    title: 'Pressure Converter',
    description: 'Convert between pascals, bars, psi, and other pressure units.',
  },
  {
    href: '/converters/speed-converter',
    title: 'Speed Converter',
    description: 'Convert between different units of speed, such as kph, mph, and knots.',
  },
  {
    href: '/converters/temperature-converter',
    title: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, and Kelvin.',
  },
  {
    href: '/converters/time-converter',
    title: 'Time Converter',
    description: 'Convert between seconds, minutes, hours, days, and other units of time.',
  },
  {
    href: '/converters/torque-converter',
    title: 'Torque Converter',
    description: 'Convert between newton-meters, pound-feet, and other torque units.',
  },
  {
    href: '/converters/volume-converter',
    title: 'Volume Converter',
    description: 'Easily convert between different metric and imperial units of volume.',
  },
  {
    href: '/converters/weight-and-mass-converter',
    title: 'Weight & Mass Converter',
    description: 'Seamlessly convert between various units of weight and mass.',
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
