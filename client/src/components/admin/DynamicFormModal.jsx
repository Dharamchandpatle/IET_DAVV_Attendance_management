import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useToast } from '../ui/toast';
import { CourseForm } from './forms/CourseForm';
import { FacultyForm } from './forms/FacultyForm';
import { StudentForm } from './forms/StudentForm';

const formComponents = {
  'add-student': StudentForm,
  'add-faculty': FacultyForm,
  'add-course': CourseForm
};

export function DynamicFormModal({ type, onClose }) {
  const { show } = useToast();
  const FormComponent = formComponents[type];

  if (!FormComponent) return null;

  const handleSubmit = async (data) => {
    try {
      // API call would go here
      show({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`,
        type: 'success'
      });
      onClose();
    } catch (error) {
      show({
        title: 'Error',
        description: error.message,
        type: 'error'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-2xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold capitalize">{type}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <FormComponent onSubmit={handleSubmit} />
      </motion.div>
    </motion.div>
  );
}
