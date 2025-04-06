import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroShape } from '../ui/HeroShape';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children, userRole = 'student', isLoading: externalLoading }) {
  const containerRef = useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ctx;
    // Ensure the DOM is ready before animation
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.from('.dashboard-card', {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }, containerRef);
    }, 0);

    return () => {
      if (ctx) ctx.revert();
      clearTimeout(timer);
    };
  }, [location.pathname]); // Re-run on route change

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userRole={userRole} />
      
      <AnimatePresence mode="wait">
        {(isLoading || externalLoading) ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center"
          >
            <LoadingSpinner size="lg" className="text-blue-600" />
          </motion.div>
        ) : (
          <motion.main 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-gray-900 transition-colors p-6"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
            <HeroShape className="absolute inset-0 opacity-5 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto space-y-6 page-content relative" ref={containerRef}>
              {children}
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
