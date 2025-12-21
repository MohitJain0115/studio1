'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateJetLag, timeZones } from '@/lib/calculators';
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
import { Bed, Clock, Map as MapIcon, Info, Shield, Compass, Plane, Sun, Moon } from 'lucide-react';

const formSchema = z.object({
  originTimeZone: z.string().min(1, 'Origin time zone is required.'),
  destinationTimeZone: z.string().min(1, 'Destination time zone is required.'),
  flightDuration: z.coerce.number().positive('Flight duration must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators = [
    { name: 'Travel Days Calculator', href: '/calculators/travel-days-calculator' },
    { name: 'Time Zone Difference', href: '/calculators/time-zone-difference-calculator' },
    { name: 'Layover Time Calculator', href: '/calculators/layover-time-calculator' },
    { name: 'Travel Time Calculator', href: '/calculators/travel-time-calculator' },
    { name: 'Flight Duration Calculator', href: '/calculators/flight-duration-calculator' },
    { name: 'Distance Between Cities', href: '/calculators/distance-between-cities-calculator' },
    { name: 'Itinerary Time Planner', href: '/calculators/itinerary-time-planner' },
].sort((a, b) => a.name.localeCompare(b.name));

export default function JetLagCalculator() {
  const [result, setResult] = useState<{ recoveryDays: string, advice: string[] } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      destinationTimeZone: 'Europe/London',
      flightDuration: undefined,
    },
  });
  
  const getOffsetInHours = (timeZone: string) => {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return (tzDate.getTime() - utcDate.getTime()) / 3600000;
  }

  const onSubmit = (data: FormValues) => {
    const originOffset = getOffsetInHours(data.originTimeZone);
    const destinationOffset = getOffsetInHours(data.destinationTimeZone);
    const timezonesCrossed = destinationOffset - originOffset;
    
    const res = calculateJetLag(timezonesCrossed, data.flightDuration);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Jet Lag Recovery Calculator</CardTitle>
          <CardDescription>
            Estimate your jet lag recovery time and get personalized advice based on your travel direction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="originTimeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Sun className="h-4 w-4"/>Origin Time Zone</FormLabel>
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
                 <FormField
                  control={form.control}
                  name="destinationTimeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Moon className="h-4 w-4"/>Destination Time Zone</FormLabel>
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
                <FormField
                    control={form.control}
                    name="flightDuration"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Plane className="h-4 w-4"/>Total Flight Duration (hours)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g., 8" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              <Button type="submit">Calculate Jet Lag</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your Jet Lag Recovery Plan</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-muted rounded-lg text-center flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground">Estimated Recovery Time</p>
                    <p className="text-4xl font-bold text-primary">{result.recoveryDays}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Personalized Advice:</h3>
                     <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {result.advice.map((tip, index) => <li key={index}>{tip}</li>)}
                    </ul>
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
            <h3 className="font-semibold text-lg">Origin & Destination Time Zones</h3>
            <p className="text-muted-foreground">Select your starting and ending time zones. The calculator uses these to determine the number of time zones crossed and the direction of travel (east or west), which is the primary factor in jet lag.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Total Flight Duration (hours)</h3>
            <p className="text-muted-foreground">The total time you spend on the plane. Longer flights contribute to general travel fatigue, which can worsen the effects of jet lag.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This calculator uses a widely accepted rule of thumb: the body needs approximately one day to recover for every one-hour time zone shifted. It also adds a small fatigue factor for very long flights.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">
              RecoveryDays ≈ |TimeZonesCrossed| + (FlightDuration / 12)
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
          <CardTitle className="text-2xl font-bold">The Science of Beating Jet Lag</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">A Scientific Guide to Resetting Your Internal Clock and Conquering Travel Fatigue</h2>
          <p>Jet lag, or desynchronosis, is a physiological condition that results from a rapid change in the body's circadian rhythms. When you cross multiple time zones, your internal 24-hour clock (master clock) falls out of sync with the new local time. This mismatch between your internal clock and the external environment leads to symptoms like fatigue, insomnia, irritability, and digestive issues. This guide explains the science behind jet lag, why direction matters, and provides actionable strategies to minimize its effects.</p>
          <h3 className="text-lg font-semibold text-foreground">The Master Clock: Your Suprachiasmatic Nucleus (SCN)</h3>
          <p>Deep within your brain's hypothalamus lies a tiny cluster of about 20,000 nerve cells called the suprachiasmatic nucleus (SCN). This is your body's master clock. The SCN controls your 24-hour cycles of sleep, wakefulness, hormone release, and body temperature. The most powerful environmental cue that synchronizes, or "entrains," this clock is light.</p>
          <p>When light enters your eyes, it signals the SCN to either advance or delay your internal clock. This is the core mechanism you can manipulate to overcome jet lag. When you travel, your SCN is still operating on your old time zone, while you are trying to live in a new one. Jet lag is simply the period of time it takes for your SCN to adjust.</p>
          <h3 className="text-lg font-semibold text-foreground">East vs. West: Why Direction of Travel is Key</h3>
          <p>The severity and experience of jet lag depend heavily on the direction of travel. This is because the human body's natural circadian rhythm is slightly longer than 24 hours (around 24.2 hours on average). This gives us a natural tendency to drift later.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Traveling West (Phase Delay):</strong> When you fly west, you are "gaining" time. For example, flying from London to New York moves you to a time zone that is 5 hours earlier. This means you need to stay awake longer and wake up later. Since our bodies have a natural tendency to delay our sleep cycle, this is generally easier to adapt to. You are essentially going with the flow of your natural body clock.</li>
            <li><strong>Traveling East (Phase Advance):</strong> When you fly east, you are "losing" time. Flying from New York to London moves you 5 hours forward. This requires you to go to sleep earlier and wake up earlier than your body wants to. This is called a "phase advance," and it is much harder for the body to do. You are fighting against your natural tendency to delay, which is why jet lag is almost always worse when traveling east.</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground">A Practical Recovery Formula: One Day Per Time Zone</h3>
          <p>The most widely accepted rule of thumb for jet lag recovery is that the body needs approximately **one full day to adjust for every one-hour time zone it has crossed**. So, for a 6-hour time difference, you can expect to feel the effects of jet lag for about 6 days, though the most severe symptoms usually subside after 2-3 days.</p>
          <p>Our calculator uses this as the primary basis for its estimation. It also adds a small factor for general travel fatigue, as very long flights can be exhausting regardless of time zones crossed, exacerbating the symptoms of jet lag.</p>
          <h3 className="text-lg font-semibold text-foreground">Strategic Use of Light: The Most Powerful Tool</h3>
          <p>Since light is the primary synchronizer of your SCN, you can use it strategically to speed up your adjustment:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>When Traveling East (Phase Advance Needed):</strong> You need to advance your clock. Seek out bright light in the morning in your new time zone. This tells your brain it's time to start the day earlier. Conversely, avoid bright light in the late evening (wear sunglasses if you have to be outside) to help your body feel ready for sleep earlier.</li>
            <li><strong>When Traveling West (Phase Delay Needed):</strong> You need to delay your clock. Avoid bright light in the morning. Instead, expose yourself to bright light in the late afternoon and early evening. This signals your brain to push your sleep cycle later, helping you stay up until a reasonable local bedtime.</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground">Other Strategies to Combat Jet Lag</h3>
          <p>Beyond light exposure, several other behaviors can help mitigate the effects of jet lag:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Pre-Adapt Your Schedule:</strong> A few days before your trip, start shifting your bedtime and wake-up time by 30-60 minutes each day in the direction of your destination's time zone.</li>
            <li><strong>Stay Hydrated:</strong> Dehydration can worsen symptoms of fatigue and jet lag. Drink plenty of water on the plane and upon arrival. Avoid excessive alcohol and caffeine, as they can disrupt sleep patterns.</li>
            <li><strong>Adjust Mealtimes Immediately:</strong> Start eating on your new time zone's schedule as soon as possible, even on the plane. Mealtimes are another cue that helps entrain your body clock.</li>
            <li><strong>Use Melatonin (Carefully):</strong> Melatonin is a hormone your body produces to signal sleep. A low-dose supplement (0.5mg to 3mg) taken about 30 minutes before your desired bedtime in the new time zone can help. It is most effective for eastward travel. Consult a doctor before using melatonin, especially for long-term use.</li>
            <li><strong>Strategic Napping:</strong> If you are exhausted upon arrival, a short nap of 20-30 minutes can be refreshing. Avoid long naps, as they can make it harder to sleep at night.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is jet lag worse when traveling east or west?</AccordionTrigger>
              <AccordionContent>
                <p>Jet lag is almost always worse when traveling east. This is because traveling east requires you to shorten your day and force your body to sleep earlier than it wants to (a "phase advance"), which goes against your body's natural tendency to delay its sleep cycle.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Does flying north or south cause jet lag?</AccordionTrigger>
              <AccordionContent>
                <p>No. Jet lag is caused by crossing time zones (moving east or west). Traveling north or south (e.g., from North America to South America) within the same time zone does not cause jet lag, although you may experience general travel fatigue from the long flight.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I beat jet lag in one day?</AccordionTrigger>
              <AccordionContent>
                <p>For a small time difference (1-3 hours), it's possible to adapt very quickly, sometimes within a day. For larger time differences (5+ hours), it is physiologically very difficult to fully adapt in one day, but you can significantly reduce the symptoms by following the advice on light exposure and scheduling.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is melatonin a sleeping pill?</AccordionTrigger>
              <AccordionContent>
                <p>No. Melatonin is not a sedative like a sleeping pill. It is a chronobiotic hormone, meaning it helps to regulate the timing of your sleep. It signals to your body that it is nighttime, helping to shift your circadian rhythm, but it doesn't force you to sleep.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Does it matter what time of day I fly?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. Many travelers find that taking an overnight flight that arrives in the morning at the destination is effective. This allows you to try to sleep on the plane and then forces you to stay awake upon arrival, helping you adapt to the local schedule more quickly.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Does food affect jet lag?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, mealtimes act as a secondary cue for your body clock. Switching to the meal schedule of your new time zone as quickly as possible can help your body adapt. Eating a large meal can also promote sleepiness, which can be used strategically.</p>
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
          <p className="text-muted-foreground">The Jet Lag Calculator provides an evidence-based estimate for your recovery time by focusing on the number of time zones crossed. Jet lag is a temporary disruption of your internal body clock, or circadian rhythm. By understanding the science behind it—especially the powerful role of light exposure and the difference between eastward and westward travel—you can use the personalized advice to strategically speed up your adjustment and minimize the fatigue, allowing you to enjoy your destination from day one.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    