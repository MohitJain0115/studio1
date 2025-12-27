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


export function calculateSaleDiscount(originalPrice: number, salePrice: number) {
    if (originalPrice === 0) return { discountPercentage: 'N/A', amountSaved: 'N/A' };
    const discountPercentage = ((originalPrice - salePrice) / originalPrice) * 100;
    const amountSaved = originalPrice - salePrice;
    return {
        discountPercentage: discountPercentage.toFixed(2),
        amountSaved: amountSaved.toFixed(2),
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
    const history = [{ period: 0, value: initialValue.toFixed(2) }];
    for (let i = 1; i <= periods; i++) {
        finalValue = finalValue * (1 + percentageIncrease / 100);
        history.push({ period: i, value: finalValue.toFixed(2) });
    }
    const totalGrowth = finalValue - initialValue;
    return {
        finalValue: finalValue.toFixed(2),
