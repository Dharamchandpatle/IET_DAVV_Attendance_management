// import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Clock, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AttendanceCalendar } from '../components/student/AttendanceCalendar';
import { ClassSchedule } from '../components/student/ClassSchedule';
import { LeaveRequestForm } from '../components/student/LeaveRequestForm';
import { useAuth } from '../context/AuthContext';
import { getMyAttendance } from '../services/attendanceService';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState(user?.semester || 4);
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subjectAttendance, setSubjectAttendance] = useState([]);

  // Fetch student profile data on mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (user?.id) {
          // For now, we'll use mock data until you create a separate profile fetch endpoint
          // In a real scenario, you'd fetch by student ID from the student table
          const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            roll_number: user.roll_number,
            department_name: user.department_name || 'Computer Science',
            semester: user.semester || 4,
            section: user.section || 'A',
            admission_year: user.admission_year,
            cgpa: user.cgpa || 0,
            profile_image: user.profile_image
          };
          setStudentData(data);
          
          // Fetch overall attendance records for the student and derive summary
          try {
            const records = await getMyAttendance();
            // Filter records to current selected semester and current academic year
            const now = new Date();
            const y = now.getFullYear();
            const currentAcademicYear = `${y}-${y + 1}`;
            const filtered = records.filter(r => Number(r.semester) === Number(selectedSemester));
            const byYear = filtered.filter(r => (r.academic_year || currentAcademicYear) === currentAcademicYear);
            const total = byYear.length;
            const present = byYear.filter(r => r.status !== 'absent').length;
            const percentage = total ? Math.round((present / total) * 100) : 0;
            setSubjectAttendance([
              { subject_name: 'Overall', total_classes: total, attended_classes: present, percentage }
            ]);
          } catch (attErr) {
            // if attendance fetch fails, keep subjectAttendance empty
            console.warn('Failed to load attendance for dashboard', attErr);
          }
        }
      } catch (error) {
        toast.error('Failed to load student data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [user?.id]);

  const overallAttendance = subjectAttendance.length
    ? Math.round(subjectAttendance.reduce((acc, subject) => acc + subject.percentage, 0) / subjectAttendance.length)
    : 0;

  const studentKPIs = [
    { title: 'Attendance', value: `${overallAttendance}%`, icon: Calendar },
    { title: 'Classes Today', value: '4', icon: Clock },
    { title: 'Leave Requests', value: '1', icon: FileText }
  ];

  if (isLoading) {
    return (
      <DashboardLayout userRole="student">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Profile Quick Access */}
        <div className="flex justify-between items-center">
          <div
            onClick={() => navigate('/student/profile')}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {studentData?.profile_image ? (
                <img
                  src={studentData.profile_image}
                  alt={studentData.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                    {studentData?.name?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-medium">{studentData?.name || 'Student'}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {studentData?.roll_number ? `Roll: ${studentData.roll_number}` : 'View Profile'}
                </p>
              </div>
            </div>
          </div>

          {/* Semester Selector */}
          <div className="relative">
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
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentKPIs.map((kpi, index) => (
            <div
              key={kpi.title}
              className="dashboard-card bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
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
            </div>
          ))}
        </div>

        {/* Subject-wise Attendance Table */}
        <div
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
                    <tr
                      key={subject.subject_name}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Other Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Calendar */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
            <AttendanceCalendar semester={selectedSemester} />
          </div>

          {/* Leave Requests */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
            <LeaveRequestForm />
          </div>

          {/* Class Schedule */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm lg:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <ClassSchedule semester={selectedSemester} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
