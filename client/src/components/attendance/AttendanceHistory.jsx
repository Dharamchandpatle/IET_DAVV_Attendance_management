import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export function AttendanceHistory({ history }) {
  return (
    <div className="flex gap-1">
      {history.map((present, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {present ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
