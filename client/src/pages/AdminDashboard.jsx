import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { BookOpen, Settings, Upload, UserPlus, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AdminAnnouncements } from '../components/admin/AdminAnnouncements';
import { DataTable } from '../components/admin/DataTable';
import { DynamicFormModal } from '../components/admin/DynamicFormModal';
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
    description: 'Register a new student in the system',
    color: 'green'
  },
  {
    id: 'add-faculty',
    title: 'Add Faculty',
    icon: UserPlus,
    description: 'Add new faculty member',
    color: 'blue'
  },
  {
    id: 'batch-import',
    title: 'Batch Import',
    icon: Upload,
    description: 'Import multiple records at once',
    color: 'orange'
  },
  {
    id: 'settings',
    title: 'System Settings',
    icon: Settings,
    description: 'Configure attendance rules & policies',
    color: 'gray'
  }
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Add your data fetching logic here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated loading
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
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
    }
  }, [isLoading]);

  if (error) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">
            <p>Error loading dashboard: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin" isLoading={isLoading}>
      <div className="space-y-8" ref={containerRef}>
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Administrator
            </p>
          </div>
        </header>

        <KPIGrid userRole="admin" />
      
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminActions.map((action) => (
              <motion.button
                key={action.id}
                onClick={() => setActiveModal(action.id)}
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                         hover:shadow-md transition-all text-left relative overflow-hidden admin-card"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
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

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <DataTable type={activeTab} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <AdminAnnouncements />
          </div>
        </section>

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
