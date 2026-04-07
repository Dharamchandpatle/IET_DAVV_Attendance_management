import { motion } from 'framer-motion';
import { HeroShape } from '../ui/HeroShape';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children, userRole = 'student', isLoading: externalLoading }) {
  const isLoading = Boolean(externalLoading);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userRole={userRole} />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" className="text-blue-600" />
        </div>
      ) : (
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-gray-900 transition-colors p-6"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          <HeroShape className="absolute inset-0 opacity-5 pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-6 page-content relative">
            {children}
          </div>
        </motion.main>
      )}
    </div>
  );
}
