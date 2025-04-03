import { motion } from 'framer-motion';
import { useState } from 'react';

const attendanceDates = {
  '2024-02-01': 'present',
  '2024-02-02': 'present',
  '2024-02-03': 'absent',
};

export function AttendanceCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}
        {Array.from({ length: 31 }, (_, i) => (
          <motion.button
            key={i + 1}
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-lg ${
              attendanceDates[`2024-02-${String(i + 1).padStart(2, '0')}`] === 'present'
                ? 'bg-green-500 text-white'
                : attendanceDates[`2024-02-${String(i + 1).padStart(2, '0')}`] === 'absent'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
            onClick={() => setSelectedDate(new Date(2024, 1, i + 1))}
          >
            {i + 1}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
