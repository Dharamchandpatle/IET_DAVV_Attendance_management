import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar, ClipboardList, Clock, FileText } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AttendanceCalendar } from '../components/student/AttendanceCalendar';
import { ClassSchedule } from '../components/student/ClassSchedule';
import { LeaveRequestForm } from '../components/student/LeaveRequestForm';

const studentKPIs = [
  { title: 'Attendance', value: '85%', icon: Calendar },
  { title: 'Classes Today', value: '4', icon: Clock },
  { title: 'Upcoming Exams', value: '2', icon: ClipboardList },
  { title: 'Leave Requests', value: '1', icon: FileText },
];

export function StudentDashboard() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <DashboardLayout userRole="student">
      {/* Add Profile Quick Access Card */}
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm cursor-pointer"
        onClick={() => navigate('/student/profile')}
      >
        <div className="flex items-center gap-4">
          <img
            src="/default-avatar.png"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-medium">John Doe</h3>
            <p className="text-sm text-gray-600">View Profile</p>
          </div>
        </div>
      </motion.div>

      <main className="flex-1 overflow-y-auto p-6" ref={containerRef}>
        <div className="max-w-7xl mx-auto space-y-6">
          <header>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome, John Doe</p>
          </header>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentKPIs.map((kpi, index) => (
              <motion.div
                key={index}
                className="dashboard-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                whileHover={{ y: -5 }}
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
              <AttendanceCalendar />
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
              <ClassSchedule />
            </motion.div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
