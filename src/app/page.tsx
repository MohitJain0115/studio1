"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function CalculatorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">FinanceFriend</h1>
      <p className="text-muted-foreground">
        Your suite of financial calculators. Get started by asking me to add a new calculator.
      </p>
    </div>
  );
}
