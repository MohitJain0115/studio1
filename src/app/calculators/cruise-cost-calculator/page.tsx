'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateCruiseCost, formatCurrency } from '@/lib/calculators';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { Ship, Users, DollarSign, Info, Shield, Compass, FerrisWheel, Beer, Wifi } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  numTravelers: z.coerce.number().int().positive('Must be at least 1 traveler'),
  numNights: z.coerce.number().int().positive('Must be at least 1 night'),
  baseFare: z.coerce.number().positive('Base fare must be positive'),
  taxesAndFees: z.coerce.number().nonnegative('Cannot be negative').default(0),
  onboardGratuities: z.coerce.number().nonnegative('Cannot be negative').default(0),
  travelInsurance: z.coerce.number().nonnegative('Cannot be negative').default(0),
  onboardSpending: z.coerce.number().nonnegative('Cannot be negative').default(0),
  shoreExcursions: z.coerce.number().nonnegative('Cannot be negative').default(0),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators = [
    { name: 'Backpack Weight Calculator', href: '/calculators/backpack-weight-calculator' },
    { name: 'Car vs. Flight Cost Comparison', href: '/calculators/car-vs-flight-calculator' },
    { name: 'Group Expense Splitter', href: '/calculators/group-expense-splitter' },
    { name: 'Hiking Calorie Calculator', href: '/calculators/hiking-calorie-calculator' },
    { name: 'Hiking Time Calculator', href: '/calculators/hiking-time-calculator' },
    { name: 'Travel Days Calculator', href: '/calculators/travel-days-calculator' },
    { name: 'Trip Budget Calculator', href: '/calculators/trip-budget-calculator' },
].sort((a,b) => a.name.localeCompare(b.name));


export default function CruiseCostCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateCruiseCost> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        numTravelers: undefined,
        numNights: undefined,
        baseFare: undefined,
        taxesAndFees: undefined,
        onboardGratuities: undefined,
        travelInsurance: undefined,
        onboardSpending: undefined,
        shoreExcursions: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateCruiseCost(data);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Cruise Cost Calculator</CardTitle>
          <CardDescription>
            Estimate the total cost of your cruise vacation, from the base fare to onboard extras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="numTravelers" render={({ field }) => (
                    <FormItem><FormLabel>Number of Travelers</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} min={1} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="numNights" render={({ field }) => (
                    <FormItem><FormLabel>Number of Nights</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} min={1} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Per-Person Costs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="baseFare" render={({ field }) => (
                        <FormItem><FormLabel>Base Fare (per person)</FormLabel><FormControl><Input type="number" placeholder="e.g., 899" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="taxesAndFees" render={({ field }) => (
                        <FormItem><FormLabel>Taxes & Port Fees (per person)</FormLabel><FormControl><Input type="number" placeholder="e.g., 210" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="onboardGratuities" render={({ field }) => (
                        <FormItem><FormLabel>Gratuities (per person, per day)</FormLabel><FormControl><Input type="number" placeholder="e.g., 18" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="travelInsurance" render={({ field }) => (
                        <FormItem><FormLabel>Travel Insurance (per person)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="onboardSpending" render={({ field }) => (
                        <FormItem><FormLabel>Onboard Spending (per person)</FormLabel><FormControl><Input type="number" placeholder="Drinks, specialty dining" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="shoreExcursions" render={({ field }) => (
                        <FormItem><FormLabel>Shore Excursions (per person)</FormLabel><FormControl><Input type="number" placeholder="Tours, activities" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
              </div>
              
              <Button type="submit">Calculate Total Cruise Cost</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Total Cruise Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                 <div className="p-6 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Cruise Cost</p>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(result.totalCost)}</p>
                </div>
                 <div className="p-6 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Average Cost Per Person</p>
                    <p className="text-4xl font-bold">{formatCurrency(result.costPerPerson)}</p>
                </div>
            </div>

            <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center"><span className="text-muted-foreground">Total Base Fare:</span><span className="font-medium">{formatCurrency(result.breakdown.baseFare)}</span></li>
                <li className="flex justify-between items-center"><span className="text-muted-foreground">Total Taxes & Port Fees:</span><span className="font-medium">{formatCurrency(result.breakdown.taxesAndFees)}</span></li>
                <li className="flex justify-between items-center"><span className="text-muted-foreground">Total Onboard Gratuities:</span><span className="font-medium">{formatCurrency(result.breakdown.gratuities)}</span></li>
                <li className="flex justify-between items-center"><span className="text-muted-foreground">Total Travel Insurance:</span><span className="font-medium">{formatCurrency(result.breakdown.insurance)}</span></li>
                <li className="flex justify-between items-center"><span className="text-muted-foreground">Total Onboard Spending:</span><span className="font-medium">{formatCurrency(result.breakdown.onboardSpending)}</span></li>
                <li className="flex justify-between items-center"><span className="text-muted-foreground">Total Shore Excursions:</span><span className="font-medium">{formatCurrency(result.breakdown.excursions)}</span></li>
                 <Separator className="my-2"/>
                 <li className="flex justify-between items-center text-base"><span className="font-semibold">Grand Total:</span><span className="font-semibold">{formatCurrency(result.totalCost)}</span></li>
            </ul>
             <p className="text-xs text-muted-foreground pt-4">*This calculation does not include flights to/from the port or pre-cruise accommodation.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding the Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>All costs are entered on a per-person basis, except for Gratuities which is per-person, per-day. The calculator handles the multiplication by number of travelers and nights.</p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Base Fare:</strong> The advertised price of the cruise per person.</li>
              <li><strong>Taxes & Port Fees:</strong> A mandatory charge per person that covers government taxes and fees for docking at various ports.</li>
              <li><strong>Onboard Gratuities:</strong> The daily "auto-gratuity" charged per person for service staff. This is often around $16-$25 per day.</li>
              <li><strong>Travel Insurance:</strong> The per-person cost for a travel insurance policy.</li>
              <li><strong>Onboard Spending:</strong> Your personal budget per person for extras not included in the fare, such as alcoholic drinks, specialty coffee, casino, spa treatments, or Wi-Fi packages.</li>
              <li><strong>Shore Excursions:</strong> The total amount per person you plan to spend on tours and activities in port cities.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculator sums up all per-person and per-day costs to provide a comprehensive total for your cruise vacation. It calculates the total for each category and then adds them together for a final grand total, which is also broken down into a cost-per-person average for easy budgeting.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Compass className="h-5 w-5" />Related Calculators</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link href={calc.href} key={calc.name} className="block hover:no-underline">
              <Card className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors h-full text-center">
                <span className="font-semibold">{calc.name}</span>
              </Card>
            </Link>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">The True Cost of a Cruise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">A Complete Guide to Decoding Cruise Prices and Budgeting for Your Voyage</h2>
          <p>Cruises are often marketed as "all-inclusive" vacations, but the reality is more complex. The attractive base fare you see is just the beginning. A variety of mandatory fees and optional extras can significantly increase the final price. Understanding every component of a cruise bill is essential for creating an accurate budget and avoiding sticker shock at the end of your trip. This guide breaks down the true cost of a cruise, from fixed fees to discretionary spending.</p>
          
          <h3 className="text-lg font-semibold text-foreground">The Upfront, Fixed Costs</h3>
          <p>These are the core costs you will pay before you even step on the ship. They form the foundation of your cruise budget.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Base Fare:</strong> This is the price per person for your cabin. It covers your accommodation, most meals (in main dining rooms and buffets), some basic beverages (like water, iced tea, and standard coffee), and access to most onboard entertainment and facilities like pools and gyms.</li>
            <li><strong>Taxes, Fees, and Port Expenses:</strong> This is a mandatory, non-negotiable charge per person. It covers government taxes, customs fees, and charges levied by each port of call for the use of their facilities. This can often add several hundred dollars per person to the total price.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground">The "Almost" Mandatory Costs</h3>
          <p>While technically optional, these costs are so standard they should be considered part of your fixed budget.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Onboard Gratuities:</strong> Most major cruise lines automatically add a daily gratuity (or "service charge") to your onboard account for each passenger. This amount, typically $16 to $25 per person per day, is distributed among the dining staff, cabin stewards, and other behind-the-scenes crew. While you can sometimes adjust or remove this at the guest services desk, it is standard practice to pay it.</li>
            <li><strong>Travel Insurance:</strong> While not required by the cruise line, it is highly recommended. Travel insurance protects you from financial loss due to trip cancellation, medical emergencies at sea or in a foreign country, or lost luggage. This is a critical expense for peace of mind.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground">The Discretionary Onboard Spending</h3>
          <p>This is where your personal choices can dramatically affect your final bill. These are the "extras" that are not included in your base fare.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Beverages:</strong> Soda, specialty coffees, and alcoholic drinks are almost never included in the base fare. You can buy them a la carte or purchase a drink package. A drink package can be a good value if you plan to have several drinks per day, but they are a significant upfront cost.</li>
            <li><strong>Specialty Dining:</strong> While the main dining rooms and buffet are free, most ships have "specialty" restaurants (like a steakhouse or sushi bar) that charge an extra fee, either a flat cover charge or a la carte pricing.</li>
            <li><strong>Wi-Fi:</strong> Internet access at sea is expensive. Cruise lines sell packages based on usage or for the duration of the cruise. Do not expect free Wi-Fi.</li>
            <li><strong>Spa and Salon Services:</strong> Massages, facials, and other treatments are available for a premium price.</li>
            <li><strong>Casino and Bingo:</strong> A major source of revenue for cruise lines, any gambling is an out-of-pocket expense.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground">Off-Ship Costs: Shore Excursions</h3>
          <p>What you do in port is another major variable. You have two main options:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Ship-Sponsored Excursions:</strong> These are tours and activities sold directly by the cruise line. They are convenient and guarantee that the ship will wait for you if your tour runs late. However, they are often more expensive than independent options.</li>
            <li><strong>Independent Tours or Self-Exploration:</strong> You can book a tour with a local operator or simply explore the port on your own. This is often cheaper but requires more planning and carries the risk of missing the ship if you are delayed.</li>
          </ul>
          <p>It's wise to budget for at least one planned activity or tour in each port of call to fully experience the destinations.</p>

           <h3 className="text-lg font-semibold text-foreground">The Grand Total: Putting It All Together</h3>
          <p>As you can see, the final cost of a cruise is the sum of many parts. Our calculator is designed to help you bring all these components together into a single, comprehensive budget. By entering an estimate for each category, you can move from the advertised "headline price" to a realistic "all-in" cost for your vacation, ensuring you are financially prepared for your adventure on the high seas.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Are drink packages worth it?</AccordionTrigger>
              <AccordionContent>
                <p>It depends on your consumption. As a rule of thumb, if you expect to drink 5-6 alcoholic beverages (or more) per day, a drink package is often worth the cost. If you drink less than that, paying a la carte is usually cheaper. Remember to factor in specialty coffees and sodas as well.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How can I save money on a cruise?</AccordionTrigger>
              <AccordionContent>
                <p>Book during the "wave season" (January-March) for the best deals. Choose an interior cabin instead of a balcony. Stick to the complimentary dining options. Limit your consumption of paid beverages. And consider booking independent shore excursions instead of the ship's tours.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What costs are NOT included in this calculator?</AccordionTrigger>
              <AccordionContent>
                <p>This calculator focuses on the cruise itself. It does not include the cost of flights or other transportation to get to and from your departure port, nor does it include costs for any pre- or post-cruise hotel stays. These should be budgeted separately as part of your total trip cost.</p>
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
          <p className="text-muted-foreground">The Cruise Cost Calculator is an essential tool for prospective cruisers, designed to demystify the complex pricing of a voyage. By breaking down costs into fixed fares, mandatory fees, and discretionary spending, it empowers you to create a realistic, all-in budget. This ensures you can enjoy your vacation without worrying about unexpected expenses, making for a truly relaxing and well-planned journey.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
