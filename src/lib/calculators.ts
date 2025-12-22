
import { z } from 'zod';

const travelTimeSchema = z.object({
  distance: z.number(),
  distanceUnit: z.enum(['kilometers', 'miles']),
  speed: z.number(),
  speedUnit: z.enum(['kmh', 'mph']),
});

const MILES_TO_KM = 1.60934;
const KM_TO_MILES = 0.621371;

function formatDuration(totalMinutes: number): string {
    if (totalMinutes < 0) totalMinutes = 0;
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60*24)) / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    
    return parts.join(', ');
}


export function calculateTravelTime(data: z.infer<typeof travelTimeSchema>): { text: string, totalHours: number } {
  let distanceInKm = data.distance;
  if (data.distanceUnit === 'miles') {
    distanceInKm = data.distance * MILES_TO_KM;
  }

  let speedInKmh = data.speed;
  if (data.speedUnit === 'mph') {
    speedInKmh = data.speed * MILES_TO_KM;
  }

  if (speedInKmh === 0) {
    return { text: 'Speed cannot be zero.', totalHours: 0 };
  }

  const timeInHours = distanceInKm / speedInKmh;
  const timeInMinutes = timeInHours * 60;

  return { text: formatDuration(timeInMinutes), totalHours: timeInHours };
}


const flightDurationSchema = z.object({
  departureDateTime: z.string(),
  departureTimeZone: z.string(),
  arrivalDateTime: z.string(),
  arrivalTimeZone: z.string(),
});

// A comprehensive list of IANA time zones
export const timeZones: string[] = Intl.supportedValuesOf('timeZone');

function getOffset(timeZone: string) {
    try {
        const date = new Date();
        const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
        return (utcDate.getTime() - tzDate.getTime()) / 36e5;
    } catch {
        return NaN; // Return NaN for invalid time zones
    }
}


export function calculateFlightDuration(data: z.infer<typeof flightDurationSchema>): { text: string, totalMinutes: number } {
  try {
    const departureDate = new Date(data.departureDateTime);
    const arrivalDate = new Date(data.arrivalDateTime);
    
    // Get the timezone offsets in hours
    const departureOffset = getOffset(data.departureTimeZone);
    const arrivalOffset = getOffset(data.arrivalTimeZone);

    if (isNaN(departureOffset) || isNaN(arrivalOffset)) {
        return { text: 'Invalid time zone provided.', totalMinutes: -1 };
    }

    // Get the UTC time by adding the offset
    const departureUTC = new Date(departureDate.getTime() + departureOffset * 3600 * 1000);
    const arrivalUTC = new Date(arrivalDate.getTime() + arrivalOffset * 3600 * 1000);
    
    let durationInMs = arrivalUTC.getTime() - departureUTC.getTime();

    if (durationInMs < 0) {
        return { text: "Arrival time cannot be before departure time.", totalMinutes: -1 };
    }
    
    const totalMinutes = durationInMs / 60000;
    
    return {
      text: formatDuration(totalMinutes),
      totalMinutes: totalMinutes,
    };
  } catch (error) {
    return { text: 'Invalid date or time provided.', totalMinutes: -1 };
  }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): { kilometers: number, miles: number } {
  const R = 6371; // Radius of the Earth in km
  const toRad = (deg: number) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const distanceMi = distanceKm * KM_TO_MILES;

  return { kilometers: distanceKm, miles: distanceMi };
}


export function calculateTimeZoneDifference(tz1: string, tz2: string): string {
    try {
        const offset1 = getOffset(tz1);
        const offset2 = getOffset(tz2);
        
        if (isNaN(offset1) || isNaN(offset2)) {
            return "Invalid time zone specified.";
        }

        const diff = offset1 - offset2;
        
        const hours = Math.trunc(diff);
        const minutes = Math.round(Math.abs(diff % 1) * 60);

        if (diff === 0) {
            return `${tz1} and ${tz2} are in the same time zone.`;
        }

        const whoIsAhead = diff < 0 ? tz2 : tz1;
        const absHours = Math.abs(hours);
        const absMinutes = Math.abs(minutes);

        let result = `${whoIsAhead} is ahead by `;
        if (absHours > 0) {
            result += `${absHours} hour${absHours > 1 ? 's' : ''}`;
        }
        if (absMinutes > 0) {
            if (absHours > 0) result += ' and ';
            result += `${absMinutes} minute${absMinutes > 1 ? 's' : ''}`;
        }
        result += '.';
        return result;
    } catch (error) {
        return "Invalid time zone specified."
    }
}

export function calculateTravelDays(startDate: string, endDate: string): { totalDays: number, totalNights: number, formatted: string } {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
            return { totalDays: -1, totalNights: -1, formatted: 'End date cannot be before start date.' };
        }

        // To include both start and end days, we add 1
        const diffTime = end.getTime() - start.getTime();
        const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const totalNights = totalDays > 0 ? totalDays - 1 : 0;

        return {
            totalDays,
            totalNights,
            formatted: `${totalDays} days, ${totalNights} nights`,
        };
    } catch (e) {
        return { totalDays: -1, totalNights: -1, formatted: 'Invalid date format.' };
    }
}


export function calculateLayoverTime(arrivalDateTime: string, departureDateTime: string): { totalMinutes: number, formatted: string } {
    try {
        const arrival = new Date(arrivalDateTime);
        const departure = new Date(departureDateTime);
        
        if (departure < arrival) {
            return { totalMinutes: -1, formatted: 'Departure cannot be before arrival.' };
        }

        const diffMs = departure.getTime() - arrival.getTime();
        const totalMinutes = diffMs / 60000;
        
        return {
            totalMinutes,
            formatted: formatDuration(totalMinutes),
        };
    } catch (e) {
        return { totalMinutes: -1, formatted: 'Invalid date format.' };
    }
}

export function calculateJetLag(timezonesCrossed: number, flightDuration: number) {
    const recoveryDays = Math.abs(timezonesCrossed);
    const flightFatigueFactor = Math.floor(flightDuration / 12);
    const totalRecoveryDays = recoveryDays + flightFatigueFactor;

    let advice = [];
    if (timezonesCrossed > 0) { // Eastward
        advice.push("You traveled east. Try to get morning sunlight to advance your body clock.");
        advice.push("Avoid heavy meals and caffeine late at night in your new time zone.");
        advice.push("Consider Melatonin to help reset your sleep schedule.");
    } else { // Westward
        advice.push("You traveled west. Try to get afternoon/evening sunlight to delay your body clock.");
        advice.push("Try to stay up until a reasonable local bedtime, avoiding long naps.");
    }
    
    advice.push("Stay hydrated during and after your flight.");
    advice.push("Adjust your meal times to the new time zone as quickly as possible.");
    
    return {
        recoveryDays: `Approx. ${totalRecoveryDays} day${totalRecoveryDays !== 1 ? 's' : ''}`,
        advice,
    };
}


export function calculateItinerary(
    itineraryStart: string,
    itineraryEnd: string,
    activities: { name: string; duration: number }[]
) {
    try {
        const start = new Date(itineraryStart);
        const end = new Date(itineraryEnd);

        if (end < start) {
            return { error: 'Itinerary end time cannot be before start time.' };
        }
        
        const totalAvailableMinutes = (end.getTime() - start.getTime()) / 60000;
        const totalActivityMinutes = activities.reduce((sum, act) => sum + (act.duration || 0), 0);

        const freeTimeMinutes = totalAvailableMinutes - totalActivityMinutes;

        if (freeTimeMinutes < 0) {
            return {
                error: `Not enough time for all activities. You are short by ${formatDuration(Math.abs(freeTimeMinutes))}.`
            };
        }

        return {
            totalAvailableTime: formatDuration(totalAvailableMinutes),
            totalActivityTime: formatDuration(totalActivityMinutes),
            freeTime: formatDuration(freeTimeMinutes),
            timeline: createTimeline(start, activities)
        };
    } catch (e) {
        return { error: 'Invalid date or time format.' };
    }
}

function createTimeline(start: Date, activities: { name: string; duration: number }[]) {
    const timeline = [];
    let currentTime = new Date(start);

    for (const activity of activities) {
        if (!activity.name || activity.duration <= 0) continue;
        const activityStart = new Date(currentTime);
        const activityEnd = new Date(currentTime.getTime() + activity.duration * 60000);
        
        timeline.push({
            name: activity.name,
            start: activityStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
            end: activityEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: activity.duration,
        });

        currentTime = activityEnd;
    }
    return timeline;
}

export function calculateBufferTime(baseTravelTime: number, bufferPercentage: number) {
    const bufferTime = baseTravelTime * (bufferPercentage / 100);
    const totalTime = baseTravelTime + bufferTime;

    return {
        baseTimeFormatted: formatDuration(baseTravelTime),
        bufferTimeFormatted: formatDuration(bufferTime),
        totalTimeFormatted: formatDuration(totalTime),
    };
}


const drivingTimeWithBreaksSchema = z.object({
  distance: z.number(),
  distanceUnit: z.enum(['kilometers', 'miles']),
  speed: z.number(),
  speedUnit: z.enum(['kmh', 'mph']),
  breakFrequency: z.number(),
  breakDuration: z.number(),
});

export function calculateDrivingTimeWithBreaks(data: z.infer<typeof drivingTimeWithBreaksSchema>) {
    let distanceInKm = data.distance;
    if (data.distanceUnit === 'miles') {
        distanceInKm = data.distance * MILES_TO_KM;
    }

    let speedInKmh = data.speed;
    if (data.speedUnit === 'mph') {
        speedInKmh = data.speed * MILES_TO_KM;
    }

    if (speedInKmh === 0) return {
        drivingTimeFormatted: 'N/A',
        totalBreakTimeFormatted: 'N/A',
        totalJourneyTimeFormatted: 'Speed cannot be zero',
        numberOfBreaks: 0,
        timeline: [],
    };
    
    const drivingTimeHours = distanceInKm / speedInKmh;
    const drivingTimeMinutes = drivingTimeHours * 60;
    
    const numberOfBreaks = data.breakFrequency > 0 ? Math.ceil(drivingTimeHours / data.breakFrequency) -1 : 0;
    const totalBreakTimeMinutes = numberOfBreaks > 0 ? numberOfBreaks * data.breakDuration : 0;
    
    const totalJourneyMinutes = drivingTimeMinutes + totalBreakTimeMinutes;

    const timeline = [];
    let accumulatedTimeMinutes = 0;

    for (let i = 1; i <= numberOfBreaks; i++) {
        accumulatedTimeMinutes += data.breakFrequency * 60;
        timeline.push({
            event: `Drive Segment ${i}`,
            time: formatDuration(accumulatedTimeMinutes),
            notes: `Driven for ${data.breakFrequency} hours.`,
        });

        accumulatedTimeMinutes += data.breakDuration;
        timeline.push({
            event: `Break ${i}`,
            time: formatDuration(accumulatedTimeMinutes),
            notes: `A ${data.breakDuration} minute break.`,
        });
    }

    // Add the final driving segment
    const finalLegDrivingHours = drivingTimeHours - (numberOfBreaks * data.breakFrequency);
    if (finalLegDrivingHours > 0.001) {
        accumulatedTimeMinutes += finalLegDrivingHours * 60;
         timeline.push({
            event: `Drive Segment ${numberOfBreaks + 1}`,
            time: formatDuration(accumulatedTimeMinutes),
            notes: `Final drive of ${formatDuration(finalLegDrivingHours * 60)}.`,
        });
    }


    return {
        drivingTimeFormatted: formatDuration(drivingTimeMinutes),
        totalBreakTimeFormatted: formatDuration(totalBreakTimeMinutes),
        totalJourneyTimeFormatted: formatDuration(totalJourneyMinutes),
        numberOfBreaks: numberOfBreaks,
        timeline,
    };
}


// New Calculators

export function calculateFuelCost(
    distance: number,
    distanceUnit: 'kilometers' | 'miles',
    efficiency: number,
    efficiencyUnit: 'mpg' | 'lp100km',
    fuelPrice: number,
    priceUnit: 'per_gallon' | 'per_liter'
) {
    const GALLONS_TO_LITERS = 3.78541;

    let distanceInKm = distance;
    if (distanceUnit === 'miles') {
        distanceInKm = distance * MILES_TO_KM;
    }

    let efficiencyLp100km = efficiency;
    if (efficiencyUnit === 'mpg') {
        if (efficiency === 0) return { totalCost: '0.00', fuelNeeded: 'N/A' };
        efficiencyLp100km = 235.215 / efficiency;
    }

    let pricePerLiter = fuelPrice;
    if (priceUnit === 'per_gallon') {
        pricePerLiter = fuelPrice / GALLONS_TO_LITERS;
    }

    const litersNeeded = (distanceInKm / 100) * efficiencyLp100km;
    const totalCost = litersNeeded * pricePerLiter;

    return {
        totalCost: totalCost.toFixed(2),
        fuelNeeded: `${litersNeeded.toFixed(2)} liters`,
    };
}

export function calculateEvChargingCost(
    distance: number,
    distanceUnit: 'kilometers' | 'miles',
    efficiency: number,
    efficiencyUnit: 'kWh_per_100km' | 'miles_per_kWh',
    chargingCost: number
) {
    let distanceInKm = distance;
    if (distanceUnit === 'miles') {
        distanceInKm = distance * MILES_TO_KM;
    }

    let efficiencyKwhPer100km = efficiency;
    if (efficiencyUnit === 'miles_per_kWh') {
        if (efficiency === 0) return { totalCost: '0.00', energyNeeded: 'N/A' };
        efficiencyKwhPer100km = (1 / efficiency) * 100 * KM_TO_MILES;
    }
    
    const kwhNeeded = (distanceInKm / 100) * efficiencyKwhPer100km;
    const totalCost = kwhNeeded * chargingCost;

    return {
        totalCost: totalCost.toFixed(2),
        energyNeeded: `${kwhNeeded.toFixed(2)} kWh`,
    };
}

export function calculateTripBudget(
    durationDays: number,
    numTravelers: number,
    costs: {
        flights: number;
        accommodationPerNight: number;
        foodPerDay: number;
        activities: number;
        transport: number;
        misc: number;
    }
) {
    const accommodationTotal = costs.accommodationPerNight * (durationDays > 0 ? durationDays - 1 : 0);
    const foodTotal = costs.foodPerDay * durationDays * numTravelers;
    const flightsTotal = costs.flights * numTravelers;
    const activitiesTotal = costs.activities * numTravelers;
    const transportTotal = costs.transport;
    const miscTotal = costs.misc;

    const totalBudget = accommodationTotal + foodTotal + flightsTotal + activitiesTotal + transportTotal + miscTotal;
    const perPerson = numTravelers > 0 ? totalBudget / numTravelers : 0;
    
    return {
        totalBudget,
        perPersonBudget: perPerson,
        breakdown: [
            { category: 'Flights', total: flightsTotal, perPerson: costs.flights },
            { category: 'Accommodation', total: accommodationTotal, perPerson: numTravelers > 0 ? accommodationTotal / numTravelers : 0 },
            { category: 'Food & Dining', total: foodTotal, perPerson: costs.foodPerDay * durationDays },
            { category: 'Activities & Tours', total: activitiesTotal, perPerson: costs.activities },
            { category: 'Local Transport', total: transportTotal, perPerson: numTravelers > 0 ? transportTotal / numTravelers : 0 },
            { category: 'Miscellaneous', total: miscTotal, perPerson: numTravelers > 0 ? miscTotal / numTravelers : 0 },
        ]
    };
}

export function calculateHotelCost(data: {
    costPerNight: number,
    numNights: number,
    numRooms: number,
    taxesAndFees: number
}) {
    const baseCostPerRoom = data.costPerNight * data.numNights;
    const totalBaseCost = baseCostPerRoom * data.numRooms;
    const taxAmount = totalBaseCost * (data.taxesAndFees / 100);
    const totalCost = totalBaseCost + taxAmount;
    
    return {
        baseCost: totalBaseCost,
        taxAmount: taxAmount,
        totalPerRoom: totalBaseCost / data.numRooms + taxAmount / data.numRooms,
        totalCost,
    };
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function calculateSplit(
    participants: string[],
    expenses: { name: string; amount: number; paidBy: string; splitBetween: string[] }[]
) {
    const balances: { [key: string]: number } = {};
    participants.forEach(p => balances[p] = 0);

    expenses.forEach(expense => {
        if (!expense.paidBy || !participants.includes(expense.paidBy) || expense.amount <= 0 || expense.splitBetween.length === 0) return;
        
        balances[expense.paidBy] += expense.amount;
        const share = expense.amount / expense.splitBetween.length;
        expense.splitBetween.forEach(person => {
            if (participants.includes(person)) {
                balances[person] -= share;
            }
        });
    });

    const debtors = Object.entries(balances).filter(([, amount]) => amount < 0).map(([name, amount]) => ({ name, amount: -amount }));
    const creditors = Object.entries(balances).filter(([, amount]) => amount > 0).map(([name, amount]) => ({ name, amount }));

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amount = Math.min(debtor.amount, creditor.amount);

        if (amount > 0.005) { // Threshold to avoid tiny settlements
            settlements.push({ from: debtor.name, to: creditor.name, amount });
        }

        debtor.amount -= amount;
        creditor.amount -= amount;

        if (debtor.amount < 0.005) i++;
        if (creditor.amount < 0.005) j++;
    }

    return { balances, settlements };
}

export function calculateCostPerMile(data: { totalCost: number, totalDistance: number, distanceUnit: 'miles' | 'kilometers' }) {
    if (data.totalDistance === 0) return { costPerUnit: 0 };
    return {
        costPerUnit: data.totalCost / data.totalDistance
    };
}

export function calculateCarVsFlight(data: {
    distance: number;
    distanceUnit: 'miles' | 'kilometers';
    numTravelers: number;
    fuelEfficiency: number;
    efficiencyUnit: 'mpg' | 'lp100km';
    fuelPrice: number;
    priceUnit: 'per_gallon' | 'per_liter';
    otherCarCosts: number;
    flightCostPerPerson: number;
    baggageFeesPerPerson: number;
    transportToFromAirport: number;
}) {
    // Car cost calculation
    const fuelCostResult = calculateFuelCost(
        data.distance * 2, // round trip
        data.distanceUnit,
        data.fuelEfficiency,
        data.efficiencyUnit,
        data.fuelPrice,
        data.priceUnit
    );
    const totalFuelCost = parseFloat(fuelCostResult.totalCost);
    const totalCarCost = totalFuelCost + data.otherCarCosts;

    // Flight cost calculation
    const totalAirfare = data.flightCostPerPerson * data.numTravelers;
    const totalBaggage = data.baggageFeesPerPerson * data.numTravelers;
    const totalFlightCost = totalAirfare + totalBaggage + data.transportToFromAirport;

    const cheaperOption = totalCarCost < totalFlightCost ? 'Driving' : 'Flying';
    const savings = Math.abs(totalCarCost - totalFlightCost);
    
    let verdict, bgColor, textColor;
    if (cheaperOption === 'Driving') {
        verdict = `Driving is cheaper by $${savings.toFixed(2)}`;
        bgColor = 'rgba(74, 222, 128, 0.1)';
        textColor = '#16a34a';
    } else {
        verdict = `Flying is cheaper by $${savings.toFixed(2)}`;
        bgColor = 'rgba(59, 130, 246, 0.1)';
        textColor = '#2563eb';
    }

    return {
        car: {
            total: totalCarCost,
            perPerson: data.numTravelers > 0 ? totalCarCost / data.numTravelers : 0,
            fuelCost: totalFuelCost,
            otherCosts: data.otherCarCosts,
        },
        flight: {
            total: totalFlightCost,
            perPerson: data.numTravelers > 0 ? totalFlightCost / data.numTravelers : 0,
            airfare: totalAirfare,
            baggage: totalBaggage,
            airportTransport: data.transportToFromAirport,
        },
        cheaperOption,
        savings,
        verdict,
        bgColor,
        textColor
    };
}


export function calculateRentalCarCost(data: {
    dailyRate: number;
    rentalDays: number;
    taxesAndFees: number;
    insurance: number;
    extras: number;
}) {
    const baseCost = data.dailyRate * data.rentalDays;
    const taxAmount = baseCost * (data.taxesAndFees / 100);
    const insuranceTotal = data.insurance * data.rentalDays;
    const extrasTotal = data.extras;
    const totalCost = baseCost + taxAmount + insuranceTotal + extrasTotal;
    const averageDailyCost = data.rentalDays > 0 ? totalCost / data.rentalDays : 0;

    return {
        baseCost,
        taxAmount,
        insuranceTotal,
        extrasTotal,
        totalCost,
        averageDailyCost,
    };
}

export function calculateMultiStopRoute(data: {
    stops: { name: string; lat: number; lon: number }[];
    averageSpeed: number;
    speedUnit: 'mph' | 'kmh';
}) {
    let totalDistanceKm = 0;
    const legs = [];

    for (let i = 0; i < data.stops.length - 1; i++) {
        const start = data.stops[i];
        const end = data.stops[i + 1];
        const legDistance = calculateDistance(start.lat, start.lon, end.lat, end.lon);
        totalDistanceKm += legDistance.kilometers;
        legs.push({
            from: start.name,
            to: end.name,
            distance: `${legDistance.miles.toFixed(1)} mi / ${legDistance.kilometers.toFixed(1)} km`,
        });
    }

    const totalDistanceMiles = totalDistanceKm * KM_TO_MILES;

    const travelTimeResult = calculateTravelTime({
        distance: totalDistanceMiles,
        distanceUnit: 'miles',
        speed: data.averageSpeed,
        speedUnit: data.speedUnit,
    });
    
    // Add estimated time for each leg
    const legsWithTime = legs.map((leg, i) => {
      const start = data.stops[i];
      const end = data.stops[i + 1];
      const legDist = calculateDistance(start.lat, start.lon, end.lat, end.lon);
      const legTime = calculateTravelTime({
        distance: legDist.miles,
        distanceUnit: 'miles',
        speed: data.averageSpeed,
        speedUnit: data.speedUnit,
      });
      return { ...leg, time: legTime.text };
    });

    return {
        totalStops: data.stops.length,
        totalDistance: `${totalDistanceMiles.toFixed(1)} mi / ${totalDistanceKm.toFixed(1)} km`,
        totalTime: travelTimeResult.text,
        legs: legsWithTime,
    };
}
