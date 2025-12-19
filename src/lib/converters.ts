// Conversion factors to meters
const LENGTH_CONVERSION_FACTORS: { [key: string]: number } = {
  millimeter: 0.001,
  centimeter: 0.01,
  meter: 1,
  kilometer: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
  'nautical-mile': 1852,
  micron: 1e-6,
  nanometer: 1e-9,
};

export const LENGTH_UNITS = [
    { value: 'nanometer', label: 'Nanometer (nm)' },
    { value: 'micron', label: 'Micron (μm)' },
    { value: 'millimeter', label: 'Millimeter (mm)' },
    { value: 'centimeter', label: 'Centimeter (cm)' },
    { value: 'meter', label: 'Meter (m)' },
    { value: 'kilometer', label: 'Kilometer (km)' },
    { value: 'inch', label: 'Inch (in)' },
    { value: 'foot', label: 'Foot (ft)' },
    { value: 'yard', label: 'Yard (yd)' },
    { value: 'mile', label: 'Mile (mi)' },
    { value: 'nautical-mile', label: 'Nautical Mile (nmi)' },
];

export const convertLength = (value: number, fromUnit: string, toUnit: string): number => {
  if (!LENGTH_CONVERSION_FACTORS[fromUnit] || !LENGTH_CONVERSION_FACTORS[toUnit]) {
    throw new Error('Invalid unit specified for length conversion');
  }
  const valueInMeters = value * LENGTH_CONVERSION_FACTORS[fromUnit];
  return valueInMeters / LENGTH_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to kilograms
const WEIGHT_CONVERSION_FACTORS: { [key: string]: number } = {
    carat: 0.0002,
    milligram: 1e-6,
    centigram: 1e-5,
    decigram: 0.0001,
    gram: 0.001,
    decagram: 0.01,
    hectogram: 0.1,
    kilogram: 1,
    'metric-tonne': 1000,
    ounce: 0.0283495231,
    pound: 0.45359237,
    stone: 6.35029318,
    'short-ton': 907.18474,
    'long-ton': 1016.0469088,
};

export const WEIGHT_UNITS = [
    { value: 'carat', label: 'Carat (ct)' },
    { value: 'milligram', label: 'Milligram (mg)' },
    { value: 'centigram', label: 'Centigram (cg)' },
    { value: 'decigram', label: 'Decigram (dg)' },
    { value: 'gram', label: 'Gram (g)' },
    { value: 'decagram', label: 'Decagram (dag)' },
    { value: 'hectogram', label: 'Hectogram (hg)' },
    { value: 'kilogram', label: 'Kilogram (kg)' },
    { value: 'metric-tonne', label: 'Metric Tonne (t)' },
    { value: 'ounce', label: 'Ounce (oz)' },
    { value: 'pound', label: 'Pound (lb)' },
    { value: 'stone', label: 'Stone (st)' },
    { value: 'short-ton', label: 'Short Ton (US)' },
    { value: 'long-ton', label: 'Long Ton (UK)' },
];

export const convertWeight = (value: number, fromUnit: string, toUnit: string): number => {
    if (!WEIGHT_CONVERSION_FACTORS[fromUnit] || !WEIGHT_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for weight conversion');
    }
    const valueInKilograms = value * WEIGHT_CONversion_FACTORS[fromUnit];
    return valueInKilograms / WEIGHT_CONVERSION_FACTORS[toUnit];
};


// Conversion factors to square meters
const AREA_CONVERSION_FACTORS: { [key: string]: number } = {
    'square-millimeter': 1e-6,
    'square-centimeter': 1e-4,
    'square-meter': 1,
    hectare: 10000,
    'square-kilometer': 1e6,
    'square-inch': 0.00064516,
    'square-foot': 0.09290304,
    'square-yard': 0.83612736,
    acre: 4046.8564224,
    'square-mile': 2589988.110336,
};

export const AREA_UNITS = [
    { value: 'square-millimeter', label: 'Square Millimeter (mm²)' },
    { value: 'square-centimeter', label: 'Square Centimeter (cm²)' },
    { value: 'square-meter', label: 'Square Meter (m²)' },
    { value: 'hectare', label: 'Hectare (ha)' },
    { value: 'square-kilometer', label: 'Square Kilometer (km²)' },
    { value: 'square-inch', label: 'Square Inch (in²)' },
    { value: 'square-foot', label: 'Square Foot (ft²)' },
    { value: 'square-yard', label: 'Square Yard (yd²)' },
    { value: 'acre', label: 'Acre (ac)' },
    { value: 'square-mile', label: 'Square Mile (mi²)' },
];

export const convertArea = (value: number, fromUnit: string, toUnit: string): number => {
    if (!AREA_CONVERSION_FACTORS[fromUnit] || !AREA_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for area conversion');
    }
    const valueInSquareMeters = value * AREA_CONVERSION_FACTORS[fromUnit];
    return valueInSquareMeters / AREA_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to liters
const VOLUME_CONVERSION_FACTORS: { [key: string]: number } = {
    'milliliter': 0.001,
    'liter': 1,
    'cubic-meter': 1000,
    'us-fluid-ounce': 0.0295735,
    'us-cup': 0.236588,
    'us-pint': 0.473176,
    'us-quart': 0.946353,
    'us-gallon': 3.78541,
    'imperial-fluid-ounce': 0.0284131,
    'imperial-pint': 0.568261,
    'imperial-quart': 1.13652,
    'imperial-gallon': 4.54609,
    'cubic-inch': 0.0163871,
    'cubic-foot': 28.3168,
};

export const VOLUME_UNITS = [
    { value: 'milliliter', label: 'Milliliter (mL)' },
    { value: 'liter', label: 'Liter (L)' },
    { value: 'cubic-meter', label: 'Cubic Meter (m³)' },
    { value: 'cubic-inch', label: 'Cubic Inch (in³)' },
    { value: 'cubic-foot', label: 'Cubic Foot (ft³)' },
    { value: 'us-fluid-ounce', label: 'US Fluid Ounce (fl-oz)' },
    { value: 'us-cup', label: 'US Cup' },
    { value: 'us-pint', label: 'US Pint (pt)' },
    { value: 'us-quart', label: 'US Quart (qt)' },
    { value: 'us-gallon', label: 'US Gallon (gal)' },
    { value: 'imperial-fluid-ounce', label: 'Imperial Fluid Ounce (fl-oz)' },
    { value: 'imperial-pint', label: 'Imperial Pint (pt)' },
    { value: 'imperial-quart', label: 'Imperial Quart (qt)' },
    { value: 'imperial-gallon', label: 'Imperial Gallon (gal)' },
];

export const convertVolume = (value: number, fromUnit: string, toUnit: string): number => {
    if (!VOLUME_CONVERSION_FACTORS[fromUnit] || !VOLUME_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for volume conversion');
    }
    const valueInLiters = value * VOLUME_CONVERSION_FACTORS[fromUnit];
    return valueInLiters / VOLUME_CONVERSION_FACTORS[toUnit];
};


export const TEMPERATURE_UNITS = [
    { value: 'celsius', label: 'Celsius (°C)' },
    { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
    { value: 'kelvin', label: 'Kelvin (K)' },
];

export const convertTemperature = (value: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) {
        return value;
    }

    let valueInCelsius: number;

    // Convert input to Celsius
    switch (fromUnit) {
        case 'fahrenheit':
            valueInCelsius = (value - 32) * 5 / 9;
            break;
        case 'kelvin':
            valueInCelsius = value - 273.15;
            break;
        case 'celsius':
        default:
            valueInCelsius = value;
            break;
    }

    // Convert from Celsius to target unit
    switch (toUnit) {
        case 'fahrenheit':
            return (valueInCelsius * 9 / 5) + 32;
        case 'kelvin':
            return valueInCelsius + 273.15;
        case 'celsius':
        default:
            return valueInCelsius;
    }
};
