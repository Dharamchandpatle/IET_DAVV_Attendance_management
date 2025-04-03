import { motion } from 'framer-motion';

const schedule = [
  {
    time: '9:00 AM',
    subject: 'Database Management',
    teacher: 'Dr. Sharma',
    room: 'Lab 101'
  },
  {
    time: '10:30 AM',
    subject: 'Data Structures',
    teacher: 'Prof. Kumar',
    room: 'Room 203'
  },
  // Add more classes...
];

export function ClassSchedule() {
  return (
    <div className="space-y-4">
      {schedule.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <div className="flex-shrink-0 w-24 text-sm font-medium">
            {item.time}
          </div>
          <div>
            <h4 className="font-medium">{item.subject}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.teacher} • {item.room}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
