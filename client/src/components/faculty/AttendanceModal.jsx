import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../ui/toast';

export function AttendanceModal({ onClose, onSubmit }) {
  const { show } = useToast();
  const [attendanceType, setAttendanceType] = useState('regular');
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', rollNo: 'CS21B001', present: false },
    // ...more students
  ]);

  const attendanceTypes = [
    { value: 'regular', label: 'Regular Class' },
    { value: 'college_event', label: 'College Event' },
    { value: 'govt_event', label: 'Government Event' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'other', label: 'Other' }
  ];

  const handleMarkAll = (status) => {
    setStudents(prev => prev.map(student => ({ ...student, present: status })));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit({
        type: attendanceType,
        students: students.map(({ id, present }) => ({ id, present })),
        date: new Date().toISOString()
      });
      
      show({
        title: "Success",
        description: "Attendance marked successfully",
      });
      onClose();
    } catch (error) {
      show({
        title: "Error",
        description: "Failed to mark attendance"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full mx-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Mark Attendance</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Attendance Type Selector */}
        <div className="mb-6">
          <select
            value={attendanceType}
            onChange={(e) => setAttendanceType(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            {attendanceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleMarkAll(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            All Present
          </button>
          <button
            onClick={() => handleMarkAll(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            All Absent
          </button>
        </div>

        {/* Student List */}
        <div className="max-h-96 overflow-y-auto">
          {students.map((student) => (
            <motion.div
              key={student.id}
              layout
              className="flex items-center justify-between p-4 border-b"
            >
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-600">{student.rollNo}</p>
              </div>
              <button
                onClick={() => {
                  setStudents(prev => prev.map(s => 
                    s.id === student.id ? { ...s, present: !s.present } : s
                  ));
                }}
                className={`p-2 rounded-lg ${
                  student.present 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {student.present ? <Check /> : <X />}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Submit Attendance
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
