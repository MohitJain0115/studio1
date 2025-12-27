
import { z } from 'zod';

const MILES_TO_KM = 1.60934;

export const timeZones: string[] = Intl.supportedValuesOf('timeZone');

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
