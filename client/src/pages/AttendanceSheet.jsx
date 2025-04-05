import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar, Save, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AttendanceHistory } from '../components/attendance/AttendanceHistory';
import { AttendanceStats } from '../components/attendance/AttendanceStats';
import { Sidebar } from '../components/dashboard/Sidebar';
import { useToast } from '../components/ui/toast';

const mockStudents = [
  { 
    id: 1, 
    name: 'John Doe', 
    roll: 'CS21B001', 
    present: false, 
    history: [true, true, false, true], 
    semester: 4,
    branch: 'CSE',
    year: '2nd',
    section: 'A',
    attendance: {
      regular: 85,
      events: 92,
      overall: 88
    }
  },
  // Add more students with similar structure
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
  const [showEventModal, setShowEventModal] = useState(false);
  const [attendanceType, setAttendanceType] = useState('regular');
  const containerRef = useRef(null);
  const [activeFilters, setActiveFilters] = useState({
    branch: 'all',
    year: 'all',
    section: 'all',
    semester: 'all'
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.filter-controls', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      });

      gsap.from('.attendance-card', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

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

  const handleBulkAttendance = async (present) => {
    try {
      setStudents(prev => prev.map(student => ({ ...student, present })));
      show({
        title: "Bulk Attendance",
        description: `All students marked as ${present ? 'present' : 'absent'}`,
        type: "success"
      });
    } catch (error) {
      show({
        title: "Error",
        description: "Failed to update attendance",
        type: "error"
      });
    }
  };

  const handleAttendanceSubmit = async () => {
    try {
      // API call would go here with attendanceType
      show({
        title: "Success",
        description: "Attendance submitted successfully",
        type: "success"
      });

      gsap.to('.attendance-card', {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    } catch (error) {
      show({
        title: "Error",
        description: "Failed to submit attendance",
        type: "error"
      });
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.roll.toLowerCase().includes(search.toLowerCase());
    
    const matchesBranch = activeFilters.branch === 'all' || student.branch === activeFilters.branch;
    const matchesYear = activeFilters.year === 'all' || student.year === activeFilters.year;
    const matchesSection = activeFilters.section === 'all' || student.section === activeFilters.section;
    const matchesSemester = activeFilters.semester === 'all' || student.semester === Number(activeFilters.semester);

    return matchesSearch && matchesBranch && matchesYear && matchesSection && matchesSemester;
  });

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar userRole="faculty" />
      
      <main className="flex-1 overflow-y-auto p-6" ref={containerRef}>
        <div className="max-w-7xl mx-auto space-y-6">
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
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
        </div>
      </main>
    </div>
  );
}
