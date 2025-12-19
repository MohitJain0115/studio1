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
    const valueInKilograms = value * WEIGHT_CONVERSION_FACTORS[fromUnit];
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

// Conversion factors to seconds
const TIME_CONVERSION_FACTORS: { [key: string]: number } = {
    nanosecond: 1e-9,
    microsecond: 1e-6,
    millisecond: 0.001,
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629746, // 30.436875 days
    year: 31556952, // 365.2425 days
};

export const TIME_UNITS = [
    { value: 'nanosecond', label: 'Nanosecond (ns)' },
    { value: 'microsecond', label: 'Microsecond (μs)' },
    { value: 'millisecond', label: 'Millisecond (ms)' },
    { value: 'second', label: 'Second (s)' },
    { value: 'minute', label: 'Minute (min)' },
    { value: 'hour', label: 'Hour (hr)' },
    { value: 'day', label: 'Day (d)' },
    { value: 'week', label: 'Week (wk)' },
    { value: 'month', label: 'Month (mo)' },
    { value: 'year', label: 'Year (yr)' },
];

export const convertTime = (value: number, fromUnit: string, toUnit: string): number => {
    if (!TIME_CONVERSION_FACTORS[fromUnit] || !TIME_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for time conversion');
    }
    const valueInSeconds = value * TIME_CONVERSION_FACTORS[fromUnit];
    return valueInSeconds / TIME_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to meters per second
const SPEED_CONVERSION_FACTORS: { [key: string]: number } = {
    'meters-per-second': 1,
    'kilometers-per-hour': 1 / 3.6,
    'miles-per-hour': 0.44704,
    'feet-per-second': 0.3048,
    'knots': 0.514444,
};

export const SPEED_UNITS = [
    { value: 'meters-per-second', label: 'Meters per second (m/s)' },
    { value: 'kilometers-per-hour', label: 'Kilometers per hour (kph)' },
    { value: 'miles-per-hour', label: 'Miles per hour (mph)' },
    { value: 'feet-per-second', label: 'Feet per second (fps)' },
    { value: 'knots', label: 'Knots (kn)' },
];

export const convertSpeed = (value: number, fromUnit: string, toUnit: string): number => {
    if (!SPEED_CONVERSION_FACTORS[fromUnit] || !SPEED_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for speed conversion');
    }
    const valueInMetersPerSecond = value * SPEED_CONVERSION_FACTORS[fromUnit];
    return valueInMetersPerSecond / SPEED_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to bytes
const DATA_STORAGE_CONVERSION_FACTORS: { [key: string]: number } = {
    bit: 1 / 8,
    byte: 1,
    kilobyte: 1024,
    megabyte: 1024 ** 2,
    gigabyte: 1024 ** 3,
    terabyte: 1024 ** 4,
    petabyte: 1024 ** 5,
};

export const DATA_STORAGE_UNITS = [
    { value: 'bit', label: 'Bit (b)' },
    { value: 'byte', label: 'Byte (B)' },
    { value: 'kilobyte', label: 'Kilobyte (KB)' },
    { value: 'megabyte', label: 'Megabyte (MB)' },
    { value: 'gigabyte', label: 'Gigabyte (GB)' },
    { value: 'terabyte', label: 'Terabyte (TB)' },
    { value: 'petabyte', label: 'Petabyte (PB)' },
];

export const convertDataStorage = (value: number, fromUnit: string, toUnit: string): number => {
    if (!DATA_STORAGE_CONVERSION_FACTORS[fromUnit] || !DATA_STORAGE_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for data storage conversion');
    }
    const valueInBytes = value * DATA_STORAGE_CONVERSION_FACTORS[fromUnit];
    return valueInBytes / DATA_STORAGE_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to bits per second
const DATA_TRANSFER_CONVERSION_FACTORS: { [key: string]: number } = {
    'bits-per-second': 1,
    'kilobits-per-second': 1000,
    'megabits-per-second': 1e6,
    'gigabits-per-second': 1e9,
    'bytes-per-second': 8,
    'kilobytes-per-second': 8000,
    'megabytes-per-second': 8e6,
    'gigabytes-per-second': 8e9,
};

export const DATA_TRANSFER_UNITS = [
    { value: 'bits-per-second', label: 'Bits per second (bps)' },
    { value: 'kilobits-per-second', label: 'Kilobits per second (Kbps)' },
    { value: 'megabits-per-second', label: 'Megabits per second (Mbps)' },
    { value: 'gigabits-per-second', label: 'Gigabits per second (Gbps)' },
    { value: 'bytes-per-second', label: 'Bytes per second (B/s)' },
    { value: 'kilobytes-per-second', label: 'Kilobytes per second (KB/s)' },
    { value: 'megabytes-per-second', label: 'Megabytes per second (MB/s)' },
    { value: 'gigabytes-per-second', label: 'Gigabytes per second (GB/s)' },
];

export const convertDataTransferSpeed = (value: number, fromUnit: string, toUnit: string): number => {
    if (!DATA_TRANSFER_CONVERSION_FACTORS[fromUnit] || !DATA_TRANSFER_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for data transfer speed conversion');
    }
    const valueInBps = value * DATA_TRANSFER_CONVERSION_FACTORS[fromUnit];
    return valueInBps / DATA_TRANSFER_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to Joules
const ENERGY_CONVERSION_FACTORS: { [key: string]: number } = {
    joule: 1,
    kilojoule: 1000,
    calorie: 4.184,
    kilocalorie: 4184,
    'watt-hour': 3600,
    'kilowatt-hour': 3.6e6,
    'btu': 1055.06,
};

export const ENERGY_UNITS = [
    { value: 'joule', label: 'Joule (J)' },
    { value: 'kilojoule', label: 'Kilojoule (kJ)' },
    { value: 'calorie', label: 'Calorie (cal)' },
    { value: 'kilocalorie', label: 'Kilocalorie (kcal)' },
    { value: 'watt-hour', label: 'Watt-hour (Wh)' },
    { value: 'kilowatt-hour', label: 'Kilowatt-hour (kWh)' },
    { value: 'btu', label: 'British Thermal Unit (BTU)' },
];

export const convertEnergy = (value: number, fromUnit: string, toUnit: string): number => {
    if (!ENERGY_CONVERSION_FACTORS[fromUnit] || !ENERGY_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for energy conversion');
    }
    const valueInJoules = value * ENERGY_CONVERSION_FACTORS[fromUnit];
    return valueInJoules / ENERGY_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to Watts
const POWER_CONVERSION_FACTORS: { [key: string]: number } = {
    'watt': 1,
    'kilowatt': 1000,
    'megawatt': 1e6,
    'gigawatt': 1e9,
    'horsepower-metric': 735.49875,
    'horsepower-mechanical': 745.699872,
};

export const POWER_UNITS = [
    { value: 'watt', label: 'Watt (W)' },
    { value: 'kilowatt', label: 'Kilowatt (kW)' },
    { value: 'megawatt', label: 'Megawatt (MW)' },
    { value: 'gigawatt', label: 'Gigawatt (GW)' },
    { value: 'horsepower-metric', label: 'Horsepower (metric)' },
    { value: 'horsepower-mechanical', label: 'Horsepower (mechanical)' },
];

export const convertPower = (value: number, fromUnit: string, toUnit: string): number => {
    if (!POWER_CONVERSION_FACTORS[fromUnit] || !POWER_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for power conversion');
    }
    const valueInWatts = value * POWER_CONVERSION_FACTORS[fromUnit];
    return valueInWatts / POWER_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to Newtons
const FORCE_CONVERSION_FACTORS: { [key: string]: number } = {
    'newton': 1,
    'dyne': 1e-5,
    'pound-force': 4.44822162,
    'kilogram-force': 9.80665,
};

export const FORCE_UNITS = [
    { value: 'newton', label: 'Newton (N)' },
    { value: 'dyne', label: 'Dyne (dyn)' },
    { value: 'pound-force', label: 'Pound-force (lbf)' },
    { value: 'kilogram-force', label: 'Kilogram-force (kgf)' },
];

export const convertForce = (value: number, fromUnit: string, toUnit: string): number => {
    if (!FORCE_CONVERSION_FACTORS[fromUnit] || !FORCE_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for force conversion');
    }
    const valueInNewtons = value * FORCE_CONVERSION_FACTORS[fromUnit];
    return valueInNewtons / FORCE_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to Pascals
const PRESSURE_CONVERSION_FACTORS: { [key: string]: number } = {
    'pascal': 1,
    'bar': 100000,
    'psi': 6894.76,
    'atm': 101325,
    'torr': 133.322,
};

export const PRESSURE_UNITS = [
    { value: 'pascal', label: 'Pascal (Pa)' },
    { value: 'bar', label: 'Bar (bar)' },
    { value: 'psi', label: 'Pounds per square inch (psi)' },
    { value: 'atm', label: 'Atmosphere (atm)' },
    { value: 'torr', label: 'Torr (Torr)' },
];

export const convertPressure = (value: number, fromUnit: string, toUnit: string): number => {
    if (!PRESSURE_CONVERSION_FACTORS[fromUnit] || !PRESSURE_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for pressure conversion');
    }
    const valueInPascals = value * PRESSURE_CONVERSION_FACTORS[fromUnit];
    return valueInPascals / PRESSURE_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to Newton-meters
const TORQUE_CONVERSION_FACTORS: { [key: string]: number } = {
    'newton-meter': 1,
    'pound-foot': 1.35581795,
    'pound-inch': 0.112984829,
};

export const TORQUE_UNITS = [
    { value: 'newton-meter', label: 'Newton-meter (N·m)' },
    { value: 'pound-foot', label: 'Pound-foot (lbf·ft)' },
    { value: 'pound-inch', label: 'Pound-inch (lbf·in)' },
];

export const convertTorque = (value: number, fromUnit: string, toUnit: string): number => {
    if (!TORQUE_CONVERSION_FACTORS[fromUnit] || !TORQUE_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for torque conversion');
    }
    const valueInNewtonMeters = value * TORQUE_CONVERSION_FACTORS[fromUnit];
    return valueInNewtonMeters / TORQUE_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to kg/m³
const DENSITY_CONVERSION_FACTORS: { [key: string]: number } = {
    'kg-per-cubic-meter': 1,
    'g-per-cubic-cm': 1000,
    'lb-per-cubic-foot': 16.0185,
    'lb-per-cubic-inch': 27679.9,
};

export const DENSITY_UNITS = [
    { value: 'kg-per-cubic-meter', label: 'Kilogram/cubic meter (kg/m³)' },
    { value: 'g-per-cubic-cm', label: 'Gram/cubic centimeter (g/cm³)' },
    { value: 'lb-per-cubic-foot', label: 'Pound/cubic foot (lb/ft³)' },
    { value: 'lb-per-cubic-inch', label: 'Pound/cubic inch (lb/in³)' },
];

export const convertDensity = (value: number, fromUnit: string, toUnit: string): number => {
    if (!DENSITY_CONVERSION_FACTORS[fromUnit] || !DENSITY_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for density conversion');
    }
    const valueInKgPerCubicMeter = value * DENSITY_CONVERSION_FACTORS[fromUnit];
    return valueInKgPerCubicMeter / DENSITY_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to cubic meters per second
const FLOW_RATE_CONVERSION_FACTORS: { [key: string]: number } = {
    'cubic-meter-per-second': 1,
    'liter-per-second': 0.001,
    'us-gallon-per-minute': 0.0000630902,
    'imperial-gallon-per-minute': 0.0000757682,
    'cubic-foot-per-minute': 0.000471947,
};

export const FLOW_RATE_UNITS = [
    { value: 'cubic-meter-per-second', label: 'Cubic Meter/Second (m³/s)' },
    { value: 'liter-per-second', label: 'Liter/Second (L/s)' },
    { value: 'us-gallon-per-minute', label: 'US Gallon/Minute (GPM)' },
    { value: 'imperial-gallon-per-minute', label: 'Imperial Gallon/Minute (GPM)' },
    { value: 'cubic-foot-per-minute', label: 'Cubic Foot/Minute (CFM)' },
];

export const convertFlowRate = (value: number, fromUnit: string, toUnit: string): number => {
    if (!FLOW_RATE_CONVERSION_FACTORS[fromUnit] || !FLOW_RATE_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for flow rate conversion');
    }
    const valueInCubicMetersPerSecond = value * FLOW_RATE_CONVERSION_FACTORS[fromUnit];
    return valueInCubicMetersPerSecond / FLOW_RATE_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to hertz
const FREQUENCY_CONVERSION_FACTORS: { [key: string]: number } = {
    'hertz': 1,
    'kilohertz': 1000,
    'megahertz': 1e6,
    'gigahertz': 1e9,
    'rpm': 1 / 60,
};

export const FREQUENCY_UNITS = [
    { value: 'hertz', label: 'Hertz (Hz)' },
    { value: 'kilohertz', label: 'Kilohertz (kHz)' },
    { value: 'megahertz', label: 'Megahertz (MHz)' },
    { value: 'gigahertz', label: 'Gigahertz (GHz)' },
    { value: 'rpm', label: 'Revolutions per minute (rpm)' },
];

export const convertFrequency = (value: number, fromUnit: string, toUnit: string): number => {
    if (!FREQUENCY_CONVERSION_FACTORS[fromUnit] || !FREQUENCY_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for frequency conversion');
    }
    const valueInHertz = value * FREQUENCY_CONVERSION_FACTORS[fromUnit];
    return valueInHertz / FREQUENCY_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to candela/square meter
const LUMINANCE_CONVERSION_FACTORS: { [key: string]: number } = {
    'candela-per-square-meter': 1,
    'nit': 1,
    'lambert': 1 / Math.PI * 10000,
    'foot-lambert': 3.426,
};

export const LUMINANCE_UNITS = [
    { value: 'candela-per-square-meter', label: 'Candela/m² (nit)' },
    { value: 'lambert', label: 'Lambert (L)' },
    { value: 'foot-lambert', label: 'Foot-lambert (fL)' },
];

export const convertLuminance = (value: number, fromUnit: string, toUnit: string): number => {
    if (!LUMINANCE_CONVERSION_FACTORS[fromUnit] || !LUMINANCE_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for luminance conversion');
    }
    const valueInCandelaPerSquareMeter = value * LUMINANCE_CONVERSION_FACTORS[fromUnit];
    return valueInCandelaPerSquareMeter / LUMINANCE_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to moles per liter (Molarity)
const CONCENTRATION_CONVERSION_FACTORS: { [key: string]: number } = {
    'moles-per-liter': 1,
    'millimoles-per-liter': 0.001,
    'micromoles-per-liter': 1e-6,
};

export const CONCENTRATION_UNITS = [
    { value: 'moles-per-liter', label: 'Moles/Liter (M)' },
    { value: 'millimoles-per-liter', label: 'Millimoles/Liter (mM)' },
    { value: 'micromoles-per-liter', label: 'Micromoles/Liter (µM)' },
];

export const convertConcentration = (value: number, fromUnit: string, toUnit: string): number => {
    if (!CONCENTRATION_CONVERSION_FACTORS[fromUnit] || !CONCENTRATION_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for concentration conversion');
    }
    const valueInMolesPerLiter = value * CONCENTRATION_CONVERSION_FACTORS[fromUnit];
    return valueInMolesPerLiter / CONCENTRATION_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to radians
const ANGLE_CONVERSION_FACTORS: { [key: string]: number } = {
    'degree': Math.PI / 180,
    'radian': 1,
    'gradian': Math.PI / 200,
    'arcminute': Math.PI / 10800,
    'arcsecond': Math.PI / 648000,
};

export const ANGLE_UNITS = [
    { value: 'degree', label: 'Degree (°)' },
    { value: 'radian', label: 'Radian (rad)' },
    { value: 'gradian', label: 'Gradian (grad)' },
    { value: 'arcminute', label: 'Arcminute (′)' },
    { value: 'arcsecond', label: 'Arcsecond (″)' },
];

export const convertAngle = (value: number, fromUnit: string, toUnit: string): number => {
    if (!ANGLE_CONVERSION_FACTORS[fromUnit] || !ANGLE_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for angle conversion');
    }
    const valueInRadians = value * ANGLE_CONVERSION_FACTORS[fromUnit];
    return valueInRadians / ANGLE_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to Liters
const COOKING_CONVERSION_FACTORS: { [key: string]: number } = {
    'us-teaspoon': 0.00492892,
    'us-tablespoon': 0.0147868,
    'us-fluid-ounce': 0.0295735,
    'us-cup': 0.236588,
    'milliliter': 0.001,
    'liter': 1,
};

export const COOKING_UNITS = [
    { value: 'us-teaspoon', label: 'US Teaspoon (tsp)' },
    { value: 'us-tablespoon', label: 'US Tablespoon (tbsp)' },
    { value: 'us-fluid-ounce', label: 'US Fluid Ounce (fl-oz)' },
    { value: 'us-cup', label: 'US Cup' },
    { value: 'milliliter', label: 'Milliliter (mL)' },
    { value: 'liter', label: 'Liter (L)' },
];

export const convertCooking = (value: number, fromUnit: string, toUnit: string): number => {
    if (!COOKING_CONVERSION_FACTORS[fromUnit] || !COOKING_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for cooking conversion');
    }
    const valueInLiters = value * COOKING_CONVERSION_FACTORS[fromUnit];
    return valueInLiters / COOKING_CONVERSION_FACTORS[toUnit];
};

// Conversion factors to Liters per 100 Kilometers
const FUEL_ECONOMY_CONVERSION_FACTORS: { [key: string]: (value: number) => number } = {
    'mpg-us': (value) => 235.214 / value,
    'mpg-imperial': (value) => 282.481 / value,
    'km-per-liter': (value) => 100 / value,
    'liters-per-100km': (value) => value,
};

const FUEL_ECONOMY_REVERSE_CONVERSION_FACTORS: { [key: string]: (value: number) => number } = {
    'mpg-us': (value) => 235.214 / value,
    'mpg-imperial': (value) => 282.481 / value,
    'km-per-liter': (value) => 100 / value,
    'liters-per-100km': (value) => value,
};

export const FUEL_ECONOMY_UNITS = [
    { value: 'mpg-us', label: 'Miles per Gallon (US)' },
    { value: 'mpg-imperial', label: 'Miles per Gallon (Imperial)' },
    { value: 'km-per-liter', label: 'Kilometers per Liter (km/L)' },
    { value: 'liters-per-100km', label: 'Liters per 100km (L/100km)' },
];

export const convertFuelEconomy = (value: number, fromUnit: string, toUnit: string): number => {
    if (value === 0) return 0;
    if (!FUEL_ECONOMY_CONVERSION_FACTORS[fromUnit] || !FUEL_ECONOMY_REVERSE_CONVERSION_FACTORS[toUnit]) {
        throw new Error('Invalid unit specified for fuel economy conversion');
    }
    const valueInLitersPer100km = FUEL_ECONOMY_CONVERSION_FACTORS[fromUnit](value);
    return FUEL_ECONOMY_REVERSE_CONVERSION_FACTORS[toUnit](valueInLitersPer100km);
};

export const calculateOhmsLaw = (
    value: { voltage?: number; current?: number; resistance?: number; power?: number; },
    calculate: 'voltage' | 'current' | 'resistance' | 'power'
): { voltage: number; current: number; resistance: number; power: number } | null => {
    const { voltage, current, resistance, power } = value;

    // Check if at least two values are provided
    const providedValues = [voltage, current, resistance, power].filter(v => v !== undefined && v !== null && v > 0);
    if (providedValues.length < 2) {
        return null;
    }

    let v = voltage ?? 0, i = current ?? 0, r = resistance ?? 0, p = power ?? 0;

    switch (calculate) {
        case 'voltage':
            if (i && r) v = i * r;
            else if (p && i) v = p / i;
            else if (p && r) v = Math.sqrt(p * r);
            else return null; // Not enough info
            break;
        case 'current':
            if (v && r) i = v / r;
            else if (p && v) i = p / v;
            else if (p && r) i = Math.sqrt(p / r);
            else return null;
            break;
        case 'resistance':
            if (v && i) r = v / i;
            else if (v && p) r = v ** 2 / p;
            else if (p && i) r = p / i ** 2;
            else return null;
            break;
        case 'power':
            if (v && i) p = v * i;
            else if (i && r) p = i ** 2 * r;
            else if (v && r) p = v ** 2 / r;
            else return null;
            break;
        default:
            return null;
    }

    // After calculating the target, recalculate all others for consistency
    if (v && i) r = v / i; p = v * i;
    else if (v && r) i = v / r; p = v * i;
    else if (i && r) v = i * r; p = v * i;
    else if (p && v) i = p / v; r = v / i;
    else if (p && i) v = p / i; r = v / i;
    else if (p && r) v = Math.sqrt(p * r); i = v / r;
    else { // Fallback if only two were provided and it wasn't enough for a full solve
      if (v && i) { r = v/i; p = v*i; }
      else if (v && r) { i = v/r; p = v*i; }
      else if (i && r) { v = i*r; p = v*i; }
    }

    return { voltage: v, current: i, resistance: r, power: p };
};
