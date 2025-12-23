'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateItinerary } from '@/lib/calculators';
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
import { ClipboardList, Clock, Map as MapIcon, Info, Shield, Compass, Calendar, PlusCircle, Trash2, ListChecks } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required.'),
  duration: z.coerce.number().int().positive('Duration must be a positive number of minutes.'),
});

const formSchema = z.object({
  itineraryStart: z.string().min(1, 'Start date and time are required.'),
  itineraryEnd: z.string().min(1, 'End date and time are required.'),
  activities: z.array(activitySchema),
});

type FormValues = z.infer<typeof formSchema>;

const relatedCalculators = [
    { name: 'Backpack Weight Calculator', href: '/calculators/backpack-weight-calculator' },
    { name: 'Driving Time with Breaks Calculator', href: '/calculators/driving-time-with-breaks-calculator' },
    { name: 'Hiking Calorie Calculator', href: '/calculators/hiking-calorie-calculator' },
    { name: 'Hiking Time Calculator', href: '/calculators/hiking-time-calculator' },
    { name: 'Layover Time Calculator', href: '/calculators/layover-time-calculator' },
    { name: 'Time Zone Difference', href: '/calculators/time-zone-difference-calculator' },
    { name: 'Travel Buffer Time Calculator', href: '/calculators/travel-buffer-time-calculator' },
    { name: 'Travel Days Calculator', href: '/calculators/travel-days-calculator' },
].sort((a, b) => a.name.localeCompare(b.name));

export default function ItineraryTimePlanner() {
  const [result, setResult] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itineraryStart: '',
      itineraryEnd: '',
      activities: [{ name: '', duration: undefined as any }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "activities"
  });

  const onSubmit = (data: FormValues) => {
    const res = calculateItinerary(data.itineraryStart, data.itineraryEnd, data.activities);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Itinerary Time Planner</CardTitle>
          <CardDescription>
            Plan your travel itinerary by blocking out time for activities and see how much free time you have left.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="itineraryStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Itinerary Start Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="itineraryEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Itinerary End Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ListChecks /> Activities</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2 p-3 border rounded-lg">
                       <FormField
                        control={form.control}
                        name={`activities.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel>Activity Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Museum Visit" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`activities.${index}.duration`}
                        render={({ field }) => (
                          <FormItem className="w-40">
                            <FormLabel>Duration (min)</FormLabel>
                            <FormControl>
                               <Input type="number" placeholder="e.g., 120" {...field} value={field.value ?? ''} />
                            </FormControl>
                             <FormMessage/>
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 flex items-center gap-2"
                    onClick={() => append({ name: '', duration: undefined as any })}>
                    <PlusCircle className="h-4 w-4" /> Add Activity
                </Button>
              </div>

              <Button type="submit">Plan My Time</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Itinerary Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Available Time</p>
                        <p className="text-2xl font-bold text-primary">{result.totalAvailableTime}</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Activity Time</p>
                        <p className="text-2xl font-bold">{result.totalActivityTime}</p>
                    </div>
                     <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Free Time</p>
                        <p className="text-2xl font-bold text-green-600">{result.freeTime}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Activity Timeline</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Activity</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
                                <TableHead className="text-right">Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.timeline.map((item: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.start}</TableCell>
                                    <TableCell>{item.end}</TableCell>
                                    <TableCell className="text-right">{item.duration} min</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Understanding the Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Itinerary Start/End Time</h3>
            <p className="text-muted-foreground">The overall window of time you want to plan. This defines the total available time for your activities.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Activities and Durations</h3>
            <p className="text-muted-foreground">List each activity you want to do and estimate its duration in minutes. The calculator will stack these activities back-to-back starting from your itinerary start time.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The calculator finds the total available minutes from the start to the end time. It then sums the duration of all listed activities. Free time is the difference between total available time and total activity time.</p>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4 text-center">
            <p className="font-mono text-sm md:text-base font-bold text-primary">
              FreeTime = (EndTime - StartTime) - Σ(ActivityDurations)
            </p>
          </div>
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
          <CardTitle className="text-2xl font-bold">The Art of Effective Itinerary Planning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">Maximizing Your Travel Experience: A Guide to Smart Itinerary Time Management</h2>
          <p>A well-planned itinerary is the backbone of any successful trip. It transforms a simple vacation into a seamless, stress-free experience by providing structure and maximizing your most valuable asset: time. However, many travelers fall into the trap of over-scheduling or underestimating durations, leading to missed activities and unnecessary stress. This guide explores the principles of effective time planning, the importance of building in buffer time, and how to use our Itinerary Time Planner to craft a realistic and enjoyable schedule.</p>
          <h3 className="text-lg font-semibold text-foreground">Why Block Scheduling is a Traveler's Best Friend</h3>
          <p>Block scheduling is a time management technique where you divide your day into blocks of time. Each block is dedicated to accomplishing a specific task or group of tasks. For travel, this means assigning a dedicated time slot for each activity—from a museum visit to a leisurely lunch. This method has several key benefits:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Reduces Decision Fatigue:</strong> When your day is planned, you don't waste precious mental energy deciding what to do next. You can simply follow the schedule and be present in the moment.</li>
            <li><strong>Ensures Priorities are Met:</strong> It guarantees that your "must-do" activities are locked into your schedule. Spontaneous activities can then be fit into the remaining free time.</li>
            <li><strong>Provides a Realistic View of Your Day:</strong> Laying out activities and their durations visually reveals whether your plan is feasible. It quickly becomes obvious if you're trying to cram too much into a single day.</li>
            <li><strong>Manages Expectations:</strong> For group travel, a shared itinerary ensures everyone is on the same page, preventing disagreements about the day's plans.</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground">Estimating Durations: The Hardest Part of Planning</h3>
          <p>The biggest challenge in itinerary planning is accurately estimating how long each activity will take. This is more of an art than a science, but here are some expert tips:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account for Travel Time:</strong> Don't just budget for the time at the location. You must include the time it takes to get from one activity to the next. A 1-hour museum visit might actually require a 2-hour block when you factor in 30 minutes of travel on each side.</li>
            <li><strong>Research Typical Visit Times:</strong> For major attractions, a quick search for "how long to spend at [attraction name]" will provide a good baseline from other travelers' experiences.</li>
            <li><strong>The "Plus 50%" Rule for Buffer Time:</strong> A great rule of thumb is to take your initial time estimate for an activity and add 50% as a buffer. If you think a market visit will take 1 hour, schedule 1.5 hours. This accounts for unexpected delays, long lines, or simply wanting to spend more time enjoying something. The worst-case scenario is that you finish early and have extra free time.</li>
            <li><strong>Don't Forget the Basics:</strong> Meals, rest breaks, and even just time for sitting in a café and people-watching are important parts of the travel experience. Schedule them in just as you would a major landmark.</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground">Using the Itinerary Time Planner Effectively</h3>
          <p>Our calculator is designed to make block scheduling simple. Here’s how to get the most out of it:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Set Your Overall Time Window:</strong> First, define the total time you're working with. This could be a single day (e.g., 9 AM to 9 PM) or your entire trip duration.</li>
            <li><strong>List Your Activities:</strong> Add each activity you want to do. Be specific. Instead of "Explore Downtown," break it down into "Walk the High Line" (90 min), "Lunch at Chelsea Market" (75 min), and "Visit Whitney Museum" (120 min).</li>
            <li><strong>Include Travel Between Activities:</strong> Add "Travel" as a separate activity with its own duration between major locations. Use a mapping service to get a realistic estimate for this.</li>
            <li><strong>Review the Results:</strong> The calculator will show you your total scheduled time and, most importantly, your remaining "Free Time." If your free time is negative, your schedule is too packed. If you have a large amount of free time, you know you have room for spontaneity.</li>
          </ol>
          <h3 className="text-lg font-semibold text-foreground">The Value of Unscheduled Time</h3>
          <p>One of the most important results from the planner is the "Free Time" calculation. A successful itinerary is not one that is packed from minute to minute. The best travel memories often come from spontaneous discoveries—a hidden alleyway, a charming bookstore, or a conversation with a local. Free time is not empty time; it is opportunity time.</p>
          <p>Aim to have at least 25-30% of your day as free time. This buffer allows for flexibility. If one activity runs long, it doesn't derail your entire day. If you discover something new and exciting, you have the freedom to explore it without feeling guilty about deviating from "the plan." The itinerary should be a guide, not a prison.</p>
          <p>By using a tool to structure your core activities, you paradoxically create more freedom. You can relax and enjoy your planned activities, confident that your priorities are covered, and embrace spontaneous moments, knowing you have the time for them. This balanced approach is the key to a truly fulfilling and low-stress travel experience.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Should I include travel time between locations as an activity?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, absolutely. This is one of the most common mistakes in itinerary planning. Underestimating or forgetting travel time can completely disrupt your schedule. Create a separate activity like "Travel from Hotel to Museum" and use a mapping app to estimate the duration.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How much buffer time should I add?</AccordionTrigger>
              <AccordionContent>
                <p>A good rule of thumb is to add 25-50% to your estimated activity duration. For a 2-hour activity, budget for 2.5 to 3 hours. This accounts for queues, getting slightly lost, or just wanting to spend more time. It's always better to have extra time than to run out of it.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What's the best way to handle meals in an itinerary?</AccordionTrigger>
              <AccordionContent>
                <p>Treat meals as scheduled activities. Don't just assume they'll fit in. Budget 60-75 minutes for a casual lunch and 90-120 minutes for a more formal dinner. This prevents you from rushing through meals or grabbing unhealthy fast food because you're out of time.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What if my planned activities exceed my available time?</AccordionTrigger>
              <AccordionContent>
                <p>This is a valuable insight from the planner! It means your itinerary is too ambitious. You need to prioritize. Rank your activities into "must-dos" and "nice-to-dos." Remove or shorten the lower-priority activities until your schedule fits within your available time.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How detailed should my activity names be?</AccordionTrigger>
              <AccordionContent>
                <p>Be as specific as you can. Instead of "Museum," write "Louvre Museum - Mona Lisa & Venus de Milo wings." This helps you create a more accurate time estimate and focuses your visit on your priorities within the larger location.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-6">
              <AccordionTrigger>Can I use this for multi-day trips?</AccordionTrigger>
              <AccordionContent>
                <p>Yes. You can set the start and end time to cover your entire trip duration. However, it's often more effective to use the planner for one day at a time. This gives you a more granular and manageable view of each day's schedule.</p>
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
          <p className="text-muted-foreground">The Itinerary Time Planner is a strategic tool for transforming a list of desires into a realistic, enjoyable travel plan. By block-scheduling activities and, crucially, calculating the remaining free time, it helps travelers avoid the common pitfalls of over-scheduling and stress. This process ensures that priority sights are seen while preserving the flexibility needed for spontaneous discovery, leading to a more balanced and memorable journey.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
