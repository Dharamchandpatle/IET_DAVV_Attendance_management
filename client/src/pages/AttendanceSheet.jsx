import { motion } from 'framer-motion';
import { Calendar, Save, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AttendanceHistory } from '../components/attendance/AttendanceHistory';
import { AttendanceStats } from '../components/attendance/AttendanceStats';
import { FacultyPageLayout } from '../components/faculty/FacultyPageLayout';
import { useToast } from '../components/ui/toast';
import { getApiErrorMessage } from '../services/api';
import { markClassAttendance } from '../services/attendanceService';
import { listStudents } from '../services/studentService';
const mockStudents = [
  { 
    id: 1, 
    name: 'Dharamchand Patle', 
    roll: 'CS21B001', 
    present: false, 
    history: [
      { type: 'regular', present: true },
      { type: 'regular', present: true },
      { type: 'regular', present: false },
      { type: 'regular', present: true },
      { type: 'regular', present: false }
    ],
    semester: 4,
    branch: 'CSE',
    year: '2nd',
    section: 'A',
    attendance: {
      regular: 91,
      events: 88,
      overall: 90
    }
  },
  { 
    id: 2, 
    name: 'Rishiraj Atman', 
    roll: 'CS21B002', 
    present: false, 
    history: [
      { type: 'regular', present: true },
      { type: 'regular', present: false },
      { type: 'regular', present: true },
      { type: 'regular', present: true },
      { type: 'regular', present: true }
    ],
    semester: 4,
    branch: 'CSE',
    year: '2nd',
    section: 'A',
    attendance: {
      regular: 76,
      events: 95,
      overall: 82
    }
  },
  {
    id: 3,
    name: 'Rohan Ahirwar',
    roll: 'CS21B003',
    present: false,
    history: [
      { type: 'regular', present: true },
      { type: 'regular', present: false },
      { type: 'regular', present: true },
      { type: 'regular', present: true },
      { type: 'regular', present: false }
    ],
    semester: 4,
    branch: 'CSE',
    year: '2nd',
    section: 'A',
    attendance: {
      regular: 65,
      events: 80,
      overall: 70
    }
  },
  {
    id: 4,
    name: 'Rahul Ahirwar',
    roll: 'CS21B003',
    present: false,
    history: [
      { type: 'regular', present: true },
      { type: 'regular', present: false },
      { type: 'regular', present: true },
      { type: 'regular', present: true },
      { type: 'regular', present: false }
    ],
    semester: 4,
    branch: 'CSE',
    year: '2nd',
    section: 'A',
    attendance: {
      regular: 65,
      events: 80,
      overall: 70
    }
  },
  {
    id: 5,
    name: 'Neelesh ',
    roll: 'CS21B003',
    present: false,
    history: [
      { type: 'regular', present: true },
      { type: 'regular', present: false },
      { type: 'regular', present: true },
      { type: 'regular', present: true },
      { type: 'regular', present: false }
    ],
    semester: 4,
    branch: 'CSE',
    year: '2nd',
    section: 'A',
    attendance: {
      regular: 65,
      events: 80,
      overall: 70
    }
  },
  {
    id: 6,
    name: 'Manish',
    roll: 'CS21B003',
    present: false,
    history: [
      { type: 'regular', present: true },
      { type: 'regular', present: false },
      { type: 'regular', present: true },
      { type: 'regular', present: true },
      { type: 'regular', present: false }
    ],
    semester: 4,
    branch: 'CSE',
    year: '2nd',
    section: 'A',
    attendance: {
      regular: 65,
      events: 80,
      overall: 70
    }
  },
  // ... Add more students as needed
];




const filters = {
  branch: ['CSE', 'IT', 'ECE', 'EE'],
  year: ['1st', '2nd', '3rd', '4th'],
  section: ['A', 'B', 'C'],
  semester: [1, 2, 3, 4, 5, 6, 7, 8]
};

export function AttendanceSheet() {
  const { show } = useToast();
  const [students, setStudents] = useState(mockStudents);
  const [search, setSearch] = useState('');
  const [selectedDate] = useState(new Date());
  const [attendanceType, setAttendanceType] = useState('regular');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    branch: 'all',
    year: 'all',
    section: 'all',
    semester: 'all'
  });

  useEffect(() => {
    let isActive = true;

    const loadStudents = async () => {
      try {
        const data = await listStudents();
        if (!isActive) return;

        const yearMap = {
          1: '1st',
          2: '1st',
          3: '2nd',
          4: '2nd',
          5: '3rd',
          6: '3rd',
          7: '4th',
          8: '4th'
        };

        const mapped = data.map((student) => ({
          id: student.user_id,
          userId: student.user_id,
          name: student.name,
          roll: student.roll_number,
          present: false,
          history: [],
          semester: student.semester,
          branch: student.department_code || student.department_name,
          year: yearMap[student.semester] || 'N/A',
          section: student.section,
          attendance: {
            regular: 0,
            events: 0,
            overall: 0
          }
        }));

        setStudents(mapped.length ? mapped : mockStudents);
      } catch (error) {
        if (isActive) {
          show({
            title: 'Unable to load students',
            description: getApiErrorMessage(error, 'Please try again later.'),
            type: 'error'
          });
        }
      }
    };

    loadStudents();

    return () => {
      isActive = false;
    };
  }, [show]);

  const markAttendance = (studentId) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return { ...student, present: !student.present };
      }
      return student;
    }));

    show({
      title: "Attendance Updated",
      description: "Student attendance has been marked successfully.",
    });
  };

  const handleBulkAttendance = (present) => {
    setStudents(prev => prev.map(student => ({ ...student, present })));
    show({
      title: "Bulk Attendance",
      description: `All students marked as ${present ? 'present' : 'absent'}`,
      type: "success"
    });
  };

  const handleAttendanceSubmit = async () => {
    try {
      setIsSubmitting(true);
      const classDate = selectedDate.toISOString().split('T')[0];
      const records = students.map((student) => ({
        user_id: student.userId,
        status: student.present ? 'present' : 'absent'
      }));

      await markClassAttendance({
        class_date: classDate,
        records,
        attendance_type: attendanceType
      });

      show({
        title: "Success",
        description: "Attendance submitted successfully",
        type: "success"
      });
    } catch (error) {
      show({
        title: "Error",
        description: getApiErrorMessage(error, "Failed to submit attendance"),
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const query = search.trim().toLowerCase();
  const filteredStudents = students.filter(student => {
    const matchesSearch = !query ||
      student.name.toLowerCase().includes(query) ||
      student.roll.toLowerCase().includes(query);
    
    const matchesBranch = activeFilters.branch === 'all' || student.branch === activeFilters.branch;
    const matchesYear = activeFilters.year === 'all' || student.year === activeFilters.year;
    const matchesSection = activeFilters.section === 'all' || student.section === activeFilters.section;
    const matchesSemester = activeFilters.semester === 'all' || student.semester === Number(activeFilters.semester);

    return matchesSearch && matchesBranch && matchesYear && matchesSection && matchesSemester;
  });

  return (
    <FacultyPageLayout>
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-5 h-5" />
            <p>{selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
        <AttendanceStats students={filteredStudents} />
      </header>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <select
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value)}
              className="p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="regular">Regular Class</option>
              <option value="college_event">College Event</option>
              <option value="govt_event">Government Event</option>
              <option value="holiday">Holiday</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Enhanced Filter Controls */}
          <div className="filter-controls grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(filters).map(([key, options]) => (
              <select
                key={key}
                value={activeFilters[key]}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, [key]: e.target.value }))}
                className="p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="all">All {key}s</option>
                {options.map(option => (
                  <option key={option} value={option}>
                    {key === 'semester' ? `Semester ${option}` : option}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between mb-4">
            <div className="space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBulkAttendance(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Mark All Present
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBulkAttendance(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Mark All Absent
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAttendanceSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              Submit Attendance
            </motion.button>
          </div>

          {/* Enhanced Student List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-4">Roll No</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Details</th>
                  <th className="text-left p-4">History</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    layoutId={student.id.toString()}
                    className="attendance-card border-b dark:border-gray-700"
                  >
                    <td className="p-4">{student.roll}</td>
                    <td className="p-4">{student.name}</td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Branch: {student.branch}</p>
                        <p>Overall: {student.attendance.overall}%</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <AttendanceHistory history={student.history} />
                    </td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAttendance(student.id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          student.present
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        {student.present ? 'Present' : 'Absent'}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
    </FacultyPageLayout>
  );
}
