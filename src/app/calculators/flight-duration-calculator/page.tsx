'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateFlightDuration, timeZones } from '@/lib/calculators';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { Globe, Clock, Map as MapIcon, Info, Shield, Compass, PlaneTakeoff, PlaneLanding, Calendar } from 'lucide-react';


const formSchema = z.object({
  departureDateTime: z.string().min(1, 'Departure date and time are required.'),
  departureTimeZone: z.string().min(1, 'Departure timezone is required.'),
  arrivalDateTime: z.string().min(1, 'Arrival date and time are required.'),
  arrivalTimeZone: z.string().min(1, 'Arrival timezone is required.'),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators = [
    { name: 'Travel Time Calculator', href: '/calculators/travel-time-calculator' },
    { name: 'Distance Between Cities', href: '/calculators/distance-between-cities-calculator' },
    { name: 'Time Zone Difference', href: '/calculators/time-zone-difference-calculator' },
    { name: 'Driving Time with Breaks Calculator', href: '/calculators/driving-time-with-breaks-calculator' },
    { name: 'Travel Buffer Time Calculator', href: '/calculators/travel-buffer-time-calculator' },
    { name: 'Fuel Cost Calculator', href: '/calculators/fuel-cost-calculator' },
    { name: 'Trip Budget Calculator', href: '/calculators/trip-budget-calculator' },
    { name: 'Hotel Cost Calculator', href: '/calculators/hotel-cost-calculator' },
    { name: 'Group Expense Splitter', href: '/calculators/group-expense-splitter' },
    { name: 'Cost Per Mile Calculator', href: '/calculators/cost-per-mile-calculator' },
    { name: 'Car vs. Flight Cost Comparison', href: '/calculators/car-vs-flight-calculator' },
    { name: 'Multi-Stop Route Planner', href: '/calculators/multi-stop-route-planner' },
    { name: 'Rental Car Cost Calculator', href: '/calculators/rental-car-cost-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));


export default function FlightDurationCalculator() {
  const [result, setResult] = useState<{ text: string, totalMinutes: number } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departureDateTime: '',
      departureTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      arrivalDateTime: '',
      arrivalTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const onSubmit = (data: FormValues) => {
    const duration = calculateFlightDuration(data);
    setResult(duration);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Flight Duration Calculator</CardTitle>
          <CardDescription>
            Calculate the total duration of a flight by providing departure and arrival times and their respective time zones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><PlaneTakeoff className="w-5 h-5 text-primary"/>Departure</h3>
                  <FormField
                    control={form.control}
                    name="departureDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date and Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="departureTimeZone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Zone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {timeZones.map((tz) => (
                              <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="space-y-2 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><PlaneLanding className="w-5 h-5 text-primary"/>Arrival</h3>
                  <FormField
                    control={form.control}
                    name="arrivalDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date and Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="arrivalTimeZone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Zone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {timeZones.map((tz) => (
                              <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit">Calculate Duration</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && result.totalMinutes >= 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Total Flight Duration</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
             <div className="p-6 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Gate-to-Gate Time</p>
                <p className="text-4xl font-bold text-primary">{result.text}</p>
            </div>
          </CardContent>
        </Card>
      )}

       {result && result.totalMinutes < 0 && (
         <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-500">{result.text}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding the Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Departure/Arrival Date and Time</h3>
            <p className="text-muted-foreground">This is the local date and time at the departure or arrival airport. It's crucial to use the time shown on your ticket for that specific location, not your home time.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Departure/Arrival Time Zone</h3>
            <p className="text-muted-foreground">This is the IANA time zone identifier for the departure and arrival locations (e.g., "America/New_York", "Europe/London"). Selecting the correct time zone is the most critical step for an accurate calculation, as it allows the calculator to account for the time difference between the two locations.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculation is based on finding the absolute difference between two points in time. The calculator first converts both the local departure and arrival times into a standardized, universal format (UTC). Once both times are in the same reference frame, it simply subtracts the departure time from the arrival time to find the total elapsed duration.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">
              Duration = AbsoluteTime(Arrival) - AbsoluteTime(Departure)
            </p>
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
          <CardTitle className="text-2xl font-bold">Decoding Your Itinerary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">The Ultimate Guide to Calculating Flight Duration Accurately</h2>
          
          <p>Understanding the true duration of a flight is a cornerstone of effective travel planning. It dictates connections, arrangements for arrival, and helps manage jet lag. Yet, it's a figure that often causes confusion. Is it the time listed on the airline's website? Does it account for time zones? This expert guide will demystify the process, explaining the methodology, the critical importance of time zones, and how to use our calculator to get a precise measure of your time in the air.</p>

          <h3 className="text-lg font-semibold text-foreground">Why "Simple" Subtraction Doesn't Work</h3>
          <p>If you take a flight that leaves New York at 2:00 PM and arrives in Los Angeles at 4:00 PM, a simple subtraction suggests the flight was only 2 hours long. This is obviously incorrect. The error comes from ignoring a crucial variable: time zones. New York operates on Eastern Time, while Los Angeles is on Pacific Time, which is three hours behind. The local times printed on your ticket are just snapshots in different frames of reference. To find the true duration, we must first convert both times to a single, universal standard.</p>
          
          <h3 className="text-lg font-semibold text-foreground">UTC: The Traveler's Gold Standard</h3>
          <p>Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks and time. It is the successor to Greenwich Mean Time (GMT) and is used in aviation, weather forecasting, and computing to ensure everyone is on the same page, regardless of their local time. Think of it as the master clock for the entire planet.</p>
          <p>The magic of calculating flight duration lies in converting both the departure and arrival times from their local time zones into UTC. For example:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>A 2:00 PM departure from New York (EDT, which is UTC-4) is 6:00 PM UTC.</li>
            <li>A 4:00 PM arrival in Los Angeles (PDT, which is UTC-7) is 11:00 PM UTC.</li>
          </ul>
          <p>Now that both events are in the same time zone (UTC), we can perform a simple subtraction: 11:00 PM UTC minus 6:00 PM UTC equals a 5-hour duration. This is the actual time elapsed from takeoff to landing. Our Flight Duration Calculator automates this entire conversion and subtraction process for you.</p>

          <h3 className="text-lg font-semibold text-foreground">The Importance of IANA Time Zones</h3>
          <p>Using generic time zone names like "Pacific Standard Time" or "Central European Time" can be ambiguous and problematic. The reason is Daylight Saving Time (DST). Does "Pacific Time" mean PST (UTC-8) or PDT (UTC-7)? To eliminate this ambiguity, the global standard is to use IANA (Internet Assigned Numbers Authority) time zone identifiers. These are always in a "Region/City" format, such as "America/New_York", "Europe/Paris", or "Asia/Tokyo".</p>
          <p>These identifiers automatically account for DST rules for any given date. If you enter a departure date in July from "America/Chicago", the calculator knows that Chicago is observing Central Daylight Time (CDT, UTC-5). If you enter a date in January, it knows it's Central Standard Time (CST, UTC-6). This is why our calculator provides a comprehensive list of IANA time zones—it is the only way to guarantee accuracy year-round.</p>

          <h3 className="text-lg font-semibold text-foreground">What 'Flight Duration' Really Means: Gate-to-Gate vs. Wheels-Up to Wheels-Down</h3>
          <p>It's important to understand what the calculated duration represents. The times printed on your ticket are typically the "gate times."</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Departure Time:</strong> The time your plane is scheduled to push back from the departure gate.</li>
            <li><strong>Arrival Time:</strong> The time your plane is scheduled to arrive at the destination gate.</li>
          </ul>
          <p>Therefore, the duration calculated from these times is the **gate-to-gate** duration. This includes not just the time spent in the air, but also the time spent taxiing to the runway at the origin and taxiing from the runway to the gate at the destination. The actual "in-air" time (wheels-up to wheels-down) will always be slightly shorter. For most travel planning purposes, the gate-to-gate duration is the more practical and useful metric.</p>

          <h3 className="text-lg font-semibold text-foreground">Real-World Factors That Affect Your Actual Flight Time</h3>
          <p>The duration you calculate is based on the scheduled times. The actual, real-world duration can vary due to several factors:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Winds (Jet Streams):</strong> This is the single biggest variable. Pilots flying east often ride the jet stream, a high-altitude river of air, which can significantly shorten flight times. Conversely, flying west means fighting against it, which can lengthen the journey. This is why a flight from LA to NY is often shorter than the return trip.</li>
            <li><strong>Air Traffic Congestion:</strong> Delays can occur on the ground waiting for a takeoff slot or in the air by being placed in a holding pattern near a busy airport.</li>
            <li><strong>Weather:</strong> Storms may require the flight to take a longer, alternative route to avoid turbulence.</li>
            <li><strong>Taxi Time:</strong> The time spent taxiing can vary greatly depending on the size of the airport and runway in use. At massive hubs like Atlanta or Dubai, taxi times can be surprisingly long.</li>
          </ul>
          <p>While our calculator provides the precise scheduled duration, always allow for some buffer in your plans for these real-world variables.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the difference between this and a Travel Time Calculator?</AccordionTrigger>
              <AccordionContent>
                <p>A Travel Time Calculator determines time based on distance and speed (Time = Distance / Speed). This Flight Duration Calculator works differently; it calculates the elapsed time between two specific moments, accounting for the complexities of time zones. It's designed specifically for itineraries where you know the local departure and arrival times.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why do I need to select a time zone? Can't it be determined from the city?</AccordionTrigger>
              <AccordionContent>
                <p>While cities have primary time zones, many countries or large cities can have complex rules or be near a border. To ensure 100% accuracy and remove all ambiguity, explicitly selecting the correct IANA time zone identifier (e.g., "America/Los_Angeles") is the best practice used in aviation and software.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Does this calculation include layovers?</AccordionTrigger>
              <AccordionContent>
                <p>No. This calculator is designed to calculate the duration of a single flight segment (from one takeoff to one landing). To calculate your total travel time including layovers, you should calculate the duration of each flight segment separately and then manually add the layover time.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Why is my flight from East to West longer than West to East?</AccordionTrigger>
              <AccordionContent>
                <p>This is due to the jet stream, which are high-altitude winds that generally flow from west to east. Flights heading east get a "tailwind" from the jet stream, increasing their ground speed and shortening the trip. Flights heading west must fly against this "headwind," which decreases their ground speed and makes the trip longer.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>What does IANA stand for?</AccordionTrigger>
              <AccordionContent>
                <p>IANA stands for Internet Assigned Numbers Authority. It is the organization responsible for maintaining the official global time zone database, which is the standard used in computers and on the internet to ensure time calculations are consistent and accurate worldwide.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-6">
              <AccordionTrigger>Is the result "in-air" time or "gate-to-gate" time?</AccordionTrigger>
              <AccordionContent>
                <p>Since the calculation is based on the departure and arrival times listed on your ticket, the result is the "gate-to-gate" time. This includes the time the plane spends taxiing to the runway before takeoff and taxiing to the gate after landing, in addition to the time spent in the air.</p>
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
          <p className="text-muted-foreground">The Flight Duration Calculator is a crucial tool for any traveler looking to understand their itinerary precisely. By converting local departure and arrival times into the universal UTC standard, it bypasses the confusion of time zones and Daylight Saving Time to provide an accurate gate-to-gate duration. This empowers travelers to plan connections, manage schedules, and anticipate their journey's true length with confidence.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
