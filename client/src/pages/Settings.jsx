import { motion } from 'framer-motion';
import gsap from 'gsap';
import { CalendarDays, Save } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HolidayCalendar } from '../components/settings/HolidayCalendar';
import { PolicyEditor } from '../components/settings/PolicyEditor';
import { useToast } from '../components/ui/toast';

export function Settings() {
  const { show } = useToast();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced animations
      gsap.from('.settings-card', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Add hover animation
      gsap.to('.settings-card', {
        y: -5,
        duration: 0.2,
        paused: true,
        ease: 'power2.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSave = () => {
    show({
      title: "Settings Updated",
      description: "Your changes have been saved successfully.",
      duration: 3000
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar userRole="admin" />
      
      <main className="flex-1 overflow-y-auto p-6" ref={containerRef}>
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage system configurations
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Holiday Management */}
            <motion.div
              className="settings-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <CalendarDays className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Holiday Calendar</h2>
              </div>
              <HolidayCalendar />
            </motion.div>

            {/* Policy Settings */}
            <motion.div
              className="settings-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <PolicyEditor />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
