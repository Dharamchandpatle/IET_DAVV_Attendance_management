import { motion } from 'framer-motion';
import { useState } from 'react';

export function LeaveRequestForm({ onSubmit }) {
  const [leaveRequests] = useState([
    { id: 1, date: '2024-02-15', reason: 'Medical', status: 'pending' },
    { id: 2, date: '2024-02-10', reason: 'Family Event', status: 'approved' },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      type: formData.get('type'),
      fromDate: formData.get('fromDate'),
      toDate: formData.get('toDate'),
      reason: formData.get('reason')
    };

    await onSubmit(data);
    e.target.reset();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="type"
          className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          required
        >
          <option value="">Select Leave Type</option>
          <option value="medical">Medical Leave</option>
          <option value="personal">Personal Leave</option>
          <option value="other">Other</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              name="fromDate"
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              name="toDate"
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <textarea
            name="reason"
            rows={3}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg"
        >
          Submit Request
        </motion.button>
      </form>

      <div className="border-t dark:border-gray-700 pt-4">
        <h3 className="text-sm font-medium mb-2">Recent Requests</h3>
        <div className="space-y-2">
          {leaveRequests.map((request) => (
            <div
              key={request.id}
              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium">{request.date}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{request.reason}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                request.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
