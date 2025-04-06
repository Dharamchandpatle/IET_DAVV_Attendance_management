import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';

export const LoadingSpinner = memo(({ size = 'default', label = 'Loading...', fullScreen = false }) => {
  const spinnerSizes = {
    small: 'w-8 h-8',
    default: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center p-4';

  return (
    <AnimatePresence>
      <div
        role="status"
        aria-label={label}
        className={containerClasses}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`border-4 border-blue-200 border-t-blue-600 rounded-full ${spinnerSizes[size]}`}
          />
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            {label}
          </motion.p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});