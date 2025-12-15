import { addDays, addWeeks, addMonths, isSaturday, isSunday, isSameDay, parseISO, subDays, differenceInYears, addYears, differenceInDays } from 'date-fns';

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
