'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateBackpackWeight } from '@/lib/calculators';
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
import { Backpack, Weight, PlusCircle, Trash2, Info, Shield, Compass, Scale } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required.'),
  weight: z.coerce.number().nonnegative('Weight cannot be negative.'),
  unit: z.enum(['grams', 'ounces', 'pounds']),
});

const formSchema = z.object({
  bodyWeight: z.coerce.number().positive('Body weight is required.'),
  bodyWeightUnit: z.enum(['pounds', 'kilograms']),
  items: z.array(itemSchema),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators = [
    { name: 'Bus vs. Train Cost Comparison', href: '/calculators/bus-vs-train-cost-calculator' },
    { name: 'Car vs. Flight Cost Comparison', href: '/calculators/car-vs-flight-calculator' },
    { name: 'Cost Per Mile Calculator', href: '/calculators/cost-per-mile-calculator' },
    { name: 'Cruise Cost Calculator', href: '/calculators/cruise-cost-calculator' },
    { name: 'Driving Time with Breaks Calculator', href: '/calculators/driving-time-with-breaks-calculator' },
    { name: 'EV Charging Cost Calculator', href: '/calculators/ev-charging-cost-calculator' },
    { name: 'Fuel Cost Calculator', href: '/calculators/fuel-cost-calculator' },
    { name: 'Group Expense Splitter', href: '/calculators/group-expense-splitter' },
    { name: 'Hiking Calorie Calculator', href: '/calculators/hiking-calorie-calculator' },
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

export default function BackpackWeightCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateBackpackWeight> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bodyWeight: undefined,
      bodyWeightUnit: 'pounds',
      items: [
        { name: 'Backpack', weight: undefined, unit: 'pounds' },
        { name: 'Tent', weight: undefined, unit: 'pounds' },
        { name: 'Sleeping Bag', weight: undefined, unit: 'grams' },
        { name: 'Water (1L)', weight: 1000, unit: 'grams' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateBackpackWeight(data.items, data.bodyWeight, data.bodyWeightUnit);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Backpack Weight Calculator</CardTitle>
          <CardDescription>
            Calculate your total pack weight and see how it compares to your body weight for optimal hiking performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
               <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Your Body Weight</h3>
                 <FormField
                    control={form.control}
                    name="bodyWeight"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Scale className="w-4 h-4" />Your Weight</FormLabel>
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
               </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Backpack /> Gear List</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_auto_auto_auto] items-end gap-2 p-3 border rounded-lg">
                       <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Tent" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`items.${index}.weight`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                               <Input type="number" placeholder="e.g., 900" {...field} value={field.value ?? ''} />
                            </FormControl>
                             <FormMessage/>
                          </FormItem>
                        )}
                      />
                      <FormField
                          control={form.control}
                          name={`items.${index}.unit`}
                          render={({ field: unitField }) => (
                           <FormItem>
                             <FormLabel>Unit</FormLabel>
                              <Select onValueChange={unitField.onChange} defaultValue={unitField.value}>
                                  <FormControl><SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    <SelectItem value="grams">grams</SelectItem>
                                    <SelectItem value="ounces">ounces</SelectItem>
                                    <SelectItem value="pounds">pounds</SelectItem>
                                  </SelectContent>
                              </Select>
                           </FormItem>
                          )}
                        />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 flex items-center gap-2"
                    onClick={() => append({ name: '', weight: undefined, unit: 'grams' })}>
                    <PlusCircle className="h-4 w-4" /> Add Item
                </Button>
              </div>

              <Button type="submit" size="lg" className="w-full">Calculate Pack Weight</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Backpack Weight Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                 <div className="p-6 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Pack Weight</p>
                    <p className="text-4xl font-bold text-primary">{result.totalWeightLbs.toFixed(2)} lbs / {result.totalWeightKg.toFixed(2)} kg</p>
                </div>
                 <div className="p-6 rounded-lg" style={{ backgroundColor: result.recommendation.color, color: 'hsl(var(--card-foreground))' }}>
                    <p className="text-sm">Weight as % of Body Weight</p>
                    <p className="text-4xl font-bold">{result.percentageOfBodyWeight}%</p>
                    <p className="text-xs font-semibold mt-1">{result.recommendation.text}</p>
                </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Weight Breakdown by Item</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Weight (lbs)</TableHead>
                    <TableHead className="text-right">Weight (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.items.map((item, index) => (
                     <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.weightLbs.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.weightKg.toFixed(2)}</TableCell>
                      </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{result.totalWeightLbs.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{result.totalWeightKg.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
            <p className="text-muted-foreground">Your current body weight. This is used as a benchmark to determine if your pack weight is within a healthy and sustainable range for your frame.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Gear List</h3>
            <p className="text-muted-foreground">List every item you plan to carry, including the backpack itself. Be meticulous—small items add up! Use a kitchen scale for accuracy if you're unsure of an item's weight.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculator converts all item weights into a common unit (kilograms) and sums them to find the total pack weight. It then calculates this total as a percentage of your body weight. Based on established backpacking guidelines, it provides a recommendation:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                <li><strong>10% or less:</strong> Ideal ultralight base weight.</li>
                <li><strong>10-20%:</strong> Excellent lightweight range for most backpackers.</li>
                <li><strong>20-30%:</strong> A conventional but heavy pack weight. Consider reducing weight.</li>
                <li><strong>Over 30%:</strong> Potentially dangerous. Significantly increases risk of injury and fatigue.</li>
            </ul>
             <p className="mt-2 text-xs text-muted-foreground">*Note: These percentages typically refer to "base weight" (pack weight without consumables like food, water, and fuel). When including consumables, your total pack weight might be higher, especially at the start of a long trip.</p>
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
