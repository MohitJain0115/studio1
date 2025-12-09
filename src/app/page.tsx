"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorsPage() {
  return (
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
    </div>
  );
}
