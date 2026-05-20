import { memo } from 'react';

// Simple, dependency-free spinner used during data loading states.
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
    <div
      role="status"
      aria-label={label}
      className={containerClasses}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={`border-4 border-blue-200 border-t-blue-600 rounded-full ${spinnerSizes[size]} animate-spin`}
        />
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{label}</p>
      </div>
    </div>
  );
});