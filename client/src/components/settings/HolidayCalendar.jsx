import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function HolidayCalendar() {
  const [holidays, setHolidays] = useState([
    { id: 1, date: '2024-01-26', name: 'Republic Day' },
    { id: 2, date: '2024-08-15', name: 'Independence Day' },
  ]);

  const [newHoliday, setNewHoliday] = useState({ date: '', name: '' });

  const addHoliday = (e) => {
    e.preventDefault();
    if (newHoliday.date && newHoliday.name) {
      const newEntry = { id: Date.now(), ...newHoliday };
      setHolidays(prev => [...prev, newEntry]);
      setNewHoliday({ date: '', name: '' });
      
      // Add animation for new entry
      gsap.from(`[data-holiday="${newEntry.id}"]`, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  };

  const removeHoliday = (id) => {
    setHolidays(holidays.filter(holiday => holiday.id !== id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addHoliday} className="flex gap-4">
        <input
          type="date"
          value={newHoliday.date}
          onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
          className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Holiday Name"
          value={newHoliday.name}
          onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
          className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </form>

      <div className="space-y-2">
        {holidays.map((holiday) => (
          <motion.div
            key={holiday.id}
            data-holiday={holiday.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div>
              <p className="font-medium">{holiday.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{holiday.date}</p>
            </div>
            <button
              onClick={() => removeHoliday(holiday.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
