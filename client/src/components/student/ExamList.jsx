import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const exams = [
  {
    id: 1,
    subject: 'Database Management',
    date: '2024-03-15',
    time: '10:00 AM',
    venue: 'Room 301'
  },
  {
    id: 2,
    subject: 'Data Structures',
    date: '2024-03-18',
    time: '2:00 PM',
    venue: 'Lab Complex'
  }
];

export function ExamList() {
  return (
    <div className="space-y-4">
      {exams.map((exam) => (
        <motion.div
          key={exam.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-medium">{exam.subject}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {exam.date} at {exam.time} • {exam.venue}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
