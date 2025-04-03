import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar, Check, X } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '../ui/toast';

export function ExamList({ selectedDate, role = 'student' }) {
  const { show } = useToast();

  const exams = [
    {
      id: 1,
      subject: 'Database Management',
      date: '2024-02-15',
      time: '10:00 AM',
      venue: 'Room 301'
    },
    {
      id: 2,
      subject: 'Data Structures',
      date: '2024-02-18',
      time: '2:00 PM',
      venue: 'Lab Complex'
    }
  ];

  const filteredExams = selectedDate 
    ? exams.filter(exam => exam.date === selectedDate.toISOString().split('T')[0])
    : exams;

  const markAttendance = (examId, present) => {
    // API call would go here
    show({
      title: "Attendance Marked",
      description: `Student marked as ${present ? 'present' : 'absent'}`
    });

    gsap.to(`#exam-${examId}`, {
      scale: 1.02,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
  };

  useEffect(() => {
    gsap.from('.exam-item', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      {filteredExams.map((exam) => (
        <motion.div
          key={exam.id}
          id={`exam-${exam.id}`}
          className="exam-item p-4 border rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-medium">{exam.subject}</h3>
                <p className="text-sm text-gray-600">
                  {exam.date} at {exam.time} • {exam.venue}
                </p>
              </div>
            </div>
            
            {role === 'faculty' && (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => markAttendance(exam.id, true)}
                  className="p-2 bg-green-100 text-green-700 rounded-lg"
                >
                  <Check className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => markAttendance(exam.id, false)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
      {filteredExams.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No exams scheduled for this date
        </p>
      )}
    </div>
  );
}
