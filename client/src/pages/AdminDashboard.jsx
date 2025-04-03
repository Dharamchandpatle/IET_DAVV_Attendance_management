import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { BookOpen, Settings, Upload, UserPlus, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AdminAnnouncements } from '../components/admin/AdminAnnouncements';
import { BatchImport } from '../components/admin/BatchImport';
import { DataTable } from '../components/admin/DataTable';
import { DynamicFormModal } from '../components/admin/DynamicFormModal';
import { PolicySettings } from '../components/admin/PolicySettings';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { KPIGrid } from '../components/dashboard/KPIGrid';

const adminMenuItems = [
  { label: 'Students', value: 'students', icon: Users },
  { label: 'Faculty', value: 'faculty', icon: Users },
  { label: 'Courses', value: 'courses', icon: BookOpen },
  { label: 'Batch Import', value: 'import', icon: Upload },
  { label: 'Settings', value: 'settings', icon: Settings },
];

const adminActions = [
  {
    id: 'add-student',
    title: 'Add Student',
    icon: UserPlus,
    description: 'Register new student with auto-generated ID',
    color: 'blue'
  },
  {
    id: 'add-faculty',
    title: 'Add Faculty',
    icon: Users,
    description: 'Add new faculty member with role assignment',
    color: 'green'
  },
  {
    id: 'add-course',
    title: 'Add Course',
    icon: BookOpen,
    description: 'Create new course with department assignment',
    color: 'purple'
  },
  {
    id: 'bulk-import',
    title: 'Bulk Import',
    icon: Upload,
    description: 'Import students/faculty via Excel',
    color: 'orange'
  },
  {
    title: 'System Settings',
    icon: Settings,
    description: 'Configure attendance rules & policies',
    color: 'gray'
  }
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [activeModal, setActiveModal] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.admin-card', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
      case 'faculty':
      case 'courses':
        return <DataTable type={activeTab} />;
      case 'import':
        return <BatchImport />;
      case 'settings':
        return <PolicySettings />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Administrator
            </p>
          </div>
        </header>

        {/* KPI Section */}
        <KPIGrid userRole="admin" />
      
        {/* Quick Actions Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminActions.map((action) => (
              <motion.button
                key={action.id}
                onClick={() => setActiveModal(action.id)}
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                         hover:shadow-md transition-all text-left relative overflow-hidden"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 
                              transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                
                <action.icon className={`w-8 h-8 text-${action.color}-500 mb-3`} />
                <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Main Management Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <DataTable type={activeTab} />
          </div>

          {/* Announcements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <AdminAnnouncements />
          </div>
        </section>

        {/* Dynamic Form Modals */}
        <AnimatePresence>
          {activeModal && (
            <DynamicFormModal
              type={activeModal}
              onClose={() => setActiveModal(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
