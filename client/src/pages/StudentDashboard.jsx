import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Clock, FileText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AttendanceCalendar } from '../components/student/AttendanceCalendar';
import { ClassSchedule } from '../components/student/ClassSchedule';
import { LeaveRequestForm } from '../components/student/LeaveRequestForm';

const subjectAttendance = [
  { subject_name: 'DBMS', total_classes: 40, attended_classes: 36, percentage: 90 },
  { subject_name: 'Data Structures', total_classes: 38, attended_classes: 35, percentage: 92 },
  { subject_name: 'Operating Systems', total_classes: 42, attended_classes: 38, percentage: 90 },
  { subject_name: 'Computer Networks', total_classes: 36, attended_classes: 30, percentage: 83 },
  { subject_name: 'Software Engineering', total_classes: 35, attended_classes: 32, percentage: 91 }
];

export function StudentDashboard() {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState(4);
  const overallAttendance = subjectAttendance.length
    ? Math.round(subjectAttendance.reduce((acc, subject) => acc + subject.percentage, 0) / subjectAttendance.length)
    : 0;
  const studentKPIs = [
    { title: 'Attendance', value: `${overallAttendance}%`, icon: Calendar },
    { title: 'Classes Today', value: '4', icon: Clock },
    { title: 'Leave Requests', value: '1', icon: FileText }
  ];

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Profile Quick Access */}
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => navigate('/student/profile')}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img
                src="/icon.svg"
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">Student Name</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View Profile</p>
              </div>
            </div>
          </motion.div>

          {/* Semester Selector */}
          <motion.div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="appearance-none bg-white dark:bg-gray-800 px-4 py-2 pr-10 rounded-lg border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </motion.div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentKPIs.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              className="dashboard-card bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <kpi.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.title}</p>
                  <h3 className="text-2xl font-bold">{kpi.value}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subject-wise Attendance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Subject-wise Attendance</h2>
          
          {subjectAttendance.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No attendance data available
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4">Subject</th>
                    <th className="text-center py-3 px-4">Total Classes</th>
                    <th className="text-center py-3 px-4">Attended</th>
                    <th className="text-center py-3 px-4">Percentage</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectAttendance.map((subject, index) => (
                    <motion.tr
                      key={subject.subject_name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b dark:border-gray-700"
                    >
                      <td className="py-3 px-4 font-medium">{subject.subject_name}</td>
                      <td className="text-center py-3 px-4">{subject.total_classes}</td>
                      <td className="text-center py-3 px-4">{subject.attended_classes}</td>
                      <td className="text-center py-3 px-4">{subject.percentage}%</td>
                      <td className="text-center py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            subject.percentage >= 75
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {subject.percentage >= 75 ? 'Good' : 'Low'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Other Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
            <AttendanceCalendar semester={selectedSemester} />
          </motion.div>

          {/* Leave Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
            <LeaveRequestForm />
          </motion.div>

          {/* Class Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm lg:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <ClassSchedule semester={selectedSemester} />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
