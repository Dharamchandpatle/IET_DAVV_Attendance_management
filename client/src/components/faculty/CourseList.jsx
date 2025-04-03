import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const courses = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Programming',
    students: 30,
    time: '10:00 AM - 11:00 AM',
    attendance: '85%'
  },
  // Add more courses...
];

export function CourseList({ onMarkAttendance }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
        <div className="space-y-4">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{course.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{course.code}</p>
                </div>
                <button
                  onClick={onMarkAttendance}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Mark Attendance
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{course.students} Students</span>
                </div>
                <span>{course.time}</span>
                <span className="text-green-600">Attendance: {course.attendance}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
