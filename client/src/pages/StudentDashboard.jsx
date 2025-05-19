import { motion } from 'framer-motion';
import gsap from 'gsap';
import { AlertCircle, Calendar, ChevronDown, ClipboardList, Clock, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AttendanceCalendar } from '../components/student/AttendanceCalendar';
import { ClassSchedule } from '../components/student/ClassSchedule';
import { LeaveRequestForm } from '../components/student/LeaveRequestForm';

export function StudentDashboard() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(4);
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [error, setError] = useState(null);
  const [studentKPIs, setStudentKPIs] = useState([
    { title: 'Attendance', value: '85%', icon: Calendar },
    { title: 'Classes Today', value: '4', icon: Clock },
    { title: 'Upcoming Exams', value: '2', icon: ClipboardList },
    { title: 'Leave Requests', value: '1', icon: FileText },
  ]);

  // Effect for initial dashboard data load
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In production, this would be fetched from your API
        const mockSubjectData = [
          { subject_name: 'DBMS', total_classes: 40, attended_classes: 36, percentage: 90 },
          { subject_name: 'Data Structures', total_classes: 38, attended_classes: 35, percentage: 92 },
          { subject_name: 'Operating Systems', total_classes: 42, attended_classes: 38, percentage: 90 },
          { subject_name: 'Computer Networks', total_classes: 36, attended_classes: 30, percentage: 83 },
          { subject_name: 'Software Engineering', total_classes: 35, attended_classes: 32, percentage: 91 }
        ];
        
        setSubjectAttendance(mockSubjectData);
        
        // Update KPIs
        const overallAttendance = Math.round(
          mockSubjectData.reduce((acc, subject) => acc + subject.percentage, 0) / mockSubjectData.length
        );
        
        setStudentKPIs(prev => prev.map(kpi => ({
          ...kpi,
          value: kpi.title === 'Attendance' ? `${overallAttendance}%` : kpi.value
        })));
        
        setError(null);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load attendance data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Initialize GSAP animations
    const ctx = gsap.context(() => {
      gsap.from('.dashboard-card', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Effect to update data when semester changes
  useEffect(() => {
    const updateSemesterData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call for semester change
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // In production, this would fetch new data from your API
        const mockNewData = [
          { subject_name: 'DBMS', total_classes: 40, attended_classes: 36, percentage: 90 },
          { subject_name: 'Data Structures', total_classes: 38, attended_classes: 35, percentage: 92 },
          { subject_name: 'Operating Systems', total_classes: 42, attended_classes: 38, percentage: 90 },
          { subject_name: 'Computer Networks', total_classes: 36, attended_classes: 30, percentage: 83 },
          { subject_name: 'Software Engineering', total_classes: 35, attended_classes: 32, percentage: 91 }
        ].map(subject => ({
          ...subject,
          attended_classes: subject.attended_classes + Math.floor(Math.random() * 5),
          total_classes: subject.total_classes + Math.floor(Math.random() * 5)
        }));

        setSubjectAttendance(mockNewData);
        
        // Update KPIs for new semester
        const newOverallAttendance = Math.round(
          mockNewData.reduce((acc, subject) => acc + subject.percentage, 0) / mockNewData.length
        );
        
        setStudentKPIs(prev => prev.map(kpi => ({
          ...kpi,
          value: kpi.title === 'Attendance' ? `${newOverallAttendance}%` : kpi.value
        })));
        
        setError(null);
      } catch (error) {
        console.error('Failed to update semester data:', error);
        setError('Failed to update attendance data for the selected semester.');
      } finally {
        setIsLoading(false);
      }
    };

    updateSemesterData();
  }, [selectedSemester]);

  return (
    <DashboardLayout userRole="student" isLoading={isLoading}>
      <div className="space-y-6" ref={containerRef}>
        {/* Profile Quick Access */}
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => navigate('/student/profile')}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img
                src="/default-avatar.png"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          
          {error ? (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          ) : subjectAttendance.length === 0 ? (
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
            <LeaveRequestForm semester={selectedSemester} />
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
