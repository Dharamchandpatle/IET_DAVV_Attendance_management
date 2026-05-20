// import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

// Shows a compact present/absent history strip.
export function AttendanceHistory({ history = [] }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {history.map((present, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              present 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'
            } transition-transform hover:scale-105`}
          >
            {present ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <X className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
}
