import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Mock data structure with semester information
const attendanceDates = {
  4: { // Semester 4
    '2024-02-01': 'present',
    '2024-02-02': 'present',
    '2024-02-03': 'absent',
  },
  5: { // Semester 5
    '2024-02-01': 'present',
    '2024-02-02': 'absent',
    '2024-02-03': 'present',
  }
};

export function AttendanceCalendar({ semester }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonthData, setCurrentMonthData] = useState({});

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const semesterData = attendanceDates[semester] || {};
    setCurrentMonthData(semesterData);
  }, [semester]);

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
              currentMonthData[`2024-02-${String(i + 1).padStart(2, '0')}`] === 'present'
                ? 'bg-green-500 text-white'
                : currentMonthData[`2024-02-${String(i + 1).padStart(2, '0')}`] === 'absent'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
            onClick={() => setSelectedDate(new Date(2024, 1, i + 1))}
          >
            {i + 1}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
}
