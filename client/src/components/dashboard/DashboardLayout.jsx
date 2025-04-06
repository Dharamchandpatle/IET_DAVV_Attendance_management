import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { HeroShape } from '../ui/HeroShape';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children, userRole, isLoading = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dashboard-card', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userRole={userRole} />
      
      <main className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-gray-900 transition-colors">
        <HeroShape className="absolute inset-0 opacity-5" />
        
        <div className="p-6 relative z-10" ref={containerRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto space-y-6 page-content"
          >
            {isLoading ? (
              <LoadingSpinner size="small" label="Loading content..." />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
