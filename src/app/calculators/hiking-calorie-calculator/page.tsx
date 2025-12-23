'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateHikingCalories } from '@/lib/calculators';
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
import { Flame, Weight, Timer, Mountain, Info, Shield, Compass, Scale } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  bodyWeight: z.coerce.number().positive('Body weight must be positive.'),
  bodyWeightUnit: z.enum(['pounds', 'kilograms']),
  hikeDuration: z.coerce.number().positive('Duration must be positive in minutes.'),
  intensity: z.enum(['easy', 'moderate', 'strenuous']),
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
    { name: 'Hiking Time Calculator', href: '/calculators/hiking-time-calculator' },
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

export default function HikingCalorieCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bodyWeight: undefined,
      bodyWeightUnit: 'pounds',
      hikeDuration: undefined,
      intensity: 'moderate',
    },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateHikingCalories(data);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Hiking Calorie Calculator</CardTitle>
          <CardDescription>
            Estimate the number of calories burned during your hike based on your body weight, hike duration, and intensity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="bodyWeight"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Scale className="w-4 h-4" />Body Weight</FormLabel>
                        <div className="flex gap-2">
                        <FormControl>
                            <Input type="number" placeholder="e.g., 150" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormField control={form.control} name="bodyWeightUnit" render={({ field: unitField }) => (
                            <Select onValueChange={unitField.onChange} defaultValue={unitField.value}>
                                <FormControl><SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="pounds">lbs</SelectItem><SelectItem value="kilograms">kg</SelectItem></SelectContent>
                            </Select>
                        )}/>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="hikeDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Timer className="w-4 h-4" />Hike Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 180" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Mountain className="w-4 h-4" />Hike Intensity</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy (Flat terrain, light pack)</SelectItem>
                          <SelectItem value="moderate">Moderate (Rolling hills, moderate pack)</SelectItem>
                          <SelectItem value="strenuous">Strenuous (Steep terrain, heavy pack)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Calculate Calories</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Estimated Calorie Burn</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-6 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Calories Burned</p>
                <p className="text-4xl font-bold text-primary">{result.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
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
            <h3 className="font-semibold text-lg">Body Weight</h3>
            <p className="text-muted-foreground">Your body weight is a key factor in calorie expenditure. A heavier person will burn more calories than a lighter person doing the same activity.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Hike Duration</h3>
            <p className="text-muted-foreground">The total time you spent hiking, in minutes.</p>
          </div>
           <div>
            <h3 className="font-semibold text-lg">Hike Intensity</h3>
            <p className="text-muted-foreground">This is a subjective measure of your hike's difficulty, which corresponds to a MET value (Metabolic Equivalent of Task). "Easy" might be a flat trail, while "Strenuous" involves significant elevation gain and/or a heavy backpack.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculator uses a standard formula based on the Metabolic Equivalent of Task (MET). One MET is the energy equivalent of sitting quietly. The calculator assigns a MET value based on your selected intensity:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                <li><strong>Easy:</strong> ~4.0 METs</li>
                <li><strong>Moderate:</strong> ~6.0 METs</li>
                <li><strong>Strenuous:</strong> ~8.0 METs</li>
            </ul>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Calories Burned = (MET Value * Body Weight in kg * 3.5) / 200 * Duration in minutes</p>
          </div>
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
