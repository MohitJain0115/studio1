'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateCarVsFlight } from '@/lib/calculators';
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
import { Car, Plane, Info, Shield, Compass, DollarSign, Fuel, Briefcase, PlusCircle, Trash2, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';


const formSchema = z.object({
  // Common
  distance: z.coerce.number().positive('Distance must be positive'),
  distanceUnit: z.enum(['miles', 'kilometers']),
  numTravelers: z.coerce.number().int().positive('Must be at least 1 traveler'),

  // Car
  fuelEfficiency: z.coerce.number().positive('Efficiency must be positive'),
  efficiencyUnit: z.enum(['mpg', 'lp100km']),
  fuelPrice: z.coerce.number().positive('Fuel price must be positive'),
  priceUnit: z.enum(['per_gallon', 'per_liter']),
  otherCarCosts: z.coerce.number().nonnegative('Cannot be negative').default(0),

  // Flight
  flightCostPerPerson: z.coerce.number().positive('Flight cost must be positive'),
  baggageFeesPerPerson: z.coerce.number().nonnegative('Cannot be negative').default(0),
  transportToFromAirport: z.coerce.number().nonnegative('Cannot be negative').default(0),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators = [
    { name: 'Bus vs. Train Cost Comparison', href: '/calculators/bus-vs-train-cost-calculator' },
    { name: 'Cruise Cost Calculator', href: '/calculators/cruise-cost-calculator' },
    { name: 'Fuel Cost Calculator', href: '/calculators/fuel-cost-calculator' },
    { name: 'Trip Budget Calculator', href: '/calculators/trip-budget-calculator' },
    { name: 'Travel Time Calculator', href: '/calculators/travel-time-calculator' },
    { name: 'Cost Per Mile Calculator', href: '/calculators/cost-per-mile-calculator' },
    { name: 'Rental Car Cost Calculator', href: '/calculators/rental-car-cost-calculator' },
    { name: 'Multi-Stop Route Planner', href: '/calculators/multi-stop-route-planner' },
].sort((a,b) => a.name.localeCompare(b.name));


export default function CarVsFlightCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateCarVsFlight> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        distance: undefined,
        distanceUnit: 'miles',
        numTravelers: 1,
        fuelEfficiency: undefined,
        efficiencyUnit: 'mpg',
        fuelPrice: undefined,
        priceUnit: 'per_gallon',
        otherCarCosts: undefined,
        flightCostPerPerson: undefined,
        baggageFeesPerPerson: undefined,
        transportToFromAirport: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateCarVsFlight(data);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Car vs. Flight Cost Comparison</CardTitle>
          <CardDescription>
            Analyze the total costs of driving versus flying to determine the most economical travel option for your trip.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Common Details */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Common Trip Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="distance" render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Way Distance</FormLabel>
                      <div className="flex gap-2">
                        <FormControl><Input type="number" placeholder="e.g., 500" {...field} value={field.value ?? ''} /></FormControl>
                        <FormField control={form.control} name="distanceUnit" render={({ field: unitField }) => (
                            <select {...unitField} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="miles">miles</option><option value="kilometers">km</option></select>
                        )}/>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="numTravelers" render={({ field }) => (
                      <FormItem><FormLabel className="flex items-center gap-2"><Users className="h-4 w-4"/> Number of Travelers</FormLabel><FormControl><Input type="number" placeholder="e.g., 2" {...field} value={field.value ?? ''} min={1} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Car Costs */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Car className="h-5 w-5 text-primary" /> Driving Costs</h3>
                  <FormField control={form.control} name="fuelEfficiency" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Fuel Efficiency</FormLabel>
                       <div className="flex gap-2">
                        <FormControl><Input type="number" placeholder="e.g., 25" {...field} value={field.value ?? ''} /></FormControl>
                        <FormField control={form.control} name="efficiencyUnit" render={({ field: unitField }) => (
                            <select {...unitField} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="mpg">MPG</option><option value="lp100km">L/100km</option></select>
                        )}/>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="fuelPrice" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Price</FormLabel>
                      <div className="flex gap-2">
                        <FormControl><Input type="number" placeholder="e.g., 3.50" {...field} value={field.value ?? ''} step="0.01" /></FormControl>
                         <FormField control={form.control} name="priceUnit" render={({ field: unitField }) => (
                             <select {...unitField} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="per_gallon">per gallon</option><option value="per_liter">per liter</option></select>
                         )}/>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="otherCarCosts" render={({ field }) => (
                      <FormItem><FormLabel>Other Round-Trip Costs (Tolls, Parking)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>

                {/* Flight Costs */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Plane className="h-5 w-5 text-primary" /> Flying Costs</h3>
                  <FormField control={form.control} name="flightCostPerPerson" render={({ field }) => (
                      <FormItem><FormLabel>Round-Trip Flight Cost (per person)</FormLabel><FormControl><Input type="number" placeholder="e.g., 350" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="baggageFeesPerPerson" render={({ field }) => (
                      <FormItem><FormLabel>Round-Trip Baggage Fees (per person)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="transportToFromAirport" render={({ field }) => (
                      <FormItem><FormLabel>Airport Transport (Round-Trip Total)</FormLabel><FormControl><Input type="number" placeholder="e.g., 80" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
              </div>
              
              <Button type="submit">Compare Costs</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Comparison Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: result.bgColor, color: result.textColor }}>
              <p className="text-lg font-semibold">{result.verdict}</p>
              <p>You could save approximately <span className="font-bold">${result.savings.toFixed(2)}</span> by choosing {result.cheaperOption}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Driving Cost Breakdown</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex justify-between"><span>Fuel Cost (Round Trip):</span> <span className="font-medium text-foreground">${result.car.fuelCost.toFixed(2)}</span></li>
                      <li className="flex justify-between"><span>Other Costs (Tolls, Parking):</span> <span className="font-medium text-foreground">${result.car.otherCosts.toFixed(2)}</span></li>
                      <li className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-bold">Total Driving Cost:</span>
                          <span className="font-bold text-primary">${result.car.total.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between">
                          <span className="font-bold">Cost Per Person:</span>
                          <span className="font-bold text-primary">${result.car.perPerson.toFixed(2)}</span>
                      </li>
                  </ul>
              </div>
              <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Flying Cost Breakdown</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex justify-between"><span>Total Airfare:</span> <span className="font-medium text-foreground">${result.flight.airfare.toFixed(2)}</span></li>
                      <li className="flex justify-between"><span>Total Baggage Fees:</span> <span className="font-medium text-foreground">${result.flight.baggage.toFixed(2)}</span></li>
                      <li className="flex justify-between"><span>Airport Transport:</span> <span className="font-medium text-foreground">${result.flight.airportTransport.toFixed(2)}</span></li>
                      <li className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-bold">Total Flying Cost:</span>
                          <span className="font-bold text-primary">${result.flight.total.toFixed(2)}</span>
                      </li>
                       <li className="flex justify-between">
                          <span className="font-bold">Cost Per Person:</span>
                          <span className="font-bold text-primary">${result.flight.perPerson.toFixed(2)}</span>
                      </li>
                  </ul>
              </div>
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
            <h3 className="font-semibold text-lg">Common Details</h3>
            <p className="text-muted-foreground">The one-way distance and number of travelers are the foundation for the entire comparison, affecting both driving and flying calculations.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Driving Costs</h3>
            <p className="text-muted-foreground">This section covers the direct costs of a road trip. The calculator will determine the round-trip fuel cost. 'Other Costs' should include any tolls, parking fees, or potential maintenance costs you anticipate for the round trip.</p>
          </div>
           <div>
            <h3 className="font-semibold text-lg">Flying Costs</h3>
            <p className="text-muted-foreground">These are the per-person and total costs associated with air travel. 'Airport Transport' refers to the total cost of getting to and from the airports at both your origin and destination (e.g., taxis, parking, train).</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculator independently totals the costs for a round trip by car and by plane. It then compares the two totals to determine the most cost-effective option and the potential savings.</p>
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
          <CardTitle className="text-2xl font-bold">The Ultimate Cost-Benefit Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">A Comprehensive Guide to Deciding Between Driving and Flying</h2>
          <p>For trips ranging from a few hundred to a thousand miles, the decision to drive or fly is a classic travel dilemma. Flying is faster, but driving offers flexibility and can be cheaper for groups. A true comparison requires looking beyond the sticker price of an airline ticket or a tank of gas. This guide breaks down the full spectrum of costs—both obvious and hidden—to help you make a financially sound decision for your next trip.</p>
          
          <h3 className="text-lg font-semibold text-foreground">The Economics of Driving: More Than Just Fuel</h3>
          <p>Calculating the cost of a road trip seems simple at first, but a comprehensive analysis includes several factors:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Fuel Costs:</strong> This is the primary variable cost. Our calculator determines this using your vehicle's efficiency, the round-trip distance, and the local price of fuel.</li>
            <li><strong>Wear and Tear:</strong> While not a direct out-of-pocket expense for the trip itself, long-distance driving accelerates your car's depreciation and maintenance needs (tires, oil changes). The IRS mileage rate (around $0.67 per mile in 2024) is a professional standard for estimating this "all-in" cost of operating a vehicle. For a 1,000-mile round trip, this hidden cost could be over $600.</li>
            <li><strong>Tolls and Parking:</strong> These costs can add up significantly, especially in urban areas. A cross-country trip can easily incur over $100 in tolls alone. Parking at your destination can add $20-$50 per day.</li>
            <li><strong>Overnight Stays:</strong> For very long drives, you may need to factor in the cost of a hotel or motel en route, which can dramatically increase the total cost of driving.</li>
          </ul>
          <p>The cost of driving is largely fixed regardless of the number of passengers (except for a marginal increase in fuel consumption due to weight). This means that for groups of two or more, the per-person cost of driving drops significantly, often making it the cheaper option.</p>

          <h3 className="text-lg font-semibold text-foreground">The Full Cost of Flying: Deconstructing the Ticket Price</h3>
          <p>Air travel costs are more than just the price shown on the booking website. A complete picture includes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Airfare:</strong> The base ticket price per person. This is the most visible cost.</li>
            <li><strong>Baggage Fees:</strong> Most airlines charge for checked bags, and some budget carriers even charge for standard carry-ons. These fees are per person and per flight segment, so they can add up quickly for a round trip.</li>
            <li><strong>Transportation to/from the Airport:</strong> This is a frequently overlooked but significant cost. Parking at an airport for a week can cost over $100. A round-trip taxi or Uber ride to the airport from your home and from the destination airport to your hotel can easily exceed $150.</li>
            <li><strong>Rental Car at Destination:</strong> If you fly, you may need to rent a car at your destination to have local mobility. This adds a substantial daily cost to the flying option, which the driving option avoids as you have your own vehicle.</li>
          </ul>
          <p>Unlike driving, most flying costs scale on a per-person basis. This makes flying more expensive for families and groups compared to solo travelers.</p>

          <h3 className="text-lg font-semibold text-foreground">The Time vs. Money Trade-Off: The Value of Your Time</h3>
          <p>This calculator focuses on the financial aspect, but the most critical non-financial factor is time. A 500-mile trip might be an 8-hour drive but only a 1.5-hour flight. However, the "flight" time is misleading. You must also account for:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Travel to the departure airport (1 hour)</li>
            <li>Airport check-in and security (1.5-2 hours)</li>
            <li>Boarding and waiting to take off (0.5 hours)</li>
            <li>Deplaning and baggage claim (0.5 hours)</li>
            <li>Travel from the destination airport (1 hour)</li>
          </ul>
          <p>The "1.5-hour flight" easily becomes a 5-6 hour door-to-door journey. For a 500-mile trip, driving is only a couple of hours longer but offers complete schedule flexibility and the ability to pack whatever you want. For a 1,000-mile trip, flying saves a significant amount of time (a full day of driving), making it a more compelling option.</p>
          <p>Consider the value of your time. If taking an extra day to drive costs you a day of work or a day of vacation, that "cost" should be factored into your decision.</p>

          <h3 className="text-lg font-semibold text-foreground">The Break-Even Point</h3>
          <p>The break-even point often depends on the number of travelers. For a solo traveler, flying is often cheaper for distances over 400-500 miles. For a family of four, driving is almost always cheaper, even for trips over 1,000 miles, because you are saving on four separate airfares. This calculator is designed to find that specific break-even point for your exact scenario, moving beyond rules of thumb to give you a data-driven answer.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What's a good way to estimate "Other Car Costs"?</AccordionTrigger>
              <AccordionContent>
                <p>Use Google Maps with the "avoid tolls" option turned off to see potential toll costs for your route. For parking, search for daily parking rates in the city you're visiting. It's wise to add a small buffer of $20-$50 for unexpected costs.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Does this calculator include the cost of a rental car at the destination?</AccordionTrigger>
              <AccordionContent>
                <p>No. If you need a rental car after flying, you should add the total estimated cost of that rental to the "Airport Transport" field or as a separate line item when you evaluate the final numbers. This is a critical extra cost for the flying option.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I account for the cost of wear and tear on my car?</AccordionTrigger>
              <AccordionContent>
                <p>A simple method is to use the current IRS mileage rate. Multiply the round-trip mileage by this rate to get a comprehensive estimate of gas, maintenance, and depreciation. You can add this figure to the "Other Car Costs" field for a more complete comparison.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>At what distance is it almost always better to fly?</AccordionTrigger>
              <AccordionContent>
                <p>For most solo travelers, trips over 700-800 miles (a full day of driving) are usually better suited for flying when you factor in the value of your time and the cost of potential overnight stops while driving. For groups, this can extend to over 1,200 miles.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What about the environmental cost?</AccordionTrigger>
              <AccordionContent>
                <p>Generally, a full commercial flight has a lower carbon footprint per person than a single person driving a gas-powered car over the same long distance. However, if you are a group of 3 or 4 in a fuel-efficient car, driving becomes more environmentally friendly per person than flying.</p>
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
          <p className="text-muted-foreground">The Car vs. Flight Calculator provides a purely financial comparison between driving and flying for a given trip. By inputting all associated costs—from fuel and tolls to airfare and baggage fees—it offers a clear verdict on the most economical choice. However, the best decision always involves balancing this financial data with the non-financial factor of time, flexibility, and personal preference.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
