'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Info, Shield, TrendingUp, Home, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

const workSegmentSchema = z.object({
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time (HH:MM)"),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time (HH:MM)"),
});

const formSchema = z.object({
  segments: z.array(workSegmentSchema).min(1, 'Please add at least one work segment.'),
  unpaidBreakMinutes: z.number().min(0, "Break minutes must be non-negative.").optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  totalGrossDuration: string;
  totalNetDuration: string;
  totalDecimalHours: number;
}

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatDuration = (totalMinutes: number) => {
    if (totalMinutes < 0) totalMinutes = 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
};


export default function WorkFromHomeHoursCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segments: [{ startTime: '', endTime: '' }],
      unpaidBreakMinutes: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "segments",
  });
  
  const resetForm = () => {
    form.reset({
      segments: [{ startTime: '', endTime: '' }],
      unpaidBreakMinutes: 0,
    });
    setResult(null);
  };
  
  const onSubmit = (values: FormValues) => {
    const grossMinutes = values.segments.reduce((acc, segment) => {
        if (!segment.startTime || !segment.endTime) return acc;
        const start = timeToMinutes(segment.startTime);
        const end = timeToMinutes(segment.endTime);
        return acc + (end - start);
    }, 0);

    const netMinutes = grossMinutes - (values.unpaidBreakMinutes || 0);

    setResult({
      totalGrossDuration: formatDuration(grossMinutes),
      totalNetDuration: formatDuration(netMinutes),
      totalDecimalHours: netMinutes / 60,
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Work From Home Hours Calculator
          </CardTitle>
          <CardDescription>
            Track and calculate your total daily work hours with complex breaks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Work Segments</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end border p-4 rounded-lg relative">
                      <FormField
                        control={form.control}
                        name={`segments.${index}.startTime`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Start Time (24h)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 09:00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`segments.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>End Time (24h)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 12:30" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                 <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ startTime: '', endTime: '' })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Segment
                </Button>
              </div>

               <FormField
                  control={form.control}
                  name="unpaidBreakMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Unpaid Break (Minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 60" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               <div className="flex gap-4">
                <Button type="submit">Calculate Hours</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
            <CardHeader>
                <CardTitle>Total Work Hours</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="text-center mb-8">
                    <p className="text-lg font-medium text-muted-foreground">Total Net Work Time</p>
                    <p className="text-5xl font-bold text-primary mt-1">{result.totalNetDuration}</p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Gross Duration</h4>
                        <p className="text-2xl font-bold">{result.totalGrossDuration}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Decimal Hours</h4>
                        <p className="text-2xl font-bold">{result.totalDecimalHours.toFixed(2)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding WFH Hour Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Working from home offers flexibility, but it can also blur the lines between work and personal time. Accurately tracking hours is crucial for non-exempt (hourly) employees to ensure proper payment and for salaried employees to maintain a healthy work-life balance.</p>
            <p>This calculator is designed for flexible schedules. It allows you to enter multiple work blocks throughout the day—for example, working in the morning, taking a long break for an appointment, and finishing in the evening—and accurately calculates your total work time after subtracting unpaid breaks.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Calculation Logic</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li><strong className="text-foreground">Calculate Segment Durations:</strong> The duration of each work block is calculated by finding the difference between its start and end times.</li>
                  <li><strong className="text-foreground">Sum Gross Duration:</strong> The durations of all work segments are added together to get the total time spent "on the clock."</li>
                  <li><strong className="text-foreground">Subtract Unpaid Breaks:</strong> The total minutes of specified unpaid break time are subtracted from the gross duration to find the net, compensable work time.</li>
                  <li><strong className="text-foreground">Format Output:</strong> The net time is presented in hours and minutes, as well as a decimal format suitable for payroll systems.</li>
              </ol>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5" />Related Calculators</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-primary">
              <li><Link href="/employment/split-shift-hours-calculator" className="hover:underline">Split Shift Hours Calculator</Link></li>
              <li><Link href="/employment/freelance-billable-hours-calculator" className="hover:underline">Freelance Billable Hours Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>

        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Guide to Compliant Time Tracking for Remote Employees</h1>
            <p className="text-lg italic">The rise of remote work has created new challenges for wage and hour compliance. For non-exempt (hourly) employees, precise tracking of all compensable time is not just good practice—it's a legal requirement under the FLSA.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">What Counts as "Hours Worked"?</h2>
            <p>The FLSA's definition of "hours worked" is broad. It includes all time an employee is "suffered or permitted to work." This means that even unauthorized work must be paid for if the employer knows or has reason to believe it is being performed.</p>
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-4 border">Activity</th>
                            <th className="p-4 border">Generally Compensable?</th>
                            <th className="p-4 border">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 border font-semibold">Answering emails after hours</td>
                            <td className="p-4 border text-green-600">Yes</td>
                            <td className="p-4 border">If a non-exempt employee spends 15 minutes answering emails at 9 PM, that is 15 minutes of paid work time.</td>
                        </tr>
                        <tr>
                            <td className="p-4 border font-semibold">System boot-up/down time</td>
                            <td className="p-4 border text-green-600">Yes</td>
                            <td className="p-4 border">Time spent starting up necessary computer systems or applications is integral to the job and must be paid.</td>
                        </tr>
                        <tr>
                            <td className="p-4 border font-semibold">Bona fide meal breaks</td>
                            <td className="p-4 border text-red-600">No</td>
                            <td className="p-4 border">Breaks of 30 minutes or more where the employee is completely relieved of duties are not work time.</td>
                        </tr>
                        <tr>
                            <td className="p-4 border font-semibold">Short rest breaks (5-20 mins)</td>
                             <td className="p-4 border text-green-600">Yes</td>
                            <td className="p-4 border">Short breaks are considered part of the workday and are compensable.</td>
                        </tr>
                        <tr>
                            <td className="p-4 border font-semibold">Training required by employer</td>
                            <td className="p-4 border text-green-600">Yes</td>
                            <td className="p-4 border">Time spent in mandatory training sessions or webinars is considered work time.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Best Practices for Remote Timekeeping</h2>
             <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">Have a Clear, Written Policy:</strong> Your timekeeping policy should explicitly state that non-exempt employees must record all time worked, including short bursts of activity outside of normal hours. It should also define the process for recording meal breaks.</li>
                <li><strong className="font-semibold text-foreground">Use a Reliable Timekeeping System:</strong> Do not rely on honor-system spreadsheets. Use a digital timekeeping system that allows employees to easily clock in and out, including for breaks. This creates an accurate, contemporaneous record.</li>
                <li><strong className="font-semibold text-foreground">Prohibit Off-the-Clock Work:</strong> The policy must strictly prohibit non-exempt employees from working off the clock. Managers must be trained to not encourage or permit this behavior, such as by sending late-night emails that imply an immediate response is needed.</li>
                <li><strong className="font-semibold text-foreground">Regularly Audit Timesheets:</strong> Managers should review and approve timesheets each pay period, checking for missed punches or unusually long or short days and clarifying any discrepancies with the employee.</li>
            </ul>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">What if I work through my lunch break?</h4>
                <p className="text-muted-foreground">If you are a non-exempt employee and you perform any work during your unpaid meal break (e.g., answering emails, taking a work call), the entire break may be considered compensable time under the FLSA. You must be completely relieved of all duties for the time to be unpaid.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">As a salaried, exempt employee, do I need to track my hours?</h4>
                <p className="text-muted-foreground">Legally, exempt employees are paid a salary regardless of the number of hours worked, so strict time tracking for payroll is not required. However, many still track hours for project billing, productivity analysis, or to ensure work-life balance.</p>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator is an essential tool for employees with flexible or non-traditional work schedules, particularly those working from home. By allowing for the entry of multiple work segments and accounting for unpaid breaks, it provides an accurate and auditable calculation of total net work hours. This helps ensure non-exempt employees are paid accurately and allows all employees to better manage their time and maintain work-life balance.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
