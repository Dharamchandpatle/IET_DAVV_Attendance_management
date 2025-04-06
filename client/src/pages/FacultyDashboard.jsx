import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar, Check, Clock, FileText, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AttendanceSection } from '../components/faculty/AttendanceSection';
import { ExamManagementSection } from '../components/faculty/ExamManagementSection';
import { LeaveRequestsSection } from '../components/faculty/LeaveRequestsSection';

const kpiData = [
  { title: 'Assigned Courses', value: '4', icon: FileText },
  { title: 'Total Students', value: '120', icon: Users },
  { title: 'Classes Today', value: '3', icon: Clock },
  { title: 'Attendance Marked', value: '85%', icon: Check },
];

export function FacultyDashboard() {
  const [activeSection, setActiveSection] = useState('attendance');
  const [isLoading, setIsLoading] = useState(true);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const dashboardSections = useMemo(() => [
    {
      id: 'attendance',
      title: 'Mark Attendance',
      description: 'Record today\'s attendance',
      icon: Calendar,
      color: 'blue',
      component: AttendanceSection,
      path: '/faculty/attendance'
    },
    {
      id: 'leave-requests',
      title: 'Leave Requests',
      description: 'Review pending requests',
      icon: Clock,
      color: 'green',
      component: LeaveRequestsSection,
      path: '/faculty/leave-requests'
    },
    {
      id: 'exams',
      title: 'Exam Management',
      description: 'Schedule and manage exams',
      icon: FileText,
      color: 'purple',
      component: ExamManagementSection,
      path: '/faculty/exams'
    }
  ], []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 300)),
          new Promise(resolve => setTimeout(resolve, 300))
        ]);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Setup GSAP animations
    const ctx = gsap.context(() => {
      gsap.from('.dashboard-card', {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Memoize active component to prevent unnecessary re-renders
  const ActiveComponent = useMemo(() => 
    dashboardSections.find(section => section.id === activeSection)?.component || AttendanceSection
  , [activeSection, dashboardSections]);

  const handleSectionChange = (sectionId) => {
    const section = dashboardSections.find(s => s.id === sectionId);
    if (section && section.path) {
      navigate(section.path);
    }
    setActiveSection(sectionId);
  };

  return (
    <DashboardLayout userRole="faculty" isLoading={isLoading}>
      <div className="space-y-8" ref={containerRef}>
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              className="dashboard-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 },
                scale: 1.02
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transform transition-transform group-hover:scale-110">
                  <kpi.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{kpi.title}</p>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">{kpi.value}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardSections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm dashboard-card overflow-hidden
                       ${activeSection === section.id ? 'ring-2 ring-blue-500' : ''}`}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.2,
                delay: index * 0.1 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-700/5 dark:to-gray-700/10 transform -skew-y-12" />
              <div className={`relative w-12 h-12 rounded-lg bg-${section.color}-100 dark:bg-${section.color}-900/20 
                           flex items-center justify-center mb-4 transform transition-transform duration-300 hover:scale-110`}>
                <section.icon className={`w-6 h-6 text-${section.color}-600 dark:text-${section.color}-400`} />
              </div>
              <h3 className="relative text-lg font-semibold mb-2">{section.title}</h3>
              <p className="relative text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Active Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            className="section-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
