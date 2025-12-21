import { z } from 'zod';

const travelTimeSchema = z.object({
  distance: z.number(),
  distanceUnit: z.enum(['kilometers', 'miles']),
  speed: z.number(),
  speedUnit: z.enum(['kmh', 'mph']),
});

const MILES_TO_KM = 1.60934;

export function calculateTravelTime(data: z.infer<typeof travelTimeSchema>): string {
  let distanceInKm = data.distance;
  if (data.distanceUnit === 'miles') {
    distanceInKm = data.distance * MILES_TO_KM;
  }

  let speedInKmh = data.speed;
  if (data.speedUnit === 'mph') {
    speedInKmh = data.speed * MILES_TO_KM;
  }

  if (speedInKmh === 0) {
    return 'Speed cannot be zero.';
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
     return 'Less than a minute';
  }

  return parts.join(', ');
}


const flightDurationSchema = z.object({
  departureDateTime: z.string(),
  departureTimeZone: z.string(),
  arrivalDateTime: z.string(),
  arrivalTimeZone: z.string(),
});

// A comprehensive list of IANA time zones
export const timeZones: string[] = Intl.supportedValuesOf('timeZone');


// Helper function to get date in a specific timezone
function getZonedTime(date: Date, timeZone: string) {
    const zonedDate = new Date(date.toLocaleString('en-US', { timeZone }));
    const offset = (date.getTime() - zonedDate.getTime()) / (1000 * 60 * 60);
    const correctedDate = new Date(date.getTime() + offset * 1000 * 60 * 60);
    return correctedDate;
}

export function calculateFlightDuration(data: z.infer<typeof flightDurationSchema>): string {
  try {
    const departureDate = new Date(data.departureDateTime);
    const arrivalDate = new Date(data.arrivalDateTime);
    
    // This is a simplified way to get the UTC time by accounting for the timezone offset.
    // A robust library like `date-fns-tz` would be better for production.
    const departureUTC = new Date(departureDate.toLocaleString('en-US', { timeZone: data.departureTimeZone }));
    const arrivalUTC = new Date(arrivalDate.toLocaleString('en-US', { timeZone: data.arrivalTimeZone }));
    
    // Get the offset of the local time from UTC for the specific dates
    const departureOffset = (new Date(departureDate.toUTCString()).getTime() - departureUTC.getTime()) / (60 * 60 * 1000);
    const arrivalOffset = (new Date(arrivalDate.toUTCString()).getTime() - arrivalUTC.getTime()) / (60 * 60 * 1000);
    
    const departureFinalUTC = new Date(departureDate.getTime() - departureOffset * 60 * 60 * 1000);
    const arrivalFinalUTC = new Date(arrivalDate.getTime() - arrivalOffset * 60 * 60 * 1000);

    let durationInMs = arrivalFinalUTC.getTime() - departureFinalUTC.getTime();

    if (durationInMs < 0) {
        return "Arrival time cannot be before departure time.";
    }

    const hours = Math.floor(durationInMs / (1000 * 60 * 60));
    durationInMs %= (1000 * 60 * 60);
    const minutes = Math.floor(durationInMs / (1000 * 60));

    return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } catch (error) {
    return 'Invalid date or time zone provided.';
  }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): { kilometers: number, miles: number } {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const distanceMi = distanceKm / MILES_TO_KM;

  return { kilometers: distanceKm, miles: distanceMi };
}

function getOffset(timeZone: string): number {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return (tzDate.getTime() - utcDate.getTime()) / (60 * 60 * 1000);
}

export function calculateTimeZoneDifference(tz1: string, tz2: string): string {
    const offset1 = getOffset(tz1);
    const offset2 = getOffset(tz2);
    
    const diff = offset2 - offset1;
    
    const hours = Math.trunc(diff);
    const minutes = Math.round((diff % 1) * 60);

    if (diff === 0) {
        return `${tz1} and ${tz2} are in the same time zone.`;
    }

    const whoIsAhead = diff > 0 ? tz2 : tz1;
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
}
