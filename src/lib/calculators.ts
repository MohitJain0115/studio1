
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

export function calculatePercentError(observedValue: number, trueValue: number) {
    if (trueValue === 0) return { error: 'N/A' };
    const error = (Math.abs(observedValue - trueValue) / Math.abs(trueValue)) * 100;
    return {
        error: error.toFixed(2),
    };
}

export function calculateTimePercentage(partialTime: number, totalTime: number) {
    if (totalTime === 0) return { percentage: 'N/A' };
    const percentage = (partialTime / totalTime) * 100;
    return {
        percentage: percentage.toFixed(2),
    };
}

export function calculatePercentToGoal(currentValue: number, goalValue: number) {
    if (goalValue === 0) return { percentage: 'N/A' };
    const percentage = (currentValue / goalValue) * 100;
    return {
        percentage: percentage.toFixed(2),
    };
}

export function calculateRelativeChange(oldValue: number, newValue: number) {
    if (oldValue === 0) return { change: 'N/A', direction: 'none' };
    const change = ((newValue - oldValue) / oldValue) * 100;
    return {
        change: change.toFixed(2),
        direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'none',
    };
}

export function calculateSlopePercentage(rise: number, run: number) {
    if (run === 0) return { slope: 'N/A' };
    const slope = (rise / run) * 100;
    return {
        slope: slope.toFixed(2),
    };
}

// ALGEBRA CALCULATORS
export function solveAbsoluteValueEquation(a: number, b: number, c: number) {
    if (c < 0) return { solutions: ['No solution'], explanation: "The absolute value cannot be negative." };
    if (a === 0) return { solutions: ['Invalid equation'], explanation: "'a' cannot be zero." };

    const sol1 = (c - b) / a;
    const sol2 = (-c - b) / a;
    
    if (sol1 === sol2) {
      return { solutions: [sol1.toString()], explanation: "The two potential solutions are identical." };
    }

    return { solutions: [sol1.toString(), sol2.toString()], explanation: "Two distinct solutions found." };
}

export function solveAbsoluteValueInequality(a: number, b: number, inequality: string, c: number) {
  if (a === 0) {
    const simpleResult = b;
    let satisfied = false;
    if (inequality === '<') satisfied = simpleResult < c;
    if (inequality === '<=') satisfied = simpleResult <= c;
    if (inequality === '>') satisfied = simpleResult > c;
    if (inequality === '>=') satisfied = simpleResult >= c;
    return {
        solution: satisfied ? 'All real numbers' : 'No solution',
        explanation: `With a=0, the inequality simplifies to |${b}| ${inequality} ${c}, which is ${satisfied ? 'always true.' : 'never true.'}`
    }
  }

  const flip = a < 0;
  if (inequality === '<' || inequality === '<=') {
    if (c < 0) return { solution: 'No solution', explanation: 'An absolute value cannot be less than a negative number.' };
    
    const endpoint1 = (-c - b) / a;
    const endpoint2 = (c - b) / a;
    const lower = Math.min(endpoint1, endpoint2);
    const upper = Math.max(endpoint1, endpoint2);
    const leftBracket = inequality === '<=' ? '[' : '(';
    const rightBracket = inequality === '<=' ? ']' : ')';

    return {
        solution: `${lower.toFixed(2)} ${flip ? '>' : '<'}${inequality.includes('=') ? '=': ''} x ${flip ? '<' : '>'}${inequality.includes('=') ? '=': ''} ${upper.toFixed(2)}`,
        explanation: `Interval Notation: ${leftBracket}${lower.toFixed(2)}, ${upper.toFixed(2)}${rightBracket}`
    }
  } else { // > or >=
    if (c < 0) return { solution: 'All real numbers', explanation: 'An absolute value is always non-negative, so it is always greater than a negative number.' };
    
    const endpoint1 = (c - b) / a;
    const endpoint2 = (-c - b) / a;
    const lower = Math.min(endpoint1, endpoint2);
    const upper = Math.max(endpoint1, endpoint2);
    
    const op1 = flip ? '>' : '<';
    const op2 = flip ? '<' : '>';
    const eq = inequality.includes('=') ? '=' : '';

    return {
        solution: `x ${op1}${eq} ${lower.toFixed(2)} or x ${op2}${eq} ${upper.toFixed(2)}`,
        explanation: `Interval Notation: (-∞, ${lower.toFixed(2)}${eq ? ']' : ')'}) U (${eq ? '[' : '('}${upper.toFixed(2)}, ∞)`
    }
  }
}

function parsePolynomial(poly: string): Map<number, number> {
    const terms = new Map<number, number>();
    // Pre-process to add + before - to make splitting easier, e.g. 3x^2-2x -> 3x^2+-2x
    const processedPoly = poly.replace(/\s/g, '').replace(/([a-zA-Z0-9\^])-/g, '$1+-');
    const termStrings = processedPoly.split('+');

    for (const term of termStrings) {
        if (!term) continue;
        let coef = 1;
        let exp = 0;

        const parts = term.split('x');
        const coefPart = parts[0];
        
        if (coefPart) {
            if (coefPart === '-') coef = -1;
            else coef = parseFloat(coefPart);
        }

        if (parts.length > 1) { // there is an x
            exp = 1; // default exponent is 1 if x exists
            if (parts[1]) { // there is something after x, e.g. ^2
                exp = parseInt(parts[1].substring(1)); // remove ^
            }
        } else { // no x, it's a constant
            exp = 0;
            coef = parseFloat(coefPart);
        }

        if(isNaN(coef)) throw new Error(`Invalid coefficient in term: "${term}"`);
        if(isNaN(exp)) throw new Error(`Invalid exponent in term: "${term}"`);

        terms.set(exp, (terms.get(exp) || 0) + coef);
    }
    return terms;
}

function formatPolynomial(terms: Map<number, number>): string {
    if (terms.size === 0) return "0";
    const sortedTerms = Array.from(terms.entries()).sort((a, b) => b[0] - a[0]);
    let result = "";

    for (const [exp, coef] of sortedTerms) {
        if (coef === 0) continue;
        
        let termStr = "";
        const absCoef = Math.abs(coef);

        if (result.length > 0) {
            termStr += (coef > 0) ? " + " : " - ";
        } else {
            if (coef < 0) termStr += "-";
        }

        if (absCoef !== 1 || exp === 0) {
            termStr += absCoef;
        }

        if (exp > 0) {
            termStr += "x";
            if (exp > 1) {
                termStr += `^${exp}`;
            }
        }
        result += termStr;
    }
    return result || "0";
}


export function addSubtractPolynomials(poly1: string, poly2: string, operation: 'add' | 'subtract') {
    const terms1 = parsePolynomial(poly1);
    const terms2 = parsePolynomial(poly2);
    const resultTerms = new Map(terms1);
    
    let steps = [];
    steps.push(`P1: (${poly1})`);
    steps.push(`P2: (${poly2})`);
    steps.push(`Operation: ${operation}`);

    for (const [exp, coef] of terms2.entries()) {
        const currentCoef = resultTerms.get(exp) || 0;
        if (operation === 'add') {
            resultTerms.set(exp, currentCoef + coef);
        } else {
            resultTerms.set(exp, currentCoef - coef);
        }
    }
    steps.push(`Combining like terms...`);

    const result = formatPolynomial(resultTerms);
    steps.push(`Result: ${result}`);
    return { result, steps };
}

function logGamma(x: number) {
    // Lanczos approximation for gamma function
    const p = [
        676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (x < 0.5) return Math.log(Math.PI / (Math.sin(Math.PI * x) * Math.exp(logGamma(1 - x))));
    x -= 1;
    let a = 0.99999999999980993;
    for (let i = 0; i < p.length; i++) {
        a += p[i] / (x + i + 1);
    }
    const t = x + p.length - 0.5;
    return Math.log(Math.sqrt(2 * Math.PI)) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

function factorial(n: number) {
    if (n < 0 || n % 1 !== 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

export function calculateBinomialCoefficient(n: number, k: number) {
    if (k < 0 || k > n) {
      return { result: 0, explanation: `k must be between 0 and n.` };
    }
    if (k === 0 || k === n) {
      return { result: 1, explanation: `Choosing 0 or all items results in 1 combination.` };
    }
    if (k > n / 2) {
      k = n - k;
    }
    // Using log-gamma for precision with large numbers
    const logResult = logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
    const result = Math.round(Math.exp(logResult));
    return { result, explanation: `There are ${result.toLocaleString()} ways to choose ${k} items from a set of ${n}.` };
}

function polynomialTerm(coef: number, exp: number): string {
    if (coef === 0) return '';
    const sign = coef > 0 ? '+' : '-';
    const absCoef = Math.abs(coef);
    let term = ` ${sign} ${absCoef}`;
    if (exp > 0) {
        term += 'x';
        if (exp > 1) {
            term += `^${exp}`;
        }
    }
    return term;
}

function formatPolynomialWithSign(terms: Map<number, number>): string {
    if (terms.size === 0) return '0';
    const sortedExps = Array.from(terms.keys()).sort((a, b) => b - a);
    let polyStr = '';
    for (const exp of sortedExps) {
        const coef = terms.get(exp)!;
        if (coef === 0) continue;
        
        if (polyStr.length > 0) {
            polyStr += ` ${coef > 0 ? '+' : '-'} ${Math.abs(coef)}`;
        } else {
            polyStr += `${coef}`;
        }

        if (exp > 0) {
            polyStr += 'x';
            if (exp > 1) {
                polyStr += `^${exp}`;
            }
        }
    }
    return polyStr;
}

export function multiplyPolynomialsBox(poly1Str: string, poly2Str: string) {
    const terms1 = parsePolynomial(poly1Str);
    const terms2 = parsePolynomial(poly2Str);

    const resultTerms = new Map<number, number>();
    const box: { colHeaders: string[], rowHeaders: string[], rows: {value: string, isDiagonal: boolean}[][] } = {
        colHeaders: [],
        rowHeaders: [],
        rows: [],
    };
    
    const sortedTerms1 = Array.from(terms1.entries()).sort((a,b) => b[0] - a[0]);
    const sortedTerms2 = Array.from(terms2.entries()).sort((a,b) => b[0] - a[0]);
    
    box.colHeaders = sortedTerms1.map(([exp, coef]) => formatPolynomial(new Map([[exp, coef]])));
    box.rowHeaders = sortedTerms2.map(([exp, coef]) => formatPolynomial(new Map([[exp, coef]])));

    const diagonalSums = new Map<number, number[]>();

    for (let i = 0; i < sortedTerms2.length; i++) {
        const [exp2, coef2] = sortedTerms2[i];
        const row = [];
        for (let j = 0; j < sortedTerms1.length; j++) {
            const [exp1, coef1] = sortedTerms1[j];
            
            const newCoef = coef1 * coef2;
            const newExp = exp1 + exp2;

            resultTerms.set(newExp, (resultTerms.get(newExp) || 0) + newCoef);
            row.push({
                value: formatPolynomial(new Map([[newExp, newCoef]])),
                isDiagonal: false,
            });
            const diagIndex = i + j;
            if(!diagonalSums.has(diagIndex)) diagonalSums.set(diagIndex, []);
            diagonalSums.get(diagIndex)!.push(newExp);
        }
        box.rows.push(row);
    }
    
    // Highlight diagonals
    for (const [diag, exps] of diagonalSums.entries()) {
        const uniqueExps = [...new Set(exps)];
        if (uniqueExps.length > 1) continue; // Not a like-term diagonal
        const exp = uniqueExps[0];
        for (let i = 0; i < sortedTerms2.length; i++) {
            for (let j = 0; j < sortedTerms1.length; j++) {
                if (i + j === diag) {
                    box.rows[i][j].isDiagonal = true;
                }
            }
        }
    }


    const steps = [];
    steps.push(`1. Create a grid with the terms of (${poly1Str}) and (${poly2Str}).`);
    steps.push(`2. Fill each cell by multiplying the row and column headers.`);
    
    const combinedTerms = new Map<number, string[]>();
    for (const [exp, coef] of resultTerms.entries()) {
      if(coef === 0) continue;
      if (!combinedTerms.has(exp)) combinedTerms.set(exp, []);
    }
    for(let i=0; i < box.rows.length; i++){
        for(let j=0; j < box.rows[i].length; j++){
            const [exp] = Array.from(parsePolynomial(box.rows[i][j].value).keys());
             if (resultTerms.get(exp)! !== 0) {
                combinedTerms.get(exp)!.push(`(${box.rows[i][j].value})`);
             }
        }
    }
    
    steps.push(`3. Combine like terms (often found on the diagonals):`);
    const sortedCombined = Array.from(combinedTerms.entries()).sort((a,b) => b[0] - a[0]);
    for(const [exp, termStrs] of sortedCombined) {
        if(termStrs.length > 1) {
            steps.push(`  x^${exp}: ${termStrs.join(' + ')} = ${formatPolynomial(new Map([[exp, resultTerms.get(exp)!]]))}`);
        }
    }

    const finalAnswer = formatPolynomial(resultTerms);
    steps.push(`4. Write the final polynomial in standard form: ${finalAnswer}`);

    return { box, steps, finalAnswer };
}

// Approximations from "Handbook of Mathematical Functions" by Abramowitz and Stegun.
export function calculateBesselJ(n: number, x: number): number {
    if (x === 0.0) return n === 0 ? 1.0 : 0.0;

    if (n === 0) {
        if (Math.abs(x) <= 3.0) {
            const t = (x / 3.0) * (x / 3.0);
            return 1.0 - 2.2499997 * t + 1.2656208 * t*t - 0.3163866 * t*t*t + 0.0444479 * t*t*t*t - 0.0039444 * t*t*t*t*t + 0.0002100 * t*t*t*t*t*t;
        } else {
            const t = 3.0 / Math.abs(x);
            const f = 0.79788456 - 0.00000077 * t - 0.00552796 * t*t + 0.00009512 * t*t*t - 0.00137237 * t*t*t*t + 0.00072805 * t*t*t*t*t - 0.00014476 * t*t*t*t*t*t;
            const theta = Math.abs(x) - 0.25 * Math.PI - 0.5 * n * Math.PI; // For n=0
            return f * Math.cos(theta) / Math.sqrt(Math.abs(x));
        }
    }

    if (n === 1) {
        if (Math.abs(x) <= 3.0) {
            const t = x * x;
            return x * (0.5 - 0.0703125 * t + 0.001302083 * t*t - 0.0000101725 * t*t*t);
        } else {
            const t = 3.0 / Math.abs(x);
            const f = 0.79788456 + 0.00000156 * t + 0.01659667 * t*t - 0.00017105 * t*t*t + 0.00229456 * t*t*t*t - 0.00157972 * t*t*t*t*t + 0.00034944 * t*t*t*t*t*t;
            const theta = Math.abs(x) - 0.75 * Math.PI;
            return f * Math.cos(theta) / Math.sqrt(Math.abs(x));
        }
    }
    
    // Recurrence relation for n > 1
    if (x === 0) return 0;
    let j_nm1 = calculateBesselJ(n-1, x);
    let j_n = calculateBesselJ(n-2, x);
    for (let i = n - 1; i < n; i++) {
        const j_np1 = (2 * i / x) * j_n - j_nm1;
        j_nm1 = j_n;
        j_n = j_np1;
    }
    return j_nm1;
}

export function calculateBesselY(n: number, x: number): number | string {
    if (x === 0.0) return "-Infinity";
    if (x < 0) return NaN; // Generally defined for x > 0

     if (n === 0) {
        if (x <= 3.0) {
            const t = x*x;
            const j0 = calculateBesselJ(0, x);
            return (2.0/Math.PI)*j0*Math.log(x/2.0) - 0.36746691 + 0.1517539*t - 0.0232496*t*t + 0.0016438*t*t*t;
        } else {
             const t = 3.0 / x;
             const f = 0.79788456 - 0.00000077*t - 0.00552796*t*t + 0.00009512*t*t*t - 0.00137237*t*t*t*t + 0.00072805*t*t*t*t*t - 0.00014476*t*t*t*t*t*t;
             const theta = x - 0.25*Math.PI;
             return Math.sqrt(2.0/(Math.PI*x)) * Math.sin(theta) * f;
        }
    }

    if (n === 1) {
        if (x <= 3.0) {
            const t = x*x;
            const j1 = calculateBesselJ(1, x);
            return (2.0/Math.PI)*j1*Math.log(x/2.0) - (2.0/(Math.PI*x)) - x*(0.1159516 + 0.022426*t - 0.001223*t*t);
        } else {
            const t = 3.0 / x;
            const f = 0.79788456 + 0.00000156*t + 0.01659667*t*t - 0.00017105*t*t*t + 0.00229456*t*t*t*t - 0.00157972*t*t*t*t*t + 0.00034944*t*t*t*t*t*t;
            const theta = x - 0.75 * Math.PI;
            return Math.sqrt(2.0/(Math.PI*x)) * Math.sin(theta) * f;
        }
    }
    
    // Recurrence
    let y_nm2 = typeof calculateBesselY(n - 2, x) === 'number' ? calculateBesselY(n - 2, x) as number : NaN;
    let y_nm1 = typeof calculateBesselY(n - 1, x) === 'number' ? calculateBesselY(n - 1, x) as number : NaN;

    if (isNaN(y_nm1) || isNaN(y_nm2)) return NaN;
    
    let y_n = (2 * (n - 1) / x) * y_nm1 - y_nm2;

    return y_n;
}
