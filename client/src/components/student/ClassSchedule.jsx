import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const scheduleData = {
  4: [ // Semester 4 schedule
    { id: 1, subject: 'Data Structures', time: '09:00 AM', duration: '1h', room: 'Lab 1' },
    { id: 2, subject: 'Computer Networks', time: '10:30 AM', duration: '1h', room: '201' },
    { id: 3, subject: 'Database Systems', time: '12:00 PM', duration: '1h', room: '302' }
  ],
  5: [ // Semester 5 schedule
    { id: 1, subject: 'Operating Systems', time: '09:00 AM', duration: '1h', room: '201' },
    { id: 2, subject: 'Software Engineering', time: '10:30 AM', duration: '1h', room: '302' },
    { id: 3, subject: 'Web Development', time: '12:00 PM', duration: '1h', room: 'Lab 2' }
  ]
};

export function ClassSchedule({ semester }) {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call
    setSchedule(scheduleData[semester] || []);
  }, [semester]);

  return (
    <div className="space-y-4">
      {schedule.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No classes scheduled for today</p>
      ) : (
        <div className="grid gap-4">
          {schedule.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.subject}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.time} • {item.duration} • Room {item.room}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
