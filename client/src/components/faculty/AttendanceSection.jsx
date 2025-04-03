import { motion } from 'framer-motion';
import { Calendar, Filter, Search } from 'lucide-react';
import { useState } from 'react';

const mockStudents = [
  { id: 1, name: 'John Doe', roll: 'CS21B001', present: false },
  { id: 2, name: 'Jane Smith', roll: 'CS21B002', present: false },
  // Add more mock data as needed
];

export function AttendanceSection() {
  const [students] = useState(mockStudents);
  const [selectedDate] = useState(new Date());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mark Attendance</h2>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span>{selectedDate.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-700"
          />
        </div>
        <button className="p-2 border rounded-lg">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 space-y-4">
          {students.map((student) => (
            <motion.div
              key={student.id}
              className="flex justify-between items-center p-4 border rounded-lg"
              whileHover={{ scale: 1.01 }}
            >
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.roll}</p>
              </div>
              <button
                className={`px-4 py-2 rounded-lg ${
                  student.present
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {student.present ? 'Present' : 'Absent'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
