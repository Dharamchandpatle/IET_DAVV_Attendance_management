import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar, Plus, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { ExamCalendar } from '../components/exam/ExamCalendar';
import { ExamList } from '../components/exam/ExamList';
import { NewExamForm } from '../components/exam/NewExamForm';

export function ExamManagement() {
  const [showNewExamForm, setShowNewExamForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.exam-card', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-6" ref={containerRef}>
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Exam Management</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Schedule and manage examinations
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewExamForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Schedule Exam
            </motion.button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Exam Calendar</h2>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <ExamCalendar onDateSelect={setSelectedDate} />
            </motion.div>

            {/* Exam List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Upcoming Exams</h2>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total: 5 Exams
                  </span>
                </div>
              </div>
              <ExamList selectedDate={selectedDate} />
            </motion.div>
          </div>
        </div>
      </main>

      {/* New Exam Form Modal */}
      {showNewExamForm && (
        <NewExamForm onClose={() => setShowNewExamForm(false)} />
      )}
    </div>
  );
}
