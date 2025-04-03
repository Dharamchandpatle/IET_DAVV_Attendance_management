import { motion } from 'framer-motion';
import gsap from 'gsap';
import { BarChart3, BookOpen, GraduationCap, Moon, Sun, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Announcements } from '../components/dashboard/Announcements';
import { KpiCard } from '../components/dashboard/KpiCard';
import { Sidebar } from '../components/dashboard/Sidebar';

const attendanceData = [
  { month: 'Jan', count: 85 },
  { month: 'Feb', count: 92 },
  { month: 'Mar', count: 88 },
  { month: 'Apr', count: 90 },
];

const kpiData = [
  { title: 'Total Students', value: '1,234', icon: GraduationCap, trend: '+5.2%' },
  { title: 'Faculty Members', value: '48', icon: Users, trend: '+2.1%' },
  { title: 'Active Courses', value: '26', icon: BookOpen, trend: '0%' },
  { title: 'Avg. Attendance', value: '89%', icon: BarChart3, trend: '+1.2%' },
];

const examData = [
  { subject: 'Math', pass: 85, fail: 15 },
  { subject: 'Physics', pass: 78, fail: 22 },
  { subject: 'Chemistry', pass: 90, fail: 10 },
  { subject: 'English', pass: 95, fail: 5 },
];

export function Dashboard({ userRole = 'admin' }) {
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.kpi-card', {
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
    <div className={`flex h-screen ${isDark ? 'dark' : ''}`}>
      <Sidebar userRole={userRole} />
      
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300" ref={containerRef}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Theme Toggle */}
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Welcome back, {userRole === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
            >
              {isDark ? <Sun className="text-yellow-500" /> : <Moon className="text-blue-500" />}
            </motion.button>
          </header>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <KpiCard key={index} {...kpi} className="kpi-card" />
            ))}
          </div>

          {/* Enhanced Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-4">Attendance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Line 
                    type="monotone"
                    dataKey="count"
                    stroke="#4F46E5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Exam Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-4">Exam Statistics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={examData}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Bar dataKey="pass" fill="#4F46E5" />
                  <Bar dataKey="fail" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Announcements */}
          <Announcements />
        </div>
      </main>
    </div>
  );
}
