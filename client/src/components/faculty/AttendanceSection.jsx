import { motion } from 'framer-motion';
import { Calendar, Check, CheckCheck, Search, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AttendanceStats } from '../attendance/AttendanceStats';
import { useToast } from '../ui/toast';

const mockStudents = [
  { 
    id: 1, 
    name: 'John Doe', 
    roll: 'CS21B001', 
    present: false,
    attendance: {
      regular: 85,
      events: 90,
      overall: 87
    },
    branch: 'CSE',
    semester: 4
  },
  // ... add more mock data as needed
];

export function AttendanceSection() {
  const [students, setStudents] = useState(mockStudents);
  const [search, setSearch] = useState('');
  const [selectedDate] = useState(new Date());
  const [attendanceType, setAttendanceType] = useState('regular');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const { show } = useToast();
  const navigate = useNavigate();

  const filteredStudents = students.filter(student =>
    (student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.roll.toLowerCase().includes(search.toLowerCase())) &&
    (selectedBranch === 'all' || student.branch === selectedBranch)
  );

  const handleMarkAttendance = useCallback((studentId) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return { ...student, present: !student.present };
      }
      return student;
    }));

    show({
      title: "Attendance Updated",
      description: "Student's attendance has been marked successfully",
      type: "success"
    });
  }, [show]);

  const handleBatchMark = useCallback((present) => {
    setStudents(prev => prev.map(student => ({
      ...student,
      present: present
    })));

    show({
      title: "Batch Update",
      description: `All students marked as ${present ? 'present' : 'absent'}`,
      type: "success"
    });
  }, [show]);

  const handleSubmitAttendance = () => {
    show({
      title: "Success",
      description: "Attendance submitted successfully",
      type: "success"
    });
    navigate('/faculty/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Mark Attendance</h2>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-5 h-5" />
            <span>{selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>
        <AttendanceStats students={filteredStudents} />
      </header>

      {/* Controls Bar */}
      <motion.div 
        className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Search */}
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        {/* Filters */}
        <select
          value={attendanceType}
          onChange={(e) => setAttendanceType(e.target.value)}
          className="p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="regular">Regular Class</option>
          <option value="college_event">College Event</option>
          <option value="govt_event">Government Event</option>
          <option value="other">Other</option>
        </select>

        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
        </select>

        {/* Batch Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleBatchMark(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Present
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleBatchMark(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Mark All Absent
          </motion.button>
        </div>
      </motion.div>

      {/* Student List */}
      <motion.div 
        layout
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
      >
        <div className="p-6 space-y-4">
          {filteredStudents.map((student) => (
            <motion.div
              key={student.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-wrap md:flex-nowrap justify-between items-center p-4 border dark:border-gray-700 rounded-lg gap-4"
              whileHover={{ scale: 1.01 }}
            >
              <div className="space-y-1 flex-1">
                <h3 className="font-medium">{student.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{student.roll}</span>
                  <span>Overall: {student.attendance.overall}%</span>
                  <span>Branch: {student.branch}</span>
                  <span>Semester: {student.semester}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMarkAttendance(student.id)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  student.present
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {student.present ? 'Present' : 'Absent'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmitAttendance}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Submit Attendance
        </motion.button>
      </div>
    </div>
  );
}
