'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Info, Shield, TrendingUp, Target, PlusCircle, Trash2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Link from 'next/link';

const savingsRateSchema = z.object({
  rate: z.number().positive("Rate must be positive.").max(100, "Rate cannot exceed 100."),
});

const formSchema = z.object({
  savingsGoal: z.number().positive("Goal must be positive."),
  initialSavings: z.number().min(0, "Initial savings can't be negative."),
  annualIncome: z.number().positive("Income must be positive."),
  investmentReturnRate: z.number().min(0, "Return rate can't be negative."),
  savingsRates: z.array(savingsRateSchema).min(1, 'Add at least one savings rate.').max(5, 'You can compare up to 5 rates.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  timelines: { rate: number; years: number | string; totalContributions: number; totalGrowth: number; }[];
  chartData: any[];
}

const formatNumberUS = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function SavingsRateGoalVisualizer() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      savingsGoal: undefined,
      initialSavings: undefined,
      annualIncome: undefined,
      investmentReturnRate: undefined,
      savingsRates: [{ rate: 15 }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "savingsRates",
  });

  const resetForm = () => {
    form.reset({
      savingsGoal: undefined,
      initialSavings: undefined,
      annualIncome: undefined,
      investmentReturnRate: undefined,
      savingsRates: [{ rate: undefined }],
    });
    setResult(null);
  };
  
  useState(() => {
    resetForm();
  }, []);

  const onSubmit = (values: FormValues) => {
    const { savingsGoal, initialSavings, annualIncome, investmentReturnRate, savingsRates } = values;

    const timelines: CalculationResult['timelines'] = [];
    const chartData: any[] = [];
    const monthlyReturnRate = investmentReturnRate / 100 / 12;

    savingsRates.forEach(item => {
      const rate = item.rate;
      if (!rate) return;
      
      const monthlyContribution = (annualIncome * (rate / 100)) / 12;
      
      let years: number | string;
      if (monthlyContribution <= 0 && initialSavings < savingsGoal) {
          years = "Never";
      } else {
        // Using the NPER formula from finance
        // NPER = log( (PMT - FV*i) / (PMT + PV*i) ) / log(1+i)
        // FV is negative because it's a cash outflow from the perspective of the investment
        const nper = Math.log((monthlyContribution - savingsGoal * monthlyReturnRate) / (monthlyContribution + initialSavings * monthlyReturnRate)) / Math.log(1 + monthlyReturnRate);
        const totalMonths = -nper;
        years = Math.ceil(totalMonths) / 12;
        if (years < 0 || !isFinite(years)) years = 'Never';
      }
      
      let totalContributions = 0;
      let totalGrowth = 0;
      if (typeof years === 'number') {
        const totalMonths = years * 12;
        totalContributions = initialSavings + (monthlyContribution * totalMonths);
        const futureValue = initialSavings * Math.pow(1 + monthlyReturnRate, totalMonths) + monthlyContribution * ((Math.pow(1 + monthlyReturnRate, totalMonths) - 1) / monthlyReturnRate);
        totalGrowth = futureValue - totalContributions;
      }
      
      timelines.push({ rate, years, totalContributions, totalGrowth });

      // Generate chart data for this rate
      let balance = initialSavings;
      for(let year = 0; year <= 40; year++) {
          let found = chartData.find(d => d.year === year);
          if(!found) {
              found = {year};
              chartData.push(found);
          }
          if(typeof years === 'number' && year > years + 1) {
             // stop calculating beyond goal
          } else {
             balance = balance * (1 + (investmentReturnRate / 100)) + (monthlyContribution * 12);
             found[`${rate}% Rate`] = balance > savingsGoal ? savingsGoal : balance;
          }
      }
    });

    setResult({ timelines, chartData });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Savings Rate vs. Goal Timeline Visualizer
          </CardTitle>
          <CardDescription>
            See how different savings rates affect how quickly you can reach your financial goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField control={form.control} name="savingsGoal" render={({ field }) => (<FormItem><FormLabel>Savings Goal ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1000000" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="initialSavings" render={({ field }) => (<FormItem><FormLabel>Initial Savings ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 25000" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="annualIncome" render={({ field }) => (<FormItem><FormLabel>Gross Annual Income ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 80000" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="investmentReturnRate" render={({ field }) => (<FormItem><FormLabel>Annual Return (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 7" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Savings Rates to Compare</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-center">
                      <FormField
                        control={form.control}
                        name={`savingsRates.${index}.rate`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="sr-only">Savings Rate {index + 1}</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder={`e.g., ${10 + index * 5}`} {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                 <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ rate: undefined })} disabled={fields.length >= 5}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Rate
                </Button>
              </div>

               <div className="flex gap-4">
                <Button type="submit">Visualize Timelines</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Goal Timelines</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.timelines.map(({ rate, years }) => (
                        <div key={rate} className="p-4 rounded-lg text-center border">
                           <h4 className="text-xl font-bold text-primary">{rate}%</h4>
                           <p className="text-muted-foreground text-sm">Savings Rate</p>
                           <p className="text-3xl font-bold mt-2">{typeof years === 'number' ? `${years.toFixed(1)} years` : years}</p>
                           <p className="text-muted-foreground text-sm">to reach {formatNumberUS(form.getValues('savingsGoal'))}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Growth Toward Goal</CardTitle></CardHeader>
            <CardContent>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={result.chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                            <YAxis tickFormatter={(value) => formatNumberUS(value)} />
                            <Tooltip formatter={(value: number, name: string) => [formatNumberUS(value), name]} />
                            <Legend />
                            {result.timelines.map(({rate}, index) => (
                                <Line key={rate} type="monotone" dataKey={`${rate}% Rate`} stroke={`hsl(var(--chart-${(index % 5) + 1}))`} strokeWidth={2} dot={false} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding Savings Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Your savings rate—the percentage of your income you set aside for the future—is the single most powerful lever you can pull to control your financial destiny. While investment returns are crucial, they are largely outside your direct control. Your savings rate, however, is a choice you make every day.</p>
            <p>This calculator demonstrates the profound impact of this choice. By visualizing how different savings rates affect your timeline to reach a major financial goal (like retirement), it transforms an abstract percentage into a tangible reality. A small increase in your savings rate can shave years, or even decades, off your goal timeline, powerfully illustrating the trade-off between current spending and future freedom.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Formula Explained</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Time to Goal (NPER)</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">Years = -ln((PMT - FV*i) / (PMT + PV*i)) / (12 * ln(1+i))</p>
                  <p className="mt-2">This calculator uses a standard financial formula called NPER (Number of Periods) to solve for the time it takes to reach a future value (FV), given a present value (PV), a periodic payment (PMT), and an interest rate (i).</p>
                  <ul className="list-decimal pl-5 mt-2 space-y-1">
                      <li><strong className="text-foreground">FV:</strong> Your savings goal.</li>
                      <li><strong className="text-foreground">PV:</strong> Your initial savings.</li>
                      <li><strong className="text-foreground">PMT:</strong> Your monthly contribution, calculated from your income and savings rate.</li>
                      <li><strong className="text-foreground">i:</strong> The monthly investment return rate.</li>
                  </ul>
                   <p className="mt-2">The formula calculates the total number of months required, which is then converted to years. It elegantly combines the effect of your contributions and the power of compound interest to determine your timeline.</p>
              </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5" />Related Calculators</CardTitle>
            <CardDescription>Explore other financial planning tools</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-primary">
              <li><Link href="/investment/spending-pattern-analyzer" className="hover:underline">Spending Pattern Analyzer</Link></li>
              <li><Link href="/investment/delayed-gratification-roi-calculator" className="hover:underline">Delayed Gratification ROI Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>

        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">The Shockingly Simple Math to Early Retirement: A Guide to Your Savings Rate</h1>
            <p className="text-lg italic">For decades, financial advice has focused obsessively on investment returns. But what if the most important number in your financial life is one you have complete control over? This guide explores why your savings rate is the true key to unlocking financial independence.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Your Savings Rate Matters More Than Anything Else</h2>
            <p>Imagine you have two investors. Investor A diligently saves 10% of their income and, through brilliant strategy, achieves a stellar 10% annual return. Investor B saves a whopping 50% of their income but is a mediocre investor, earning only a 5% annual return. Who reaches financial independence first? In almost every scenario, it's Investor B.</p>
            <p>This is because your savings rate works on both sides of the wealth equation simultaneously:</p>
            <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold">It Increases Your Investable Capital:</strong> This is the obvious part. A higher savings rate means you are putting more money to work for you each month. This provides more fuel for the engine of compound growth.</li>
                <li><strong className="font-semibold">It Decreases Your Target Goal:</strong> This is the secret, more powerful part. A high savings rate means you have trained yourself to live happily on a smaller portion of your income. This, in turn, dramatically lowers the amount of money you need to accumulate to be financially independent. If you live on $40,000 a year, you need a much smaller nest egg than someone who lives on $100,000 a year.</li>
            </ul>
            <p>This "two-lever" effect is why increasing your savings rate from 10% to 20% doesn't just cut your timeline in half; it can reduce it by much more, as this calculator powerfully visualizes.</p>
            
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">A Framework for Thinking About Savings Rates</h2>
            <p>While personal finance is personal, some general benchmarks can help you understand where you stand and what's possible.</p>
            <ol className="list-decimal ml-6 space-y-4">
                <li>
                    <strong className="font-semibold text-foreground">0-10% Savings Rate (The Danger Zone):</strong> Saving less than 10% of your income puts you on a 40-50+ year career track, assuming you start early. This rate leaves little room for error, market downturns, or unexpected life events. It's a path to a traditional, and potentially delayed, retirement.
                </li>
                <li>
                    <strong className="font-semibold text-foreground">15-25% Savings Rate (The Standard Path):</strong> This is the rate most financial advisors recommend. It puts you on a solid track for a conventional retirement in your early-to-mid 60s. A 15% rate, sustained over a 40-year career, is a reliable path to financial security. Pushing this to 25% can significantly accelerate your timeline, potentially allowing for retirement in your 50s.
                </li>
                <li>
                    <strong className="font-semibold text-foreground">30-40% Savings Rate (The Accelerator Lane):</strong> At this level, you are making serious progress. Your timeline to financial independence shortens dramatically, often to 20-28 years. This is where the possibility of early retirement becomes a tangible reality, not just a distant dream. Reaching this rate often requires conscious choices about major expenses like housing and transportation.
                </li>
                <li>
                    <strong className="font-semibold text-foreground">50%+ Savings Rate (The Escape Velocity):</strong> This is the territory of the Financial Independence, Retire Early (FIRE) movement. At a 50% savings rate, for every year you work, you are saving one year's worth of living expenses. This creates an astonishingly simple relationship: your working career can shrink to as little as 15-17 years. This level of saving is a lifestyle in itself, requiring extreme intentionality and a focus on what truly brings you happiness, rather than what society tells you to buy.
                </li>
            </ol>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">How to Increase Your Savings Rate Without Deprivation</h2>
            <p>Increasing your savings rate doesn't have to mean a life of austerity. It's about strategic optimization.</p>
            <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">Automate Everything:</strong> The most powerful financial habit is to "pay yourself first." Set up automatic transfers from your checking account to your investment accounts for the day after you get paid. The money you never see is the money you won't miss.</li>
                <li><strong className="font-semibold text-foreground">Focus on the "Big Three":</strong> For most households, the three largest expenses are housing, transportation, and food. Making a significant change in one of these areas has a far greater impact than cutting out a hundred small pleasures. Could you live in a smaller home or a less expensive neighborhood ("house hacking")? Could you switch from a two-car household to one, or use a bike for commuting? Could you commit to cooking more meals at home?</li>
                <li><strong className="font-semibold text-foreground">Embrace "Lifestyle Inflation" Resistance:</strong> The natural tendency is to increase your spending as your income rises. The key to a high savings rate is to redirect the majority of every raise, bonus, or new income stream directly into savings and investments. If you get a $500 monthly raise, celebrate with a nice dinner, then immediately automate a new $450 monthly investment. You maintain your current quality of life while dramatically boosting your future self's wealth.</li>
                <li><strong className="font-semibold text-foreground">Conduct a Spending Audit:</strong> Use a tool like the "Spending Pattern Analyzer" to track every dollar for a month. Identify mindless spending or subscriptions that no longer bring you joy. Every dollar you cut from waste is a dollar you can add to your savings rate.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Conclusion: Your Rate is Your Destiny</h2>
            <p>Your investment portfolio will have good years and bad years, and you can't control that. But you can control how much you contribute to it. This calculator proves that the choices you make about your spending and saving habits are the true drivers of your financial future. Play with the numbers. See what's possible. A 5% increase in your savings rate might feel small today, but it could buy you five years of your life back in the future. That's a trade worth making.</p>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Should I use my pre-tax or after-tax income for this calculation?</h4>
              <p className="text-muted-foreground">For simplicity and a conservative estimate, using your gross (pre-tax) annual income is a good starting point. This calculator defines savings rate as a percentage of your total income. If you want to be more precise, you can calculate your savings rate based on your take-home pay.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What is a realistic long-term investment return to assume?</h4>
              <p className="text-muted-foreground">A widely used and historically reasonable estimate for long-term returns on a diversified stock portfolio is between 7% and 8% annually, which accounts for inflation. Using a lower number (like 6-7%) provides a more conservative projection, while a higher number (9-10%) is more optimistic and reflects pre-inflation historical averages.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Does this account for taxes on investment growth?</h4>
              <p className="text-muted-foreground">No, this calculator assumes that you are investing within tax-advantaged retirement accounts like a 401(k) or IRA, where growth is not taxed annually. If you are investing in a regular taxable brokerage account, capital gains and dividend taxes would slightly reduce your effective return, extending your timeline.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What if my income changes over time?</h4>
              <p className="text-muted-foreground">This calculator uses a constant income for its projections. In reality, your income will likely rise. The best practice is to increase your savings amount proportionally with every raise to maintain or increase your savings rate. You can re-run this calculation every few years with your new income to get an updated timeline.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What if the calculator says "Never"?</h4>
              <p className="text-muted-foreground">This result occurs if your monthly contributions are not enough to overcome the growth of your goal, or if your investment return rate is zero and you have no contributions. It indicates that under the current parameters, your goal is mathematically unreachable. To fix this, you need to increase your savings rate, increase your investment return assumption, or lower your savings goal.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This visualizer powerfully demonstrates the relationship between your savings rate and the time required to reach a major financial goal. By comparing multiple "what-if" scenarios side-by-side, it highlights that increasing how much you save is the most effective strategy for accelerating your journey to financial independence. The tool transforms the abstract concept of a savings rate into a concrete timeline, empowering you to make intentional decisions about your spending today to achieve your goals sooner.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
