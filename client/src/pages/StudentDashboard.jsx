import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar, ChevronDown, ClipboardList, Clock, FileText } from 'lucide-react';
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
  const [studentKPIs, setStudentKPIs] = useState([
    { title: 'Attendance', value: '85%', icon: Calendar },
    { title: 'Classes Today', value: '4', icon: Clock },
    { title: 'Upcoming Exams', value: '2', icon: ClipboardList },
    { title: 'Leave Requests', value: '1', icon: FileText },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // In a real app, this would be fetched from an API
        setStudentKPIs(prev => prev.map(kpi => ({
          ...kpi,
          value: kpi.title === 'Attendance' ? `${80 + Math.floor(Math.random() * 15)}%` : kpi.value
        })));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        setStudentKPIs(prev => prev.map(kpi => ({
          ...kpi,
          value: kpi.title === 'Attendance' ? `${80 + Math.floor(Math.random() * 15)}%` : kpi.value
        })));
      } catch (error) {
        console.error('Failed to update semester data:', error);
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
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </motion.div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentKPIs.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              className="dashboard-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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

        {/* Main Content Grid */}
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
