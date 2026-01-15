
import React from 'react';
import { UserSettings } from '../types';

interface Props {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

const SettingsForm: React.FC<Props> = ({ settings, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onUpdate({
      ...settings,
      [name]: type === 'checkbox' ? checked : (name === 'lastPeriodStart' ? value : parseInt(value) || 0),
    });
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      onUpdate({ ...settings, notificationsEnabled: true });
    }
  };

  return (
    <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-stone-800 max-w-md mx-auto transition-colors duration-300">
      <h2 className="text-xl font-serif text-stone-800 dark:text-stone-100 mb-6 italic">Cycle basics</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-2 font-medium">Last period started</label>
          <input
            type="date"
            name="lastPeriodStart"
            value={settings.lastPeriodStart}
            onChange={handleChange}
            className="w-full bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-lg p-3 text-stone-700 dark:text-stone-200 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/30 focus:outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-2 font-medium">Cycle length</label>
            <div className="relative">
              <input
                type="number"
                name="cycleLength"
                value={settings.cycleLength}
                onChange={handleChange}
                className="w-full bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-lg p-3 text-stone-700 dark:text-stone-200 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/30 focus:outline-none transition-all"
              />
              <span className="absolute right-3 top-3 text-stone-400 dark:text-stone-500 text-sm">days</span>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-2 font-medium">Period length</label>
            <div className="relative">
              <input
                type="number"
                name="periodLength"
                value={settings.periodLength}
                onChange={handleChange}
                className="w-full bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-lg p-3 text-stone-700 dark:text-stone-200 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/30 focus:outline-none transition-all"
              />
              <span className="absolute right-3 top-3 text-stone-400 dark:text-stone-500 text-sm">days</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-50 dark:border-stone-800/50">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-medium group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
              Cycle reminders (3 days before)
            </span>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                name="notificationsEnabled"
                checked={settings.notificationsEnabled}
                onChange={(e) => {
                  if (e.target.checked) requestPermission();
                  else handleChange(e);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-rose-400"></div>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};

export default SettingsForm;
