import { motion } from 'framer-motion';
import { Calendar, FileText } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ExamList } from '../components/student/ExamList';

const examStats = {
  upcoming: 2,
  completed: 5,
  averageScore: 85
};

export function ExamView() {
  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Examinations</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View your upcoming and past examinations
            </p>
          </div>
          <div className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                  <p className="text-2xl font-bold">{examStats.upcoming}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                  <p className="text-2xl font-bold">{examStats.averageScore}%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

          {/* Exam List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="exam-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Upcoming Examinations</h2>
            <ExamList />
          </motion.div>

          {/* Past Exams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="exam-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Past Examinations</h2>
            <div className="space-y-4">
              {/* Past exam entries would go here */}
            </div>
          </motion.div>
      </div>
    </DashboardLayout>
  );
}
