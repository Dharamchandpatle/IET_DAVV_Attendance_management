// import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Check, Clock, FileText, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AttendanceSection } from '../components/faculty/AttendanceSection';
import { LeaveRequestsSection } from '../components/faculty/LeaveRequestsSection';
import { useAuth } from '../context/AuthContext';

const dashboardSections = [
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
  }
];

const sectionColorClasses = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400'
  }
};

export function FacultyDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [facultyData, setFacultyData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch faculty data on mount
  useEffect(() => {
    let isActive = true;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Use user data from auth context
        const data = {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          phone: user?.phone || '',
          faculty_code: user?.faculty_code,
          department_name: user?.department_name || 'Computer Science',
          designation: user?.designation || 'Assistant Professor',
          joining_date: user?.joining_date,
          specialization: user?.specialization || '',
          profile_image: user?.profile_image,
          assigned_courses: 4,
          total_students: 120,
          classes_today: 3,
          attendance_marked: '85%'
        };
        if (!isActive) return;
        setFacultyData(data);
      } catch (error) {
        if (isActive) toast.error('Failed to load dashboard data');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  const activeSection = useMemo(() => {
    const match = dashboardSections.find(section => section.path === location.pathname);
    return match?.id || 'attendance';
  }, [location.pathname]);

  const ActiveComponent = useMemo(() => {
    return dashboardSections.find(section => section.id === activeSection)?.component || AttendanceSection;
  }, [activeSection]);

  if (isLoading || !facultyData) {
    return (
      <DashboardLayout userRole="faculty" isLoading={isLoading}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const facultyKPIs = [
    { title: 'Assigned Courses', value: facultyData.assigned_courses?.toString() || '0', icon: FileText },
    { title: 'Total Students', value: facultyData.total_students?.toString() || '0', icon: Users },
    { title: 'Classes Today', value: facultyData.classes_today?.toString() || '0', icon: Clock },
    { title: 'Attendance Marked', value: facultyData.attendance_marked || '0%', icon: Check },
  ];


  const handleSectionChange = (sectionId) => {
    const section = dashboardSections.find(s => s.id === sectionId);
    if (section && section.path) {
      navigate(section.path, { replace: true });
    }
  };

  return (
    <DashboardLayout userRole="faculty" isLoading={isLoading}>
      <div className="space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {facultyKPIs.map((kpi, index) => (
            <div
              key={kpi.title}
              className="dashboard-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
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
            </div>
          ))}
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardSections.map((section, index) => {
            const colorClasses = sectionColorClasses[section.color] || sectionColorClasses.blue;

            return (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm dashboard-card overflow-hidden
                         ${activeSection === section.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-700/5 dark:to-gray-700/10 transform -skew-y-12" />
                <div
                  className={`relative w-12 h-12 rounded-lg ${colorClasses.bg}
                           flex items-center justify-center mb-4 transform transition-transform duration-300 hover:scale-110`}
                >
                  <section.icon className={`w-6 h-6 ${colorClasses.icon}`} />
                </div>
                <h3 className="relative text-lg font-semibold mb-2">{section.title}</h3>
                <p className="relative text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
              </button>
            );
          })}
        </div>

        {/* Active Section Content */}
        <div
          className="section-content"
        >
          <ActiveComponent />
        </div>
      </div>
    </DashboardLayout>
  );
}
