'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Info, Shield, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Link from 'next/link';

const formSchema = z.object({
  initialPrice: z.number().positive("Initial price must be positive."),
  strikePrice: z.number().positive("Strike price must be positive."),
  timeToDefault: z.number().positive("Time to default must be positive."),
  riskFreeRate: z.number().min(0, "Risk-free rate can't be negative."),
  volatility: z.number().positive("Volatility must be positive."),
  numSimulations: z.number().int().positive("Number of simulations must be a positive integer."),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  ead: number;
  pfe: number;
  histogramData: { range: string; count: number }[];
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

// Standard normal distribution using Box-Muller transform
const standardNormal = () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

export default function ExposureAtDefaultSimulation() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialPrice: undefined,
      strikePrice: undefined,
      timeToDefault: undefined,
      riskFreeRate: undefined,
      volatility: undefined,
      numSimulations: undefined,
    },
  });
  
  const resetForm = () => {
    form.reset({
      initialPrice: undefined,
      strikePrice: undefined,
      timeToDefault: undefined,
      riskFreeRate: undefined,
      volatility: undefined,
      numSimulations: undefined,
    });
    setResult(null);
  };

  const onSubmit = (values: FormValues) => {
    setIsLoading(true);
    setTimeout(() => {
        const { initialPrice, strikePrice, timeToDefault, riskFreeRate, volatility, numSimulations } = values;
        const r = riskFreeRate / 100;
        const vol = volatility / 100;

        const exposures = [];
        let sumOfExposures = 0;

        for (let i = 0; i < numSimulations; i++) {
            const epsilon = standardNormal();
            const futurePrice = initialPrice * Math.exp((r - 0.5 * vol * vol) * timeToDefault + vol * Math.sqrt(timeToDefault) * epsilon);
            // Exposure of a simple call option: max(0, S_T - K)
            const exposure = Math.max(0, futurePrice - strikePrice);
            exposures.push(exposure);
            sumOfExposures += exposure;
        }

        const ead = sumOfExposures / numSimulations;

        // Calculate 95% Potential Future Exposure (PFE)
        exposures.sort((a, b) => a - b);
        const pfeIndex = Math.floor(0.95 * numSimulations);
        const pfe = exposures[pfeIndex];

        // Create histogram data
        const maxExposure = Math.max(...exposures);
        const numBins = 20;
        const binWidth = maxExposure > 0 ? maxExposure / numBins : 1;
        const bins = Array(numBins).fill(0);

        exposures.forEach(exp => {
            if (exp > 0) {
              const binIndex = Math.min(Math.floor(exp / binWidth), numBins - 1);
              bins[binIndex]++;
            }
        });
        
        const histogramData = bins.map((count, i) => ({
            range: `${formatNumber(i * binWidth)} - ${formatNumber((i + 1) * binWidth)}`,
            count,
        }));

        setResult({ ead, pfe, histogramData });
        setIsLoading(false);
    }, 50);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Exposure at Default (EAD) Simulation
          </CardTitle>
          <CardDescription>
            Simulate the distribution of potential exposures at a specific future default time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="initialPrice" render={({ field }) => (<FormItem><FormLabel>Initial Asset Price ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 100" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="strikePrice" render={({ field }) => (<FormItem><FormLabel>Strike Price ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 100" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="timeToDefault" render={({ field }) => (<FormItem><FormLabel>Time to Default (Years)</FormLabel><FormControl><Input type="number" placeholder="e.g., 0.5" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="riskFreeRate" render={({ field }) => (<FormItem><FormLabel>Risk-Free Rate (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="volatility" render={({ field }) => (<FormItem><FormLabel>Volatility (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 20" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="numSimulations" render={({ field }) => (<FormItem><FormLabel>Number of Simulations</FormLabel><FormControl><Input type="number" placeholder="e.g., 10000" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Simulating...' : 'Run Simulation'}</Button>
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
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>
                Distribution of potential exposures at the specified time of default.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center mb-8">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Expected Exposure (EAD)</h4>
                  <p className="text-3xl font-bold">{formatNumber(result.ead)}</p>
                   <p className="text-xs text-muted-foreground">The average potential loss across all simulations.</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">95% Potential Future Exposure (PFE)</h4>
                  <p className="text-3xl font-bold text-orange-600">{formatNumber(result.pfe)}</p>
                  <p className="text-xs text-muted-foreground">A "worst-case" loss that is not expected to be exceeded 95% of the time.</p>
                </div>
              </div>
              
              <div className="mt-8 h-96">
                <h3 className="text-center font-semibold mb-4">Distribution of Exposures</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.histogramData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <XAxis dataKey="range" angle={-45} textAnchor="end" height={60} interval={1} tick={{fontSize: 10}} />
                    <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                        formatter={(value: number, name: string) => [value, 'Simulations']}
                        labelFormatter={(label: string) => `Exposure Range: ${label}`}
                    />
                    <Bar dataKey="count" name="Frequency" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interpretation of the Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p><strong className="text-foreground">EAD vs. PFE:</strong> Your Expected Exposure (EAD) of <strong className="text-primary">{formatNumber(result.ead)}</strong> represents the average loss you would expect if the counterparty defaults at the specified time. In contrast, your 95% PFE of <strong className="text-orange-600">{formatNumber(result.pfe)}</strong> is a "worst-case" scenario; it tells you that in 95% of the simulated futures, your loss would be less than this amount. PFE is always higher than EAD and is a more conservative measure of risk.</p>
                <p><strong className="text-foreground">The Histogram Distribution:</strong> The chart shows the full range of possible outcomes. Notice the shape: it is not a bell curve. It is highly skewed to the right with a large number of simulations resulting in zero or low exposure (when the option is out-of-the-money). However, there is a long "tail" on the right, representing the less likely but possible scenarios where the asset price soars, leading to a very large exposure. This tail risk is often what concerns risk managers most.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation and Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p><strong className="text-foreground">1. Calculate Expected Loss (EL):</strong> The EAD of <strong className="text-primary">{formatNumber(result.ead)}</strong> is a direct input into the core credit risk formula: Expected Loss = EAD * Probability of Default (PD) * Loss Given Default (LGD). You can now combine this exposure with estimates for PD and LGD to quantify the expected loss for this specific contract.</p>
                <p><strong className="text-foreground">2. Set Credit Limits with PFE:</strong> The PFE of <strong className="text-orange-600">{formatNumber(result.pfe)}</strong> is the key metric for setting credit limits. A bank would compare this "worst-case" exposure against the total credit limit it has for the counterparty to ensure it is not taking on excessive risk.</p>
                <p><strong className="text-foreground">3. Determine Regulatory Capital:</strong> Banking regulations (like Basel III) require banks to hold capital in reserve against unexpected losses. The PFE metric is a primary input into the models used to calculate the amount of regulatory capital needed for counterparty credit risk.</p>
                <p><strong className="text-foreground">Action:</strong> Notice how many simulations fall into the first bin (close to zero). This represents the probability of the option expiring worthless. Now, increase the volatility in the inputs and re-run. You will see the histogram spread out, the tail will get fatter, and both EAD and PFE will increase, demonstrating that higher volatility creates a riskier position.</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding Exposure at Default</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Exposure at Default (EAD) is a fundamental component of credit risk measurement. It represents the total value that a lender or creditor is exposed to when a borrower defaults on a loan or obligation.</p>
            <p>For financial derivatives, EAD isn't a fixed number; it's a random variable that depends on market movements up to the moment of default. This calculator simulates this uncertainty. It runs thousands of possible scenarios for the underlying asset price to determine a <strong className="text-foreground">distribution</strong> of possible exposures at a specific future default time. </p>
             <p>The histogram shows this distribution, while the key metrics (Expected Exposure and PFE) summarize it. This provides a much richer picture of risk than a single-point estimate.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Formula Explained</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Future Price Simulation</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">S_T = S_0 * exp((r - 0.5 * &#x3C3;^2) * T + &#x3C3; * sqrt(T) * Z)</p>
                  <p className="mt-2">This is the closed-form solution for the Geometric Brownian Motion (GBM) model, which allows us to directly simulate the asset price (S_T) at a future time (T) without simulating all the intermediate steps. 'Z' is a random draw from a standard normal distribution. By running this calculation thousands of times, we generate a distribution of possible future prices.</p>
              </div>
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Exposure Calculation</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">Exposure_i = max(0, Future Price_i - Strike Price)</p>
                  <p className="mt-2">For each of the 'i' simulated future prices, the calculator determines the exposure. For this simple call option example, the exposure is the amount the option is in-the-money. If it's out-of-the-money, the exposure is zero.</p>
              </div>
               <div>
                  <h4 className="font-semibold text-foreground mb-2">EAD and PFE</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">EAD = (1/N) * &#x2211; Exposure_i</p>
                  <p className="mt-2">The EAD is simply the average of all the individual exposure values generated in the simulation. It's also called Expected Exposure (EE) at time T. The Potential Future Exposure (PFE) is a quantile of this distribution. A 95% PFE is the value that is not expected to be exceeded in 95% of the simulated scenarios, providing a measure of "worst-case" risk.</p>
              </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5" />Related Calculators</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-primary">
              <li><Link href="/investment/expected-exposure-calculator" className="hover:underline">Expected Exposure (EE) Calculator</Link></li>
            </ul>
          </CardContent>
        </Card>

         <section className="space-y-6 text-muted-foreground leading-relaxed bg-card p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Deeper Look at Credit Risk: Exposure at Default (EAD)</h1>
            <p className="text-lg italic">To manage risk, one must first measure it. In the world of credit, Exposure at Default (EAD) is one of the three critical pillars, alongside Probability of Default (PD) and Loss Given Default (LGD). This guide explores what EAD is and why simulating it is crucial for complex financial instruments.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">The Three Pillars of Credit Risk</h2>
            <p>When a bank calculates its expected loss on a loan or financial contract, it uses a fundamental formula:</p>
            <p className="font-mono bg-muted p-4 rounded-md text-center">Expected Loss (EL) = PD * LGD * EAD</p>
            <ul className="list-disc ml-6 space-y-3 mt-4">
                <li><strong className="font-semibold">Probability of Default (PD):</strong> What is the likelihood that the borrower or counterparty will default within a specific time horizon? This is derived from credit ratings, market data, and historical information.</li>
                <li><strong className="font-semibold">Loss Given Default (LGD):</strong> <em className="italic">If</em> a default occurs, what percentage of the exposure will we fail to recover? This is expressed as a percentage (e.g., 40% LGD means a 60% recovery rate).</li>
                <li><strong className="font-semibold">Exposure at Default (EAD):</strong> <em className="italic">If</em> a default occurs, how much money are we owed at that exact moment? This is the EAD.</li>
            </ul>
            <p>For a simple term loan, EAD is relatively easy to determine; it's the outstanding loan balance. But for derivatives or lines of credit, the EAD is uncertain and depends on market movements and borrower behavior. This is why simulation becomes necessary.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">EAD for Derivatives: Capturing Uncertainty</h2>
            <p>The value of a derivative contract, such as an interest rate swap or a stock option, changes daily with market fluctuations. This means the amount you would lose if your counterparty defaulted tomorrow is unknown. It could be a large positive value (you're "in-the-money"), or it could be negative (you're "out-of-the-money," in which case your loss is zero).</p>
            <p>This calculator demonstrates how firms quantify this uncertainty for a single future point in time. It doesn't just give one answer; it provides a <strong className="font-semibold">distribution of possible EADs</strong>. The histogram chart is a visual representation of this distribution, showing which levels of exposure are most likely and which are less likely but still possible.</p>
            <p>This distribution is far more useful than a single number because it allows risk managers to answer more sophisticated questions. Instead of just asking "What's the average exposure?" (the EAD), they can ask, "What's our worst-case exposure with 95% confidence?" (the Potential Future Exposure, or PFE).</p>
            
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Understanding the Simulation Outputs</h2>
            <p>The simulation in this calculator provides two key summary statistics and a visual distribution:</p>
            <ul className="list-disc ml-6 space-y-3">
                <li>
                    <strong className="font-semibold text-foreground">Expected Exposure (EAD):</strong> This is the mean, or average, of the distribution of simulated exposures. It's the probability-weighted average of all potential exposure values. In the context of the Expected Loss formula, this is the number you would typically use for EAD. It answers the question: "On average, what would our exposure be if a default occurs at this future time?"
                </li>
                <li>
                    <strong className="font-semibold text-foreground">Potential Future Exposure (PFE):</strong> This is a measure of "worst-case" exposure. The calculator shows the 95% PFE, which means that in 95% of the simulation scenarios, the actual exposure was less than or equal to this value. PFE is not used for calculating expected loss, but it is critical for setting credit limits and for regulatory capital calculations. It answers the question: "What is a conservatively high estimate of our exposure that we don't expect to exceed?"
                </li>
                 <li>
                    <strong className="font-semibold text-foreground">The Histogram:</strong> The chart provides the full picture. A distribution that is tightly clustered around zero indicates a low-risk position. A distribution with a long "tail" to the right indicates that while large losses may be infrequent, they are possible. This tail risk is often what concerns risk managers the most. The shape of this distribution is critical for more advanced risk measures like Value at Risk (VaR) and Expected Shortfall (ES).
                </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Practical Applications in Banking and Finance</h2>
            <p>The simulation of EAD is not merely a theoretical exercise; it is a core process in modern financial institutions with real-world consequences:</p>
             <ul className="list-disc ml-6 space-y-2">
                <li><strong className="font-semibold">Regulatory Capital:</strong> Under banking regulations like Basel III, banks are required to hold a certain amount of capital in reserve to cover unexpected losses. The amount of capital required is directly influenced by risk-weighted assets, which are calculated using PFE measures derived from EAD simulations.</li>
                <li><strong className="font-semibold">Credit Limits:</strong> When a bank trades with a new counterparty, it sets a credit limit on how much total exposure it is willing to have with them. This limit is based on PFE calculations across all trades with that counterparty to manage the "worst-case" loss scenario.</li>
                <li><strong className="font-semibold">Pricing and CVA:</strong> As mentioned in the EE calculator guide, the expected exposure over time is used to calculate the Credit Valuation Adjustment (CVA), which is the price of the credit risk. Accurate EAD modeling is essential for correct CVA pricing.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Conclusion</h2>
            <p>The Exposure at Default simulation bridges the gap from a simple, deterministic view of credit risk to a more realistic, probabilistic one. By embracing uncertainty and modeling a wide range of outcomes, it allows for a more nuanced and robust understanding of the potential losses a financial institution might face. It is a fundamental tool for pricing risk, managing limits, and ensuring the stability of the financial system.</p>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What's the difference between this and the Expected Exposure (EE) Calculator?</h4>
              <p className="text-muted-foreground">The EE Calculator provides a <strong className="text-foreground">profile</strong> of the average exposure over many future time steps. This EAD simulator provides a <strong className="text-foreground">distribution</strong> of exposures at a <strong className="text-foreground">single</strong> future time step. The EAD (mean) from this calculator is equivalent to one point on the EE profile chart.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Why is the distribution of exposures skewed?</h4>
              <p className="text-muted-foreground">The exposure for an option is defined as max(0, Value). This floor at zero means the distribution cannot be negative. Asset prices, especially under GBM, also have a log-normal distribution, which is naturally skewed to the right. This results in an exposure distribution that is also skewed, with a cluster of outcomes near zero and a long tail of less likely but possible large exposures.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">How many simulations are enough?</h4>
              <p className="text-muted-foreground">The accuracy of a Monte Carlo simulation increases with the square root of the number of simulations. While 1,000 to 10,000 simulations are good for educational purposes, real-world banking systems often use hundreds of thousands or even millions of simulations for regulatory reporting to ensure the stability of the results, especially for tail measures like PFE.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Does this model account for "wrong-way risk"?</h4>
              <p className="text-muted-foreground">No. This is a simplified model. "Wrong-way risk" is a dangerous situation where the counterparty's probability of default (PD) is positively correlated with the exposure (EAD). For example, if you have a contract with an oil company that pays you if oil prices fall, their default risk increases precisely when your exposure to them increases. This model assumes PD and EAD are independent.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What does a PFE of $50 mean?</h4>
              <p className="text-muted-foreground">A 95% PFE of $50 means that across all the scenarios simulated for the specified future date, 95% of them resulted in an exposure of $50 or less. It provides a confidence level for a "worst-case" exposure, which is a more conservative risk measure than the simple average (EAD).</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This tool simulates the distribution of potential exposures for a financial contract at a specific future default date. By running thousands of Monte Carlo scenarios, it calculates not only the average exposure (EAD) but also a "worst-case" measure (Potential Future Exposure, PFE) and visualizes the entire probability distribution as a histogram. This provides a comprehensive view of counterparty risk, which is essential for setting credit limits, pricing risk, and calculating regulatory capital.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
    
