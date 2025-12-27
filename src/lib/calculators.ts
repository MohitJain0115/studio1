
import { z } from 'zod';

export function calculateValuePercentage(percentage: number, totalValue: number) {
    const value = (percentage / 100) * totalValue;
    return {
        value: value.toFixed(2),
    };
}


export function calculateHistoricChange(oldValue: number, newValue: number) {
    if (oldValue === 0) return { change: 'N/A', direction: 'none' };
    const change = ((newValue - oldValue) / oldValue) * 100;
    return {
        change: change.toFixed(2),
        direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'none',
    };
}


export function calculateComparativeDifference(valueA: number, valueB: number) {
    const average = (valueA + valueB) / 2;
    if (average === 0) return { difference: 'N/A' };
    const difference = (Math.abs(valueA - valueB) / average) * 100;
    return {
        difference: difference.toFixed(2),
    };
}


export function calculateInvestmentGrowth(initialAmount: number, finalAmount: number) {
    if (initialAmount === 0) return { growthPercentage: 'N/A', netGrowth: 'N/A' };
    const growthPercentage = ((finalAmount - initialAmount) / initialAmount) * 100;
    const netGrowth = finalAmount - initialAmount;
    return {
        growthPercentage: growthPercentage.toFixed(2),
        netGrowth: netGrowth.toFixed(2),
    };
}


export function calculateCompoundingIncrease(initialValue: number, percentageIncrease: number, periods: number) {
    let finalValue = initialValue;
    const history = [{ period: 0, value: parseFloat(initialValue.toFixed(2)) }];
    for (let i = 1; i <= periods; i++) {
        finalValue = finalValue * (1 + percentageIncrease / 100);
        history.push({ period: i, value: parseFloat(finalValue.toFixed(2)) });
    }
    const totalGrowth = finalValue - initialValue;
    return {
        finalValue: finalValue.toFixed(2),
        totalGrowth: totalGrowth.toFixed(2),
        history: history,
    };
}

export function calculateFuelCost(distance: number, distanceUnit: 'kilometers' | 'miles', efficiency: number, efficiencyUnit: 'mpg' | 'lp100km', fuelPrice: number, priceUnit: 'per_gallon' | 'per_liter') {
    // Conversion constants
    const milesToKm = 1.60934;
    const kmToMiles = 1 / milesToKm;
    const gallonsToLiters = 3.78541;
    const litersToGallons = 1 / gallonsToLiters;

    // Normalize everything to a common standard: distance in km, efficiency in L/100km, price in $/L
    let distanceInKm = distance;
    if (distanceUnit === 'miles') {
        distanceInKm = distance * milesToKm;
    }

    let efficiencyInLp100km = efficiency;
    if (efficiencyUnit === 'mpg') {
        efficiencyInLp100km = 235.215 / efficiency;
    }
    
    let pricePerLiter = fuelPrice;
    if (priceUnit === 'per_gallon') {
        pricePerLiter = fuelPrice / gallonsToLiters;
    }

    // Calculate total fuel needed in liters
    const fuelNeededInLiters = (distanceInKm / 100) * efficiencyInLp100km;
    
    // Calculate total cost
    const totalCost = fuelNeededInLiters * pricePerLiter;
    
    // Determine which unit to display fuel needed in
    let fuelNeededDisplay: string;
    if (efficiencyUnit === 'mpg') {
      fuelNeededDisplay = `${(fuelNeededInLiters * litersToGallons).toFixed(2)} gallons`;
    } else {
      fuelNeededDisplay = `${fuelNeededInLiters.toFixed(2)} liters`;
    }

    return {
        totalCost: totalCost.toFixed(2),
        fuelNeeded: fuelNeededDisplay,
    };
}


export function calculateAveragePercentage(percentages: number[]) {
    const sum = percentages.reduce((acc, val) => acc + val, 0);
    const average = sum / percentages.length;
    return {
        average: average.toFixed(2),
    };
}

export function calculateFractionToPercent(numerator: number, denominator: number) {
    if (denominator === 0) return { percentage: 'N/A' };
    const percentage = (numerator / denominator) * 100;
    return {
        percentage: percentage.toFixed(2),
    };
}

export function calculateDoublingTime(growthRate: number) {
    if (growthRate <= 0) return { exactTime: 'N/A', ruleOf72Time: 'N/A' };
    const rateDecimal = growthRate / 100;
    const exactTime = Math.log(2) / Math.log(1 + rateDecimal);
    const ruleOf72Time = 72 / growthRate;
    return {
        exactTime: exactTime.toFixed(2),
        ruleOf72Time: ruleOf72Time.toFixed(2),
    };
}

export function calculatePercentageOfPercentage(percentage1: number, percentage2: number) {
    const decimal1 = percentage1 / 100;
    const decimal2 = percentage2 / 100;
    const result = decimal1 * decimal2 * 100;
    return {
        result: result.toFixed(2),
    };
}

export function calculatePercentagePoint(percentage1: number, percentage2: number) {
    const difference = percentage2 - percentage1;
    return {
        difference: difference.toFixed(2),
    };
}
