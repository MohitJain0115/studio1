
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
  order: z.coerce.number().int().min(0, "Order must be a non-negative integer.").max(10, "Order must be 10 or less for stability."),
  xValue: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

const chartConfig = {
  j: { label: "Jₙ(x)", color: "hsl(var(--primary))" },
  y: { label: "Yₙ(x)", color: "hsl(var(--destructive))" },
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
    const points = 100;
    const newChartData = [];
    const maxX = Math.max(20, data.xValue * 1.5);
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * maxX;
        const y_j = calculateBesselJ(data.order, x);
        const y_y = calculateBesselY(data.order, x);
        newChartData.push({
            x: x.toFixed(2),
            j: y_j,
            y: typeof y_y === 'number' && isFinite(y_y) ? y_y : null, // Handle infinity and NaN
        });
    }
    setChartData(newChartData);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Bessel Function Calculator</CardTitle>
          <CardDescription>Calculate Bessel functions of the first (Jₙ) and second (Yₙ) kind for an integer order.</CardDescription>
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
                <p className="text-3xl font-bold text-primary">{result.j.toPrecision(6)}</p>
            </div>
             <div className="p-6 bg-destructive/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Y_n(x)</p>
                <p className="text-3xl font-bold text-destructive">{typeof result.y === 'number' ? result.y.toPrecision(6) : result.y}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FunctionSquare className="h-5 w-5" />Function Plot</CardTitle>
            <CardDescription>Plot of Jₙ(x) and Yₙ(x) for order n={form.getValues('order')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} allowDuplicatedCategory={false} />
                <YAxis domain={[-1.1, 1.1]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="j" type="monotone" stroke="var(--color-j)" strokeWidth={2} dot={false} name="Jₙ(x)" />
                <Line dataKey="y" type="monotone" stroke="var(--color-y)" strokeWidth={2} dot={false} name="Yₙ(x)" connectNulls={false} />
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
            <p className="text-muted-foreground">A non-negative integer that defines the specific Bessel function. Each order, such as `J_0(x)`, `J_1(x)`, etc., has a unique waveform.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Value (x)</h3>
            <p className="text-muted-foreground">The point (a real number) at which you want to evaluate the function. This is the independent variable, often representing distance or time.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sigma className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bessel functions are canonical solutions y(x) to Bessel's differential equation. Calculating them precisely is computationally intensive. This calculator uses a combination of methods for accuracy and stability:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
              <li><strong>Polynomial Approximations:</strong> For small values of `x` and low orders, highly accurate polynomial approximations (based on formulas from Abramowitz and Stegun's "Handbook of Mathematical Functions") are used.</li>
              <li><strong>Recurrence Relations:</strong> For higher orders, the calculator uses stable recurrence relations. For `J_n(x)`, Miller's algorithm (a backward recurrence method) is used to ensure stability. For `Y_n(x)`, a forward recurrence relation is applied starting from calculated values for Y₀ and Y₁ .</li>
          </ul>
          <h3 className="font-semibold text-lg mt-4">Bessel Function of the First Kind, `J_n(x)`</h3>
          <p>These functions are finite (well-behaved) at x = 0. They model phenomena that are defined and finite at a central point, resembling oscillating functions like sine or cosine but with an amplitude that decreases as x increases.</p>
          <h3 className="font-semibold text-lg mt-4">Bessel Function of the Second Kind, `Y_n(x)`</h3>
          <p>Also known as Neumann functions, these are solutions that are singular (approach negative infinity) at x = 0. They are essential for modeling phenomena with a central hole, source, or singularity.</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />In-Depth Guide to Bessel Functions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">The 'Wobbling Chain' Functions</h2>
            <p>Bessel functions, first systematically studied by Friedrich Bessel, are a family of special functions that arise as solutions to a specific second-order differential equation known as **Bessel's differential equation**:</p>
            <div className="p-4 bg-muted/50 rounded-lg mt-2 text-center font-mono text-sm md:text-base">x²y'' + xy' + (x² - n²)y = 0</div>
            <p>While the equation itself is abstract, its solutions are incredibly practical. They describe a vast number of physical phenomena, particularly those involving waves and oscillations in systems with cylindrical or spherical symmetry. Think of them as the natural "sibling" functions to sine and cosine. While sines and cosines describe simple harmonic motion on a line or circle, Bessel functions describe the more complex oscillations of things like drumheads, ripples in a pond, or heat flow in a pipe.</p>

            <h3 className="text-lg font-semibold text-foreground">Visualizing the Behavior: Jₙ(x) vs. Yₙ(x)</h3>
            <p>The best way to understand Bessel functions is to visualize them. Use the calculator to plot functions of different integer orders (`n`).</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>`J_n(x)` (First Kind, "Regular"):</strong> These are the most common solutions. They are "regular" because they are finite and well-behaved at the origin (x=0).
                    <ul>
                        <li><strong>`J_0(x)`:</strong> Starts at its maximum value of 1 at x=0 and oscillates like a damped cosine wave.</li>
                        <li><strong>`J_1(x)`:</strong> Starts at 0, rises to a peak, and then oscillates like a damped sine wave.</li>
                    </ul>
                </li>
                <li><strong>`Y_n(x)` (Second Kind, "Irregular"):</strong> These solutions are "irregular" or "singular" at the origin. As `x` approaches 0, `Y_n(x)` goes to negative infinity. This mathematical property makes them physically unsuitable for describing phenomena that must be finite at the center of a cylinder (like the vibration at the very center of a drumhead). However, they are essential for describing phenomena with a central hole, source, or boundary condition away from the center (like the waves in a washer-shaped pool).</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground">Where are Bessel Functions Used?</h3>
            <p>Bessel functions are indispensable in many areas of science and engineering. Their ability to incorporate cylindrical or spherical symmetry into solutions makes them appear everywhere.</p>
            <div className="w-full overflow-x-auto mt-2">
              <table className="w-full text-sm">
                <thead className="text-left font-semibold text-foreground"><tr><th className="p-2 border-b">Field</th><th className="p-2 border-b">Application</th></tr></thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Acoustics</td><td className="p-2">Analyzing the vibrations of a circular drumhead. The concentric circular lines where the drum doesn't move (nodes) correspond to the zeros of Bessel functions.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Electromagnetism</td><td className="p-2">Describing the propagation of electromagnetic waves in a cylindrical waveguide, like a coaxial cable or optical fiber.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Heat Transfer</td><td className="p-2">Solving for the temperature distribution in a cylindrical object, like a metal rod, fin, or engine cylinder, as it heats or cools.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Fluid Dynamics</td><td className="p-2">Modeling the oscillations of a hanging chain or the sloshing of liquid in a cylindrical tank.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Signal Processing</td><td className="p-2">Used in the analysis of frequency modulation (FM) signals. The amplitudes of the sidebands in an FM signal are directly given by Bessel function values.</td>
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
              <AccordionTrigger>What's the key difference between functions of the first kind (J) and second kind (Y)?</AccordionTrigger>
              <AccordionContent>
                <p>The primary physical difference is their behavior at x=0. `J_n(x)` functions are finite at the origin, making them suitable for problems involving a solid cylinder or a complete domain. `Y_n(x)` functions are infinite (singular) at the origin, making them necessary for problems with a hole or boundary at the center, like an annulus (a ring shape) or wave propagation from a line source.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can the order `n` be a non-integer?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. Bessel functions are defined for fractional or even complex orders, which are crucial in advanced physics and engineering (e.g., quantum mechanics). However, the formulas become more complex, often involving the gamma function. This calculator is specialized for non-negative integer orders, which cover the vast majority of introductory and common applications.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>What are modified Bessel functions (`I_n` and `K_n`)?</AccordionTrigger>
              <AccordionContent>
                <p>Modified Bessel functions are solutions to the *modified* Bessel's differential equation, where the term `(x^2 - n^2)` is replaced with `-(x^2 + n^2)`. This change turns the oscillatory solutions into exponential solutions. Instead of waving up and down, `I_n(x)` represents exponential growth, and `K_n(x)` represents exponential decay. They are used in problems involving diffusion or damping, such as heat flow in a pipe or the probability distribution of wind speeds.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Why does Yₙ(x) show "-Infinity" for x=0?</AccordionTrigger>
              <AccordionContent>
                <p>The Bessel function of the second kind, `Y_n(x)`, is mathematically singular at x=0 by definition. This means its value approaches negative infinity as x gets closer to zero. This is a fundamental property of the function, and the calculator correctly reports this singularity. For values of x very close to 0, you will see a very large negative number.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>How is this different from sine or cosine?</AccordionTrigger>
              <AccordionContent>
                <p>Sine and cosine are solutions to the simple harmonic oscillator equation (`y'' + k²y = 0`), which describes uniform oscillations with a constant amplitude. Bessel functions solve a more complex equation and describe oscillations whose amplitude is not constant but decays as `1/√x`. They are often called "cylindrical functions" because they represent the radial part of the solution to the wave equation in cylindrical coordinates, whereas sine and cosine represent the solution in Cartesian coordinates.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
                <AccordionTrigger>What are the "zeros" of a Bessel function?</AccordionTrigger>
                <AccordionContent>
                    <p>The "zeros" of a Bessel function are the `x` values where the function crosses the horizontal axis, i.e., `J_n(x) = 0`. These points are extremely important in physics. For example, in the vibrating drumhead problem, the zeros of the Bessel function correspond to the circular "nodal lines" where the drumhead remains stationary while the rest of it vibrates.</p>
                </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The Bessel Function Calculator provides a tool to compute and visualize the values of Bessel functions of the first and second kinds for integer orders. These special functions are fundamental solutions to wave and potential equations in systems with cylindrical symmetry. By offering both the calculated values and a graphical plot, this tool aids students, engineers, and scientists in understanding and applying these critical functions to real-world problems in fields ranging from acoustics and electromagnetism to heat transfer and signal processing.</p>
        </CardContent>
      </Card>
    </div>
  );
}
