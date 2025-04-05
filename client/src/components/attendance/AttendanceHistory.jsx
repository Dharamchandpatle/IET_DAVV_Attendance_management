import { motion } from 'framer-motion';
import { Calendar, Check, Flag, Star, X } from 'lucide-react';
import { useState } from 'react';

export function AttendanceHistory({ history = [] }) {
  const [showDetails, setShowDetails] = useState(false);

  // Example structure for enhanced history
  const getStatusIcon = (entry) => {
    switch (entry.type) {
      case 'regular':
        return entry.present ? 
          <Check className="w-5 h-5 text-green-600 dark:text-green-400" /> : 
          <X className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'college_event':
        return <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'govt_event':
        return <Flag className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'holiday':
        return <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      default:
        return entry.present ? 
          <Check className="w-5 h-5 text-green-600 dark:text-green-400" /> : 
          <X className="w-5 h-5 text-red-600 dark:text-red-400" />;
    }
  };

  const getStatusClass = (entry) => {
    switch (entry.type) {
      case 'regular':
        return entry.present ? 
          'bg-green-100 dark:bg-green-900/20' : 
          'bg-red-100 dark:bg-red-900/20';
      case 'college_event':
        return 'bg-purple-100 dark:bg-purple-900/20';
      case 'govt_event':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'holiday':
        return 'bg-gray-100 dark:bg-gray-800/50';
      default:
        return entry.present ? 
          'bg-green-100 dark:bg-green-900/20' : 
          'bg-red-100 dark:bg-red-900/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {history.map((entry, index) => (
          <motion.button
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-2 rounded-lg ${getStatusClass(entry)}`}
            onClick={() => entry.details && setShowDetails(!showDetails)}
            title={entry.details || (entry.present ? 'Present' : 'Absent')}
          >
            {getStatusIcon(entry)}
          </motion.button>
        ))}
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm space-y-2"
        >
          <div className="flex items-center gap-4">
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
              <span>Event</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span>Holiday</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
