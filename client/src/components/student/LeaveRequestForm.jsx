import { motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '../ui/toast';

export function LeaveRequestForm({ semester }) {
  const { show } = useToast();
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    semester: semester
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call
      // Including semester in the request data
      console.log('Submitting leave request for semester:', semester, formData);
      
      show({
        title: 'Success',
        description: 'Leave request submitted successfully',
        type: 'success'
      });

      // Reset form
      setFormData({
        fromDate: '',
        toDate: '',
        reason: '',
        semester: semester
      });
    } catch (error) {
      show({
        title: 'Error',
        description: 'Failed to submit leave request',
        type: 'error'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            required
            value={formData.fromDate}
            onChange={(e) => setFormData(prev => ({ ...prev, fromDate: e.target.value }))}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            required
            value={formData.toDate}
            onChange={(e) => setFormData(prev => ({ ...prev, toDate: e.target.value }))}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reason</label>
        <textarea
          required
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          rows={3}
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full p-2 bg-blue-600 text-white rounded-lg"
      >
        Submit Request
      </motion.button>
    </form>
  );
}
