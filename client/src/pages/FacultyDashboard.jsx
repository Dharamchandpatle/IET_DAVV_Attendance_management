import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar, Check, Clock, FileText, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AttendanceSection } from '../components/faculty/AttendanceSection';
import { ExamManagementSection } from '../components/faculty/ExamManagementSection';
import { LeaveRequestsSection } from '../components/faculty/LeaveRequestsSection';
import { AttendanceTrends } from '../components/faculty/AttendanceTrends';
import { ExamStats } from '../components/faculty/ExamStats';

const kpiData = [
  { title: 'Assigned Courses', value: '4', icon: FileText },
  { title: 'Total Students', value: '120', icon: Users },
  { title: 'Classes Today', value: '3', icon: Clock },
  { title: 'Attendance Marked', value: '85%', icon: Check },
];

export function FacultyDashboard() {
  const [activeSection, setActiveSection] = useState('attendance');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const containerRef = useRef(null);

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

  const dashboardSections = [
    {
      id: 'attendance',
      title: 'Mark Attendance',
      description: 'Record today\'s attendance',
      icon: Calendar,
      color: 'blue',
      component: AttendanceSection,
    },
    {
      id: 'leave-requests',
      title: 'Leave Requests',
      description: 'Review pending requests',
      icon: Clock,
      color: 'green',
      component: LeaveRequestsSection,
    },
    {
      id: 'exams',
      title: 'Exam Management',
      description: 'Schedule and manage exams',
      icon: FileText,
      color: 'purple',
      component: ExamManagementSection,
    }
  ];

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-8">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardSections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm
                       ${activeSection === section.id ? 'ring-2 ring-primary' : ''}`}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <section.icon className={`w-8 h-8 text-${section.color}-500 mb-3`} />
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {section.description}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {dashboardSections.find(s => s.id === activeSection)?.component}
          </motion.div>
        </AnimatePresence>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceTrends />
          <ExamStats />
        </div>

        {/* Attendance Modal */}
        <AnimatePresence>
          {showAttendanceModal && (
            <AttendanceModal 
              onClose={() => setShowAttendanceModal(false)}
              onSubmit={handleAttendanceSubmit}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
