'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, RefreshCw, Info, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

const formSchema = z.object({
  rotationStartDate: z.date({
    required_error: "A start date is required.",
  }),
  daysOn: z.number().int().positive("Days On must be a positive integer."),
  daysOff: z.number().int().positive("Days Off must be a positive integer."),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  rotationLength: number;
  workDays: Date[];
  offDays: Date[];
}

const generateRotation = (values: FormValues): CalculationResult => {
    const { rotationStartDate, daysOn, daysOff } = values;
    const rotationLength = daysOn + daysOff;
    const workDays: Date[] = [];
    const offDays: Date[] = [];

    let currentDay = rotationStartDate;
    const cyclesToGenerate = Math.ceil(90 / rotationLength) + 1; // Generate enough cycles to fill a few months

    for (let i = 0; i < cyclesToGenerate; i++) {
        // Add work days
        for (let j = 0; j < daysOn; j++) {
            workDays.push(currentDay);
            currentDay = addDays(currentDay, 1);
        }
        // Add off days
        for (let k = 0; k < daysOff; k++) {
            offDays.push(currentDay);
            currentDay = addDays(currentDay, 1);
        }
    }
    
    return { rotationLength, workDays, offDays };
};


export default function ShiftRotationCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rotationStartDate: undefined,
      daysOn: undefined,
      daysOff: undefined,
    },
  });

  const resetForm = () => {
    form.reset({
      rotationStartDate: undefined,
      daysOn: undefined,
      daysOff: undefined,
    });
    setResult(null);
  };
  
  const onSubmit = (values: FormValues) => {
    const rotationData = generateRotation(values);
    setResult(rotationData);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Shift Rotation Calculator
          </CardTitle>
          <CardDescription>
            Visualize a repeating shift work schedule based on your rotation pattern.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="rotationStartDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date of a Work Cycle</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="daysOn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consecutive Days On</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 4" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value) || undefined)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="daysOff"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consecutive Days Off</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 4" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value) || undefined)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="flex gap-4">
                <Button type="submit">Generate Schedule</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
            <CardHeader>
                <CardTitle>Your Shift Rotation</CardTitle>
                <CardDescription>A calendar view of your upcoming work and off days. Your rotation is a {result.rotationLength}-day cycle.</CardDescription>
            </CardHeader>
            <CardContent>
                <Calendar
                    mode="multiple"
                    selected={[...result.workDays, ...result.offDays]}
                    modifiers={{
                        work: result.workDays,
                        off: result.offDays,
                    }}
                    modifiersClassNames={{
                        work: 'bg-primary/80 text-primary-foreground rounded-md',
                        off: 'bg-muted text-muted-foreground rounded-md opacity-70',
                    }}
                    numberOfMonths={3}
                    className="p-0"
                />
                <div className="flex items-center space-x-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-md bg-primary/80" />
                        <span>Work Day</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-md bg-muted" />
                        <span>Day Off</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding Shift Rotations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Shift rotation schedules are common in industries that require 24/7 coverage, such as healthcare, law enforcement, manufacturing, and logistics. These patterns involve working a set number of days followed by a set number of days off.</p>
            <p>Common rotations include the "4 on, 4 off" schedule, various "Panama" schedules (like 2-2-3), or the "DuPont" schedule. This calculator helps you visualize any simple "X days on, Y days off" pattern, making it easier to plan personal appointments, vacations, and social events around your work life.</p>
          </CardContent>
        </Card>
        
        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Guide to Common Shift Work Schedules</h1>
            <p className="text-lg italic">Shift work is a reality for millions. Understanding the structure of different rotation patterns can help you manage your time, health, and personal life more effectively.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Examples of Common Rotation Patterns</h2>
            <p>While this calculator handles a simple "X on, Y off" pattern, many industries use more complex named schedules designed to balance coverage and employee well-being.</p>
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-4 border">Schedule Name</th>
                            <th className="p-4 border">Rotation Pattern</th>
                            <th className="p-4 border">Industries</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 border">4 On, 4 Off</td>
                            <td className="p-4 border">4 consecutive work days, followed by 4 consecutive days off. Often uses 10 or 12-hour shifts.</td>
                            <td className="p-4 border">Law Enforcement, Fire Departments, Manufacturing.</td>
                        </tr>
                        <tr>
                            <td className="p-4 border">Panama (2-2-3)</td>
                            <td className="p-4 border">2 on, 2 off, 3 on. Then reverses: 2 off, 2 on, 3 off. This completes a 28-day cycle.</td>
                            <td className="p-4 border">Police Departments, 24/7 Call Centers. Provides a 3-day weekend every other week.</td>
                        </tr>
                        <tr>
                            <td className="p-4 border">DuPont Schedule</td>
                            <td className="p-4 border">A 28-day cycle with 4 consecutive night shifts, 3 days off, 3 consecutive day shifts, 1 day off, 3 consecutive night shifts, 3 days off, 4 consecutive day shifts, 7 days off.</td>
                            <td className="p-4 border">Chemical Plants, Manufacturing. Known for providing a full week off each month.</td>
                        </tr>
                        <tr>
                            <td className="p-4 border">Pitman Schedule</td>
                            <td className="p-4 border">A 14-day cycle where teams work 2-3-2. (2 on, 2 off, 3 on, 2 off, 2 on, 3 off). Also called the "every other weekend off" schedule.</td>
                            <td className="p-4 border">Emergency Services, Security.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Managing the Challenges of Shift Work</h2>
            <p>Shift work, especially with night or rotating shifts, can pose challenges to health and well-being. Here are some strategies to cope:</p>
            <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">Prioritize Sleep Hygiene:</strong> Create a dark, quiet, and cool sleeping environment. Use blackout curtains and white noise machines. Try to maintain a consistent sleep schedule, even on your days off.</li>
                <li><strong className="font-semibold text-foreground">Strategic Use of Caffeine:</strong> Use caffeine at the beginning of your shift to boost alertness, but avoid it within 4-6 hours of your planned sleep time.</li>
                <li><strong className="font-semibold text-foreground">Plan Your Meals:</strong> Avoid heavy, greasy foods during your shift, which can cause drowsiness. Opt for smaller, more frequent meals and snacks. Stay well-hydrated with water.</li>
                <li><strong className="font-semibold text-foreground">Maximize Sunlight Exposure on Days Off:</strong> On your days off, get as much natural sunlight as possible, especially in the morning. This helps reset your body's internal clock (circadian rhythm).</li>
                <li><strong className="font-semibold text-foreground">Communicate with Family and Friends:</strong> Use a shared calendar to make your schedule visible to loved ones. This helps them understand your availability and makes it easier to plan social activities.</li>
            </ul>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Disclaimer</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator provides a visual representation of a repeating shift pattern. It does not account for specific company policies, overtime, or holiday schedules, which may alter the pattern. This tool is for personal planning and informational purposes only. Always refer to your official work schedule provided by your employer.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}