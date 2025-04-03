import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function ExamManagementSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Exam Management</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Schedule Exam
        </motion.button>
      </div>
      {/* Add exam management content here */}
    </div>
  );
}
