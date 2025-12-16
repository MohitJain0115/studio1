'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Info, Shield, TrendingUp, Phone, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

const onCallSegmentSchema = z.object({
  hours: z.number().positive("Hours must be positive."),
  rate: z.number().min(0, "Rate must be non-negative."),
});

const formSchema = z.object({
  segments: z.array(onCallSegmentSchema).min(1, 'Please add at least one segment.'),
  basePayRate: z.number().positive("Base pay rate must be positive."),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  totalOnCallHours: number;
  totalOnCallPay: number;
  equivalentRegularHours: number;
  chartData: { name: string; pay: number }[];
}

const formatNumberUS = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);

export default function OnCallHoursCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segments: [{ hours: undefined, rate: undefined }],
      basePayRate: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "segments",
  });
  
  const resetForm = () => {
    form.reset({
      segments: [{ hours: undefined, rate: undefined }],
      basePayRate: undefined,
    });
    setResult(null);
  };
  
  const onSubmit = (values: FormValues) => {
    let totalOnCallHours = 0;
    let totalOnCallPay = 0;
    const chartData: CalculationResult['chartData'] = [];

    values.segments.forEach((segment, index) => {
        const hours = segment.hours || 0;
        const rate = segment.rate || 0;
        const pay = hours * rate;
        totalOnCallHours += hours;
        totalOnCallPay += pay;
        chartData.push({ name: `Segment ${index + 1}`, pay });
    });

    const equivalentRegularHours = totalOnCallPay / values.basePayRate;
    
    setResult({
      totalOnCallHours,
      totalOnCallPay,
      equivalentRegularHours,
      chartData,
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            On-Call Pay Calculator
          </CardTitle>
          <CardDescription>
            Calculate total compensation for on-call or standby time based on different pay rates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="basePayRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Regular Hourly Rate ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 35" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">On-Call Segments</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end border p-4 rounded-lg relative">
                      <FormField
                        control={form.control}
                        name={`segments.${index}.hours`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Hours On-Call</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 40" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`segments.${index}.rate`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>On-Call Hourly Rate ($)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
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
                 <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ hours: undefined, rate: undefined })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Segment
                </Button>
              </div>

               <div className="flex gap-4">
                <Button type="submit">Calculate On-Call Pay</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
            <CardHeader>
                <CardTitle>On-Call Compensation Summary</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="text-center mb-8">
                    <p className="text-lg font-medium text-muted-foreground">Total On-Call Pay</p>
                    <p className="text-5xl font-bold text-primary mt-1">{formatNumberUS(result.totalOnCallPay)}</p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Hours On-Call</h4>
                        <p className="text-2xl font-bold">{result.totalOnCallHours}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Equivalent Regular Hours</h4>
                        <p className="text-2xl font-bold">{result.equivalentRegularHours.toFixed(1)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding On-Call Pay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>On-call, or standby, pay is compensation provided to employees for the time they are required to be available to work if called upon, even if they are not actively working. The laws surrounding whether this time must be compensated are complex and depend on how restricted the employee is during the on-call period.</p>
            <p>This calculator helps compute the total pay for on-call hours based on specific rates, which might differ for weekdays, weekends, or holidays. It provides a clear total and shows how that compensation equates to regular working hours.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Calculation Logic</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li><strong className="text-foreground">Calculate Segment Pay:</strong> For each on-call segment, the pay is calculated by multiplying the on-call hours by the specific on-call hourly rate.</li>
                  <li><strong className="text-foreground">Sum Total Pay:</strong> The pay from all segments is summed to determine the total on-call compensation.</li>
                  <li><strong className="text-foreground">Calculate Equivalent Hours:</strong> The total on-call pay is divided by the employee's regular hourly rate to show how many regular work hours that compensation represents.</li>
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
              <li><Link href="/employment/split-shift-hours-calculator" className="hover:underline">Split Shift Hours Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>

        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Manager's Guide to On-Call Compensation and FLSA Rules</h1>
            <p className="text-lg italic">"Are we required to pay for on-call time?" It's one of the most common and complex wage and hour questions. The answer, under the Fair Labor Standards Act (FLSA), depends entirely on one key concept: the degree of restriction placed on the employee.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">The Defining Line: Engaged to Wait vs. Waiting to be Engaged</h2>
            <p>The FLSA distinguishes between two types of on-call situations. This distinction determines whether the time is considered "hours worked" and must be paid.</p>
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-4 border">Situation</th>
                            <th className="p-4 border">Compensable?</th>
                            <th className="p-4 border">Characteristics & Examples</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 border font-semibold">Engaged to Wait</td>
                            <td className="p-4 border text-green-600">Yes (Must be paid)</td>
                            <td className="p-4 border">The employee is unable to use the time effectively for their own purposes. The time is spent predominantly for the employer's benefit. Examples: a factory worker waiting for a machine to be repaired, a firefighter waiting for a call at the firehouse.</td>
                        </tr>
                        <tr>
                            <td className="p-4 border font-semibold">Waiting to be Engaged</td>
                            <td className="p-4 border text-red-600">No (Not required)</td>
                            <td className="p-4 border">The employee has been asked to be on-call but has significant freedom. They can leave the premises, go to the store, watch movies, etc. They are "waiting to be engaged." Example: An IT worker who carries a pager and must respond within 30 minutes but is otherwise free.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Factors Courts Consider for On-Call Time</h2>
            <p>When there is a dispute, courts look at several factors to determine if on-call time is compensable working time. No single factor is decisive.</p>
             <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">Geographic Restrictions:</strong> Are employees required to remain on the employer's premises? The more geographically restricted, the more likely it's paid time.</li>
                <li><strong className="font-semibold text-foreground">Response Time:</strong> How quickly must an employee respond? A very short response time (e.g., 5-10 minutes) severely restricts activities and points toward paid time.</li>
                <li><strong className="font-semibold text-foreground">Frequency of Calls:</strong> If an employee is called back to work so frequently that they cannot enjoy their personal time, the entire on-call period may be considered work time.</li>
                <li><strong className="font-semibold text-foreground">Use of a Pager:</strong> Simply carrying a pager or phone does not automatically make on-call time compensable. The key is the level of freedom the employee retains.</li>
                 <li><strong className="font-semibold text-foreground">Personal Activities:</strong> Can the employee effectively engage in personal activities like going to a movie, having dinner with family, or running errands? If so, it's less likely to be compensable.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Best Practices for On-Call Policies</h2>
            <p>Even if on-call time is not legally required to be paid as "hours worked," many companies offer a smaller stipend (like the rates in this calculator) as an incentive and to recognize the inconvenience.</p>
            <ol className="list-decimal ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">Have a Clear, Written Policy:</strong> Your on-call policy should be in writing and clearly define response time requirements, compensation rates (for both standby time and actual call-in work), and restrictions.</li>
                <li><strong className="font-semibold text-foreground">Distinguish Standby Pay from Call-In Pay:</strong> The policy must be clear that the on-call stipend is for being available. Any time an employee is actually called and begins working, that time <strong className="text-primary">must</strong> be paid at their regular (or overtime) rate.</li>
                <li><strong className="font-semibold text-foreground">Consult Legal Counsel:</strong> Wage and hour laws are complex and vary by state. It is highly advisable to have your on-call policy reviewed by legal counsel to ensure compliance with federal and state regulations.</li>
            </ol>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">If I am called in to work while on-call, how is that time paid?</h4>
                <p className="text-muted-foreground">Any time you are actually working in response to a call is considered "hours worked" and must be paid at your regular rate of pay. If these hours push you over 40 hours in a workweek, they must be paid at your overtime rate.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">My employer doesn't pay for on-call time but requires me to stay within 15 minutes of the hospital. Is this legal?</h4>
                <p className="text-muted-foreground">This is a gray area and depends on a court's interpretation. Such a tight restriction could be argued to prevent you from using the time for your own purposes, potentially making it compensable time. You should consult with your HR department or a legal expert.</p>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator is a tool for employees and managers to compute total compensation for periods of on-call or standby duty. By allowing for multiple segments with different pay rates (e.g., weekday vs. weekend), it provides an accurate total for on-call stipends and translates that pay into the equivalent number of regular working hours, aiding in payroll and benefits discussions.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
