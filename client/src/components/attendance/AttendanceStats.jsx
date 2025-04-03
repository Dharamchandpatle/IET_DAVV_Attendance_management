import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Users } from 'lucide-react';
import { useEffect } from 'react';

export function AttendanceStats({ students }) {
  const presentCount = students.filter(s => s.present).length;
  const totalCount = students.length;
  const percentage = Math.round((presentCount / totalCount) * 100);

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
    <motion.div 
      className="flex items-center gap-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        <Users className="w-5 h-5 text-blue-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
          <p className="stat-number text-xl font-bold">{presentCount}/{totalCount}</p>
        </div>
      </div>
      <div className="h-12 w-px bg-gray-200 dark:bg-gray-700" />
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
        <p className="stat-number text-xl font-bold text-green-500">{percentage}%</p>
        <motion.div 
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="bg-green-500 h-2 rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
