import { motion } from 'framer-motion';
import { Calendar, Image, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../ui/toast';

export function LeaveRequestForm({ onSubmit, isSubmitting }) {
  const { show } = useToast();
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    type: 'sick',
    attachments: []
  });

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = [...e.dataTransfer.files];
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isSizeValid = file.size <= 5 * 1024 * 1024; // 5MB limit
      if (!isValid) {
        show({
          title: "Invalid file type",
          description: "Please upload only images or PDF files",
          type: "error"
        });
      }
      if (!isSizeValid) {
        show({
          title: "File too large",
          description: "Files must be less than 5MB",
          type: "error"
        });
      }
      return isValid && isSizeValid;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles].slice(0, 5) // Limit to 5 files
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fromDate || !formData.toDate || !formData.reason) {
      show({
        title: "Incomplete form",
        description: "Please fill in all required fields",
        type: "error"
      });
      return;
    }

    // Create FormData to handle file uploads
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'attachments') {
        formData.attachments.forEach(file => {
          submitData.append('attachments', file);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Date *
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={formData.fromDate}
              onChange={(e) => setFormData(prev => ({ ...prev, fromDate: e.target.value }))}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To Date *
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={formData.toDate}
              onChange={(e) => setFormData(prev => ({ ...prev, toDate: e.target.value }))}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Leave Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Leave Type *
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="sick">Sick Leave</option>
          <option value="personal">Personal Leave</option>
          <option value="family">Family Emergency</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reason *
        </label>
        <textarea
          required
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 min-h-[100px]"
          placeholder="Please provide detailed reason for your leave request..."
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Attachments (Optional)
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
              <label className="relative cursor-pointer rounded-md font-semibold text-blue-600 dark:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 hover:text-blue-500">
                <span>Upload files</span>
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleFiles([...e.target.files])}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Images or PDF up to 5MB (max 5 files)
            </p>
          </div>
        </div>

        {/* File Preview */}
        {formData.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.attachments.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {file.type.startsWith('image/') ? (
                    <Image className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Upload className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium 
                   hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
      </motion.button>
    </form>
  );
}
