import { motion } from 'framer-motion';
import { Calendar, Info } from 'lucide-react';
import { useState } from 'react';

// Mock data structure with semester information and event types
const attendanceDates = {
  4: { // Semester 4
    '2024-02-01': { type: 'regular', present: true },
    '2024-02-02': { type: 'college_event', details: 'Annual Function', present: true },
    '2024-02-03': { type: 'holiday', details: 'Republic Day' },
    '2024-02-04': { type: 'govt_event', details: 'State Program', present: true },
  },
  5: { // Semester 5
    '2024-02-01': { type: 'regular', present: true },
    '2024-02-02': { type: 'regular', present: false },
    '2024-02-03': { type: 'college_event', details: 'Tech Fest', present: true },
  }
};

export function AttendanceCalendar({ semester }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const currentMonthData = attendanceDates[semester] || {};
  const monthLabel = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

  const getStatusClass = (date) => {
    const entry = currentMonthData[date];
    if (!entry) return 'bg-gray-100 dark:bg-gray-800';

    switch (entry.type) {
      case 'regular':
        return entry.present ? 
          'bg-green-500 text-white hover:bg-green-600' : 
          'bg-red-500 text-white hover:bg-red-600';
      case 'college_event':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      case 'govt_event':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'holiday':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const handleDateClick = (date, entry) => {
    setSelectedDate(new Date(date));
    setSelectedEvent(entry?.details ? entry : null);
  };

  return (
    <div className="space-y-4">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {monthLabel}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Semester {semester}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = `2024-02-${String(day).padStart(2, '0')}`;
          const entry = currentMonthData[date];
          return (
            <motion.button
              key={date}
              whileHover={{ scale: 1.1 }}
              className={`p-2 rounded-lg relative ${getStatusClass(date)}`}
              onClick={() => handleDateClick(date, entry)}
            >
              {day}
              {entry?.details && (
                <div className="absolute -top-1 -right-1">
                  <Info className="w-3 h-3" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>College Event</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Govt Event</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span>Holiday</span>
        </div>
      </div>

      {/* Event Details */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 mt-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{selectedEvent.details}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <button 
              onClick={() => setSelectedEvent(null)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
