'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateBesselJ, calculateBesselY } from '@/lib/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Sigma, Lightbulb, FunctionSquare } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const formSchema = z.object({
  order: z.coerce.number().int().min(0, "Order must be a non-negative integer."),
  xValue: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

const chartConfig = {
  j: { label: "BesselJ", color: "hsl(var(--primary))" },
  y: { label: "BesselY", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;

export default function BesselFunctionCalculator() {
  const [result, setResult] = useState<{ j: number; y: number | string } | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { order: 0, xValue: 1 },
  });

  const onSubmit = (data: FormValues) => {
    const j_val = calculateBesselJ(data.order, data.xValue);
    const y_val = calculateBesselY(data.order, data.xValue);
    setResult({ j: j_val, y: y_val });
    
    // Generate chart data
    const points = 50;
    const newChartData = [];
    const maxX = Math.max(10, data.xValue * 1.5);
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * maxX;
        const y_j = calculateBesselJ(data.order, x);
        const y_y = calculateBesselY(data.order, x);
        newChartData.push({
            x: x.toFixed(2),
            j: y_j,
            y: typeof y_y === 'number' ? y_y : null, // Handle infinity
        });
    }
    setChartData(newChartData);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Bessel Function Calculator</CardTitle>
          <CardDescription>Calculate Bessel functions of the first (J) and second (Y) kind for an integer order.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="order" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order (n)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 0" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="xValue" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (x)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="submit">Calculate</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
             <div className="p-6 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">J_n(x)</p>
                <p className="text-3xl font-bold text-primary">{result.j.toPrecision(5)}</p>
            </div>
             <div className="p-6 bg-destructive/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Y_n(x)</p>
                <p className="text-3xl font-bold text-destructive">{typeof result.y === 'number' ? result.y.toPrecision(5) : result.y}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FunctionSquare className="h-5 w-5" />Function Plot</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} />
                <YAxis domain={[-1, 1]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="j" type="monotone" stroke="var(--color-j)" strokeWidth={2} dot={false} name="J(x)" />
                <Line dataKey="y" type="monotone" stroke="var(--color-y)" strokeWidth={2} dot={false} name="Y(x)" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Understanding the Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Order (n)</h3>
            <p className="text-muted-foreground">A non-negative integer that defines the specific Bessel function. `J_0(x)`, `J_1(x)`, etc., all have different shapes.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Value (x)</h3>
            <p className="text-muted-foreground">The point at which you want to evaluate the function. This is the independent variable.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bessel functions are solutions to Bessel's differential equation. Calculating them precisely often involves infinite series or complex integrals. This calculator uses a highly accurate polynomial approximation (based on formulas from Abramowitz and Stegun's "Handbook of Mathematical Functions") to compute the values for `J_n(x)` and `Y_n(x)`.</p>
          <h3 className="font-semibold text-lg mt-4">Bessel Function of the First Kind, `J_n(x)`</h3>
          <p>These functions are finite at x = 0. They resemble oscillating functions like sine or cosine, but their amplitude decreases as x increases. `J_0(0) = 1`, and `J_n(0) = 0` for n > 0.</p>
          <h3 className="font-semibold text-lg mt-4">Bessel Function of the Second Kind, `Y_n(x)`</h3>
          <p>Also known as Neumann functions, these are solutions that are singular (infinite) at x = 0. They also oscillate with decreasing amplitude but start at negative infinity at x=0.</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />In-Depth Guide to Bessel Functions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">The 'Wobbling Chain' Functions</h2>
            <p>Bessel functions, first defined by the mathematician Daniel Bernoulli and later generalized by Friedrich Bessel, are a family of special functions that arise as solutions to a specific second-order differential equation known as **Bessel's differential equation**:</p>
            <div className="p-4 bg-muted/50 rounded-lg mt-2 text-center font-mono text-sm md:text-base">x²y'' + xy' + (x² - n²)y = 0</div>
            <p>While the equation itself is abstract, its solutions describe a vast number of physical phenomena, particularly those involving waves and oscillations in cylindrical or spherical shapes. Think of them as the cylindrical equivalent of the sine and cosine functions, which describe simple harmonic motion on a line.</p>

            <h3 className="text-lg font-semibold text-foreground">Visualizing the Behavior</h3>
            <p>The best way to understand Bessel functions is to see them. Use the calculator to plot functions of different orders (`n`).</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>`J_0(x)` (Order 0, First Kind):</strong> This is one of the most common. It starts at a maximum value of 1 at x=0 and oscillates like a damped cosine wave. Its peaks and valleys get smaller as `x` moves away from zero.</li>
                <li><strong>`J_1(x)` (Order 1, First Kind):</strong> This function starts at 0 at x=0, rises to a peak, and then oscillates like a damped sine wave.</li>
                <li><strong>`Y_n(x)` (Second Kind):</strong> These functions are notable because they are "singular" at the origin. As `x` approaches 0, `Y_n(x)` goes to negative infinity. This mathematical property makes them unsuitable for describing physical phenomena that must be finite at the center of a cylinder (like the vibration of a drumhead), but they are essential for describing phenomena with a central hole or source, like the waves on the surface of water after a pebble is dropped.</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground">Where are Bessel Functions Used?</h3>
            <p>Bessel functions are indispensable in many areas of science and engineering. Their ability to describe systems with cylindrical or spherical symmetry makes them appear everywhere.</p>
            <div className="w-full overflow-x-auto mt-2">
              <table className="w-full text-sm">
                <thead className="text-left font-semibold text-foreground"><tr><th className="p-2 border-b">Field</th><th className="p-2 border-b">Application</th></tr></thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Acoustics</td><td className="p-2">Analyzing the vibrations of a circular drumhead. The nodal lines (where the drum doesn't move) correspond to the zeros of Bessel functions.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Electromagnetism</td><td className="p-2">Describing the propagation of electromagnetic waves in a cylindrical waveguide (like a coaxial cable).</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Heat Transfer</td><td className="p-2">Solving for the temperature distribution in a cylindrical object, like a metal rod or a cooking pot.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Fluid Dynamics</td><td className="p-2">Modeling the oscillations of a hanging chain or the ripples on the surface of water.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Signal Processing</td><td className="p-2">Used in frequency modulation (FM) synthesis and designing filters. The sidebands in an FM signal are related to Bessel function values.</td>
                  </tr>
                </tbody>
              </table>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What's the difference between functions of the first kind (J) and second kind (Y)?</AccordionTrigger>
              <AccordionContent>
                <p>Mathematically, they are two independent solutions to Bessel's differential equation. For any second-order differential equation, you need a combination of two independent solutions to describe all possible behaviors. Physically, the key difference is their behavior at x=0. `J_n(x)` is finite (well-behaved) at the origin, while `Y_n(x)` is infinite (singular). Therefore, `J` functions are used for problems involving a full cylinder, while `Y` functions are needed for problems involving an annulus (a ring or donut shape).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can the order `n` be a non-integer?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, Bessel functions can be defined for fractional or even complex orders. However, the formulas and calculations become more complex, often involving the gamma function. This calculator is specialized for non-negative integer orders, which cover the vast majority of common applications.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>What are modified Bessel functions (`I_n` and `K_n`)?</AccordionTrigger>
              <AccordionContent>
                <p>Modified Bessel functions are solutions to the *modified* Bessel's differential equation, where the `(x^2 - n^2)` term is replaced by `-(x^2 + n^2)`. Instead of oscillating, these functions exhibit purely exponential growth or decay. They are used in problems involving diffusion or damping, such as heat flow in a pipe or the analysis of certain electrical filters.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Why does Y(x) show "Infinity"?</AccordionTrigger>
              <AccordionContent>
                <p>The Bessel function of the second kind, `Y_n(x)`, is mathematically singular at x=0, meaning its value goes to negative infinity. If you input x=0, the calculator correctly reports this. For values of x very close to 0, you will see a very large negative number.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>How is this different from sine or cosine?</AccordionTrigger>
              <AccordionContent>
                <p>Sine and cosine are solutions to the simple harmonic oscillator equation (`y'' + y = 0`), which describes uniform oscillations. Bessel functions solve a more complex equation and describe oscillations whose amplitude is not constant. They are often called "cylindrical functions" because they represent the radial part of the solution to the wave equation in cylindrical coordinates.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}
