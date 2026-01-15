
import React from 'react';
import { format, isSameMonth } from 'date-fns';
import { UserSettings } from '../types';
import { getCalendarDays, getDayStatus } from '../utils/dateUtils';

interface Props {
  settings: UserSettings;
  viewDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const Calendar: React.FC<Props> = ({ settings, viewDate, onPrevMonth, onNextMonth }) => {
  const days = getCalendarDays(viewDate);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 shadow-sm border border-stone-100 dark:border-stone-800 transition-all duration-300">
      <header className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-xl font-serif text-stone-800 dark:text-stone-100 capitalize">
          {format(viewDate, 'MMMM')}
        </h3>
        <div className="flex gap-4">
          <button 
            onClick={onPrevMonth}
            className="p-2 text-stone-400 dark:text-stone-500 hover:text-stone-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button 
            onClick={onNextMonth}
            className="p-2 text-stone-400 dark:text-stone-500 hover:text-stone-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-[9px] uppercase tracking-widest text-stone-300 dark:text-stone-600 font-black">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2">
        {days.map((date, idx) => {
          const status = getDayStatus(date, settings);
          const isCurrentMonth = isSameMonth(date, viewDate);
          
          let bgColor = '';
          let textColor = 'text-stone-700 dark:text-stone-300';
          let ringColor = '';

          if (status.isPeriod) {
            bgColor = 'bg-rose-100 dark:bg-rose-950/50';
            textColor = 'text-rose-800 dark:text-rose-200 font-bold';
          } else if (status.isOvulation) {
            bgColor = 'bg-indigo-100 dark:bg-indigo-950/50';
            textColor = 'text-indigo-800 dark:text-indigo-200 font-bold';
          } else if (status.isFertile) {
            bgColor = 'bg-blue-50 dark:bg-blue-950/30';
            textColor = 'text-blue-700 dark:text-blue-300';
          } else if (status.isPMS) {
            bgColor = 'bg-amber-50 dark:bg-amber-950/30';
            textColor = 'text-amber-800 dark:text-amber-200';
          }

          if (status.isToday) {
            ringColor = 'ring-1.5 ring-stone-800 dark:ring-stone-200 ring-offset-2 dark:ring-offset-stone-900';
          }

          return (
            <div 
              key={idx} 
              className={`
                relative h-11 flex items-center justify-center text-sm transition-all
                ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'}
                ${bgColor} ${textColor} ${ringColor}
                ${idx % 7 === 0 ? 'rounded-l-xl' : ''}
                ${idx % 7 === 6 ? 'rounded-r-xl' : ''}
                ${status.isPeriod || status.isFertile || status.isPMS || status.isOvulation ? '' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'}
              `}
            >
              <span className="relative z-10">{format(date, 'd')}</span>
              {status.isToday && (
                 <span className="absolute bottom-1 w-0.5 h-0.5 bg-stone-800 dark:bg-stone-200 rounded-full"></span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-rose-100 dark:bg-rose-950/50 rounded-sm"></div>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Period</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-sm"></div>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Fertile</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-indigo-100 dark:bg-indigo-950/50 rounded-sm"></div>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Ovulation</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-sm"></div>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">PMS</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
