
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
    // This is a simplified approach and can have issues with DST transitions.
    // A robust library like `date-fns-tz` is better for production.
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

    