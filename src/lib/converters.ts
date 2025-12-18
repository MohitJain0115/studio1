// Conversion factors to meters
const CONVERSION_FACTORS: { [key: string]: number } = {
  millimeter: 0.001,
  centimeter: 0.01,
  meter: 1,
  kilometer: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.34,
  'nautical-mile': 1852,
  micron: 1e-6,
  nanometer: 1e-9,
};

export const UNITS = [
    { value: 'millimeter', label: 'Millimeter (mm)' },
    { value: 'centimeter', label: 'Centimeter (cm)' },
    { value: 'meter', label: 'Meter (m)' },
    { value: 'kilometer', label: 'Kilometer (km)' },
    { value: 'inch', label: 'Inch (in)' },
    { value: 'foot', label: 'Foot (ft)' },
    { value: 'yard', label: 'Yard (yd)' },
    { value: 'mile', label: 'Mile (mi)' },
    { value: 'nautical-mile', label: 'Nautical Mile (nmi)' },
    { value: 'micron', label: 'Micron (μm)' },
    { value: 'nanometer', label: 'Nanometer (nm)' },
];

export const convertLength = (value: number, fromUnit: string, toUnit: string): number => {
  if (!CONVERSION_FACTORS[fromUnit] || !CONVERSION_FACTORS[toUnit]) {
    throw new Error('Invalid unit specified');
  }

  // Convert the input value to the base unit (meters)
  const valueInMeters = value * CONVERSION_FACTORS[fromUnit];

  // Convert from the base unit to the target unit
  const result = valueInMeters / CONVERSION_FACTORS[toUnit];

  return result;
};
