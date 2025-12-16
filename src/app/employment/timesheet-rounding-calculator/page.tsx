
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Info, Shield, TrendingUp, Timer } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  timeIn: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  timeOut: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  roundingRule: z.enum(['nearest_5', 'nearest_15', 'down_15']),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  actualDuration: string;
  roundedIn: string;
  roundedOut: string;
  roundedDuration: string;
  timeDifference: string;
}

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
    if (minutes < 0) minutes = 0;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const formatDuration = (totalMinutes: number) => {
    if (totalMinutes < 0) totalMinutes = 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
};


export default function TimesheetRoundingCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeIn: undefined,
      timeOut: undefined,
      roundingRule: 'nearest_15',
    },
  });

  const resetForm = () => {
    form.reset({
      timeIn: undefined,
      timeOut: undefined,
      roundingRule: 'nearest_15',
    });
    setResult(null);
  };

  const onSubmit = (values: FormValues) => {
    const { timeIn, timeOut, roundingRule } = values;

    const actualInMinutes = timeToMinutes(timeIn);
    const actualOutMinutes = timeToMinutes(timeOut);
    const actualDurationMinutes = actualOutMinutes - actualInMinutes;

    let roundedInMinutes: number;
    let roundedOutMinutes: number;

    switch (roundingRule) {
      case 'nearest_5':
        roundedInMinutes = Math.round(actualInMinutes / 5) * 5;
        roundedOutMinutes = Math.round(actualOutMinutes / 5) * 5;
        break;
      case 'nearest_15':
        roundedInMinutes = Math.round(actualInMinutes / 15) * 15;
        roundedOutMinutes = Math.round(actualOutMinutes / 15) * 15;
        break;
      case 'down_15':
        roundedInMinutes = Math.floor(actualInMinutes / 15) * 15;
        roundedOutMinutes = Math.floor(actualOutMinutes / 15) * 15;
        break;
    }
    
    const roundedDurationMinutes = roundedOutMinutes - roundedInMinutes;
    const timeDifferenceMinutes = roundedDurationMinutes - actualDurationMinutes;
    const timeDifference = `${timeDifferenceMinutes >= 0 ? '+' : '-'} ${formatDuration(Math.abs(timeDifferenceMinutes))}`;

    setResult({
      actualDuration: formatDuration(actualDurationMinutes),
      roundedIn: minutesToTime(roundedInMinutes),
      roundedOut: minutesToTime(roundedOutMinutes),
      roundedDuration: formatDuration(roundedDurationMinutes),
      timeDifference,
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Timesheet Rounding Calculator
          </CardTitle>
          <CardDescription>
            See how different timesheet rounding rules affect total paid hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="timeIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Time In (24h format)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 08:53" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="timeOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Time Out (24h format)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 17:06" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="roundingRule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rounding Rule</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rounding rule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nearest_15">Nearest 15 minutes (Quarter Hour)</SelectItem>
                        <SelectItem value="nearest_5">Nearest 5 minutes</SelectItem>
                        <SelectItem value="down_15">Round down to nearest 15 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit">Calculate Rounding</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
            <CardHeader>
                <CardTitle>Rounding Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Actual Duration</h4>
                        <p className="text-2xl font-bold">{result.actualDuration}</p>
                    </div>
                     <div className="p-4 bg-primary/10 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Rounded Duration</h4>
                        <p className="text-2xl font-bold text-primary">{result.roundedDuration}</p>
                    </div>
                </div>
                 <div className="text-center mt-6">
                    <p className="text-lg font-bold text-muted-foreground">{result.timeDifference}</p>
                    <p className="text-sm text-muted-foreground">Difference</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-center border-t pt-6">
                     <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Rounded Time In</h4>
                        <p className="text-2xl font-bold">{result.roundedIn}</p>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Rounded Time Out</h4>
                        <p className="text-2xl font-bold">{result.roundedOut}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding Timesheet Rounding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Timesheet rounding is the practice of rounding employee punch-in and punch-out times to a nearby increment, such as the nearest 5 minutes or 15 minutes (quarter-hour), for payroll purposes. This is a common practice used to simplify payroll calculations.</p>
            <p>Under federal law (the FLSA), this practice is legal as long as it is applied fairly and consistently and does not, over time, fail to compensate employees for all the time they have actually worked. This calculator demonstrates how different rounding rules can affect an employee's recorded work duration for a given day.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Calculation Logic</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>The calculator converts all times to minutes from the start of the day to perform the math, then converts them back.</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong className="text-foreground">Nearest 5 or 15:</strong> The total minutes are divided by the increment (5 or 15), rounded to the nearest whole number, and then multiplied back by the increment. For example, 8:07 (487 minutes) rounded to the nearest 15 is 487/15 = 32.46 -&gt; 32 -&gt; 32*15 = 480 minutes, or 8:00. 8:08 (488 minutes) becomes 488/15 = 32.53 -&gt; 33 -&gt; 33*15 = 495 minutes, or 8:15.</li>
                  <li><strong className="text-foreground">Rounding Down:</strong> The total minutes are divided by the increment, the decimal is dropped (floored), and then multiplied back. This always favors the employer and is a legally risky practice.</li>
              </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5" />Related Calculators</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-primary">
              <li><Link href="/employment/freelance-billable-hours-calculator" className="hover:underline">Freelance Billable Hours Calculator</Link></li>
              <li><Link href="/employment/split-shift-hours-calculator" className="hover:underline">Split Shift Hours Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>

        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Guide to Compliant Timesheet Rounding</h1>
            <p className="text-lg italic">Timesheet rounding can simplify payroll, but if implemented incorrectly, it can lead to significant legal and financial risk. This guide covers the rules and best practices.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">The "7-Minute Rule" for Quarter-Hour Rounding</h2>
            <p>The most common and legally accepted rounding practice is the quarter-hour (15-minute) rounding rule, often called the "7-minute rule." This is the standard the Department of Labor looks for.</p>
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-4 border">Time Punched (HH:MM)</th>
                            <th className="p-4 border">Minutes from Quarter-Hour (:00, :15, :30, :45)</th>
                            <th className="p-4 border">Rounded Time (HH:MM)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 border">08:01 - 08:07</td>
                            <td className="p-4 border">1 to 7 minutes past</td>
                            <td className="p-4 border text-red-600">08:00 (Rounds down)</td>
                        </tr>
                        <tr>
                            <td className="p-4 border">08:08 - 08:14</td>
                            <td className="p-4 border">8 to 14 minutes past</td>
                            <td className="p-4 border text-green-600">08:15 (Rounds up)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="mt-4">For this rule to be compliant, it must be applied consistently to both punch-in and punch-out times. The rounding must average out over time so that employees are fully compensated for all time worked. Rounding that always favors the employer is illegal.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Risks and Best Practices</h2>
             <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">Consistency is Key:</strong> You cannot round down for late arrivals but fail to round up for early arrivals. The policy must be neutral and applied to all non-exempt employees uniformly.</li>
                <li><strong className="font-semibold text-foreground">The Danger of One-Way Rounding:</strong> A policy that only ever rounds time in the employer's favor (e.g., rounding in late but not rounding out early) is a direct violation of the FLSA.</li>
                <li><strong className="font-semibold text-foreground">Meal Breaks:</strong> Rounding cannot be used to avoid paying for short breaks. If a meal break is supposed to be 30 minutes but an employee is required to perform work during that time, the entire break may be considered compensable time.</li>
                <li><strong className="font-semibold text-foreground">The Modern Alternative:</strong> With modern digital timekeeping systems, the need for rounding has greatly diminished. The most risk-averse and transparent practice is to pay employees for the exact number of minutes they have worked. This eliminates all ambiguity and risk of litigation.</li>
            </ul>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Is timesheet rounding legal in California?</h4>
                <p className="text-muted-foreground">This is a contentious issue. While federal law permits neutral rounding, California courts have become increasingly skeptical of the practice. A 2021 court case (<em className="italic">Camp v. Home Depot</em>) cast further doubt on rounding. California employers should be extremely cautious and consult legal counsel. The safest practice in California is to pay for exact time worked.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Can my employer round my hours if they use a biometric time clock?</h4>
                <p className="text-muted-foreground">Yes, the method of time capture doesn't change the legality of the rounding policy itself. However, since these systems capture exact time, it raises the question of why rounding is necessary at all, and may make it harder to defend in a dispute.</p>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator demonstrates the impact of common timesheet rounding policies on an employee's recorded work duration. By comparing the actual time worked to the rounded time, it clarifies how these policies can lead to small gains or losses in paid time each day. It serves as a valuable tool for both employees seeking to understand their paycheck and for employers aiming to ensure their rounding practices are fair and compliant.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
