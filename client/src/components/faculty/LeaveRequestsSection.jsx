import { motion } from 'framer-motion';
import { Clock, Search } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../ui/toast';

const mockRequests = [
  {
    id: 1,
    studentName: 'John Doe',
    studentId: 'CS21B001',
    fromDate: '2024-04-10',
    toDate: '2024-04-12',
    reason: 'Medical appointment',
    status: 'pending',
    requestedOn: '2024-04-08',
    department: 'CSE',
    semester: 4
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    studentId: 'CS21B002',
    fromDate: '2024-04-15',
    toDate: '2024-04-15',
    reason: 'Family function',
    status: 'pending',
    requestedOn: '2024-04-07',
    department: 'CSE',
    semester: 4
  }
];

export function LeaveRequestsSection() {
  const { show } = useToast();
  const [requests, setRequests] = useState(mockRequests);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: 'pending',
    dateRange: 'all'
  });

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // In a real app, this would be an API call
      setRequests(prev => prev.map(request => 
        request.id === id ? { ...request, status: newStatus } : request
      ));

      show({
        title: `Request ${newStatus}`,
        description: `Leave request has been ${newStatus} successfully.`,
        type: "success"
      });
    } catch (error) {
      show({
        title: "Error",
        description: `Failed to ${newStatus} request`,
        type: "error"
      });
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.studentName.toLowerCase().includes(search.toLowerCase()) ||
      request.studentId.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      filters.status === 'all' || request.status === filters.status;
    
    const matchesDate = filters.dateRange === 'all' || 
      (filters.dateRange === 'today' && request.requestedOn === new Date().toISOString().split('T')[0]) ||
      (filters.dateRange === 'week' && isWithinLastWeek(request.requestedOn));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Leave Requests</h2>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {stats.pending} pending requests
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
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

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            No leave requests found
          </motion.div>
        ) : (
          filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              layoutId={request.id.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{request.studentName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {request.studentId} • {request.department} • Semester {request.semester}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  request.status === 'approved'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : request.status === 'rejected'
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {request.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">From Date</p>
                  <p>{new Date(request.fromDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">To Date</p>
                  <p>{new Date(request.toDate).toLocaleDateString()}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {request.reason}
              </p>

              {request.status === 'pending' && (
                <div className="mt-4 flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                    className="px-4 py-2 border dark:border-gray-700 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    Reject
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusUpdate(request.id, 'approved')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Approve
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function isWithinLastWeek(dateString) {
  const date = new Date(dateString);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return date >= weekAgo;
}
