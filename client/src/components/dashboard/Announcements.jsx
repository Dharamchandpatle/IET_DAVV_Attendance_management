import { motion } from 'framer-motion';

const announcements = [
  {
    id: 1,
    title: 'Mid-Semester Examination Schedule',
    content: 'Mid-semester examinations will commence from next week...',
    date: '2024-02-15'
  },
  {
    id: 2,
    title: 'Faculty Meeting',
    content: 'Important faculty meeting scheduled for tomorrow at 2 PM...',
    date: '2024-02-14'
  },
  // Add more announcements...
];

export function Announcements() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Latest Announcements</h3>
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <h4 className="font-medium">{announcement.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {announcement.content}
            </p>
            <time className="text-xs text-gray-500 mt-2 block">
              {announcement.date}
            </time>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
