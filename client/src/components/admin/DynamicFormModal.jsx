import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { BatchImport } from './BatchImport';
import { CourseForm } from './forms/CourseForm';
import { FacultyForm } from './forms/FacultyForm';
import { StudentForm } from './forms/StudentForm';
import { PolicySettings } from './PolicySettings';

export function DynamicFormModal({ type, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFormComponent = () => {
    switch (type) {
      case 'add-student':
        return <StudentForm onSubmit={handleSubmit} />;
      case 'add-faculty':
        return <FacultyForm onSubmit={handleSubmit} />;
      case 'add-course':
        return <CourseForm onSubmit={handleSubmit} />;
      case 'batch-import':
        return <BatchImport onClose={onClose} />;
      case 'settings':
        return <PolicySettings onClose={onClose} />;
      default:
        return null;
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      // Add your form submission logic here based on the type
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="mt-4">
          {getFormComponent()}
        </div>

        {isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
