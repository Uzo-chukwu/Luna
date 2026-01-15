
import { 
  addDays, 
  subDays, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  parseISO
} from 'date-fns';
import { UserSettings, DayStatus } from '../types';

/**
 * Calculates the status of a specific day based on cycle logic.
 * Logic:
 * - Period: Start Date to Start Date + Period Length
 * - Ovulation: Next Period Start Date - 14 days
 * - Fertile: Ovulation - 5 days to Ovulation + 1 day
 * - PMS: Next Period Start Date - 5 days
 */
export const getDayStatus = (date: Date, settings: UserSettings): DayStatus => {
  const lastStart = parseISO(settings.lastPeriodStart);
  const today = new Date();
  
  // We calculate multiple cycles to cover past/future view
  // For simplicity, we project cycles around the target date
  const diffDays = Math.floor((date.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24));
  const cycleCount = Math.floor(diffDays / settings.cycleLength);
  
  // Projection of the current cycle start relative to 'date'
  const currentCycleStart = addDays(lastStart, cycleCount * settings.cycleLength);
  const nextCycleStart = addDays(currentCycleStart, settings.cycleLength);
  
  // Period check
  const isPeriod = (date >= currentCycleStart && date < addDays(currentCycleStart, settings.periodLength)) ||
                   (date >= nextCycleStart && date < addDays(nextCycleStart, settings.periodLength));

  // Prediction for the NEXT period to calculate ovulation/pms relative to it
  const ovulationDay = subDays(nextCycleStart, 14);
  const isOvulation = isSameDay(date, ovulationDay);
  
  const isFertile = date >= subDays(ovulationDay, 5) && date <= addDays(ovulationDay, 1);
  const isPMS = date >= subDays(nextCycleStart, 5) && date < nextCycleStart;

  return {
    date,
    isPeriod,
    isOvulation,
    isFertile: isFertile && !isPeriod, // Prioritize period visualization
    isPMS: isPMS && !isPeriod && !isFertile, // Hierarchy of visualization
    isToday: isSameDay(date, today)
  };
};

export const getCalendarDays = (viewDate: Date): Date[] => {
  const start = startOfWeek(startOfMonth(viewDate));
  const end = endOfWeek(endOfMonth(viewDate));
  return eachDayOfInterval({ start, end });
};
