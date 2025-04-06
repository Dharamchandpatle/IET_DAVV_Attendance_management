import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';

// Enhanced mock data with proper typing
const attendanceData = {
  present: 42,
  total: 50,
  dates: {
    '2024-02-01': { type: 'regular', present: true },
    '2024-02-02': { type: 'college_event', present: true, details: 'Technical Symposium' },
    '2024-02-03': { type: 'holiday', details: 'College Function' },
    '2024-02-04': { type: 'regular', present: false },
  }
};

export function AttendanceView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [monthData, setMonthData] = useState(attendanceData);
  const containerRef = useRef(null);

  useEffect(() => {
    // Simulate API call and data loading
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        // In production, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMonthData(attendanceData);
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [currentMonth]); // Refetch when month changes

  const percentage = Math.round((monthData.present / monthData.total) * 100);

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getStatusClass = (date) => {
    const entry = monthData.dates[date];
    if (!entry) return 'bg-gray-100 dark:bg-gray-800';

    switch (entry.type) {
      case 'regular':
        return entry.present ? 
          'bg-green-500 text-white hover:bg-green-600' : 
          'bg-red-500 text-white hover:bg-red-600';
      case 'college_event':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      case 'holiday':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <DashboardLayout userRole="student" isLoading={isLoading}>
      <div className="space-y-6">
        {/* Header Stats */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Attendance Record</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your attendance and participation
            </p>
          </div>
          <motion.div 
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Attendance</p>
                <p className="attendance-percentage text-2xl font-bold">{percentage}%</p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Calendar View */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Monthly View</h2>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <span className="font-medium">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium p-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const date = `2024-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 text-center rounded-lg relative ${getStatusClass(date)}`}
                >
                  {i + 1}
                  {monthData.dates[date]?.details && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
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
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span>Holiday</span>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
