
import React, { useState, useEffect, useRef } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import SettingsForm from './components/SettingsForm';
import Calendar from './components/Calendar';
import { UserSettings } from './types';

const STORAGE_KEY = 'luna_cycle_settings';
const THEME_KEY = 'luna_theme';

type Tab = 'calendar' | 'settings';

const App: React.FC = () => {
  const hasNotifiedRef = useRef(false);
  const [activeTab, setActiveTab] = useState<Tab>('calendar');

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      lastPeriodStart: format(new Date(), 'yyyy-MM-dd'),
      cycleLength: 28,
      periodLength: 5,
      notificationsEnabled: false,
    };
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const root = window.document.documentElement;
    const themeMeta = document.getElementById('theme-meta');
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
      if (themeMeta) themeMeta.setAttribute('content', '#0c0a09');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
      if (themeMeta) themeMeta.setAttribute('content', '#fcfaf7');
    }
  }, [isDarkMode]);

  const handlePrevMonth = () => setViewDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setViewDate(prev => addMonths(prev, 1));
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex flex-col min-h-screen max-h-screen overflow-hidden dark:bg-stone-950 transition-colors duration-300">
      {/* App Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-4 bg-transparent shrink-0">
        <div>
          <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100">Luna</h1>
          <p className="text-stone-400 dark:text-stone-500 text-[10px] uppercase tracking-widest font-bold">
            {activeTab === 'calendar' ? format(viewDate, 'MMMM yyyy') : 'Your Cycle'}
          </p>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2.5 bg-white dark:bg-stone-900 shadow-sm border border-stone-100 dark:border-stone-800 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-all"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32">
        <div className="max-w-md mx-auto">
          {activeTab === 'calendar' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Calendar 
                settings={settings} 
                viewDate={viewDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
              <div className="mt-8 px-2 space-y-4">
                 <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl">
                    <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-200 mb-1 font-serif italic">Gentle reminder</h4>
                    <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                       This cycle is predicted based on your average {settings.cycleLength} day rhythm. Every body is unique and changes month to month.
                    </p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SettingsForm settings={settings} onUpdate={setSettings} />
              <div className="mt-8 text-center px-6">
                <p className="text-[10px] text-stone-300 dark:text-stone-700 uppercase tracking-widest font-medium leading-loose">
                  Your data stays on this device only. Luna does not collect, sell, or share your personal health information.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-t border-stone-100 dark:border-stone-800 px-6 pb-safe-bottom pt-3 shrink-0 z-50">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'calendar' ? 'text-rose-400' : 'text-stone-400 dark:text-stone-600 hover:text-stone-600'}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Calendar</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'settings' ? 'text-rose-400' : 'text-stone-400 dark:text-stone-600 hover:text-stone-600'}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm10.5-2.2v-2.6l-2.43-.4c-.2-.71-.48-1.39-.83-2.01l1.45-1.99-1.84-1.84-1.99 1.45c-.62-.35-1.3-.63-2.01-.83l-.4-2.43h-2.6l-.4 2.43c-.71.2-1.39.48-2.01.83l-1.99-1.45-1.84 1.84 1.45 1.99c-.35.62-.63 1.3-.83 2.01l-2.43.4v2.6l2.43.4c.2.71.48 1.39.83 2.01l-1.45 1.99 1.84 1.84 1.99-1.45c.62-.35 1.3-.63 2.01-.83l.4 2.43h2.6l.4-2.43c.71-.2 1.39-.48 2.01-.83l1.99 1.45 1.84-1.84-1.45-1.99c.35-.62.63-1.3.83-2.01l2.43-.4z"/>
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
