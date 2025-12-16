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
import { Landmark, Info, Shield, TrendingUp, Hourglass } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  overtimeHours: z.number().positive("Overtime hours must be positive."),
  overtimeMinutes: z.number().min(0).max(59).optional(),
  compTimeRate: z.number().positive("Rate must be positive."),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  totalOvertimeMinutes: number;
  compTimeMinutes: number;
  compTimeHours: number;
  compTimeDays: number;
}

export default function CompensatoryOffDaysCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overtimeHours: undefined,
      overtimeMinutes: 0,
      compTimeRate: 1.5,
    },
  });

  const resetForm = () => {
    form.reset({
      overtimeHours: undefined,
      overtimeMinutes: 0,
      compTimeRate: 1.5,
    });
    setResult(null);
  };

  const onSubmit = (values: FormValues) => {
    const totalOvertimeMinutes = (values.overtimeHours * 60) + (values.overtimeMinutes || 0);
    const compTimeMinutes = totalOvertimeMinutes * values.compTimeRate;
    const compTimeHours = compTimeMinutes / 60;
    const compTimeDays = compTimeHours / 8; // Assuming an 8-hour workday

    setResult({
      totalOvertimeMinutes,
      compTimeMinutes,
      compTimeHours,
      compTimeDays,
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hourglass className="h-5 w-5" />
            Compensatory Time Off Calculator
          </CardTitle>
          <CardDescription>
            Calculate the amount of compensatory time ("comp time") earned for working overtime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="overtimeHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overtime Hours Worked</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 10" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="overtimeMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overtime Minutes</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 30" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="compTimeRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comp Time Rate</FormLabel>
                       <Select onValueChange={(v) => field.onChange(parseFloat(v))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rate" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1.0 (Straight Time)</SelectItem>
                          <SelectItem value="1.5">1.5 (Time-and-a-half)</SelectItem>
                          <SelectItem value="2">2.0 (Double Time)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">Calculate Comp Time</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
            <CardHeader>
                <CardTitle>Compensatory Time Earned</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="text-center mb-8">
                    <p className="text-lg font-medium text-muted-foreground">Total Comp Time Accrued</p>
                    <p className="text-5xl font-bold text-primary mt-1">
                        {Math.floor(result.compTimeHours)}h {result.compTimeMinutes % 60}m
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Equivalent in Work Days</h4>
                        <p className="text-2xl font-bold">{result.compTimeDays.toFixed(2)}</p>
                         <p className="text-xs text-muted-foreground">(Assuming 8-hour days)</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Equivalent in Hours</h4>
                        <p className="text-2xl font-bold">{result.compTimeHours.toFixed(2)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding Compensatory Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Compensatory time, or "comp time," is paid time off that is granted to an employee instead of overtime pay. This practice is heavily regulated and is primarily applicable only to public sector (government) employees under the Fair Labor Standards Act (FLSA).</p>
            <p>For every hour of overtime worked, an employee must receive comp time at a rate of not less than one and one-half hours (a 1.5x rate). This calculator helps eligible employees and their managers accurately calculate the amount of comp time accrued for overtime hours worked.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Calculation Logic</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li><strong className="text-foreground">Convert Overtime to Minutes:</strong> The total overtime hours and minutes worked are converted into a single minute value.</li>
                  <li><strong className="text-foreground">Apply Comp Time Rate:</strong> This total minute value is then multiplied by the comp time rate (e.g., 1.5 for time-and-a-half).</li>
                  <li><strong className="text-foreground">Convert to Hours/Days:</strong> The resulting comp time minutes are converted back into a user-friendly format of hours and minutes, as well as the equivalent in 8-hour work days.</li>
              </ol>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5" />Related Calculators</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-primary">
              <li><Link href="/employment/pto-accrual-calculator" className="hover:underline">PTO Accrual Calculator</Link></li>
              <li><Link href="/employment/on-call-hours-calculator" className="hover:underline">On-call Hours Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>

        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Manager's Guide to Compensatory Time Off</h1>
            <p className="text-lg italic">Comp time can be a flexible tool for managing budgets and employee schedules, but it comes with strict legal guidelines. Understanding the rules is essential to avoid costly labor violations.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">The Public vs. Private Sector Divide</h2>
            <p>The most important rule regarding comp time is who can legally use it. The Fair Labor Standards Act (FLSA) established very different rules for government agencies versus private businesses.</p>
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-4 border">Sector</th>
                            <th className="p-4 border">Comp Time Eligibility</th>
                            <th className="p-4 border">Key FLSA Rules</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 border font-semibold">Public Sector (Government)</td>
                            <td className="p-4 border text-green-600">Allowed</td>
                            <td className="p-4 border">Allowed for non-exempt employees if there's an agreement in place. Must be accrued at 1.5x the overtime hours worked. There are caps on how much can be accrued.</td>
                        </tr>
                        <tr>
                            <td className="p-4 border font-semibold">Private Sector</td>
                            <td className="p-4 border text-red-600">Generally Not Allowed</td>
                            <td className="p-4 border">Private employers must pay non-exempt employees for overtime hours in cash at a rate of 1.5x their regular pay. Providing "comp time" instead is a violation of the FLSA.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Accrual Caps and Payout Rules for Public Employees</h2>
            <p>Even for public agencies where comp time is legal, there are strict limits on how much an employee can accrue before they must be paid in cash for further overtime.</p>
            <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">General Employees:</strong> The accrual cap is <strong className="text-primary">240 hours</strong> of comp time (which represents 160 hours of actual overtime worked at a 1.5x rate).</li>
                <li><strong className="font-semibold text-foreground">Public Safety, Emergency, and Seasonal Workers:</strong> For police, firefighters, and other specific roles, the cap is higher at <strong className="text-primary">480 hours</strong> of comp time (320 hours of overtime worked).</li>
                <li><strong className="font-semibold text-foreground">Cash-Out Requirements:</strong> Any overtime worked after an employee hits their accrual cap must be paid in cash. Furthermore, upon termination of employment, all unused accrued comp time must be paid out to the employee at their final regular rate of pay or the average of their last three years, whichever is higher.</li>
            </ul>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Can a private company offer comp time to salaried, exempt employees?</h4>
                <p className="text-muted-foreground">Yes. Since exempt employees are not legally entitled to overtime pay under the FLSA, a private employer can offer them informal comp time (e.g., "You worked last weekend, so take this Friday off"). This is an informal perk, not a legal requirement, and should be managed by company policy.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">When can an employee use their accrued comp time?</h4>
                <p className="text-muted-foreground">An employee must be permitted to use their comp time on the day they request, unless doing so would "unduly disrupt" the agency's operations. The definition of "unduly disrupt" is a high bar, so requests should generally be granted.</p>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator provides a simple way for public sector employees and managers to calculate compensatory time earned for overtime hours. By inputting the hours worked and the applicable rate (typically 1.5x), it accurately computes the total time off accrued, ensuring compliance with FLSA regulations for government agencies.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
