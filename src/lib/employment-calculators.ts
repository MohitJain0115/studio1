import { addDays, addWeeks, addMonths, isSaturday, isSunday, isSameDay, parseISO, subDays, differenceInYears, addYears, differenceInDays, differenceInMinutes, intervalToDuration } from 'date-fns';

type ProbationParams = {
  startDate: Date;
  duration: number;
  unit: 'days' | 'weeks' | 'months';
};

export const calculateProbationEndDate = ({ startDate, duration, unit }: ProbationParams): Date => {
  let endDate: Date;
  switch (unit) {
    case 'days':
      endDate = addDays(startDate, duration);
      break;
    case 'weeks':
      endDate = addWeeks(startDate, duration);
      break;
    case 'months':
      endDate = addMonths(startDate, duration);
      break;
  }
  // The period ends the day before the start date in the future.
  return subDays(endDate, 1);
};


type NoticePeriodParams = {
  resignationDate: Date;
  duration: number;
  unit: 'days' | 'weeks' | 'months';
};

export const calculateNoticePeriodEndDate = ({ resignationDate, duration, unit }: NoticePeriodParams): Date => {
  let endDate: Date;
  switch (unit) {
    case 'days':
      endDate = addDays(resignationDate, duration);
      break;
    case 'weeks':
      endDate = addWeeks(resignationDate, duration);
      break;
    case 'months':
      endDate = addMonths(resignationDate, duration);
      break;
  }
  return subDays(endDate, 1);
};


type LastDayParams = {
  resignationDate: Date;
  noticeDuration: number;
  noticeUnit: 'days' | 'weeks' | 'months';
  publicHolidays?: string;
};

export const calculateLastWorkingDay = ({ resignationDate, noticeDuration, noticeUnit, publicHolidays }: LastDayParams) => {
  const holidays = (publicHolidays || '')
    .split(',')
    .map(d => d.trim())
    .filter(d => d)
    .map(d => parseISO(d));

  const isNonWorkingDay = (date: Date): boolean => {
    if (isSaturday(date) || isSunday(date)) {
      return true;
    }
    return holidays.some(h => isSameDay(h, date));
  };
  
  let noticePeriodEndDate: Date;
  let lastWorkingDay: Date;

  if (noticeUnit === 'days') { // "Working days"
    let workingDaysCounted = 0;
    let currentDate = resignationDate;
    while (workingDaysCounted < noticeDuration) {
      currentDate = addDays(currentDate, 1);
      if (!isNonWorkingDay(currentDate)) {
        workingDaysCounted++;
      }
    }
    noticePeriodEndDate = currentDate;
    lastWorkingDay = currentDate;
  } else {
    switch (noticeUnit) {
      case 'weeks':
        noticePeriodEndDate = addWeeks(resignationDate, noticeDuration);
        break;
      case 'months':
        noticePeriodEndDate = addMonths(resignationDate, noticeDuration);
        break;
      default:
        noticePeriodEndDate = resignationDate;
    }
    noticePeriodEndDate = subDays(noticePeriodEndDate, 1);
    lastWorkingDay = noticePeriodEndDate;
  }
  
  while(isNonWorkingDay(lastWorkingDay)) {
    lastWorkingDay = subDays(lastWorkingDay, 1);
  }

  const totalHolidays = holidays.filter(h => h > resignationDate && h <= lastWorkingDay).length;

  return { noticePeriodEndDate, lastWorkingDay, totalHolidays };
};


export const calculateAnniversaries = (hireDate: Date) => {
    const today = new Date();
    const totalYearsOfService = differenceInYears(today, hireDate);
    const pastAnniversaries = [];
    const upcomingAnniversaries = [];

    const nextAnniversaryDate = addYears(hireDate, totalYearsOfService + 1);
    const nextAnniversary = {
      year: totalYearsOfService + 1,
      date: nextAnniversaryDate.toISOString(),
      daysUntil: differenceInDays(nextAnniversaryDate, today),
      daysAgo: null,
    };
    
    // Past 5 anniversaries
    for (let i = 0; i < 5; i++) {
        const year = totalYearsOfService - i;
        if (year > 0) {
            const date = addYears(hireDate, year);
            pastAnniversaries.unshift({
                year,
                date: date.toISOString(),
                daysAgo: differenceInDays(today, date),
                daysUntil: null
            });
        }
    }

    // Upcoming 5 anniversaries
    for (let i = 1; i <= 5; i++) {
        const year = totalYearsOfService + i;
        const date = addYears(hireDate, year);
        upcomingAnniversaries.push({
            year,
            date: date.toISOString(),
            daysUntil: differenceInDays(date, today),
            daysAgo: null,
        });
    }

    return { nextAnniversary, pastAnniversaries, upcomingAnniversaries, totalYearsOfService };
};

export const calculateTimeDuration = (startTime: string, endTime: string, isOvernight: boolean) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let start = new Date();
  start.setHours(startHours, startMinutes, 0, 0);

  let end = new Date();
  end.setHours(endHours, endMinutes, 0, 0);

  if (isOvernight && end <= start) {
    end = addDays(end, 1);
  }

  const totalMinutes = differenceInMinutes(end, start);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const decimalHours = totalMinutes / 60;

  return { hours, minutes, totalMinutes, decimalHours };
};

export const calculateContractDuration = (startDate: Date, endDate: Date) => {
    const totalDays = differenceInDays(endDate, startDate) + 1;
    const totalWeeks = totalDays / 7;
    const totalMonths = totalDays / 30.437; // Average days in a month

    const duration = intervalToDuration({ start: startDate, end: endDate });

    // Adjust for inclusive end date
    const adjustedEndDate = addDays(endDate, 1);
    const adjustedDuration = intervalToDuration({ start: startDate, end: adjustedEndDate });

    return {
        totalDays,
        totalWeeks,
        totalMonths,
        years: adjustedDuration.years || 0,
        months: adjustedDuration.months || 0,
        days: adjustedDuration.days || 0,
    }
};

export const PAY_PERIODS_PER_YEAR = {
  weekly: 52,
  'bi-weekly': 26,
  'semi-monthly': 24,
  monthly: 12,
  annually: 1,
};

export const calculatePtoAccrual = (values: {
  accrualRate: number;
  accrualFrequency: keyof typeof PAY_PERIODS_PER_YEAR;
  hoursWorked?: number;
  payPeriods?: number;
}) => {
  let ptoAccrued = 0;
  if (values.hoursWorked) {
    // Accrual per hour worked
    ptoAccrued = values.accrualRate * values.hoursWorked;
  } else {
    // Accrual per pay period
    const numPeriods = values.payPeriods || PAY_PERIODS_PER_YEAR[values.accrualFrequency];
    ptoAccrued = values.accrualRate * numPeriods;
  }
  return ptoAccrued;
};

export const calculateCompTime = (values: {
  overtimeHours: number;
  overtimeMinutes?: number;
  compTimeRate: number;
}) => {
  const totalOvertimeMinutes = (values.overtimeHours * 60) + (values.overtimeMinutes || 0);
  const compTimeMinutes = totalOvertimeMinutes * values.compTimeRate;
  const compTimeHours = compTimeMinutes / 60;
  const compTimeDays = compTimeHours / 8; // Assuming an 8-hour workday

  return {
    totalOvertimeMinutes,
    compTimeMinutes,
    compTimeHours,
    compTimeDays,
  };
};

const timeStringToMinutes = (time: string) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const calculateWfhHours = (values: {
  segments: { startTime: string; endTime: string }[];
  unpaidBreakMinutes?: number;
}) => {
  const grossMinutes = values.segments.reduce((acc, segment) => {
    if (!segment.startTime || !segment.endTime) return acc;
    const start = timeStringToMinutes(segment.startTime);
    const end = timeStringToMinutes(segment.endTime);
    // Handle overnight segments
    const duration = end >= start ? end - start : (24 * 60 - start) + end;
    return acc + duration;
  }, 0);

  const netMinutes = grossMinutes - (values.unpaidBreakMinutes || 0);

  const formatDuration = (totalMinutes: number) => {
    if (totalMinutes < 0) totalMinutes = 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  };

  return {
    totalGrossDuration: formatDuration(grossMinutes),
    totalNetDuration: formatDuration(netMinutes),
    totalDecimalHours: netMinutes / 60,
  };
};

const formatDurationFromMinutes = (totalMinutes: number) => {
    if (totalMinutes < 0) totalMinutes = 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
};

export const calculateTimesheetRounding = (values: {
  timeIn: string;
  timeOut: string;
  roundingRule: 'nearest_5' | 'nearest_15' | 'down_15';
}) => {
    const { timeIn, timeOut, roundingRule } = values;

    const actualInMinutes = timeStringToMinutes(timeIn);
    const actualOutMinutes = timeStringToMinutes(timeOut);
    const actualDurationMinutes = actualOutMinutes - actualInMinutes;

    let roundedInMinutes: number;
    let roundedOutMinutes: number;
    
    const minutesToTime = (minutes: number) => {
        if (minutes < 0) minutes = 0;
        const h = Math.floor(minutes / 60);
        const m = Math.round(minutes % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    switch (roundingRule) {
      case 'nearest_5':
        roundedInMinutes = Math.round(actualInMinutes / 5) * 5;
        roundedOutMinutes = Math.round(actualOutMinutes / 5) * 5;
        break;
      case 'nearest_15':
        roundedInMinutes = Math.round(actualInMinutes / 15) * 15;
        roundedOutMinutes = Math.round(actualOutMinutes / 15) * 15;
        break;
      case 'down_15':
        roundedInMinutes = Math.floor(actualInMinutes / 15) * 15;
        roundedOutMinutes = Math.floor(actualOutMinutes / 15) * 15;
        break;
    }
    
    const roundedDurationMinutes = roundedOutMinutes - roundedInMinutes;
    const timeDifferenceMinutes = roundedDurationMinutes - actualDurationMinutes;
    const timeDifference = `${timeDifferenceMinutes >= 0 ? '+' : '-'} ${formatDurationFromMinutes(Math.abs(timeDifferenceMinutes))}`;

    return {
      actualDuration: formatDurationFromMinutes(actualDurationMinutes),
      roundedIn: minutesToTime(roundedInMinutes),
      roundedOut: minutesToTime(roundedOutMinutes),
      roundedDuration: formatDurationFromMinutes(roundedDurationMinutes),
      timeDifference,
    };
};
