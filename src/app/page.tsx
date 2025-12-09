"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield, HeartPulse, Stethoscope, Gem, Zap } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Calculators</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/insurance">
          <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Insurance Affordability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Assess your capacity for insurance premium payments.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/out-of-pocket-health-cost-calculator">
          <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="w-6 h-6 text-primary" />
                Out-of-Pocket Health Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Estimate your total healthcare costs for a year.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/medical-bill-estimator">
          <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-primary" />
                Medical Bill Estimator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Estimate your cost for a specific medical procedure.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/wealth-consistency-tracker">
          <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="w-6 h-6 text-primary" />
                Wealth Consistency Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track and improve your monthly savings consistency.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/habit-based-wealth-growth-estimator">
          <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Habit-based Wealth Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Estimate growth by redirecting spending on habits.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
