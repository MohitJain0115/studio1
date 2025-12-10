'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Info, Shield, TrendingUp, TestTube, PlusCircle, Trash2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Link from 'next/link';

const observationSchema = z.object({
  predictedLgd: z.number().min(0, "Must be >= 0").max(100, "Must be <= 100"),
  actualLgd: z.number().min(0, "Must be >= 0").max(100, "Must be <= 100"),
});

const formSchema = z.object({
  observations: z.array(observationSchema).min(1, 'Please add at least one observation.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  meanAbsoluteError: number;
  meanSquaredError: number;
  rootMeanSquaredError: number;
  chartData: { name: string; 'Predicted LGD': number; 'Actual LGD': number; }[];
}

const formatPercent = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value / 100);
const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);


export default function LgdBacktestCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observations: [{ predictedLgd: undefined, actualLgd: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "observations",
  });
  
  const resetForm = () => {
    form.reset({
      observations: [{ predictedLgd: undefined, actualLgd: undefined }],
    });
    setResult(null);
  };

  const onSubmit = (values: FormValues) => {
    const n = values.observations.length;
    if (n === 0) return;

    let sumAbsoluteError = 0;
    let sumSquaredError = 0;

    const chartData = values.observations.map((obs, index) => {
      const error = obs.actualLgd - obs.predictedLgd;
      sumAbsoluteError += Math.abs(error);
      sumSquaredError += error * error;
      return {
        name: `Obs ${index + 1}`,
        'Predicted LGD': obs.predictedLgd,
        'Actual LGD': obs.actualLgd,
      }
    });
    
    const meanAbsoluteError = sumAbsoluteError / n;
    const meanSquaredError = sumSquaredError / n;
    const rootMeanSquaredError = Math.sqrt(meanSquaredError);

    setResult({
      meanAbsoluteError,
      meanSquaredError,
      rootMeanSquaredError,
      chartData,
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Loss Given Default (LGD) Backtest Calculator
          </CardTitle>
          <CardDescription>
            Assess the accuracy of an LGD model by comparing its predictions to actual outcomes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Model Observations</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end border p-4 rounded-lg relative">
                      <FormField
                        control={form.control}
                        name={`observations.${index}.predictedLgd`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Predicted LGD (%)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 45" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`observations.${index}.actualLgd`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Actual LGD (%)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 52" {...field} value={field.value ?? ''} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
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
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ predictedLgd: undefined, actualLgd: undefined })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Observation
                </Button>
              </div>

              <div className="flex gap-4">
                <Button type="submit">Backtest Model</Button>
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
              <CardTitle>Backtesting Results</CardTitle>
              <CardDescription>Key error metrics for your LGD model's performance.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Mean Absolute Error (MAE)</h4>
                        <p className="text-3xl font-bold">{formatNumber(result.meanAbsoluteError)}%</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Mean Squared Error (MSE)</h4>
                        <p className="text-3xl font-bold">{formatNumber(result.meanSquaredError)}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Root Mean Squared Error (RMSE)</h4>
                        <p className="text-3xl font-bold">{formatNumber(result.rootMeanSquaredError)}%</p>
                    </div>
                </div>
                <div className="mt-8 h-96">
                    <h3 className="text-center font-semibold mb-4">Predicted vs. Actual LGD</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.chartData}>
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'LGD (%)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                            <Bar dataKey="Predicted LGD" fill="hsl(var(--chart-2))" />
                            <Bar dataKey="Actual LGD" fill="hsl(var(--chart-1))" />
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
                <p><strong className="text-foreground">Mean Absolute Error (MAE) of {formatNumber(result.meanAbsoluteError)}%:</strong> This is the most straightforward metric. It means that, on average, your model's prediction was off by about {formatNumber(result.meanAbsoluteError)} percentage points. A lower MAE is better. This value gives you a simple, interpretable measure of the typical error size.</p>
                <p><strong className="text-foreground">Root Mean Squared Error (RMSE) of {formatNumber(result.rootMeanSquaredError)}%:</strong> RMSE penalizes larger errors more heavily than MAE because it squares the errors before averaging. An RMSE that is significantly higher than the MAE indicates that your model has some large, outlier errors. For risk management, these large misses are often the most concerning.</p>
                <p><strong className="text-foreground">Visual Analysis:</strong> The bar chart provides a quick visual check. Are the predicted bars consistently lower than the actuals (under-prediction)? Are they consistently higher (over-prediction)? Or are the errors random? A systematic bias (always too high or too low) suggests a fundamental problem with the model's calibration.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation and Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p><strong className="text-foreground">1. Establish a Threshold:</strong> Your institution should have a defined threshold for acceptable model performance (e.g., MAE must be below 10%). If your results exceed this, it should trigger a formal model review.</p>
                <p><strong className="text-foreground">2. Analyze Error Patterns:</strong> Don't just look at the aggregate numbers. Look at the individual observations in the chart. Are the largest errors concentrated in a specific type of loan or economic condition (if you have that data)? A model might perform well on average but poorly for a specific, high-risk segment. This would require model refinement.</p>
                <p><strong className="text-foreground">3. Recalibrate or Rebuild:</strong> If the backtest reveals significant inaccuracies or bias (e.g., your model consistently predicts 40% LGD when actuals are closer to 60%), the model likely needs to be recalibrated with more recent data. If the issues are more fundamental, a complete model rebuild might be necessary.</p>
                <p><strong className="text-foreground">Action:</strong> Add more observations to the calculator, especially any where the model's prediction was very wrong. See how much the MAE and RMSE change. This demonstrates the sensitivity of the metrics to outliers and the importance of a comprehensive backtesting dataset.</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding LGD Backtesting</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Loss Given Default (LGD) is a measure of the financial loss incurred when a borrower defaults on a loan, expressed as a percentage of the total exposure at the time of default. Banks and financial institutions build complex statistical models to predict LGD for their loan portfolios.</p>
            <p>Backtesting is the crucial process of validating that model. It involves comparing the model's LGD predictions from a prior period against the actual, observed LGDs that have since been resolved. This calculator allows you to perform a simple backtest, providing key error metrics to assess your model's predictive power and accuracy.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Formulas Explained</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Mean Absolute Error (MAE)</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">MAE = (1/N) * &#x2211; |Actual LGD - Predicted LGD|</p>
                  <p className="mt-2">MAE calculates the average size of the errors in a set of predictions, without considering their direction. It's the average over the test sample of the absolute differences between prediction and actual observation where all individual differences have equal weight.</p>
              </div>
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Mean Squared Error (MSE)</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">MSE = (1/N) * &#x2211; (Actual LGD - Predicted LGD)^2</p>
                  <p className="mt-2">MSE measures the average of the squares of the errors. Because the errors are squared before they are averaged, MSE gives a relatively high weight to large errors. This means it is a useful metric when large errors are particularly undesirable.</p>
              </div>
              <div>
                  <h4 className="font-semibold text-foreground mb-2">Root Mean Squared Error (RMSE)</h4>
                  <p className="font-mono bg-muted p-4 rounded-md">RMSE = sqrt(MSE)</p>
                  <p className="mt-2">RMSE is the square root of the MSE. This is done to bring the metric back to the original units (in this case, percentage points of LGD), making it more interpretable than MSE. Like MSE, it penalizes large errors more severely than MAE.</p>
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
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">A Practical Guide to Credit Risk Model Backtesting: Loss Given Default (LGD)</h1>
            <p className="text-lg italic">In the world of risk management, a model is only as good as its predictive power. Backtesting is the process of rigorously checking a model's predictions against reality. This guide delves into the why and how of backtesting for Loss Given Default (LGD) models.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">The Three Pillars of Credit Risk and the Role of LGD</h2>
            <p>Modern credit risk management, especially under the Basel accords, is built upon three key parameters for calculating expected loss:</p>
            <p className="font-mono bg-muted p-4 rounded-md text-center">Expected Loss (EL) = Probability of Default (PD) * Loss Given Default (LGD) * Exposure at Default (EAD)</p>
             <ul className="list-disc ml-6 space-y-3 mt-4">
                <li><strong className="font-semibold">Probability of Default (PD):</strong> The likelihood a borrower will default.</li>
                <li><strong className="font-semibold">Exposure at Default (EAD):</strong> The amount owed by the borrower at the moment of default.</li>
                <li><strong className="font-semibold">Loss Given Default (LGD):</strong> The percentage of the exposure that will be <em className="italic">lost</em> after all recovery efforts are completed. If a bank has a $100,000 EAD and recovers $60,000 through collateral sales and collections, the loss is $40,000, and the LGD is 40%.</li>
            </ul>
            <p>While PD models often get more attention, LGD models are equally critical. An inaccurate LGD model can lead a bank to misprice its loans, hold insufficient capital, and underestimate its true risk profile.</p>
            
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">What is Backtesting? Confronting Predictions with Reality</h2>
            <p>Backtesting is the practice of comparing a model's historical predictions (ex-ante) with the actual outcomes that have since occurred (ex-post). For LGD, this means taking a set of loans that defaulted in the past, for which the bank's model made a prediction (e.g., "we predict a 45% LGD for this loan"), and comparing that prediction to the final, realized LGD after the entire recovery process is finished (which can take years).</p>
            <p>This process is mandatory for banks using their own internal models for regulatory capital calculations. Regulators need to be sure that the bank's models are accurate, conservative, and not understating risk. This calculator allows you to perform a simplified version of this regulatory requirement.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Interpreting the Key Backtesting Metrics</h2>
            <p>This calculator provides three standard metrics for assessing the accuracy of a continuous model like LGD. Understanding the nuances between them is key.</p>
             <ol className="list-decimal ml-6 space-y-4">
                <li>
                    <strong className="font-semibold text-foreground">Mean Absolute Error (MAE):</strong> Think of this as the "average error." It tells you, in percentage points, how far off your predictions are on average. It's simple, easy to interpret, and gives a good overall sense of the error magnitude. However, it treats a 10-point error the same whether it's on a single loan or spread across ten loans, and it doesn't tell you if your errors are biased (i.e., always too high or too low).
                </li>
                <li>
                    <strong className="font-semibold text-foreground">Mean Squared Error (MSE) and Root Mean Squared Error (RMSE):</strong> These metrics are closely related. By squaring the errors before averaging, they place a much heavier penalty on large errors. A model with many small errors might have a low MAE but a high RMSE if it also has a few very large errors. In risk management, these large, unexpected losses are often the most damaging. Therefore, RMSE is a critical metric for a risk-oriented assessment. If your RMSE is significantly higher than your MAE, it's a red flag that you have outliers that need investigation. We use RMSE because it's in the same units as the original data (LGD %), making it more interpretable than MSE.
                </li>
            </ol>
            
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Beyond the Metrics: Qualitative Analysis</h2>
            <p>Quantitative metrics are only part of the story. A thorough backtest also involves qualitative analysis, which you can simulate by looking at the bar chart.</p>
            <ul className="list-disc ml-6 space-y-2">
                <li><strong className="font-semibold">Bias Assessment:</strong> Look at the chart. Are the blue bars (Predicted) consistently shorter than the red bars (Actual)? This would indicate a systematic underestimation of LGD, which is a serious issue. It means the model is too optimistic and the bank is understating its expected losses and holding insufficient capital. Conversely, consistent overestimation, while more prudent, could mean the bank is overpricing loans and losing business.</li>
                <li><strong className="font-semibold">Outlier Investigation:</strong> Identify the specific observations with the largest errors. What do these loans have in common? Are they from a particular industry, geographic region, or of a specific collateral type? This analysis can reveal weaknesses in the model's ability to handle certain risk segments.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Conclusion: An Ongoing Process of Refinement</h2>
            <p>Backtesting is not a one-time event. It is a continuous cycle of prediction, observation, comparison, and refinement. Financial markets and economic conditions change, and a model that was accurate five years ago may not be today. By regularly and rigorously backtesting their LGD models, financial institutions ensure they have a clear and accurate understanding of their potential losses, allowing them to make sounder lending decisions, hold appropriate levels of capital, and maintain the stability of the financial system. This calculator provides a window into this essential risk management practice.</p>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Why is RMSE usually higher than MAE?</h4>
              <p className="text-muted-foreground">Because RMSE squares the errors, it gives much more weight to large errors. A single error of 10 points contributes 10 to the MAE sum, but 100 to the MSE sum. This disproportionate weighting means that even a few large errors will inflate the RMSE. A large gap between RMSE and MAE is a signal of outliers.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What is a "good" value for MAE or RMSE?</h4>
              <p className="text-muted-foreground">This is highly dependent on the institution's risk appetite and the type of loan portfolio. For a mortgage portfolio, an MAE of 5-7% might be considered good. For unsecured personal loans, where losses are more volatile, an MAE of 10-15% might be acceptable. The key is to establish internal thresholds and track performance over time.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">How long does an LGD backtesting period need to be?</h4>
              <p className="text-muted-foreground">Regulators often require several years of data. The challenge with LGD is the time it takes to resolve a defaulted loan. The full recovery process can take 2-5 years or even longer. This means that the "actual LGD" for a loan that defaulted last year might not be known for several more years.</p>
            </div>
             <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What's the difference between LGD and ELGD?</h4>
              <p className="text-muted-foreground">LGD typically refers to a single, observed outcome. ELGD stands for "Expected Loss Given Default" and is the model's prediction. For a portfolio, ELGD is often a through-the-cycle average. Downturn LGD (DLGD) is an estimate of LGD during a recession, which is usually much higher than average and is often the primary focus for regulatory capital.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This calculator provides a straightforward tool for backtesting the performance of a Loss Given Default (LGD) model. By inputting pairs of predicted and actual LGD values, it computes key statistical error metrics—Mean Absolute Error (MAE), Mean Squared Error (MSE), and Root Mean Squared Error (RMSE)—and visualizes the differences. This allows risk managers and model validators to assess a model's accuracy, identify biases, and determine if the model is fit for purpose in calculating expected loss and regulatory capital.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
