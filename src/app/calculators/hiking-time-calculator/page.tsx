'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateHikingTime } from '@/lib/calculators';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { Timer, Route, Mountain, Info, Shield, Compass, Footprints } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const formSchema = z.object({
  distance: z.coerce.number().positive('Distance must be positive.'),
  distanceUnit: z.enum(['miles', 'kilometers']),
  elevationGain: z.coerce.number().nonnegative('Elevation gain cannot be negative.'),
  elevationUnit: z.enum(['feet', 'meters']),
  pace: z.enum(['slow', 'average', 'fast']),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators = [
    { name: 'Backpack Weight Calculator', href: '/calculators/backpack-weight-calculator' },
    { name: 'Bus vs. Train Cost Comparison', href: '/calculators/bus-vs-train-cost-calculator' },
    { name: 'Car vs. Flight Cost Comparison', href: '/calculators/car-vs-flight-calculator' },
    { name: 'Cost Per Mile Calculator', href: '/calculators/cost-per-mile-calculator' },
    { name: 'Cruise Cost Calculator', href: '/calculators/cruise-cost-calculator' },
    { name: 'Driving Time with Breaks Calculator', href: '/calculators/driving-time-with-breaks-calculator' },
    { name: 'EV Charging Cost Calculator', href: '/calculators/ev-charging-cost-calculator' },
    { name: 'Fuel Cost Calculator', href: '/calculators/fuel-cost-calculator' },
    { name: 'Group Expense Splitter', href: '/calculators/group-expense-splitter' },
    { name: 'Hiking Calorie Calculator', href: '/calculators/hiking-calorie-calculator' },
    { name: 'Hotel Cost Calculator', href: '/calculators/hotel-cost-calculator' },
    { name: 'Itinerary Time Planner', href: '/calculators/itinerary-time-planner' },
    { name: 'Jet Lag Calculator', href: '/calculators/jet-lag-calculator' },
    { name: 'Layover Time Calculator', href: '/calculators/layover-time-calculator' },
    { name: 'Rental Car Cost Calculator', href: '/calculators/rental-car-cost-calculator' },
    { name: 'Time Zone Difference', href: '/calculators/time-zone-difference-calculator' },
    { name: 'Travel Buffer Time Calculator', href: '/calculators/travel-buffer-time-calculator' },
    { name: 'Travel Days Calculator', href: '/calculators/travel-days-calculator' },
    { name: 'Trip Budget Calculator', href: '/calculators/trip-budget-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));


export default function HikingTimeCalculator() {
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      distance: undefined,
      distanceUnit: 'miles',
      elevationGain: undefined,
      elevationUnit: 'feet',
      pace: 'average',
    },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateHikingTime(data);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Hiking Time Calculator</CardTitle>
          <CardDescription>
            Estimate your hiking time based on distance, elevation gain, and your personal pace using Naismith's Rule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Route className="w-4 h-4" />Hike Distance</FormLabel>
                        <div className="flex gap-2">
                        <FormControl>
                            <Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormField control={form.control} name="distanceUnit" render={({ field: unitField }) => (
                            <Select onValueChange={unitField.onChange} defaultValue={unitField.value}>
                                <FormControl><SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="miles">miles</SelectItem><SelectItem value="kilometers">km</SelectItem></SelectContent>
                            </Select>
                        )}/>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="elevationGain"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Mountain className="w-4 h-4" />Total Elevation Gain</FormLabel>
                        <div className="flex gap-2">
                        <FormControl>
                            <Input type="number" placeholder="e.g., 1500" {...field} value={field.value ?? ''} />
                        </FormControl>
                         <FormField control={form.control} name="elevationUnit" render={({ field: unitField }) => (
                            <Select onValueChange={unitField.onChange} defaultValue={unitField.value}>
                                <FormControl><SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="feet">feet</SelectItem><SelectItem value="meters">meters</SelectItem></SelectContent>
                            </Select>
                        )}/>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>
               <FormField
                  control={form.control}
                  name="pace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Footprints className="w-4 h-4" />Your Fitness Level / Pace</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="slow">Slow / Beginner (2 mph or 3.2 km/h)</SelectItem>
                          <SelectItem value="average">Average / Intermediate (3 mph or 4.8 km/h)</SelectItem>
                          <SelectItem value="fast">Fast / Advanced (4 mph or 6.4 km/h)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="submit">Calculate Hiking Time</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Estimated Hiking Time</CardTitle>
             <CardDescription>This is your estimated "moving time." Remember to add time for breaks, photos, and lunch.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-6 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated Moving Time</p>
                <p className="text-4xl font-bold text-primary">{result}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding the Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Distance & Elevation Gain</h3>
            <p className="text-muted-foreground">These are the two most critical factors for estimating hiking time. Elevation gain often has a greater impact on your time than horizontal distance.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Pace</h3>
            <p className="text-muted-foreground">This adjusts the formula based on your fitness level. Be honest with your self-assessment. If you're new to hiking or carrying a heavy pack, choose a slower pace.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This calculator uses a modified version of **Naismith's Rule**, a classic formula developed in 1892 by Scottish mountaineer William W. Naismith. The rule states that you should allow:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
              <li>1 hour for every 3 miles (or 5 km) of horizontal distance.</li>
              <li>1 additional hour for every 2,000 feet (or 600 meters) of ascent.</li>
          </ul>
          <p className="mt-2">Our calculator adjusts the base pace according to your selected fitness level and then adds the time calculated for the elevation gain to arrive at a total estimated moving time.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Compass className="h-5 w-5" />Related Calculators</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link href={calc.href} key={calc.name} className="block hover:no-underline">
              <Card className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors h-full text-center">
                <span className="font-semibold">{calc.name}</span>
              </Card>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
