
import { z } from 'zod';

const travelTimeSchema = z.object({
  distance: z.number(),
  distanceUnit: z.enum(['kilometers', 'miles']),
  speed: z.number(),
  speedUnit: z.enum(['kmh', 'mph']),
});

const MILES_TO_KM = 1.60934;

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

  const days = Math.floor(timeInHours / 24);
  const remainingHours = timeInHours % 24;
  const hours = Math.floor(remainingHours);
  const minutes = Math.round((remainingHours - hours) * 60);
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  
  if (parts.length === 0 && timeInHours > 0) {
     return { text: 'Less than a minute', totalHours: timeInHours };
  }

  return { text: parts.join(', '), totalHours: timeInHours };
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
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return (utcDate.getTime() - tzDate.getTime()) / 36e5;
}

export function calculateFlightDuration(data: z.infer<typeof flightDurationSchema>): { text: string, totalMinutes: number } {
  try {
    const departureDate = new Date(data.departureDateTime);
    const arrivalDate = new Date(data.arrivalDateTime);
    
    // Get the timezone offsets in hours
    const departureOffset = getOffset(data.departureTimeZone);
    const arrivalOffset = getOffset(data.arrivalTimeZone);

    // Get the UTC time by adding the offset
    const departureUTC = new Date(departureDate.getTime() + departureOffset * 3600 * 1000);
    const arrivalUTC = new Date(arrivalDate.getTime() + arrivalOffset * 3600 * 1000);
    
    let durationInMs = arrivalUTC.getTime() - departureUTC.getTime();

    if (durationInMs < 0) {
        return { text: "Arrival time cannot be before departure time.", totalMinutes: -1 };
    }
    
    const totalMinutes = durationInMs / 60000;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    return {
      text: `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`,
      totalMinutes: totalMinutes,
    };
  } catch (error) {
    return { text: 'Invalid date or time zone provided.', totalMinutes: -1 };
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
  const distanceMi = distanceKm / MILES_TO_KM;

  return { kilometers: distanceKm, miles: distanceMi };
}


export function calculateTimeZoneDifference(tz1: string, tz2: string): string {
    try {
        const offset1 = getOffset(tz1);
        const offset2 = getOffset(tz2);
        
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
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const totalNights = totalDays - 1;

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
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);

        return {
            totalMinutes,
            formatted: `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`,
        };
    } catch (e) {
        return { totalMinutes: -1, formatted: 'Invalid date format.' };
    }
}

export function calculateJetLag(timezonesCrossed: number, flightDuration: number) {
    // A simplified model for jet lag recovery.
    // General rule: 1 day of recovery per time zone crossed.
    // Westward travel is often easier.
    const recoveryDays = Math.abs(timezonesCrossed);
    
    // Flight duration can also contribute to fatigue.
    const flightFatigueFactor = Math.floor(flightDuration / 12);
    
    const totalRecoveryDays = recoveryDays + flightFatigueFactor;

    let advice = [];
    if (timezonesCrossed > 0) { // Eastward
        advice.push("You traveled east. Try to get morning sunlight to advance your body clock.");
        advice.push("Avoid heavy meals and caffeine late at night in your new time zone.");
    } else { // Westward
        advice.push("You traveled west. Try to get afternoon/evening sunlight to delay your body clock.");
        advice.push("Try to stay up until a reasonable local bedtime.");
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
        const totalActivityMinutes = activities.reduce((sum, act) => sum + act.duration, 0);

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

function formatDuration(totalMinutes: number): string {
    if (totalMinutes < 0) totalMinutes = 0;
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60*24)) / 60);
    const minutes = Math.round(totalMinutes % 60);
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
    return parts.join(' ');
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

    