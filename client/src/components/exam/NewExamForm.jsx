import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { useToast } from '../ui/toast';

export function NewExamForm({ onClose }) {
  const { show } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // API call would go here
    show({
      title: "Exam Scheduled",
      description: "New exam has been scheduled successfully"
    });

    gsap.to('.exam-form', {
      y: -20,
      opacity: 0,
      duration: 0.3,
      onComplete: onClose
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50"
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg mx-auto mt-20 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Schedule New Exam</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="exam-form space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Venue</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Schedule Exam
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
