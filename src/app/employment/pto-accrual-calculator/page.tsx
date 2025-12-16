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
import { Landmark, Info, Shield, TrendingUp, CalendarDays } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  accrualRate: z.number().positive("Accrual rate must be positive."),
  accrualFrequency: z.enum(['weekly', 'bi-weekly', 'semi-monthly', 'monthly', 'annually']),
  hoursWorked: z.number().optional(),
  payPeriods: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  ptoAccrued: number;
}

const PAY_PERIODS_PER_YEAR = {
  weekly: 52,
  'bi-weekly': 26,
  'semi-monthly': 24,
  monthly: 12,
  annually: 1,
};

export default function PtoAccrualCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accrualRate: undefined,
      accrualFrequency: 'bi-weekly',
      hoursWorked: undefined,
      payPeriods: undefined,
    },
  });

  const resetForm = () => {
    form.reset({
      accrualRate: undefined,
      accrualFrequency: 'bi-weekly',
      hoursWorked: undefined,
      payPeriods: undefined,
    });
    setResult(null);
  };

  const onSubmit = (values: FormValues) => {
    let ptoAccrued = 0;
    if (values.hoursWorked) {
        // Accrual per hour worked
        ptoAccrued = values.accrualRate * values.hoursWorked;
    } else {
        // Accrual per pay period
        const numPeriods = values.payPeriods || PAY_PERIODS_PER_YEAR[values.accrualFrequency];
        ptoAccrued = values.accrualRate * numPeriods;
    }

    setResult({ ptoAccrued });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            PTO Accrual Calculator
          </CardTitle>
          <CardDescription>
            Calculate the amount of Paid Time Off (PTO) accrued over a specific period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="accrualRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accrual Rate (Hours)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 3.077" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accrualFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accrual Frequency</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly (every 2 weeks)</SelectItem>
                          <SelectItem value="semi-monthly">Semi-monthly (twice a month)</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">--- OR ---</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="hoursWorked"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Hours Worked</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2080" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="payPeriods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Pay Periods (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 26" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">Calculate PTO</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
            <CardHeader>
                <CardTitle>PTO Accrual Summary</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">Total PTO Accrued</p>
                    <p className="text-5xl font-bold text-primary mt-1">{result.ptoAccrued.toFixed(2)} hours</p>
                    <p className="text-muted-foreground mt-2">({(result.ptoAccrued / 8).toFixed(2)} days, assuming an 8-hour workday)</p>
                </div>
            </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding PTO Accrual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Paid Time Off (PTO) is a benefit where employers provide paid time off for employees to use as they wish, combining vacation, sick, and personal days into a single bank. PTO accrual is the process by which employees earn this time off.</p>
            <p>Companies use various methods to calculate this. Some grant a lump sum annually, while others have employees accrue a certain number of hours per pay period, or per hour worked. This calculator helps you determine how much PTO you've earned based on your company's specific accrual policy.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Calculation Logic</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>The calculator supports two primary methods of accrual:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li><strong className="text-foreground">Accrual per Pay Period:</strong> Your total accrued PTO is calculated by multiplying your accrual rate per period by the number of pay periods. If you don't specify the number of periods, it will calculate for a full year based on your selected frequency.</li>
                  <li><strong className="text-foreground">Accrual per Hour Worked:</strong> Your total accrued PTO is calculated by multiplying your accrual rate per hour by the total number of hours you've worked.</li>
              </ol>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5" />Related Calculators</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-primary">
              <li><Link href="/employment/compensatory-off-days-calculator" className="hover:underline">Compensatory Off Days Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>

        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Guide to PTO Accrual Policies</h1>
            <p className="text-lg italic">PTO is one of the most valued employee benefits. Understanding how your company's policy works is key to managing your work-life balance and maximizing your compensation.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Common Accrual Methods and Calculations</h2>
            <p>Companies use different methods to award PTO. This table breaks down how to find the accrual rate for each method, which you can then plug into the calculator.</p>
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-4 border">Method</th>
                            <th className="p-4 border">How to Calculate the Accrual Rate</th>
                            <th className="p-4 border">Example (For 120 hours / 15 days of annual PTO)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 border font-semibold">Per Pay Period</td>
                            <td className="p-4 border">Annual PTO Hours / Number of Pay Periods per Year</td>
                            <td className="p-4 border">120 hours / 26 bi-weekly periods = <strong className="text-primary">4.615 hours</strong> per pay period</td>
                        </tr>
                        <tr>
                            <td className="p-4 border font-semibold">Per Hour Worked</td>
                            <td className="p-4 border">Annual PTO Hours / Annual Work Hours (typically 2080)</td>
                            <td className="p-4 border">120 hours / 2080 hours = <strong className="text-primary">0.05769 hours</strong> per hour worked</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">PTO Policy Key Terms and Considerations</h2>
             <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">Accrual Caps:</strong> Many companies cap the total amount of PTO an employee can have in their bank at any one time (e.g., 1.5x their annual accrual). This is to prevent large liabilities on their books.</li>
                <li><strong className="font-semibold text-foreground">Use-It-or-Lose-It vs. Rollover:</strong> Policies vary on what happens to unused PTO at the end of the year. Some companies have a "use-it-or-lose-it" policy where unused time is forfeited. Others allow employees to "rollover" a certain number of hours into the next year. Several states (like California, Montana, and Nebraska) have laws restricting or banning use-it-or-lose-it policies.</li>
                <li><strong className="font-semibold text-foreground">Cash-Out at Termination:</strong> State laws also differ on whether an employer must pay out an employee's accrued, unused PTO when they leave the company. Many states require it, viewing PTO as earned wages. Others do not, unless it is specified in the employment agreement.</li>
            </ul>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">What is the difference between bi-weekly and semi-monthly pay periods?</h4>
                <p className="text-muted-foreground">Bi-weekly means you are paid every two weeks, resulting in 26 pay periods per year. Semi-monthly means you are paid twice a month (e.g., on the 15th and last day), resulting in 24 pay periods per year. This distinction is important for accurate per-period accrual calculations.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Do I accrue PTO on overtime hours?</h4>
                <p className="text-muted-foreground">This depends entirely on company policy. Most companies do not include overtime hours in PTO accrual calculations, but some may. Check your employee handbook.</p>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator provides an easy way to determine the amount of Paid Time Off (PTO) an employee has earned. By accommodating different accrual methods—either per pay period or per hour worked—it gives employees a clear picture of their available time off, helping them to better plan vacations and personal time while enabling employers to accurately track liabilities.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
