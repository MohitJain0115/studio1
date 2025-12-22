'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateCostPerMile } from '@/lib/calculators';
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
import { Route, DollarSign, Info, Shield, Compass } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  totalCost: z.coerce.number().positive('Total cost must be a positive number.'),
  totalDistance: z.coerce.number().positive('Total distance must be a positive number.'),
  distanceUnit: z.enum(['miles', 'kilometers']),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators = [
    { name: 'Fuel Cost Calculator', href: '/calculators/fuel-cost-calculator' },
    { name: 'Trip Budget Calculator', href: '/calculators/trip-budget-calculator' },
    { name: 'Car vs. Flight Cost Comparison', href: '/calculators/car-vs-flight-calculator' },
    { name: 'EV Charging Cost Calculator', href: '/calculators/ev-charging-cost-calculator' },
    { name: 'Rental Car Cost Calculator', href: '/calculators/rental-car-cost-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));


export default function CostPerMileCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateCostPerMile> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalCost: undefined,
      totalDistance: undefined,
      distanceUnit: 'miles',
    },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateCostPerMile(data);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Trip Cost Per Mile/Kilometer Calculator</CardTitle>
          <CardDescription>
            Calculate the cost per unit of distance for your trip to understand its true running cost.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><DollarSign className="w-4 h-4" />Total Trip Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 150" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Route className="w-4 h-4" />Total Trip Distance</FormLabel>
                     <div className="flex gap-2">
                        <FormControl>
                          <Input type="number" placeholder="e.g., 300" {...field} value={field.value ?? ''} />
                        </FormControl>
                         <FormField
                            control={form.control}
                            name="distanceUnit"
                            render={({ field: unitField }) => (
                              <Select onValueChange={unitField.onChange} defaultValue={unitField.value}>
                                <FormControl>
                                  <SelectTrigger className="w-[150px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="miles">miles</SelectItem>
                                  <SelectItem value="kilometers">kilometers</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Calculate Cost Per Unit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Unit Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-6 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Cost per {form.getValues('distanceUnit').slice(0, -1)}</p>
                <p className="text-4xl font-bold text-primary">${result.costPerUnit.toFixed(2)}</p>
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
            <h3 className="font-semibold text-lg">Total Trip Cost</h3>
            <p className="text-muted-foreground">The entire out-of-pocket cost for the journey. For a road trip, this should primarily be the fuel cost, but you can also include tolls and other direct expenses.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Total Trip Distance</h3>
            <p className="text-muted-foreground">The full distance covered during the trip, from start to finish.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculation is a simple division of the total cost by the total distance.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">Cost Per Unit = Total Cost / Total Distance</p>
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
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">The True Cost of a Mile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">A Guide to Understanding Unit Cost in Travel Budgeting</h2>
          <p>When planning a trip, we often focus on the total cost. However, breaking that down into a "cost per mile" or "cost per kilometer" provides a powerful metric for comparing the efficiency of different trips or modes of transport. This guide explores the utility of unit cost, what it reveals about your travel habits, and how to use this data to make smarter financial decisions.</p>
          
          <h3 className="text-lg font-semibold text-foreground">What is Cost Per Mile?</h3>
          <p>Cost per mile is a unit rate that tells you how much money you spend for every mile you travel. It normalizes the cost of a trip, allowing for an apples-to-apples comparison regardless of the trip's length. A trip that costs $100 and covers 400 miles has a cost of $0.25 per mile. A trip that costs $150 and covers 500 miles has a cost of $0.30 per mile, making it more expensive on a per-unit basis.</p>

          <h3 className="text-lg font-semibold text-foreground">Why This Metric Matters</h3>
          <p>Calculating the cost per mile is useful for several reasons:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Budgeting for Future Trips:</strong> Once you know your vehicle's typical cost per mile, you can quickly estimate the fuel cost for any future trip. A 1,000-mile road trip at $0.15 per mile will reliably cost about $150 in fuel.</li>
            <li><strong>Comparing Vehicles:</strong> If you're considering buying a new car, comparing the cost per mile (based on fuel efficiency and fuel type) is a more practical way to understand long-term running costs than just looking at MPG ratings. An EV might have a cost per mile of $0.04, while a gas car has $0.12, making the EV three times cheaper to run.</li>
            <li><strong>Business Expense Reporting:</strong> For freelancers or business owners who use a personal vehicle for work, knowing your cost per mile helps in accurately billing clients or deducting expenses. While the IRS provides a standard mileage rate, knowing your actual cost can be beneficial for internal accounting.</li>
            <li><strong>Evaluating Travel Choices:</strong> You can compare the cost per mile of driving versus other forms of transport to see which is truly the most economical.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground">What to Include in "Total Cost"</h3>
          <p>The accuracy of the cost-per-mile calculation depends on what you include in the "Total Cost." There are different levels of analysis:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Level 1: Fuel/Energy Only.</strong> This is the most common and straightforward calculation. The total cost is simply the amount spent on gasoline or electricity for the trip. This gives you the direct running cost.</li>
            <li><strong>Level 2: Fuel + Direct Costs.</strong> This includes fuel plus any tolls or parking fees incurred during the trip. This provides a more complete picture of the journey's out-of-pocket expenses.</li>
            <li><strong>Level 3: All-In Operating Cost.</strong> This is the most comprehensive analysis, used by businesses and fleet managers. It includes fuel, tolls, but also accounts for vehicle depreciation, insurance, maintenance, and tires on a per-mile basis. The IRS standard mileage rate is a blended average designed to represent this all-in cost. For a personal trip, this level of detail is often unnecessary, but it reveals the true, long-term cost of using your vehicle.</li>
          </ul>
          <p>For most personal travel planning, using the "Fuel Only" or "Fuel + Direct Costs" method is perfectly sufficient and highly useful.</p>

          <h3 className="text-lg font-semibold text-foreground">Example Scenario: Comparing Two Cars</h3>
          <p>Imagine you are choosing between two cars for a 400-mile road trip. Gas costs $4.00 per gallon.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Car A (Sedan):</strong> Gets 30 MPG. It will need 13.33 gallons (400 / 30), costing $53.32. The cost per mile is **$0.13**.</li>
            <li><strong>Car B (SUV):</strong> Gets 20 MPG. It will need 20 gallons (400 / 20), costing $80.00. The cost per mile is **$0.20**.</li>
          </ul>
          <p>The SUV is significantly more expensive to operate on a per-mile basis. Over the course of 15,000 miles of driving in a year, this difference amounts to over $1,000 in extra fuel costs.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Should I include the cost of my hotel and food in the "Total Cost"?</AccordionTrigger>
              <AccordionContent>
                <p>Generally, no. The cost per mile is typically used to analyze the transportation cost itself, not the entire trip budget. Including accommodation and food would inflate the number and make it less useful for comparing vehicle efficiency or estimating future fuel costs.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What is the IRS mileage rate and should I use it?</AccordionTrigger>
              <AccordionContent>
                <p>The IRS standard mileage rate is an amount set by the US government for deducting the cost of operating a vehicle for business purposes. It's an estimated "all-in" rate that includes fuel, maintenance, depreciation, and insurance. While you can use it as your total cost to get a comprehensive cost per mile, it's generally more useful for tax purposes than for simple trip budgeting, where fuel cost is the primary concern.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How can I lower my cost per mile?</AccordionTrigger>
              <AccordionContent>
                <p>The best way to lower your cost per mile is to improve your vehicle's fuel efficiency. This can be done by ensuring your tires are properly inflated, removing excess weight from the car, and adopting a smoother driving style with less aggressive acceleration and braking.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>How does cost per mile differ for electric vehicles (EVs)?</AccordionTrigger>
              <AccordionContent>
                <p>The principle is the same, but the inputs are different. For an EV, the "Total Cost" is the cost of electricity used. Since electricity is much cheaper than gasoline and EVs are more efficient, their cost per mile is typically 3-5 times lower than a comparable gas car. Use our EV Charging Cost Calculator to determine the total energy cost for your trip.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The Cost Per Mile Calculator is an analytical tool that distills complex trip expenses into a single, comparable unit of measurement. By dividing the total transportation cost by the distance traveled, it provides a clear metric for budgeting future trips, comparing the operating costs of different vehicles, and making more informed financial decisions about your travel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    