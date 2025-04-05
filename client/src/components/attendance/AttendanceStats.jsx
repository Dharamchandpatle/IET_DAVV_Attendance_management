import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar, Clock, FileText, Users } from 'lucide-react';
import { useEffect } from 'react';

export function AttendanceStats({ students }) {
  const presentCount = students.filter(s => s.present).length;
  const totalCount = students.length;
  const percentage = Math.round((presentCount / totalCount) * 100) || 0;

  // Calculate aggregate stats
  const stats = students.reduce((acc, student) => {
    acc.regularClasses += student.attendance?.regular || 0;
    acc.eventAttendance += student.attendance?.events || 0;
    acc.totalStudents++;
    return acc;
  }, { regularClasses: 0, eventAttendance: 0, totalStudents: 0 });

  const averageRegular = Math.round(stats.regularClasses / stats.totalStudents) || 0;
  const averageEvents = Math.round(stats.eventAttendance / stats.totalStudents) || 0;

  useEffect(() => {
    // Animate stats on update
    gsap.to('.stat-number', {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
  }, [presentCount]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Present Today</p>
            <p className="stat-number text-xl font-bold">{presentCount}/{totalCount}</p>
          </div>
        </div>
        <motion.div 
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={`h-2 rounded-full ${
              percentage >= 75 ? 'bg-green-500' :
              percentage >= 50 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
          />
        </motion.div>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Regular Classes</p>
            <p className="stat-number text-xl font-bold">{averageRegular}%</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Event Attendance</p>
            <p className="stat-number text-xl font-bold">{averageEvents}%</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Required</p>
            <p className="stat-number text-xl font-bold">75%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
