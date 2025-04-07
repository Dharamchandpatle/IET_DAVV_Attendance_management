import { motion } from 'framer-motion';
import { Check, Clock, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// Mock data - replace with actual API calls in production
const mockStats = {
  pending: 5,
  approved: 12,
  rejected: 3
};

const mockRequests = [
  {
    id: 1,
    studentName: 'Dharamchand Patle ',
    studentId: 'ST2025001',
    startDate: '2025-04-08',
    endDate: '2025-04-10',
    reason: 'computer science',
    status: 'pending'
  },
  // Add more mock data as needed
];

export function LeaveRequestsSection() {
  const [stats, setStats] = useState(mockStats);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const loadLeaveRequests = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        setRequests(mockRequests);
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading leave requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaveRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      // Optimistic update
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );

      // In production, make API call here
      await new Promise(resolve => setTimeout(resolve, 300));

      // Update stats
      setStats(prev => {
        const updatedStats = { ...prev };
        updatedStats.pending--;
        updatedStats[newStatus]++;
        return updatedStats;
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      // Revert optimistic update on error
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'pending' } : req
        )
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
        >
          <h3 className="font-medium">Pending</h3>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
        >
          <h3 className="font-medium">Approved</h3>
          <p className="text-2xl font-bold">{stats.approved}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
        >
          <h3 className="font-medium">Rejected</h3>
          <p className="text-2xl font-bold">{stats.rejected}</p>
        </motion.div>
      </div>

      {/* Requests List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="flex gap-2 p-4 border-b dark:border-gray-700">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors
                ${activeTab === tab 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="divide-y dark:divide-gray-700">
          {requests
            .filter(request => activeTab === 'all' || request.status === activeTab)
            .map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{request.studentName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {request.studentId}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {request.startDate} to {request.endDate}
                    </p>
                    <p className="text-sm mt-2">{request.reason}</p>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatusChange(request.id, 'approved')}
                        className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                      >
                        <Check className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatusChange(request.id, 'rejected')}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                  )}

                  {request.status !== 'pending' && (
                    <div className={`px-3 py-1 rounded-full text-sm
                      ${request.status === 'approved' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}
                    >
                      {request.status}
                    </div>
                  )}
                </div>
              </motion.div>
          ))}

          {requests.filter(request => activeTab === 'all' || request.status === activeTab).length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-gray-500 dark:text-gray-400"
            >
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No {activeTab} leave requests</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
