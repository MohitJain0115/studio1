'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateBusVsTrain, formatCurrency } from '@/lib/calculators';
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
import { Bus, Train, Users, DollarSign, Info, Shield, Compass } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  numTravelers: z.coerce.number().int().positive('Must be at least 1 traveler'),
  
  // Bus
  busTicketCost: z.coerce.number().positive('Ticket cost must be positive'),
  busBaggageFees: z.coerce.number().nonnegative('Cannot be negative').default(0),
  busOtherCosts: z.coerce.number().nonnegative('Cannot be negative').default(0),

  // Train
  trainTicketCost: z.coerce.number().positive('Ticket cost must be positive'),
  trainBaggageFees: z.coerce.number().nonnegative('Cannot be negative').default(0),
  trainOtherCosts: z.coerce.number().nonnegative('Cannot be negative').default(0),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators = [
    { name: 'Car vs. Flight Cost Comparison', href: '/calculators/car-vs-flight-calculator' },
    { name: 'Trip Budget Calculator', href: '/calculators/trip-budget-calculator' },
    { name: 'Travel Time Calculator', href: '/calculators/travel-time-calculator' },
    { name: 'Group Expense Splitter', href: '/calculators/group-expense-splitter' },
    { name: 'Rental Car Cost Calculator', href: '/calculators/rental-car-cost-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));


export default function BusVsTrainCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateBusVsTrain> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        numTravelers: 1,
        busTicketCost: undefined,
        busBaggageFees: 0,
        busOtherCosts: 0,
        trainTicketCost: undefined,
        trainBaggageFees: 0,
        trainOtherCosts: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateBusVsTrain(data);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Bus vs. Train Cost Comparison</CardTitle>
          <CardDescription>
            Compare the total costs of traveling by bus versus train to find the most economical option for your journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Common Trip Details</h3>
                <FormField control={form.control} name="numTravelers" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2"><Users className="h-4 w-4"/> Number of Travelers</FormLabel><FormControl><Input type="number" placeholder="e.g., 2" {...field} value={field.value ?? ''} min={1} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bus Costs */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Bus className="h-5 w-5 text-primary" /> Bus Costs</h3>
                   <FormField control={form.control} name="busTicketCost" render={({ field }) => (
                        <FormItem><FormLabel>Ticket Cost (per person)</FormLabel><FormControl><Input type="number" placeholder="e.g., 45" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="busBaggageFees" render={({ field }) => (
                        <FormItem><FormLabel>Baggage Fees (per person)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? '0'} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="busOtherCosts" render={({ field }) => (
                        <FormItem><FormLabel>Other Costs (e.g., station transport, total)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? '0'} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>

                {/* Train Costs */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Train className="h-5 w-5 text-primary" /> Train Costs</h3>
                    <FormField control={form.control} name="trainTicketCost" render={({ field }) => (
                        <FormItem><FormLabel>Ticket Cost (per person)</FormLabel><FormControl><Input type="number" placeholder="e.g., 75" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="trainBaggageFees" render={({ field }) => (
                        <FormItem><FormLabel>Baggage Fees (per person)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? '0'} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="trainOtherCosts" render={({ field }) => (
                        <FormItem><FormLabel>Other Costs (e.g., station transport, total)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? '0'} /></FormControl><FormMessage /></FormItem>
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
              <p>You could save approximately <span className="font-bold">{formatCurrency(result.savings)}</span> by choosing the {result.cheaperOption}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Bus Cost Breakdown</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex justify-between"><span>Total Ticket Cost:</span> <span className="font-medium text-foreground">{formatCurrency(result.bus.ticketCost)}</span></li>
                      <li className="flex justify-between"><span>Total Baggage Fees:</span> <span className="font-medium text-foreground">{formatCurrency(result.bus.baggageFees)}</span></li>
                      <li className="flex justify-between"><span>Other Costs:</span> <span className="font-medium text-foreground">{formatCurrency(result.bus.otherCosts)}</span></li>
                      <Separator className="my-2" />
                      <li className="flex justify-between font-bold"><span>Total Bus Cost:</span> <span className="text-primary">{formatCurrency(result.bus.total)}</span></li>
                      <li className="flex justify-between font-bold"><span>Cost Per Person:</span> <span className="text-primary">{formatCurrency(result.bus.perPerson)}</span></li>
                  </ul>
              </div>
              <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Train Cost Breakdown</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex justify-between"><span>Total Ticket Cost:</span> <span className="font-medium text-foreground">{formatCurrency(result.train.ticketCost)}</span></li>
                      <li className="flex justify-between"><span>Total Baggage Fees:</span> <span className="font-medium text-foreground">{formatCurrency(result.train.baggageFees)}</span></li>
                      <li className="flex justify-between"><span>Other Costs:</span> <span className="font-medium text-foreground">{formatCurrency(result.train.otherCosts)}</span></li>
                       <Separator className="my-2" />
                      <li className="flex justify-between font-bold"><span>Total Train Cost:</span> <span className="text-primary">{formatCurrency(result.train.total)}</span></li>
                      <li className="flex justify-between font-bold"><span>Cost Per Person:</span> <span className="text-primary">{formatCurrency(result.train.perPerson)}</span></li>
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
            <h3 className="font-semibold text-lg">Per-Person Costs</h3>
            <p className="text-muted-foreground">Ticket and baggage fees are entered on a per-person basis. The calculator automatically multiplies these by the number of travelers to get the total.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Total Other Costs</h3>
            <p className="text-muted-foreground">This field is for the entire group's other expenses for that mode of travel. This includes things like the total cost of taxis or public transit to and from the bus or train station at both your origin and destination.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculator totals all per-person and group costs for both bus and train travel. It then compares the two grand totals to identify the more economical option and calculate the potential savings, providing a clear financial basis for your decision.</p>
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
          <CardTitle className="text-2xl font-bold">The Ground Travel Dilemma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">A Comprehensive Guide to Choosing Between Bus and Train Travel</h2>
          <p>For medium to long-distance ground travel, the choice between taking a bus or a train is a classic one. Buses often boast the lowest prices, while trains are typically faster and more comfortable. However, a true cost-benefit analysis requires a deeper look at the various factors that influence the price, duration, and overall experience of your journey. This guide breaks down the essential considerations to help you decide which mode of transport is right for your trip.</p>
          
          <h3 className="text-lg font-semibold text-foreground">The Cost Factor: More Than Just the Ticket Price</h3>
          <p>While buses are frequently cheaper upfront, a complete cost comparison should include several elements:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Ticket Price:</strong> This is the most visible cost. Bus tickets, especially when booked in advance with carriers like Megabus or BoltBus, can be significantly cheaper than train tickets. Train pricing is often more dynamic, with prices increasing closer to the departure date.</li>
            <li><strong>Baggage Fees:</strong> This is an area where trains often have an advantage. Many train services (like Amtrak in the US) offer generous free baggage allowances, including multiple checked bags. Bus companies, on the other hand, often have stricter limits and may charge for extra or oversized bags.</li>
            <li><strong>Transportation to the Station:</strong> Consider the location of the bus terminal versus the train station. Train stations are often centrally located in major cities with excellent public transit links, potentially saving you money on a taxi. Bus terminals can sometimes be in less central or less accessible locations.</li>
            <li><strong>Onboard Amenities & Costs:</strong> While train travel might be more expensive, it may offer amenities that save you money elsewhere. Access to a dining car or the ability to bring your own food and drink without restriction can reduce your onboard spending compared to a bus with limited options.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground">The Time and Comfort Equation</h3>
          <p>This calculator focuses on cost, but your time and comfort are invaluable. Here’s how the two options generally stack up:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Speed and Punctuality:</strong> Trains are almost always faster than buses. They run on dedicated tracks, are not subject to road traffic or congestion, and make fewer stops. This also makes them more likely to arrive on time. A bus journey from New York to Washington D.C. can take 4-5 hours, while the train can do it in under 3.</li>
            <li><strong>Comfort and Space:</strong> Trains offer a superior level of comfort. Seats are larger with more legroom, and passengers can get up and walk around, visit a cafe car, or stretch out. Buses are more cramped, with limited ability to move during the journey. For overnight trips, the ability to recline or book a sleeper car on a train is a significant advantage.</li>
            <li><strong>Scenery:</strong> Train routes often travel through scenic landscapes inaccessible by road, offering a more picturesque journey.</li>
            <li><strong>Productivity:</strong> The smoother ride and increased space on a train, often coupled with reliable Wi-Fi and power outlets at every seat, make it a much better environment for working or relaxing.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground">Making the Decision: Key Scenarios</h3>
          <p>So, which should you choose? It often comes down to your priorities for a specific trip:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Choose the Bus if:</strong> You are on a very tight budget, your trip is relatively short (under 4-5 hours), and you are traveling light. The cost savings can be substantial and may outweigh the loss of comfort for shorter durations.</li>
            <li><strong>Choose the Train if:</strong> Speed is a priority, you value comfort and space, you need to work during the journey, or you are traveling with a lot of luggage. For longer trips or overnight travel, the train is almost always the more civilized and comfortable choice.</li>
          </ul>
          <p>By using our calculator, you can put a precise number on the financial trade-off. If the train is only $20 more expensive but saves you two hours and provides a more comfortable experience, it might be the better value. If the bus is $50 cheaper, you can decide if that saving is worth the extra time and reduced comfort.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Are trains always more expensive than buses?</AccordionTrigger>
              <AccordionContent>
                <p>Generally, yes, but not always. Booking train tickets far in advance can sometimes yield prices that are competitive with last-minute bus fares. Always compare prices for your specific travel dates.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What are the typical baggage allowances?</AccordionTrigger>
              <AccordionContent>
                <p>This varies widely by company. For example, Amtrak in the US typically allows two personal items and two carry-on bags for free, plus the option to check two bags for free. Major bus lines often allow one carry-on and one checked bag for free, with fees for additional items. Always check the specific carrier's policy.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How does this comparison change for overnight travel?</AccordionTrigger>
              <AccordionContent>
                <p>For overnight trips, the comfort of a train becomes a much larger factor. While an overnight bus is the cheapest way to travel, the cramped seating can make sleep difficult. A train might offer reclining seats or the option to book a couchette or sleeper cabin, which can save you the cost of a hotel night and allow you to arrive more rested.</p>
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
          <p className="text-muted-foreground">The Bus vs. Train Cost Comparison Calculator provides a clear financial breakdown to help you make an informed decision about your ground transportation. By looking beyond the ticket price to include associated costs like baggage and station transport, it helps you quantify the trade-offs between the budget-friendliness of bus travel and the speed and comfort of train travel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
