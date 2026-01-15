
export type CycleDayType = 'period' | 'ovulation' | 'fertile' | 'pms' | 'none';

export interface UserSettings {
  lastPeriodStart: string; // ISO format YYYY-MM-DD
  cycleLength: number;
  periodLength: number;
  notificationsEnabled: boolean;
}

export interface DayStatus {
  date: Date;
  isPeriod: boolean;
  isOvulation: boolean;
  isFertile: boolean;
  isPMS: boolean;
  isToday: boolean;
}
