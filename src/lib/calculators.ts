
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

    return { solutions: [sol1.toFixed(3), sol2.toFixed(3)], explanation: "Two distinct solutions found." };
}

export function solveAbsoluteValueInequality(a: number, b: number, inequality: string, c: number) {
  if (a === 0) {
    const simpleResult = Math.abs(b);
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
    if (c === 0) return { solution: 'No solution', explanation: 'An absolute value cannot be less than zero.' };
    
    const endpoint1 = (-c - b) / a;
    const endpoint2 = (c - b) / a;
    const lower = Math.min(endpoint1, endpoint2);
    const upper = Math.max(endpoint1, endpoint2);
    
    const finalInequality = `${lower.toFixed(2)} ${inequality.replace('=', '')} x ${inequality.replace('=', '')} ${upper.toFixed(2)}`;
    
    return {
        solution: finalInequality,
        explanation: `This is a bounded interval. Interval Notation: ${inequality.includes('=') ? '[' : '('}${lower.toFixed(2)}, ${upper.toFixed(2)}${inequality.includes('=') ? ']' : ')'}`
    }
  } else { // > or >=
    if (c < 0) return { solution: 'All real numbers', explanation: 'An absolute value is always non-negative, so it is always greater than any negative number.' };
    if (c === 0) {
        if (inequality === '>') return { solution: `x ≠ ${(-b/a).toFixed(2)}`, explanation: 'The absolute value is positive for all x except where ax+b=0.'}
        if (inequality === '>=') return { solution: 'All real numbers', explanation: 'The absolute value is always greater than or equal to zero.'}
    }
    
    const endpoint1 = (c - b) / a;
    const endpoint2 = (-c - b) / a;
    const lower = Math.min(endpoint1, endpoint2);
    const upper = Math.max(endpoint1, endpoint2);
    
    const op1 = '<';
    const op2 = '>';
    const eq = inequality.includes('=') ? '=' : '';

    return {
        solution: `x ${op1}${eq} ${lower.toFixed(2)} or x ${op2}${eq} ${upper.toFixed(2)}`,
        explanation: `This represents two unbounded intervals. Interval Notation: (-∞, ${lower.toFixed(2)}${inequality.includes('=') ? ']' : ')'}) U (${inequality.includes('=') ? '[' : '('}${upper.toFixed(2)}, ∞)`
    }
  }
}

function parsePolynomial(poly: string): Map<number, number> {
    const terms = new Map<number, number>();
    if (!poly) return terms;

    const processedPoly = poly.replace(/\s/g, '').replace(/([a-zA-Z0-9\^])-/g, '$1+-').replace(/^-/, '');
    if (poly.trim().startsWith('-')) {
        // Handle case where first term is negative
    }
    
    let termStrings = processedPoly.split('+');
    if (poly.trim().startsWith('-')) {
        termStrings[0] = '-' + termStrings[0];
    }
    
    for (const term of termStrings) {
        if (!term) continue;
        let coef = 1;
        let exp = 0;

        if (!term.includes('x')) {
            coef = parseFloat(term);
            exp = 0;
        } else {
            const parts = term.split('x');
            const coefPart = parts[0];
            
            if (coefPart === '' || coefPart === undefined) {
                coef = 1;
            } else if (coefPart === '-') {
                coef = -1;
            } else {
                coef = parseFloat(coefPart);
            }

            if (parts[1] && parts[1].startsWith('^')) {
                exp = parseInt(parts[1].substring(1));
            } else {
                exp = 1;
            }
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
        } else if (coef < 0) {
            termStr += "-";
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
    return result.length === 0 ? "0" : result;
}


export function addSubtractPolynomials(poly1: string, poly2: string, operation: 'add' | 'subtract') {
    const terms1 = parsePolynomial(poly1);
    const terms2 = parsePolynomial(poly2);
    const resultTerms = new Map(terms1);
    
    let steps = [];
    steps.push(`1. Identify polynomials: P1 = (${poly1}), P2 = (${poly2}).`);
    
    if (operation === 'subtract') {
        steps.push(`2. Distribute the negative sign to P2: -(${poly2}) = (${formatPolynomial(new Map(Array.from(terms2.entries()).map(([exp, coef]) => [exp, -coef])))})`);
    } else {
        steps.push(`2. Prepare for addition.`);
    }

    for (const [exp, coef] of terms2.entries()) {
        const currentCoef = resultTerms.get(exp) || 0;
        if (operation === 'add') {
            resultTerms.set(exp, currentCoef + coef);
        } else {
            resultTerms.set(exp, currentCoef - coef);
        }
    }
    steps.push(`3. Combine like terms by adding/subtracting coefficients for each power of x.`);

    const result = formatPolynomial(resultTerms);
    steps.push(`4. Write the final polynomial in standard form: ${result}`);
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
    // Using log-gamma for precision with large numbers, which avoids overflow.
    const logResult = logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
    const result = Math.round(Math.exp(logResult));
    return { result, explanation: `There are ${result.toLocaleString()} ways to choose ${k} items from a set of ${n}.` };
}

export function multiplyPolynomialsBox(poly1Str: string, poly2Str: string) {
    const terms1 = parsePolynomial(poly1Str);
    const terms2 = parsePolynomial(poly2Str);

    if (terms1.size === 0 || terms2.size === 0) {
        return { box: { colHeaders: [], rowHeaders: [], rows: [] }, steps: ["One of the polynomials is zero.", "The result is 0."], finalAnswer: "0" };
    }

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

    const diagonalExponents = new Map<number, number>();

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
            if(!diagonalExponents.has(diagIndex)) diagonalExponents.set(diagIndex, newExp);
        }
        box.rows.push(row);
    }
    
    // Highlight diagonals with like terms
    for (let i = 0; i < box.rows.length; i++) {
        for (let j = 0; j < box.rows[i].length; j++) {
            const diagIndex = i + j;
            const [exp] = Array.from(parsePolynomial(box.rows[i][j].value).keys());
            if (exp === diagonalExponents.get(diagIndex) && Array.from(diagonalExponents.values()).filter(e => e === exp).length > 1) {
                 box.rows[i][j].isDiagonal = true;
            }
        }
    }


    const steps = [];
    steps.push(`1. Create a grid with the terms of (${poly1Str}) and (${poly2Str}).`);
    steps.push(`2. Fill each cell by multiplying its corresponding row and column term.`);
    
    const combinedTerms = new Map<number, string[]>();
    for (const [exp, coef] of resultTerms.entries()) {
      if(coef === 0) continue;
      if (!combinedTerms.has(exp)) combinedTerms.set(exp, []);
    }
    for(let i=0; i < box.rows.length; i++){
        for(let j=0; j < box.rows[i].length; j++){
            const [exp] = Array.from(parsePolynomial(box.rows[i][j].value).keys());
             if (resultTerms.get(exp)! !== 0) {
                 const formattedTerm = formatPolynomial(parsePolynomial(box.rows[i][j].value));
                 if(formattedTerm !== "0") combinedTerms.get(exp)!.push(formattedTerm);
             }
        }
    }
    
    steps.push(`3. Combine like terms (highlighted in the same color):`);
    const sortedCombined = Array.from(combinedTerms.entries()).sort((a,b) => b[0] - a[0]);
    for(const [exp, termStrs] of sortedCombined) {
        if(termStrs.length > 1) {
            steps.push(`  x^${exp}: ${termStrs.map(t => `(${t})`).join(' + ')} = ${formatPolynomial(new Map([[exp, resultTerms.get(exp)!]]))}`);
        }
    }

    const finalAnswer = formatPolynomial(resultTerms);
    steps.push(`4. Write the final polynomial in standard form: ${finalAnswer}`);

    return { box, steps, finalAnswer };
}

// Forward recurrence relation for Bessel functions.
export function calculateBesselJ(n: number, x: number): number {
    if (x === 0.0) return n === 0 ? 1.0 : 0.0;
    
    // For negative x, J_n(x) = (-1)^n * J_n(-x)
    if (x < 0) {
        return (n % 2 === 0 ? 1 : -1) * calculateBesselJ(n, -x);
    }
    
    if (n === 0) {
        // Use series expansion for small x
        if (x <= 3.0) {
            const t = (x / 2.0) * (x / 2.0);
            return 1 - t + (t * t) / 4 - (t * t * t) / 36 + (t * t * t * t) / 576;
        }
        // Use asymptotic expansion for large x
        const theta = x - Math.PI / 4;
        return Math.sqrt(2.0 / (Math.PI * x)) * Math.cos(theta);
    }
    
    if (n === 1) {
        if (x <= 3.0) {
            const t = (x / 2.0) * (x / 2.0);
            return (x / 2.0) * (1 - t / 2 + (t * t) / 12 - (t * t * t) / 144);
        }
        const theta = x - 3 * Math.PI / 4;
        return Math.sqrt(2.0 / (Math.PI * x)) * Math.cos(theta);
    }
    
    // Miller's Algorithm for upward recurrence
    const N_START = Math.max(n + 5, Math.floor(1.5 * x) + 5);
    let j_values = new Array(N_START + 2).fill(0.0);
    j_values[N_START + 1] = 0;
    j_values[N_START] = 1e-30;

    for (let k = N_START - 1; k >= 0; k--) {
        j_values[k] = (2 * (k + 1) / x) * j_values[k + 1] - j_values[k + 2];
    }

    const scale = calculateBesselJ(0, x) / j_values[0];
    
    return j_values[n] * scale;
}

export function calculateBesselY(n: number, x: number): number | string {
    if (x === 0.0) return "-Infinity";
    if (x < 0) return NaN;

    if (n === 0) {
        if (x <= 3.0) {
            const j0 = calculateBesselJ(0, x);
            const term1 = (2 / Math.PI) * j0 * (Math.log(x / 2.0) + 0.57721566); // Euler-Mascheroni constant
            const t = (x/2.0)*(x/2.0);
            const term2 = (t / (1*1));
            return term1 - (2/Math.PI) * term2;
        }
        const theta = x - Math.PI / 4;
        return Math.sqrt(2.0 / (Math.PI * x)) * Math.sin(theta);
    }

    if (n === 1) {
        if (x <= 3.0) {
            const j1 = calculateBesselJ(1, x);
             return (2 / Math.PI) * (j1 * (Math.log(x / 2.0) + 0.57721566) - 1/x);
        }
        const theta = x - 3 * Math.PI / 4;
        return Math.sqrt(2.0 / (Math.PI * x)) * Math.sin(theta);
    }

    // Recurrence relation
    const y0_val = calculateBesselY(0, x);
    const y1_val = calculateBesselY(1, x);
    
    if (typeof y0_val !== 'number' || typeof y1_val !== 'number') return NaN;

    let y_nm1 = y1_val;
    let y_n = y0_val;
    
    for (let i = 1; i < n; i++) {
        const y_np1 = (2 * i / x) * y_nm1 - y_n;
        y_n = y_nm1;
        y_nm1 = y_np1;
    }
    return y_nm1;
}
