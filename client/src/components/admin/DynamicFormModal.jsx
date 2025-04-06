import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../ui/toast';

export function DynamicFormModal({ type, onClose, onSubmit }) {
  const { show } = useToast();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const formFields = {
    'add-student': [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'select', required: true,
        options: [
          { value: 'CSE', label: 'Computer Science' },
          { value: 'IT', label: 'Information Technology' },
          { value: 'ECE', label: 'Electronics & Communication' }
        ]
      },
      { name: 'semester', label: 'Semester', type: 'select', required: true,
        options: Array.from({ length: 8 }, (_, i) => ({
          value: i + 1,
          label: `Semester ${i + 1}`
        }))
      },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'address', label: 'Address', type: 'text', required: true }
    ],
    'add-faculty': [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'select', required: true,
        options: [
          { value: 'CSE', label: 'Computer Science' },
          { value: 'IT', label: 'Information Technology' },
          { value: 'ECE', label: 'Electronics & Communication' }
        ]
      },
      { name: 'designation', label: 'Designation', type: 'select', required: true,
        options: [
          { value: 'Professor', label: 'Professor' },
          { value: 'Associate Professor', label: 'Associate Professor' },
          { value: 'Assistant Professor', label: 'Assistant Professor' }
        ]
      },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'specialization', label: 'Specialization', type: 'text', required: true }
    ]
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = formFields[type];

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.type === 'email' && formData[field.name] && 
          !formData[field.name].match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors[field.name] = 'Please enter a valid email address';
      }
      if (field.type === 'tel' && formData[field.name] && 
          !formData[field.name].match(/^[0-9+\s-]{10,}$/)) {
        newErrors[field.name] = 'Please enter a valid phone number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      show({
        title: "Validation Error",
        description: "Please check the form for errors",
        type: "error"
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {type === 'add-student' ? 'Add New Student' : 'Add New Faculty'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields[type].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1" htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required={field.required}
                />
              )}
              
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 border rounded-lg dark:border-gray-600"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add {type === 'add-student' ? 'Student' : 'Faculty'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
