'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Info, Shield, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Link from 'next/link';

const formSchema = z.object({
  initialPrice: z.number().positive("Initial price must be positive."),
  strikePrice: z.number().positive("Strike price must be positive."),
  timeToMaturity: z.number().positive("Time to maturity must be positive."),
  riskFreeRate: z.number().min(0, "Risk-free rate can't be negative."),
  volatility: z.number().positive("Volatility must be positive."),
  numSimulations: z.number().int().positive("Number of simulations must be a positive integer."),
  numTimeSteps: z.number().int().positive("Number of time steps must be a positive integer."),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  eeProfile: { time: number; ee: number }[];
  peakExposure: { time: number; ee: number };
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

// Standard normal distribution using Box-Muller transform
const standardNormal = () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

export default function ExpectedExposureCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialPrice: undefined,
      strikePrice: undefined,
      timeToMaturity: undefined,
      riskFreeRate: undefined,
      volatility: undefined,
      numSimulations: undefined,
      numTimeSteps: undefined,
    },
  });

  const resetForm = () => {
    form.reset({
      initialPrice: undefined,
      strikePrice: undefined,
      timeToMaturity: undefined,
      riskFreeRate: undefined,
      volatility: undefined,
      numSimulations: undefined,
      numTimeSteps: undefined,
    });
    setResult(null);
  };
  
  const onSubmit = (values: FormValues) => {
    setIsLoading(true);
    // Use setTimeout to allow UI to update to loading state before intensive calculation
    setTimeout(() => {
        const { initialPrice, strikePrice, timeToMaturity, riskFreeRate, volatility, numSimulations, numTimeSteps } = values;
        const dt = timeToMaturity / numTimeSteps;
        const r = riskFreeRate / 100;
        const vol = volatility / 100;

        const exposuresAtTimeSteps = Array(numTimeSteps + 1).fill(0);

        for (let i = 0; i < numSimulations; i++) {
            let currentPrice = initialPrice;
            for (let t = 1; t <= numTimeSteps; t++) {
                const epsilon = standardNormal();
                currentPrice = currentPrice * Math.exp((r - 0.5 * vol * vol) * dt + vol * Math.sqrt(dt) * epsilon);
                // Exposure of a simple call option: max(0, S_t - K)
                const exposure = Math.max(0, currentPrice - strikePrice);
                exposuresAtTimeSteps[t] += exposure;
            }
        }
        
        const eeProfile = exposuresAtTimeSteps.map((summedExposure, t) => ({
            time: (t * dt),
            ee: summedExposure / numSimulations
        }));
        
        let peakExposure = { time: 0, ee: 0 };
        eeProfile.forEach(point => {
            if (point.ee > peakExposure.ee) {
                peakExposure = point;
            }
        });

        setResult({ eeProfile, peakExposure });
        setIsLoading(false);
    }, 50);
  };
  

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Expected Exposure (EE) Calculator
          </CardTitle>
          <CardDescription>
            Simulate and visualize the Expected Exposure profile of a financial contract using Monte Carlo methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="initialPrice" render={({ field }) => (<FormItem><FormLabel>Initial Asset Price ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 100" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="strikePrice" render={({ field }) => (<FormItem><FormLabel>Strike Price ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 100" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="timeToMaturity" render={({ field }) => (<FormItem><FormLabel>Time to Maturity (Years)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="riskFreeRate" render={({ field }) => (<FormItem><FormLabel>Risk-Free Rate (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="volatility" render={({ field }) => (<FormItem><FormLabel>Volatility (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 20" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div>
                <h3 className="text-lg font-medium mt-4 mb-2">Simulation Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="numSimulations" render={({ field }) => (<FormItem><FormLabel>Number of Simulations</FormLabel><FormControl><Input type="number" placeholder="e.g., 1000" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="numTimeSteps" render={({ field }) => (<FormItem><FormLabel>Number of Time Steps</FormLabel><FormControl><Input type="number" placeholder="e.g., 100" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Calculating...' : 'Calculate EE'}</Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <div className="text-center p-4">Running simulations, please wait...</div>}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expected Exposure Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center mb-8">
                    <p className="text-sm text-muted-foreground">Peak Expected Exposure</p>
                    <p className="text-5xl font-bold text-primary">{formatNumber(result.peakExposure.ee)}</p>
                    <p className="text-muted-foreground mt-2">Occurs at Year {result.peakExposure.time.toFixed(2)}</p>
                </div>
                <div className="mt-8 h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={result.eeProfile} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                            <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} name="Time (Years)" label={{ value: 'Time (Years)', position: 'insideBottom', offset: -10 }} tickFormatter={(val) => val.toFixed(2)} />
                            <YAxis name="Exposure" tickFormatter={(value) => formatNumber(value)} />
                            <Tooltip formatter={(value: number) => [formatNumber(value), 'Expected Exposure']} labelFormatter={(label: number) => `Time: ${label.toFixed(2)} years`} />
                            <Legend />
                            <Line type="monotone" dataKey="ee" name="Expected Exposure" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding Expected Exposure</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Expected Exposure (EE) is a critical metric in financial risk management, particularly for counterparty credit risk. It measures the potential future loss if a counterparty were to default on a financial contract (like a derivative).</p>
            <p>Unlike a simple mark-to-market value, EE is a forward-looking measure. It's the <strong className="text-foreground">average</strong> of all possible positive values (exposures) of a contract at a specific point in the future. We only care about positive values because if the contract has a negative value to us at the time of default, we don't owe the defaulting counterparty anything. The exposure is therefore defined as <strong className="text-foreground">max(0, V)</strong>, where V is the contract's value.</p>
             <p>This calculator uses a Monte Carlo simulation to model thousands of potential paths the underlying asset's price could take. By averaging the exposure on each of these paths at each future time step, it builds a profile of the Expected Exposure over the life of the contract.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Formula Explained</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Geometric Brownian Motion (GBM)</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">S_t = S_{t-1} * exp((r - 0.5 * &#x3C3;^2) * dt + &#x3C3; * sqrt(dt) * Z)</p>
                  <p className="mt-2">This calculator simulates the price of the underlying asset using the GBM stochastic process, which is a standard model in quantitative finance. It assumes that price returns follow a random walk.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong className="text-foreground">S_t</strong> is the asset price at the current time step.</li>
                      <li><strong className="text-foreground">r</strong> is the risk-free rate (drift).</li>
                      <li><strong className="text-foreground">&#x3C3;</strong> (sigma) is the volatility of the asset.</li>
                      <li><strong className="text-foreground">dt</strong> is the size of the time step.</li>
                      <li><strong className="text-foreground">Z</strong> is a random number drawn from a standard normal distribution.</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Expected Exposure Calculation</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">EE(t) = (1/N) * &#x2211; max(0, V_i(t))</p>
                  <p className="mt-2">The simulation runs 'N' times. In each simulation (i), we calculate the value of the contract (V) at each time step (t). For this calculator, we use a simple European call option, so <strong className="text-foreground">V_i(t) = S_i(t) - K</strong> at maturity, but for exposure, we look at the potential replacement cost at any time t, which for a simple derivative is its mark-to-market value. The exposure is the positive part of this value. The EE at time t is the average of these exposures across all N simulations.</p>
                  <p className="mt-2">The EE profile often has a "hump" shape. It starts at zero (no uncertainty), rises as uncertainty about the future asset price increases, and then falls back to zero as the contract approaches maturity and there is less time for large price movements.</p>
              </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5" />Related Calculators</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-primary">
              <li><Link href="/investment/exposure-at-default-simulation" className="hover:underline">Exposure at Default (EAD) Simulation</Link></li>
            </ul>
          </CardContent>
        </Card>

        <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Practical Guide to Counterparty Credit Risk and Expected Exposure</h1>
            <p className="text-lg italic">In the interconnected world of finance, the failure of one party to meet its obligations can trigger a cascade of losses. Understanding and quantifying this risk, known as counterparty credit risk, is paramount. Expected Exposure (EE) is a cornerstone of this analysis.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">What is Counterparty Credit Risk?</h2>
            <p>Imagine you have a contract with a bank (your "counterparty") that is currently profitable for you. For example, you bought an option that has increased significantly in value. Counterparty credit risk is the danger that this bank will go bankrupt (default) before the contract settles. If they default, they cannot pay you what you are owed. The potential loss you face is your "exposure" to that counterparty.</p>
            <p>This risk is not static. The value of your contract—and thus your potential exposure—fluctuates over time with market movements. This is why we don't look at just one number; we look at an <strong className="font-semibold">exposure profile</strong> over the entire life of the trade. This is what the Expected Exposure calculator generates.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Monte Carlo Simulation: Peering into the Future</h2>
            <p>How can we measure something that hasn't happened yet and depends on random market movements? The answer is through <strong className="font-semibold">Monte Carlo simulation</strong>. This powerful technique, used in fields from physics to finance, involves running thousands of "what-if" scenarios to model a range of possible outcomes.</p>
            <p>In our case, the "what-if" scenario is a potential future path for the price of the underlying asset (e.g., a stock). The calculator does the following, thousands of times:</p>
            <ol className="list-decimal ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">Generate a Path:</strong> Starting from today's price, it uses the Geometric Brownian Motion (GBM) model to simulate one possible random path the asset price could follow until the contract's maturity. The path's characteristics are governed by the asset's volatility and the risk-free rate.</li>
                <li><strong className="font-semibold text-foreground">Calculate Contract Value:</strong> At each discrete time step along this simulated path, it calculates the value of the financial contract (for this calculator, a simple call option).</li>
                <li><strong className="font-semibold text-foreground">Determine Exposure:</strong> At each step, it checks if the contract's value is positive. If it is, that's the exposure for that path at that time. If the value is negative (meaning you would owe the counterparty), your exposure is zero. Exposure = max(0, Contract Value).</li>
            </ol>
            <p>After running this process for thousands of simulations, we have a massive dataset. To get the Expected Exposure at a specific time (e.g., at the 6-month mark), we simply take the average of all the exposure values calculated at the 6-month mark across all the thousands of simulated paths. By doing this for every time step, we build the EE profile shown in the chart.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Interpreting the Expected Exposure Profile</h2>
            <p>The EE profile chart tells a story about how your risk evolves over time. Typically, for a contract like an option, the profile has a distinctive "hump" shape:</p>
            <ul className="list-disc ml-6 space-y-3">
                <li><strong className="font-semibold text-foreground">The Beginning:</strong> At time zero, the EE is zero (or very close to it). There is little uncertainty about the immediate future.</li>
                <li><strong className="font-semibold text-foreground">The Rise (The Diffusion Effect):</strong> As time moves forward, the uncertainty about the asset's future price grows. The range of possible prices widens, which means there's a greater chance for the contract to become highly profitable (and thus create a large exposure). This causes the EE profile to rise. This is often called the "diffusion effect."</li>
                <li><strong className="font-semibold text-foreground">The Fall (The Amortization Effect):</strong> As the contract gets closer to its maturity date, the "pull-to-par" or "amortization effect" takes over. There is simply less time remaining for the asset price to make large, unexpected moves. The range of possible outcomes begins to narrow, and many paths that were profitable may converge back toward being worthless. This causes the EE profile to decline, eventually reaching its final settlement value at maturity (which is often zero for an out-of-the-money option).</li>
            </ul>
            <p>The highest point on this curve is the <strong className="font-semibold text-foreground">Peak Exposure</strong>. This is a critical number for risk managers, as it represents the point in time where, on average, the potential loss from a counterparty default is at its maximum.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why This Matters: From EE to CVA</h2>
            <p>Expected Exposure is not just an academic exercise; it's a fundamental building block for pricing credit risk. Banks use EE profiles to calculate <strong className="font-semibold">Credit Valuation Adjustment (CVA)</strong>. CVA is essentially the market price of the counterparty credit risk on a derivative. It is calculated by integrating the EE profile over time, weighted by the counterparty's probability of default at each point in time.</p>
            <p>CVA = &#x222B; EE(t) * PD(t) * LGD dt</p>
            <p>Where PD(t) is the probability of default at time t, and LGD is the Loss Given Default. This CVA is a real cost that is booked against the profits of a trade. By understanding EE, you are taking the first step toward understanding how banks and financial institutions price and manage the risk of default in a systematic, quantitative way.</p>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Why is volatility a key driver of Expected Exposure?</h4>
              <p className="text-muted-foreground">Higher volatility means a wider range of possible future prices for the underlying asset. This increases the probability of extreme outcomes, including very high prices. For a call option, a very high price leads to a very high payoff and thus a large exposure. Therefore, higher volatility directly leads to higher Expected Exposure.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What is the difference between EE and Potential Future Exposure (PFE)?</h4>
              <p className="text-muted-foreground">Expected Exposure (EE) is the <strong className="text-foreground">average</strong> exposure at a future time. Potential Future Exposure (PFE) is a <strong className="text-foreground">quantile</strong> of the exposure distribution. For example, the 95% PFE is the level of exposure that we are 95% confident will not be exceeded at that future time. PFE is a measure of "worst-case" exposure, while EE is the average case.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Why does the EE profile for an option decline towards maturity?</h4>
              <p className="text-muted-foreground">This is due to the "amortization effect." As an option nears its expiry, there is less time for the underlying asset's price to move favorably. The uncertainty decreases. An out-of-the-money option has a high probability of expiring worthless, so its expected value (and thus exposure) converges toward zero.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Is this calculator accurate for all types of derivatives?</h4>
              <p className="text-muted-foreground">No. This calculator uses a simple European call option (Exposure = max(0, S_t - K)) for illustrative purposes. The exposure calculation for other instruments, like swaps, forwards, or more complex options, would be different. However, the underlying Monte Carlo simulation methodology for generating asset paths and averaging exposures remains the same.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">How do banks use EE in practice?</h4>
              <p className="text-muted-foreground">Banks use EE profiles for several critical functions: 1) Calculating Credit Valuation Adjustment (CVA), which is the accounting cost of counterparty risk. 2) Setting credit limits for counterparties. 3) Determining the amount of regulatory capital they must hold against counterparty risk.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator provides a dynamic view of counterparty credit risk by simulating and plotting the Expected Exposure (EE) of a financial contract over time. By using Monte Carlo methods to model thousands of possible future scenarios, it moves beyond a static point-in-time valuation to show how potential loss evolves as market uncertainty and time to maturity change. This tool is fundamental for understanding the core concepts behind credit risk management and the calculation of Credit Valuation Adjustment (CVA).</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
    