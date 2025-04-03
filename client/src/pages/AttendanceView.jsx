import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';

const attendanceData = {
  present: 42,
  total: 50,
  dates: {
    '2024-02-01': true,
    '2024-02-02': true,
    '2024-02-03': false,
    '2024-02-04': true,
    // Add more dates...
  }
};

export function AttendanceView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.attendance-card', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Realtime attendance updates
    const updateAttendance = async () => {
      try {
        // API call would go here
        gsap.from('.attendance-percentage', {
          textContent: 0,
          duration: 1,
          snap: { textContent: 1 },
          ease: 'power1.out'
        });
      } catch (error) {
        show({
          title: "Error",
          description: "Failed to fetch attendance",
          type: "error"
        });
      }
    };

    updateAttendance();
  }, []);

  const percentage = Math.round((attendanceData.present / attendanceData.total) * 100);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar userRole="student" />
      
      <main className="flex-1 overflow-y-auto p-6" ref={containerRef}>
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Attendance Record</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your attendance statistics and history
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Attendance</p>
                  <p className="attendance-percentage text-2xl font-bold">{percentage}%</p>
                </div>
              </div>
            </motion.div>
          </header>

          <div className="grid gap-6">
            {/* Calendar View */}
            <motion.div 
              className="attendance-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Monthly View</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium p-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => {
                  const date = `2024-02-${String(i + 1).padStart(2, '0')}`;
                  return (
                    <div
                      key={i}
                      className={`p-2 text-center rounded-lg ${
                        attendanceData.dates[date] === true
                          ? 'bg-green-500 text-white'
                          : attendanceData.dates[date] === false
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
