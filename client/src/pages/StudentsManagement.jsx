import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { DataTable } from '../components/admin/DataTable';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HeroShape } from '../components/ui/HeroShape';

export function StudentsManagement() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.students-card', {
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar userRole="admin" />
      
      <main className="flex-1 overflow-y-auto p-6 relative" ref={containerRef}>
        <HeroShape className="absolute inset-0 opacity-5" />
        
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Students Management</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage student records and information
              </p>
            </div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="students-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <DataTable type="students" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
